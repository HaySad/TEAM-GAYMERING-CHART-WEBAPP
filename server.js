const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const redisDatabase = require('./redis-database');
const app = express();

// Debug logging
console.log('Server starting...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('REDIS_URL:', process.env.REDIS_URL ? 'SET' : 'NOT SET');

// JWT Secret Key (ในการใช้งานจริงควรเก็บใน environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'maimai-jwt-secret-key-2024';

// Initialize Redis database
async function initializeDatabase() {
  try {
    console.log('Initializing Redis database...');
    const connected = await redisDatabase.connect();
    if (connected) {
      await redisDatabase.initializeDefaultData();
      console.log('Database initialization completed');
    } else {
      console.error('Failed to connect to Redis');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://discord-competition.vercel.app',
      'https://maimai-w.vercel.app',
      'https://maimai-w-git-main.vercel.app',
      // Local network IPs (จะเพิ่มตามที่ต้องการ)
      'http://192.168.1.100:3000',
      'http://192.168.1.101:3000',
      'http://192.168.1.102:3000',
      'http://192.168.1.103:3000',
      'http://192.168.1.104:3000',
      'http://192.168.1.105:3000',
      'http://192.168.1.106:3000',
      'http://192.168.1.107:3000',
      'http://192.168.1.108:3000',
      'http://192.168.1.109:3000',
      'http://192.168.1.110:3000',
      // Public IP (จะเปลี่ยนตาม ISP)
      'http://203.xxx.xxx.xxx:3000',
      'http://27.145.145.20:3000',
      'http://27.145.145.20:3001'
    ];
    
    // Allow all local network requests (192.168.x.x)
    if (origin && origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
      return callback(null, true);
    }
    
    // Allow specific public IP
    if (origin && origin.match(/^http:\/\/27\.145\.145\.20:\d+$/)) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration with Redis store
const sessionConfig = {
  store: new RedisStore({ 
    client: redisDatabase.client,
    prefix: 'session:'
  }),
  secret: 'maimai-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
};

app.use(session(sessionConfig));

app.use(express.json());

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}
app.use(express.static(path.join(__dirname, 'public')));

// Middleware สำหรับการตรวจสอบ JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // ตรวจสอบ guest token
  if (token === 'guest-token') {
    req.user = {
      id: 'guest-' + Date.now(),
      username: 'Guest User',
      email: undefined
    };
    req.isGuest = true;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await database.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    req.isGuest = false;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  console.log('Signup request received:', { username: req.body.username });
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const result = await redisDatabase.createUser(username, password, email);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: result.user.id, username: result.user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.user,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await redisDatabase.authenticateUser(username, password);
    
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: result.user.id, username: result.user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set session data (เก็บไว้เพื่อ backward compatibility)
    req.session.user = {
      id: result.user.id,
      username: result.user.username,
      loginTime: new Date(),
    };
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: result.user,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Check session status (รองรับทั้ง JWT และ session)
app.get('/api/session', async (req, res) => {
  // ตรวจสอบ JWT token ก่อน
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // ตรวจสอบ guest token
    if (token === 'guest-token') {
      return res.json({
        isValid: true,
        user: {
          id: 'guest-' + Date.now(),
          username: 'Guest User',
          email: undefined
        },
        authMethod: 'guest'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await database.findUserById(decoded.userId);
      
      if (user) {
        return res.json({
          isValid: true,
          user: user,
          authMethod: 'jwt'
        });
      }
    } catch (error) {
      // JWT token invalid, fall through to session check
    }
  }

  // Fallback to session check
  if (req.session && req.session.user) {
    res.json({
      isValid: true,
      user: req.session.user,
      authMethod: 'session',
      sessionExpiry: req.session.cookie.expires
    });
  } else {
    res.json({ isValid: false });
  }
});

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Submit game score for rating calculation (protected route)
app.post('/api/game-score', authenticateToken, async (req, res) => {
  const { 
    songId, 
    songTitle,
    artist,
    difficulty,
    level,
    score, 
    rank,
    achievementRate,
    critical,
    perfect,
    great,
    good,
    miss,
    early,
    late,
    dxScore,
    clearType,
    calculatedRating
  } = req.body;
  
  if (!songId || !level || !rank || typeof achievementRate !== 'number') {
    return res.status(400).json({ error: 'Invalid game score data' });
  }

  try {
    // เก็บข้อมูลคะแนนเกม (สำหรับ deep learning)
    const gameScore = {
      userId: req.user.id,
      username: req.user.username,
      songId,
      songTitle,
      artist,
      difficulty: difficulty || 'MASTER',
      level,
      score: score || 0,
      rank,
      achievementRate,
      critical: critical || 0,
      perfect: perfect || 0,
      great: great || 0,
      good: good || 0,
      miss: miss || 0,
      early: early || 0,
      late: late || 0,
      dxScore: dxScore || 0,
      clearType: clearType || 'CLEAR',
      calculatedRating: calculatedRating || 0,
      timestamp: new Date().toISOString(),
      // Rating จะถูกคำนวณโดย deep learning system
    };

    // TODO: ส่งข้อมูลไปยัง deep learning system
    // TODO: รับ rating ที่คำนวณแล้วกลับมา
    // TODO: อัปเดต rating ในฐานข้อมูล

    console.log('Game score submitted:', gameScore);

    res.json({
      success: true,
      message: 'Game score submitted successfully',
      gameScore,
      note: 'Rating will be calculated by AI system'
    });
  } catch (error) {
    console.error('Submit game score error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user game history (protected route)
app.get('/api/game-history', authenticateToken, async (req, res) => {
  try {
    // TODO: ดึงประวัติเกมของผู้ใช้
    const gameHistory = []; // จะดึงจากฐานข้อมูล

    res.json({
      success: true,
      gameHistory
    });
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const users = await redisDatabase.getAllUsers();
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Discord roles (admin only)
app.get('/api/admin/discord-roles', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const roles = await redisDatabase.getAllDiscordRoles();
    res.json({
      success: true,
      roles
    });
  } catch (error) {
    console.error('Get discord roles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Discord role (admin only)
app.post('/api/admin/discord-roles', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { role } = req.body;
  
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'Role name is required' });
  }

  try {
    const result = await redisDatabase.addDiscordRole(role);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Role added successfully',
        roles: result.roles
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Add discord role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove Discord role (admin only)
app.delete('/api/admin/discord-roles/:role', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { role } = req.params;

  try {
    const result = await redisDatabase.removeDiscordRole(role);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Role removed successfully',
        roles: result.roles
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Remove discord role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Discord role to user (admin only)
app.post('/api/admin/users/:userId/discord-roles', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { userId } = req.params;
  const { role } = req.body;
  
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'Role name is required' });
  }

  try {
    const result = await redisDatabase.addRoleToUser(userId, role);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Role added to user successfully',
        user: result.user
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Add role to user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove Discord role from user (admin only)
app.delete('/api/admin/users/:userId/discord-roles/:role', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { userId, role } = req.params;

  try {
    const result = await redisDatabase.removeRoleFromUser(userId, role);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Role removed from user successfully',
        user: result.user
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Remove role from user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tiers data (protected route)
app.get('/api/tiers', authenticateToken, async (req, res) => {
  try {
    // Sample tiers data
    const tiers = [
      {
        level: 1,
        life: 100,
        minusX: 10,
        minusY: 20,
        minusZ: 30,
        addLife: 5,
        songs: [
          {
            id: "1-1",
            name: "Sample Song 1",
            level: 1.0,
            image: "/placeholder.png",
            downloadUrl: "/api/songs/1-1/download"
          }
        ]
      }
    ];
    
    res.json(tiers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download song endpoint (protected route)
app.get('/api/songs/:songId/download', authenticateToken, (req, res) => {
  const { songId } = req.params;
  res.json({ 
    message: `Download requested for song ${songId}`,
    user: req.user.username
  });
});

// Get database status
app.get('/api/database-status', async (req, res) => {
  try {
    res.json({
      isConnected: redisDatabase.isConnected,
      isFallbackMode: redisDatabase.fallbackMode,
      message: redisDatabase.fallbackMode 
        ? 'Using fallback mode - data may not persist' 
        : 'Connected to Redis database'
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ 
      isConnected: false,
      isFallbackMode: true,
      message: 'Database status check failed'
    });
  }
});

// Get all users (admin endpoint - for testing)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await redisDatabase.getAllUsers();
    // ไม่ส่ง password กลับไป
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
    res.json(safeUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; 
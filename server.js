const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const database = require('./database');
const app = express();

// JWT Secret Key (ในการใช้งานจริงควรเก็บใน environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'maimai-jwt-secret-key-2024';

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://discord-competition.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session configuration for Vercel (in-memory)
app.use(session({
  secret: 'maimai-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

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

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await database.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const result = await database.createUser(username, password, email);
    
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
    const result = await database.authenticateUser(username, password);
    
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

// Get all users (admin endpoint - for testing)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await database.getAllUsers();
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
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const app = express();

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

// Login endpoint (simplified for Vercel)
app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Set session data without database
    req.session.user = {
      username,
      loginTime: new Date(),
    };
    
    res.json({ 
      success: true, 
      username,
      sessionExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });
  } catch (error) {
    console.error('Error:', error);
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

// Check session status
app.get('/api/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      isValid: true,
      user: req.session.user,
      sessionExpiry: req.session.cookie.expires
    });
  } else {
    res.json({ isValid: false });
  }
});

// Get all tiers data (no session check for now)
app.get('/api/tiers', async (req, res) => {
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

// Download song endpoint (no session check for now)
app.get('/api/songs/:songId/download', (req, res) => {
  const { songId } = req.params;
  res.json({ message: `Download requested for song ${songId}` });
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
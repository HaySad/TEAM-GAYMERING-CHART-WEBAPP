const redis = require('redis');
const bcrypt = require('bcryptjs');

class RedisDatabase {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.fallbackMode = false;
    this.inMemoryUsers = [];
    this.inMemoryRoles = [];
  }

  async connect() {
    try {
      // ใช้ Redis URL จาก environment variable
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      console.log('Connecting to Redis:', redisUrl);
      
      this.client = redis.createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('Redis connection failed after 10 retries');
              return false;
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
        this.enableFallbackMode();
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isConnected = true;
        this.fallbackMode = false;
      });

      this.client.on('ready', () => {
        console.log('Redis client ready');
        this.isConnected = true;
        this.fallbackMode = false;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      console.error('Redis connection error:', error);
      this.isConnected = false;
      this.enableFallbackMode();
      return false;
    }
  }

  enableFallbackMode() {
    console.log('Enabling fallback mode - using in-memory storage');
    this.fallbackMode = true;
    
    // Initialize default data in fallback mode
    if (this.inMemoryUsers.length === 0) {
      this.inMemoryUsers = [
        {
          id: 'admin-user',
          username: 'admin',
          password: '$2a$10$rQZ8K9L2M1N0P.Q.R.S.T.U.V.W.X.Y.Z.A.B.C.D.E.F.G.H.I.J.K',
          email: 'admin@example.com',
          rating: 1000,
          discordRoles: ['Admin'],
          isAdmin: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ];
    }
    
    if (this.inMemoryRoles.length === 0) {
      this.inMemoryRoles = [
        'Moderator', 'Admin', 'VIP', 'Premium', 'Member', 'Newbie',
        'Pro Player', 'Tournament Winner', 'Event Organizer',
        'Content Creator', 'Streamer', 'Developer', 'Support Team'
      ];
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  // User Management
  async createUser(username, password, email = null) {
    try {
      if (this.fallbackMode) {
        return this.createUserFallback(username, password, email);
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      // ตรวจสอบว่า username ซ้ำหรือไม่
      const existingUser = await this.getUserByUsername(username);
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // สร้าง user ID
      const userId = `user:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // สร้าง user object
      const user = {
        id: userId,
        username: username.toLowerCase(),
        password: hashedPassword,
        email: email,
        rating: 1000,
        discordRoles: [],
        isAdmin: username.toLowerCase() === 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      // บันทึก user ใน Redis
      await this.client.hSet(`users:${userId}`, user);
      await this.client.set(`username:${username.toLowerCase()}`, userId);
      
      // เพิ่มใน users list
      await this.client.sAdd('users:list', userId);

      // ลบ password ออกจาก response
      const { password: _, ...userWithoutPassword } = user;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Create user error:', error);
      return this.createUserFallback(username, password, email);
    }
  }

  createUserFallback(username, password, email = null) {
    try {
      // ตรวจสอบว่า username ซ้ำหรือไม่
      const existingUser = this.inMemoryUsers.find(u => u.username === username.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // สร้าง user object
      const user = {
        id: `user:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
        username: username.toLowerCase(),
        password: hashedPassword,
        email: email,
        rating: 1000,
        discordRoles: [],
        isAdmin: username.toLowerCase() === 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      this.inMemoryUsers.push(user);

      // ลบ password ออกจาก response
      const { password: _, ...userWithoutPassword } = user;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Create user fallback error:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  async getUserByUsername(username) {
    try {
      if (this.fallbackMode) {
        return this.inMemoryUsers.find(u => u.username === username.toLowerCase()) || null;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const userId = await this.client.get(`username:${username.toLowerCase()}`);
      if (!userId) {
        return null;
      }

      return await this.getUserById(userId);
    } catch (error) {
      console.error('Get user by username error:', error);
      return this.inMemoryUsers.find(u => u.username === username.toLowerCase()) || null;
    }
  }

  async getUserById(userId) {
    try {
      if (this.fallbackMode) {
        return this.inMemoryUsers.find(u => u.id === userId) || null;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const userData = await this.client.hGetAll(`users:${userId}`);
      if (!userData || Object.keys(userData).length === 0) {
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return this.inMemoryUsers.find(u => u.id === userId) || null;
    }
  }

  async authenticateUser(username, password) {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // ตรวจสอบ password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid username or password' };
      }

      // อัพเดท lastLogin
      if (this.fallbackMode) {
        const userIndex = this.inMemoryUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          this.inMemoryUsers[userIndex].lastLogin = new Date().toISOString();
        }
      } else {
        await this.client.hSet(`users:${user.id}`, 'lastLogin', new Date().toISOString());
      }

      // ลบ password ออกจาก response
      const { password: _, ...userWithoutPassword } = user;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Authenticate user error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  async getAllUsers() {
    try {
      if (this.fallbackMode) {
        return this.inMemoryUsers.map(user => {
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const userIds = await this.client.sMembers('users:list');
      const users = [];

      for (const userId of userIds) {
        const user = await this.getUserById(userId);
        if (user) {
          // ลบ password ออกจาก response
          const { password: _, ...userWithoutPassword } = user;
          users.push(userWithoutPassword);
        }
      }

      return users;
    } catch (error) {
      console.error('Get all users error:', error);
      return this.inMemoryUsers.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    }
  }

  // Discord Roles Management
  async getAllDiscordRoles() {
    try {
      if (this.fallbackMode) {
        return this.inMemoryRoles;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const roles = await this.client.sMembers('discord:roles');
      return roles;
    } catch (error) {
      console.error('Get discord roles error:', error);
      return this.inMemoryRoles;
    }
  }

  async addDiscordRole(role) {
    try {
      if (this.fallbackMode) {
        if (!this.inMemoryRoles.includes(role)) {
          this.inMemoryRoles.push(role);
        }
        return { success: true, roles: this.inMemoryRoles };
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      await this.client.sAdd('discord:roles', role);
      const roles = await this.getAllDiscordRoles();
      return { success: true, roles };
    } catch (error) {
      console.error('Add discord role error:', error);
      return this.addDiscordRoleFallback(role);
    }
  }

  addDiscordRoleFallback(role) {
    if (!this.inMemoryRoles.includes(role)) {
      this.inMemoryRoles.push(role);
    }
    return { success: true, roles: this.inMemoryRoles };
  }

  async removeDiscordRole(role) {
    try {
      if (this.fallbackMode) {
        const initialRoles = [...this.inMemoryRoles];
        this.inMemoryRoles = this.inMemoryRoles.filter(r => r !== role);
        if (this.inMemoryRoles.length < initialRoles.length) {
          console.log(`Removed role "${role}" from in-memory roles.`);
          return { success: true, roles: this.inMemoryRoles };
        }
        return { success: false, error: 'Role not found in in-memory roles' };
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      await this.client.sRem('discord:roles', role);
      
      // ลบ role จาก users ทั้งหมด
      const userIds = await this.client.sMembers('users:list');
      for (const userId of userIds) {
        await this.client.sRem(`users:${userId}:roles`, role);
      }

      const roles = await this.getAllDiscordRoles();
      return { success: true, roles };
    } catch (error) {
      console.error('Remove discord role error:', error);
      return { success: false, error: 'Failed to remove role' };
    }
  }

  async addRoleToUser(userId, role) {
    try {
      if (this.fallbackMode) {
        const user = this.inMemoryUsers.find(u => u.id === userId);
        if (!user) {
          return { success: false, error: 'User not found in in-memory' };
        }

        // เพิ่ม role ให้ user
        if (!user.discordRoles.includes(role)) {
          user.discordRoles.push(role);
        }
        
        // อัพเดท user object
        const roles = user.discordRoles;
        await this.client.hSet(`users:${userId}`, 'discordRoles', JSON.stringify(roles));

        const updatedUser = this.inMemoryUsers.find(u => u.id === userId);
        const { password: _, ...userWithoutPassword } = updatedUser;
        
        return { success: true, user: userWithoutPassword };
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const user = await this.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // เพิ่ม role ให้ user
      await this.client.sAdd(`users:${userId}:roles`, role);
      
      // อัพเดท user object
      const roles = await this.client.sMembers(`users:${userId}:roles`);
      await this.client.hSet(`users:${userId}`, 'discordRoles', JSON.stringify(roles));

      const updatedUser = await this.getUserById(userId);
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Add role to user error:', error);
      return { success: false, error: 'Failed to add role to user' };
    }
  }

  async removeRoleFromUser(userId, role) {
    try {
      if (this.fallbackMode) {
        const user = this.inMemoryUsers.find(u => u.id === userId);
        if (!user) {
          return { success: false, error: 'User not found in in-memory' };
        }

        // ลบ role จาก user
        const initialRoles = [...user.discordRoles];
        user.discordRoles = user.discordRoles.filter(r => r !== role);
        if (user.discordRoles.length < initialRoles.length) {
          console.log(`Removed role "${role}" from in-memory user ${userId}.`);
          await this.client.hSet(`users:${userId}`, 'discordRoles', JSON.stringify(user.discordRoles));
          return { success: true, user: { ...user, discordRoles: user.discordRoles } };
        }
        return { success: false, error: 'Role not found in in-memory user roles' };
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const user = await this.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // ลบ role จาก user
      await this.client.sRem(`users:${userId}:roles`, role);
      
      // อัพเดท user object
      const roles = await this.client.sMembers(`users:${userId}:roles`);
      await this.client.hSet(`users:${userId}`, 'discordRoles', JSON.stringify(roles));

      const updatedUser = await this.getUserById(userId);
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Remove role from user error:', error);
      return { success: false, error: 'Failed to remove role from user' };
    }
  }

  // Session Management
  async saveSession(sessionId, sessionData) {
    try {
      if (this.fallbackMode) {
        console.warn('Saving session in fallback mode. Data will not persist.');
        return true;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      await this.client.setEx(`session:${sessionId}`, 3600, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Save session error:', error);
      return false;
    }
  }

  async getSession(sessionId) {
    try {
      if (this.fallbackMode) {
        console.warn('Getting session in fallback mode. Data will not persist.');
        return null;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const sessionData = await this.client.get(`session:${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async deleteSession(sessionId) {
    try {
      if (this.fallbackMode) {
        console.warn('Deleting session in fallback mode. Data will not persist.');
        return true;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      await this.client.del(`session:${sessionId}`);
      return true;
    } catch (error) {
      console.error('Delete session error:', error);
      return false;
    }
  }

  // Initialize default data
  async initializeDefaultData() {
    try {
      if (this.fallbackMode) {
        console.log('Initializing default data in fallback mode');
        return;
      }

      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      // ตรวจสอบว่ามี admin user หรือไม่
      const adminUser = await this.getUserByUsername('admin');
      if (!adminUser) {
        await this.createUser('admin', 'admin123', 'admin@example.com');
        console.log('Created default admin user');
      }

      // ตรวจสอบว่ามี default roles หรือไม่
      const roles = await this.getAllDiscordRoles();
      if (roles.length === 0) {
        const defaultRoles = [
          'Moderator', 'Admin', 'VIP', 'Premium', 'Member', 'Newbie',
          'Pro Player', 'Tournament Winner', 'Event Organizer',
          'Content Creator', 'Streamer', 'Developer', 'Support Team'
        ];

        for (const role of defaultRoles) {
          await this.addDiscordRole(role);
        }
        console.log('Created default discord roles');
      }

      console.log('Redis database initialized successfully');
    } catch (error) {
      console.error('Initialize default data error:', error);
      this.enableFallbackMode();
    }
  }
}

module.exports = new RedisDatabase();

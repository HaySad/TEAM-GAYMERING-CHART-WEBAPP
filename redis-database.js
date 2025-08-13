const redis = require('redis');
const bcrypt = require('bcryptjs');

class RedisDatabase {
  constructor() {
    this.client = null;
    this.isConnected = false;
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
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('Redis client ready');
        this.isConnected = true;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      console.error('Redis connection error:', error);
      this.isConnected = false;
      return false;
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
      return { success: false, error: 'Failed to create user' };
    }
  }

  async getUserByUsername(username) {
    try {
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
      return null;
    }
  }

  async getUserById(userId) {
    try {
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
      return null;
    }
  }

  async authenticateUser(username, password) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

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
      await this.client.hSet(`users:${user.id}`, 'lastLogin', new Date().toISOString());

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
      return [];
    }
  }

  async updateUser(userId, updates) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const user = await this.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // อัพเดท fields ที่ต้องการ
      const updatedUser = { ...user, ...updates };
      await this.client.hSet(`users:${userId}`, updatedUser);

      // ลบ password ออกจาก response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  // Discord Roles Management
  async getAllDiscordRoles() {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const roles = await this.client.sMembers('discord:roles');
      return roles;
    } catch (error) {
      console.error('Get discord roles error:', error);
      return [];
    }
  }

  async addDiscordRole(role) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      await this.client.sAdd('discord:roles', role);
      const roles = await this.getAllDiscordRoles();
      return { success: true, roles };
    } catch (error) {
      console.error('Add discord role error:', error);
      return { success: false, error: 'Failed to add role' };
    }
  }

  async removeDiscordRole(role) {
    try {
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
    }
  }
}

module.exports = new RedisDatabase();

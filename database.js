const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.usersFile = path.join(__dirname, 'data', 'users.json');
    this.discordRolesFile = path.join(__dirname, 'data', 'discord_roles.txt');
    this.init();
  }

  async init() {
    try {
      // สร้างโฟลเดอร์ data ถ้ายังไม่มี
      const dataDir = path.join(__dirname, 'data');
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir);
      }

      // สร้างไฟล์ users.json ถ้ายังไม่มี
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify([], null, 2));
      }

      // สร้างไฟล์ discord_roles.txt ถ้ายังไม่มี
      try {
        await fs.access(this.discordRolesFile);
      } catch {
        const defaultRoles = [
          'Moderator',
          'Admin',
          'VIP',
          'Premium',
          'Member',
          'Newbie',
          'Pro Player',
          'Tournament Winner',
          'Event Organizer',
          'Content Creator',
          'Streamer',
          'Developer',
          'Support Team'
        ];
        await fs.writeFile(this.discordRolesFile, defaultRoles.join('\n'));
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async getAllUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  // ดึง Discord roles ทั้งหมด
  async getDiscordRoles() {
    try {
      const data = await fs.readFile(this.discordRolesFile, 'utf8');
      return data.split('\n').filter(role => role.trim() !== '');
    } catch (error) {
      console.error('Error reading discord roles:', error);
      return [];
    }
  }

  // เพิ่ม Discord role ใหม่
  async addDiscordRole(role) {
    try {
      const roles = await this.getDiscordRoles();
      if (!roles.includes(role)) {
        roles.push(role);
        await fs.writeFile(this.discordRolesFile, roles.join('\n'));
      }
      return { success: true, roles };
    } catch (error) {
      console.error('Error adding discord role:', error);
      return { success: false, error: 'Server error' };
    }
  }

  // ลบ Discord role
  async removeDiscordRole(role) {
    try {
      const roles = await this.getDiscordRoles();
      const filteredRoles = roles.filter(r => r !== role);
      await fs.writeFile(this.discordRolesFile, filteredRoles.join('\n'));
      return { success: true, roles: filteredRoles };
    } catch (error) {
      console.error('Error removing discord role:', error);
      return { success: false, error: 'Server error' };
    }
  }

  async createUser(username, password, email = null) {
    try {
      const users = await this.getAllUsers();
      
      // ตรวจสอบว่ามี username นี้อยู่แล้วหรือไม่
      if (users.find(user => user.username === username)) {
        return { success: false, error: 'Username already exists' };
      }

      // เข้ารหัสรหัสผ่าน
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // สร้างผู้ใช้ใหม่
      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        email,
        rating: 0,
        discordRoles: [],
        isAdmin: username === 'HaySad', // HaySad เป็น admin
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      users.push(newUser);
      await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
      
      return { success: true, user: { id: newUser.id, username: newUser.username, email: newUser.email } };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Server error' };
    }
  }

  async authenticateUser(username, password) {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.username === username);
      
      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // ตรวจสอบรหัสผ่าน
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid username or password' };
      }

      // อัปเดต lastLogin
      user.lastLogin = new Date().toISOString();
      await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));

      return { 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          rating: user.rating || 0,
          discordRoles: user.discordRoles || [],
          isAdmin: user.isAdmin || false,
          lastLogin: user.lastLogin
        } 
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'Server error' };
    }
  }

  async findUser(username) {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.username === username);
      return user ? { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        rating: user.rating || 0,
        discordRoles: user.discordRoles || [],
        isAdmin: user.isAdmin || false
      } : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async findUserById(id) {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.id === id);
      return user ? { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        rating: user.rating || 0,
        discordRoles: user.discordRoles || [],
        isAdmin: user.isAdmin || false
      } : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async deleteUser(username) {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user.username !== username);
      await fs.writeFile(this.usersFile, JSON.stringify(filteredUsers, null, 2));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Legacy method สำหรับ backward compatibility
  async addUser(username) {
    return await this.createUser(username, 'defaultPassword123');
  }

  // อัปเดต rating ของผู้ใช้
  async updateUserRating(userId, newRating) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      users[userIndex].rating = newRating;
      await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
      
      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Error updating user rating:', error);
      return { success: false, error: 'Server error' };
    }
  }

  // เพิ่ม discord role ให้ผู้ใช้
  async addDiscordRole(userId, role) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      if (!users[userIndex].discordRoles) {
        users[userIndex].discordRoles = [];
      }

      if (!users[userIndex].discordRoles.includes(role)) {
        users[userIndex].discordRoles.push(role);
        await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
      }
      
      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Error adding discord role:', error);
      return { success: false, error: 'Server error' };
    }
  }

  // ลบ discord role ของผู้ใช้
  async removeDiscordRole(userId, role) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      if (users[userIndex].discordRoles) {
        users[userIndex].discordRoles = users[userIndex].discordRoles.filter(r => r !== role);
        await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
      }
      
      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Error removing discord role:', error);
      return { success: false, error: 'Server error' };
    }
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ admin)
  async getAllUsersForAdmin() {
    try {
      const users = await this.getAllUsers();
      return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        rating: user.rating || 0,
        discordRoles: user.discordRoles || [],
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }));
    } catch (error) {
      console.error('Error getting all users for admin:', error);
      return [];
    }
  }
}

module.exports = new Database(); 
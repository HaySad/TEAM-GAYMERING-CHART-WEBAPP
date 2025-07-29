const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.usersFile = path.join(__dirname, 'data', 'users.json');
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
      return user ? { id: user.id, username: user.username, email: user.email } : null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async findUserById(id) {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.id === id);
      return user ? { id: user.id, username: user.username, email: user.email } : null;
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
}

module.exports = new Database(); 
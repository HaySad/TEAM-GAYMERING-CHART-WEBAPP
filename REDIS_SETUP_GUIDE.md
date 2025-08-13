# คู่มือการตั้งค่า Redis ใน Vercel

## ภาพรวม:
การย้ายระบบ login ไปใช้ Redis จะแก้ปัญหา Server Error และทำให้ระบบเสถียรขึ้น

## ข้อดีของการใช้ Redis:

### ✅ **แก้ปัญหา Server Error**
- ไม่ต้องพึ่งพา file-based database
- ข้อมูลคงทนเมื่อ server restart
- รองรับ serverless environment

### ✅ **Performance ดีขึ้น**
- Redis เร็วกว่า file system
- In-memory storage
- Optimized for session management

### ✅ **Scalable**
- รองรับ user จำนวนมาก
- Distributed caching
- High availability

## ขั้นตอนการตั้งค่า:

### 1. **สร้าง Redis Database ใน Vercel**

#### ไปที่ Vercel Dashboard:
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจค discord-competition
3. ไปที่ Storage tab
4. คลิก "Create Database"
5. เลือก "Redis"
6. ตั้งชื่อ: `maimai-redis`
7. เลือก Region: `Washington, D.C. (iad1)`
8. คลิก "Create"

### 2. **ตั้งค่า Environment Variables**

#### ใน Vercel Dashboard > Settings > Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://discord-competition.vercel.app
REDIS_URL=redis://your-redis-url-from-vercel
```

#### วิธีหา REDIS_URL:
1. ไปที่ Storage tab
2. เลือก Redis database ที่สร้าง
3. คลิก "Connect"
4. คัดลอก Connection String
5. ใส่ใน Environment Variables

### 3. **ติดตั้ง Dependencies**

#### ไฟล์ที่แก้ไขแล้ว:
- ✅ `package.json` - เพิ่ม redis และ connect-redis
- ✅ `redis-database.js` - สร้าง Redis database module
- ✅ `server.js` - แก้ไขให้ใช้ Redis

### 4. **Deploy โปรเจค**

#### Commit และ Push:
```bash
git add .
git commit -m "Migrate to Redis: replace file-based database with Redis"
git push origin master
```

## การทำงานของ Redis Database:

### **User Management:**
```javascript
// สร้าง user
await redisDatabase.createUser(username, password, email);

// ตรวจสอบ user
await redisDatabase.authenticateUser(username, password);

// ดึงข้อมูล user
await redisDatabase.getUserByUsername(username);
await redisDatabase.getAllUsers();
```

### **Session Management:**
```javascript
// บันทึก session
await redisDatabase.saveSession(sessionId, sessionData);

// ดึง session
await redisDatabase.getSession(sessionId);

// ลบ session
await redisDatabase.deleteSession(sessionId);
```

### **Discord Roles:**
```javascript
// จัดการ roles
await redisDatabase.getAllDiscordRoles();
await redisDatabase.addDiscordRole(role);
await redisDatabase.removeDiscordRole(role);

// จัดการ user roles
await redisDatabase.addRoleToUser(userId, role);
await redisDatabase.removeRoleFromUser(userId, role);
```

## การตรวจสอบ:

### 1. **ตรวจสอบ Redis Connection:**
```bash
# ทดสอบ API endpoint
curl https://discord-competition.vercel.app/api/session
```

### 2. **ตรวจสอบ Function Logs:**
- ไปที่ Vercel Dashboard > Functions
- ดู Logs ของ server.js
- ตรวจสอบ "Redis connected successfully"

### 3. **ทดสอบ Login/Signup:**
- เปิดเว็บไซต์
- ลอง signup user ใหม่
- ลอง login
- ตรวจสอบ admin panel

## Default Data:

### **Admin User:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@example.com`

### **Default Discord Roles:**
- Moderator, Admin, VIP, Premium, Member, Newbie
- Pro Player, Tournament Winner, Event Organizer
- Content Creator, Streamer, Developer, Support Team

## การแก้ไขปัญหา:

### 1. **Redis Connection Error:**
**ตรวจสอบ:**
- REDIS_URL environment variable
- Redis database status ใน Vercel
- Network connectivity

### 2. **Session Not Working:**
**ตรวจสอบ:**
- Redis session store configuration
- Session secret key
- Cookie settings

### 3. **User Data Not Persisting:**
**ตรวจสอบ:**
- Redis database operations
- Error logs ใน Vercel
- Database initialization

## หมายเหตุ:

1. **Redis URL** ต้องถูกต้องและ accessible
2. **Environment Variables** ต้องตั้งค่าถูกต้อง
3. **Session Store** ต้องใช้ Redis client
4. **Database Initialization** จะสร้าง default data อัตโนมัติ

## การทดสอบหลัง Deploy:

1. ✅ ตรวจสอบ Redis connection
2. ✅ ทดสอบ signup user ใหม่
3. ✅ ทดสอบ login
4. ✅ ตรวจสอบ admin panel
5. ✅ ทดสอบ Discord roles management
6. ✅ ตรวจสอบ session persistence

หากยังมีปัญหา ให้ดู Function Logs ใน Vercel Dashboard เพื่อหาข้อผิดพลาดที่ชัดเจน

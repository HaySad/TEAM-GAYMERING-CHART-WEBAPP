# คู่มือการ Deploy Redis

## Redis URL ที่ได้:
```
redis://default:rGYilPjaBMYa05YE5KlvDFyJPaFd3Sco@redis-14393.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com:14393
```

## ขั้นตอนการ Deploy:

### 1. **ตั้งค่า Environment Variables ใน Vercel**

#### ไปที่ Vercel Dashboard:
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจค discord-competition
3. ไปที่ Settings > Environment Variables
4. เพิ่ม Environment Variables:

```
NODE_ENV=production
JWT_SECRET=maimai-jwt-secret-key-2024-redis
REACT_APP_API_URL=https://discord-competition.vercel.app
REDIS_URL=redis://default:rGYilPjaBMYa05YE5KlvDFyJPaFd3Sco@redis-14393.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com:14393
```

### 2. **Commit และ Push โปรเจค**

```bash
git add .
git commit -m "Migrate to Redis: replace file-based database with Redis"
git push origin master
```

### 3. **ตรวจสอบ Vercel Build**

#### ไปที่ Vercel Dashboard:
1. ดู Build Logs
2. ตรวจสอบว่า build สำเร็จ
3. ดู Function Logs ของ server.js

### 4. **ทดสอบ Redis Connection**

#### ทดสอบ API endpoint:
```bash
curl https://discord-competition.vercel.app/api/session
```

#### ตรวจสอบ Function Logs:
- ไปที่ Vercel Dashboard > Functions
- ดู Logs ของ server.js
- ตรวจสอบ "Redis connected successfully"

### 5. **ทดสอบ Login/Signup**

#### ทดสอบ Signup:
1. เปิดเว็บไซต์
2. ไปที่หน้า Signup
3. สร้าง user ใหม่
4. ตรวจสอบว่าไม่มี "Server error"

#### ทดสอบ Login:
1. ไปที่หน้า Login
2. ลอง login ด้วย user ที่สร้าง
3. ตรวจสอบว่า login สำเร็จ

#### ทดสอบ Admin Panel:
1. Login ด้วย admin user:
   - Username: `admin`
   - Password: `admin123`
2. ไปที่ Admin Panel
3. ตรวจสอบ Discord Roles Management

## การตรวจสอบ:

### 1. **ตรวจสอบ Redis Connection:**
- ดู Function Logs ใน Vercel Dashboard
- ตรวจสอบ "Redis connected successfully"
- ตรวจสอบ "Database initialization completed"

### 2. **ทดสอบ API Endpoints:**
```bash
# ทดสอบ session
curl https://discord-competition.vercel.app/api/session

# ทดสอบ signup
curl -X POST https://discord-competition.vercel.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# ทดสอบ login
curl -X POST https://discord-competition.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### 3. **ตรวจสอบ Default Data:**
- Admin user: `admin` / `admin123`
- Default Discord roles ควรถูกสร้างอัตโนมัติ

## การแก้ไขปัญหา:

### 1. **Redis Connection Error:**
**ตรวจสอบ:**
- REDIS_URL environment variable ถูกต้อง
- Redis database status
- Network connectivity

### 2. **Build Error:**
**ตรวจสอบ:**
- Dependencies ติดตั้งถูกต้อง
- Environment Variables ครบถ้วน
- Build Logs ใน Vercel

### 3. **API Error:**
**ตรวจสอบ:**
- Function Logs ใน Vercel
- Redis connection status
- Database initialization

## หมายเหตุ:

1. **Redis URL** ถูกต้องและ accessible
2. **Environment Variables** ตั้งค่าครบถ้วน
3. **Database Initialization** จะสร้าง default data อัตโนมัติ
4. **Session Management** ใช้ Redis store

## การทดสอบหลัง Deploy:

1. ✅ ตรวจสอบ Redis connection
2. ✅ ทดสอบ signup user ใหม่
3. ✅ ทดสอบ login
4. ✅ ตรวจสอบ admin panel
5. ✅ ทดสอบ Discord roles management
6. ✅ ตรวจสอบ session persistence

หากยังมีปัญหา ให้ดู Function Logs ใน Vercel Dashboard เพื่อหาข้อผิดพลาดที่ชัดเจน

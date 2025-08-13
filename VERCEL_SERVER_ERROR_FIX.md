# คู่มือการแก้ไข Server Error ใน Vercel

## ปัญหาที่พบ:
- หน้า Signup/Login แสดง "Server error"
- Build สำเร็จแล้ว แต่ API ไม่ทำงาน
- Vercel deployment มีปัญหา

## สาเหตุที่เป็นไปได้:

### 1. **Environment Variables ไม่ถูกต้อง**
- `JWT_SECRET` ไม่ได้ตั้งค่า
- `REACT_APP_API_URL` ไม่ถูกต้อง
- `NODE_ENV` ไม่ได้ตั้งค่า

### 2. **API Routes ไม่ทำงาน**
- Serverless functions ไม่สามารถรันได้
- Database connection ล้มเหลว
- CORS configuration ไม่ถูกต้อง

### 3. **Vercel Configuration**
- `vercel.json` ไม่ถูกต้อง
- Build configuration มีปัญหา

## วิธีแก้ไข:

### วิธีที่ 1: ตรวจสอบ Environment Variables

#### 1. ไปที่ Vercel Dashboard:
- ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
- เลือกโปรเจค discord-competition
- ไปที่ Settings > Environment Variables

#### 2. ตั้งค่า Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://discord-competition.vercel.app
```

### วิธีที่ 2: ตรวจสอบ API Routes

#### 1. ทดสอบ API endpoint:
```bash
curl https://discord-competition.vercel.app/api/session
```

#### 2. ตรวจสอบ server.js:
- ตรวจสอบว่า server.js ทำงานได้ใน Vercel
- ตรวจสอบ database connection

### วิธีที่ 3: แก้ไข vercel.json

#### ใช้ vercel.json แบบง่าย:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### วิธีที่ 4: ตรวจสอบ Database

#### 1. ตรวจสอบ database.js:
- ตรวจสอบว่าใช้ in-memory fallback ใน Vercel
- ตรวจสอบ file system access

#### 2. แก้ไข database.js:
```javascript
// เพิ่ม logging เพื่อ debug
console.log('Database initialization:', process.env.NODE_ENV);
```

## ขั้นตอนการแก้ไข:

### 1. ตั้งค่า Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://discord-competition.vercel.app
```

### 2. Commit และ Push:
```bash
git add .
git commit -m "Fix server error: update vercel configuration and environment variables"
git push origin master
```

### 3. ตรวจสอบ Vercel Build:
- ไปที่ Vercel Dashboard
- ดู Build Logs
- ตรวจสอบ Function Logs

### 4. ทดสอบ API:
```bash
# ทดสอบ session endpoint
curl https://discord-competition.vercel.app/api/session

# ทดสอบ signup endpoint
curl -X POST https://discord-competition.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## การตรวจสอบ:

### 1. ตรวจสอบ Function Logs:
- ไปที่ Vercel Dashboard
- เลือกโปรเจค
- ไปที่ Functions
- ดู Logs ของ server.js

### 2. ตรวจสอบ Network Tab:
- เปิด browser console (F12)
- ไปที่ Network tab
- ลอง signup/login
- ดู error responses

### 3. ตรวจสอบ Console Errors:
- เปิด browser console
- ดู JavaScript errors
- ดู API call errors

## ปัญหาอื่นๆ ที่อาจพบ:

### 1. **CORS Error:**
**แก้ไข:** ตรวจสอบ CORS configuration ใน server.js

### 2. **Database Error:**
**แก้ไข:** ตรวจสอบ database.js และ in-memory fallback

### 3. **JWT Error:**
**แก้ไข:** ตรวจสอบ JWT_SECRET environment variable

## หมายเหตุ:

1. **Environment Variables** ต้องตั้งค่าถูกต้อง
2. **API Routes** ต้องทำงานได้ใน Vercel
3. **Database** ต้องใช้ in-memory fallback
4. **CORS** ต้องอนุญาต Vercel domain

## การทดสอบหลังแก้ไข:

1. ตรวจสอบว่า API endpoints ทำงาน
2. ทดสอบ signup/login
3. ตรวจสอบ database operations
4. ทดสอบ admin panel

หากยังมีปัญหา ให้ดู Function Logs ใน Vercel Dashboard เพื่อหาข้อผิดพลาดที่ชัดเจน

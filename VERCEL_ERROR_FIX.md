# คู่มือการแก้ไข Vercel Error: Conflicting Functions and Builds Configuration

## ปัญหาที่พบ:
- Vercel deployment ล้มเหลว
- Error: "Conflicting Functions and Builds Configuration"
- โปรเจค discord-competition ไม่สามารถ deploy ได้

## สาเหตุ:
ตาม [Vercel Error Documentation](https://vercel.com/docs/errors/error-list#conflicting-functions-and-builds-configuration):
- การตั้งค่า `vercel.json` ที่ขัดแย้งกัน
- มีการกำหนด Functions และ Builds ที่ไม่เข้ากัน
- Routing configuration ไม่ถูกต้อง

## วิธีแก้ไข:

### วิธีที่ 1: ใช้ vercel.json แบบง่าย (แนะนำ)

#### 1. แทนที่ vercel.json ด้วย:
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

#### 2. หรือใช้ vercel-simple.json:
```bash
# เปลี่ยนชื่อไฟล์
mv vercel.json vercel.json.backup
mv vercel-simple.json vercel.json
```

### วิธีที่ 2: ลบ vercel.json และใช้ Framework Preset

#### 1. ลบ vercel.json:
```bash
rm vercel.json
```

#### 2. ตั้งค่าใน Vercel Dashboard:
- ไปที่ Project Settings
- เลือก Framework Preset: "Node.js"
- ตั้งค่า:
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Install Command: `npm install`

### วิธีที่ 3: แก้ไข vercel.json ปัจจุบัน

#### ลบส่วน functions ออก:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "CI=false npm run build",
        "outputDirectory": "build",
        "devCommand": "npm run dev"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## ขั้นตอนการ Deploy:

### 1. Commit การเปลี่ยนแปลง:
```bash
git add .
git commit -m "Fix Vercel configuration - remove conflicting functions"
git push origin main
```

### 2. ตรวจสอบ Vercel Dashboard:
- ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
- เลือกโปรเจค discord-competition
- ดู Build Logs

### 3. ตั้งค่า Environment Variables:
ใน Vercel Dashboard > Settings > Environment Variables:
```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://discord-competition.vercel.app
```

## การตรวจสอบ:

### 1. ตรวจสอบ Build Logs:
- ไปที่ Vercel Dashboard
- เลือกโปรเจค
- ไปที่ Deployments
- คลิกที่ deployment ล่าสุด
- ดู Build Logs

### 2. ทดสอบ API:
```bash
# ทดสอบ API endpoint
curl https://discord-competition.vercel.app/api/session
```

### 3. ทดสอบ Frontend:
- เปิด browser
- ไปที่ https://discord-competition.vercel.app
- ตรวจสอบ console errors (F12)

## ปัญหาอื่นๆ ที่อาจพบ:

### 1. **Missing build script**
**แก้ไข:** ตรวจสอบ `package.json` ว่ามี build script:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### 2. **Missing public directory**
**แก้ไข:** ตรวจสอบว่ามีโฟลเดอร์ `public` และ `build`

### 3. **Environment Variables ไม่ถูกต้อง**
**แก้ไข:** ตั้งค่า Environment Variables ใน Vercel Dashboard

## หมายเหตุ:

1. **Functions configuration** ใน vercel.json อาจขัดแย้งกับ builds
2. **ควรใช้ Framework Preset** แทนการกำหนดเอง
3. **ตรวจสอบ Build Logs** เพื่อหาข้อผิดพลาดที่ชัดเจน
4. **Environment Variables** ต้องตั้งค่าถูกต้อง

## การทดสอบหลัง Deploy:

1. ตรวจสอบว่าเว็บไซต์โหลดได้
2. ทดสอบ API endpoints
3. ทดสอบ Login/Signup
4. ตรวจสอบ CORS errors

หากยังมีปัญหา ให้ดู Build Logs ใน Vercel Dashboard เพื่อหาข้อผิดพลาดที่ชัดเจน

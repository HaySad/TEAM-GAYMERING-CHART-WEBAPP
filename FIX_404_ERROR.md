# คู่มือการแก้ไข 404 Error ใน Vercel

## ปัญหาที่พบ:
- เข้า https://discord-competition.vercel.app/ แล้วได้ 404: NOT_FOUND
- Build อาจล้มเหลวหรือ static files ไม่ถูก serve

## สาเหตุที่เป็นไปได้:

### 1. **Build ล้มเหลว**
- React build ไม่สำเร็จ
- Dependencies มีปัญหา
- Build configuration ไม่ถูกต้อง

### 2. **Static Files ไม่ถูก Serve**
- vercel.json configuration ไม่ถูกต้อง
- build folder ไม่ถูกสร้าง
- routing ไม่ถูกต้อง

### 3. **Environment Variables ไม่ครบ**
- Build environment variables ไม่ครบ
- Production environment variables ไม่ครบ

## วิธีแก้ไข:

### วิธีที่ 1: ตรวจสอบ Vercel Build

#### ไปที่ Vercel Dashboard:
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจค discord-competition
3. ดู Build Logs
4. ตรวจสอบว่า build สำเร็จหรือไม่

### วิธีที่ 2: แก้ไข vercel.json

#### ใช้ vercel.json ที่ถูกต้อง:
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
        "outputDirectory": "build"
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
  ]
}
```

### วิธีที่ 3: ตั้งค่า Environment Variables

#### ใน Vercel Dashboard > Settings > Environment Variables:
```
NODE_ENV=production
JWT_SECRET=maimai-jwt-secret-key-2024-redis
REACT_APP_API_URL=https://discord-competition.vercel.app
REDIS_URL=redis://default:rGYilPjaBMYa05YE5KlvDFyJPaFd3Sco@redis-14393.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com:14393
```

### วิธีที่ 4: ลบ vercel.json และใช้ Framework Preset

#### ถ้า vercel.json มีปัญหา:
```bash
rm vercel.json
```

#### ตั้งค่าใน Vercel Dashboard:
1. ไปที่ Project Settings
2. เลือก Framework Preset: "Create React App"
3. ตั้งค่า:
   - Build Command: `CI=false npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### วิธีที่ 5: Commit และ Deploy

#### Commit การเปลี่ยนแปลง:
```bash
git add .
git commit -m "Fix 404 error: update vercel configuration and build settings"
git push origin master
```

## การตรวจสอบ:

### 1. **ตรวจสอบ Build Logs:**
- ไปที่ Vercel Dashboard
- ดู Build Logs
- ตรวจสอบว่า build สำเร็จ

### 2. **ตรวจสอบ Deployments:**
- ดู Deployments tab
- ตรวจสอบว่า deployment สำเร็จ
- ดู Function Logs

### 3. **ทดสอบ URL:**
```bash
# ทดสอบ root URL
curl https://discord-competition.vercel.app/

# ทดสอบ API endpoint
curl https://discord-competition.vercel.app/api/session
```

## การแก้ไขปัญหา:

### 1. **Build Error:**
**ตรวจสอบ:**
- Dependencies ติดตั้งถูกต้อง
- Build command ถูกต้อง
- Environment variables ครบ

### 2. **Static Files Error:**
**ตรวจสอบ:**
- build folder ถูกสร้าง
- vercel.json configuration
- Routing rules

### 3. **API Error:**
**ตรวจสอบ:**
- server.js function
- Redis connection
- Environment variables

## หมายเหตุ:

1. **Build Process** ต้องสำเร็จก่อน
2. **Static Files** ต้องถูก serve
3. **API Routes** ต้องทำงานได้
4. **Environment Variables** ต้องครบถ้วน

## การทดสอบหลังแก้ไข:

1. ✅ ตรวจสอบว่าเว็บไซต์โหลดได้
2. ✅ ทดสอบ API endpoints
3. ✅ ทดสอบ signup/login
4. ✅ ตรวจสอบ admin panel

หากยังมีปัญหา ให้ดู Build Logs ใน Vercel Dashboard เพื่อหาข้อผิดพลาดที่ชัดเจน

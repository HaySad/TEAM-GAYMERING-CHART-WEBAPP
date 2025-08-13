# คู่มือการ Deploy บน Vercel

## ปัญหาที่พบบ่อย: Vercel ไม่ Build อัตโนมัติ

### สาเหตุและวิธีแก้ไข:

#### 1. **Git Repository ไม่ได้เชื่อมต่อกับ Vercel**
```bash
# ตรวจสอบ Git remote
git remote -v

# ถ้าไม่มี remote ให้เพิ่ม
git remote add origin https://github.com/username/repository-name.git

# หรือถ้าใช้ GitHub CLI
gh repo create repository-name --public --source=. --remote=origin --push
```

#### 2. **Vercel Project ไม่ได้เชื่อมต่อกับ Git Repository**
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ Settings > Git
4. ตรวจสอบว่า Repository ถูกเชื่อมต่อแล้ว
5. ถ้าไม่ ให้กด "Connect Git Repository"

#### 3. **Branch ไม่ตรงกัน**
- Vercel จะ build จาก branch `main` หรือ `master` โดยค่าเริ่มต้น
- ตรวจสอบว่าคุณ push ไปยัง branch ที่ถูกต้อง

#### 4. **Environment Variables ไม่ได้ตั้งค่า**
ตั้งค่าตัวแปรต่อไปนี้ใน Vercel:
```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://your-vercel-domain.vercel.app
```

#### 5. **Build Command ไม่ถูกต้อง**
ตรวจสอบ `package.json`:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

## ขั้นตอนการ Deploy แบบ Manual:

### 1. **ติดตั้ง Vercel CLI**
```bash
npm i -g vercel
```

### 2. **Login Vercel**
```bash
vercel login
```

### 3. **Deploy**
```bash
vercel --prod
```

### 4. **หรือ Deploy ผ่าน Git**
```bash
# Commit และ Push
git add .
git commit -m "Fix server error and update configuration"
git push origin main

# Vercel จะ build อัตโนมัติหลังจาก push
```

## การตรวจสอบ Build Logs:

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจค
3. ไปที่ Deployments
4. คลิกที่ deployment ล่าสุด
5. ดู Build Logs เพื่อหาข้อผิดพลาด

## การแก้ไขปัญหา Build Error:

### 1. **Node Version**
เพิ่มใน `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. **Build Output Directory**
ตรวจสอบ `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "CI=false npm run build",
        "outputDirectory": "build"
      }
    }
  ]
}
```

### 3. **CORS Configuration**
ตรวจสอบ `server.js` ว่า CORS ถูกตั้งค่าถูกต้อง

## การทดสอบหลัง Deploy:

1. ตรวจสอบว่าเว็บไซต์โหลดได้
2. ทดสอบ API endpoints
3. ทดสอบ Login/Signup
4. ตรวจสอบ CORS errors ใน browser console

## หมายเหตุสำคัญ:

- ข้อมูลผู้ใช้จะหายเมื่อ function restart (in-memory storage)
- สำหรับ production จริง ควรใช้ external database
- ตรวจสอบ JWT_SECRET ว่าตั้งค่าถูกต้องและปลอดภัย

# Vercel Deployment Guide

## การตั้งค่า Environment Variables บน Vercel

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ Settings > Environment Variables
4. เพิ่มตัวแปรต่อไปนี้:

```
NODE_ENV=production
JWT_SECRET=your-secret-jwt-key-here
REACT_APP_API_URL=https://your-vercel-domain.vercel.app
```

## การแก้ไขปัญหา Server Error

### 1. CORS Error
- ตรวจสอบว่า domain ของคุณอยู่ใน allowed origins
- แก้ไขใน `server.js` หากจำเป็น

### 2. Database Error
- ใน serverless environment ไฟล์ database อาจไม่สามารถเขียนได้
- ระบบจะใช้ in-memory storage แทน

### 3. API Routes Error
- ตรวจสอบ `vercel.json` configuration
- ตรวจสอบว่า API routes ถูกต้อง

## การ Debug

1. ตรวจสอบ Vercel Function Logs
2. ใช้ `console.log()` ใน server.js
3. ตรวจสอบ Network tab ใน browser

## การทดสอบ

1. ทดสอบ API endpoints ด้วย Postman
2. ตรวจสอบ CORS headers
3. ทดสอบ authentication flow

## หมายเหตุ

- ข้อมูลจะหายเมื่อ function restart (in-memory storage)
- ควรใช้ external database สำหรับ production
- ตรวจสอบ JWT_SECRET ว่าตั้งค่าถูกต้อง

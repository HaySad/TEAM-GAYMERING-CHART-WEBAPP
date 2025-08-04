# Profile และ Admin Panel Features

## 📋 Overview
ระบบ Profile และ Admin Panel ที่เพิ่มความสามารถในการจัดการ Rating และ Discord Roles

## 👤 Profile Features

### ข้อมูลผู้ใช้
- **ชื่อผู้ใช้**: แสดงชื่อผู้ใช้ปัจจุบัน
- **อีเมล**: แสดงอีเมล (ถ้ามี)
- **สถานะ**: แสดงสถานะ (Guest/Member/Admin)
- **Rating**: คะแนนของผู้ใช้ (สามารถเพิ่ม/ลดได้)
- **Discord Roles**: ยศที่ได้รับมอบหมาย

### Rating System
- Rating จะถูกคำนวณอัตโนมัติจากคะแนนเกมที่เล่น
- ใช้ Deep Learning ในการวิเคราะห์และปรับ Rating
- ผู้ใช้ไม่สามารถแก้ไข Rating ได้เอง
- Rating เริ่มต้นที่ 0
- ระบบจะรับคะแนนเกมและคำนวณ Rating อัตโนมัติ

### Discord Roles Display
- แสดงยศทั้งหมดที่ได้รับมอบหมาย
- แสดงเป็น tags สีฟ้า
- ถ้าไม่มียศจะแสดง "ยังไม่มี Discord roles"

### Admin Access
- ถ้าผู้ใช้เป็น Admin จะมีปุ่ม "เข้าสู่ Admin Panel"
- Admin จะมี badge สีแดงแสดงสถานะ

## ⚙️ Admin Panel Features

### Discord Roles Management
- **เพิ่ม Role ใหม่**: Admin สามารถเพิ่ม Discord role ใหม่ได้
- **ลบ Role**: Admin สามารถลบ role ที่ไม่ต้องการได้
- **แสดง Role ทั้งหมด**: แสดงรายการ role ทั้งหมดที่มีในระบบ

### User Management
- **ดูผู้ใช้ทั้งหมด**: แสดงรายการผู้ใช้ทั้งหมดในระบบ
- **ข้อมูลผู้ใช้**: แสดง username, email, rating, roles
- **เพิ่ม Role ให้ผู้ใช้**: Admin สามารถมอบหมาย role ให้ผู้ใช้ได้
- **ลบ Role ของผู้ใช้**: Admin สามารถลบ role ของผู้ใช้ได้

### Admin Controls
- **Admin Only**: เฉพาะผู้ใช้ที่เป็น Admin เท่านั้นที่เข้าถึงได้
- **Real-time Updates**: การเปลี่ยนแปลงจะอัปเดตทันที
- **Error Handling**: แสดงข้อความ error และ success

## 🔐 Security Features

### Authentication
- ต้องเข้าสู่ระบบก่อนเข้าถึง Profile
- Admin Panel ต้องเป็น Admin เท่านั้น
- JWT Token authentication

### Authorization
- Guest users ไม่สามารถแก้ไข Rating ได้
- เฉพาะ Admin เท่านั้นที่เข้าถึง Admin Panel
- การจัดการ Discord roles เฉพาะ Admin

## 📊 Database Schema

### User Table
```json
{
  "id": "string",
  "username": "string",
  "email": "string (optional)",
  "password": "string (hashed)",
  "rating": "number (default: 0)",
  "discordRoles": "array of strings",
  "isAdmin": "boolean (default: false)",
  "createdAt": "timestamp",
  "lastLogin": "timestamp"
}
```

### Discord Roles File
```
Moderator
Admin
VIP
Premium
Member
Newbie
Pro Player
Tournament Winner
Event Organizer
Content Creator
Streamer
Developer
Support Team
```

## 🚀 API Endpoints

### Profile Endpoints
- `GET /api/profile` - ดึงข้อมูลโปรไฟล์
- `POST /api/game-score` - ส่งคะแนนเกมเพื่อคำนวณ Rating
- `GET /api/game-history` - ดึงประวัติเกมของผู้ใช้

### Admin Endpoints
- `GET /api/admin/users` - ดึงข้อมูลผู้ใช้ทั้งหมด
- `GET /api/admin/discord-roles` - ดึง Discord roles ทั้งหมด
- `POST /api/admin/discord-roles` - เพิ่ม Discord role ใหม่
- `DELETE /api/admin/discord-roles/:role` - ลบ Discord role
- `POST /api/admin/users/:userId/discord-roles` - เพิ่ม role ให้ผู้ใช้
- `DELETE /api/admin/users/:userId/discord-roles/:role` - ลบ role ของผู้ใช้

## 🎯 User Roles

### Guest User
- เข้าสู่ระบบได้โดยไม่ต้องสมัครสมาชิก
- ดูข้อมูลได้แต่แก้ไขไม่ได้
- ไม่สามารถเพิ่ม/ลด Rating ได้
- ไม่สามารถเข้าถึง Admin Panel ได้

### Regular User
- Rating จะถูกคำนวณอัตโนมัติจากคะแนนเกม
- ดู Discord roles ที่ได้รับมอบหมาย
- ไม่สามารถเข้าถึง Admin Panel ได้

### Admin User
- มีสิทธิ์ทั้งหมดของ Regular User
- เข้าถึง Admin Panel ได้
- จัดการ Discord roles ได้
- จัดการผู้ใช้ได้

## 🔧 Setup Instructions

### 1. สร้าง Admin User
```javascript
// ใน database.js
const newUser = {
  // ... other fields
  isAdmin: username === 'HaySad', // HaySad เป็น admin
};
```

### 2. สร้าง Discord Roles File
```bash
# สร้างไฟล์ data/discord_roles.txt
Moderator
Admin
VIP
Premium
Member
Newbie
Pro Player
Tournament Winner
Event Organizer
Content Creator
Streamer
Developer
Support Team
```

### 3. อัปเดต Routes
```javascript
// ใน App.tsx
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
```

## 📱 UI Features

### Profile Page
- **Responsive Design**: รองรับทุกขนาดหน้าจอ
- **Modern UI**: ใช้ gradient และ shadow effects
- **Interactive Elements**: ปุ่มเพิ่ม/ลด Rating
- **Status Indicators**: แสดงสถานะ Guest/Admin

### Admin Panel
- **Tabbed Interface**: แยก Discord Roles และ User Management
- **Real-time Updates**: อัปเดตข้อมูลทันที
- **Bulk Operations**: จัดการหลายรายการพร้อมกัน
- **Search & Filter**: ค้นหาและกรองข้อมูล

## 🔄 Future Enhancements

### Rating System
- **Deep Learning Integration**: เชื่อมต่อกับ AI system
- **Game Score Analysis**: วิเคราะห์คะแนนเกม
- **Rating Calculation**: คำนวณ Rating อัตโนมัติ
- **Performance Tracking**: ติดตามประสิทธิภาพการเล่น

### Discord Roles
- **Role Hierarchy**: ระบบลำดับชั้นของ roles
- **Role Permissions**: สิทธิ์ของแต่ละ role
- **Role Colors**: สีของแต่ละ role
- **Role Descriptions**: คำอธิบายของแต่ละ role

### Admin Features
- **User Analytics**: วิเคราะห์ข้อมูลผู้ใช้
- **Bulk Operations**: จัดการหลายรายการพร้อมกัน
- **Audit Log**: บันทึกการเปลี่ยนแปลง
- **Advanced Search**: ค้นหาขั้นสูง

## 🐛 Troubleshooting

### Common Issues
1. **Admin Access Denied**: ตรวจสอบว่า username เป็น 'HaySad' หรือไม่
2. **Rating Update Failed**: ตรวจสอบ network connection
3. **Role Not Added**: ตรวจสอบว่า role มีอยู่ในระบบหรือไม่
4. **Guest User Error**: Guest users ไม่สามารถแก้ไขข้อมูลได้

### Debug Steps
1. ตรวจสอบ console logs
2. ตรวจสอบ network requests
3. ตรวจสอบ database files
4. ตรวจสอบ JWT token

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ console logs
2. ตรวจสอบ network requests
3. ตรวจสอบ database files
4. ติดต่อ developer 
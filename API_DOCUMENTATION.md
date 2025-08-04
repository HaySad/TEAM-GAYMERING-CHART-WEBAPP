# API Documentation - Authentication System

## Overview
ระบบ Authentication ที่รองรับการเข้าสู่ระบบแบบปกติและ Guest Mode

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Login
**POST** `/api/login`

เข้าสู่ระบบด้วย username และ password

**Request Body:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "user123",
    "email": "user@example.com"
  },
  "token": "jwt_token_here",
  "expiresIn": "24h"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

### 2. Signup
**POST** `/api/signup`

สมัครสมาชิกใหม่

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "newuser@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "new_user_id",
    "username": "newuser",
    "email": "newuser@example.com"
  },
  "token": "jwt_token_here",
  "expiresIn": "24h"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

### 3. Guest Mode
**Frontend Implementation**

Guest mode ไม่ต้องการ API endpoint แยก เนื่องจากทำงานในฝั่ง frontend:

```typescript
// ใน AuthContext
const loginAsGuest = async () => {
  const guestUser = {
    id: 'guest-' + Date.now(),
    username: 'Guest User',
    email: undefined
  };
  
  setUser(guestUser);
  setIsGuest(true);
  setToken('guest-token');
  localStorage.setItem('authToken', 'guest-token');
  localStorage.setItem('isGuest', 'true');
  
  return { success: true };
};
```

### 4. Logout
**POST** `/api/logout`

ออกจากระบบ

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Submit Game Score
**POST** `/api/game-score`

ส่งคะแนนเกมเพื่อคำนวณ Rating (สำหรับ Deep Learning)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "songId": "song_123",
  "score": 950000,
  "accuracy": 98.5,
  "combo": 1000,
  "difficulty": "MASTER",
  "clearType": "CLEAR"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game score submitted successfully",
  "gameScore": {
    "userId": "user_id",
    "username": "username",
    "songId": "song_123",
    "score": 950000,
    "accuracy": 98.5,
    "combo": 1000,
    "difficulty": "MASTER",
    "clearType": "CLEAR",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "note": "Rating will be calculated by AI system"
}
```

### 6. Get Game History
**GET** `/api/game-history`

ดึงประวัติเกมของผู้ใช้

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "gameHistory": []
}
```

### 7. Check Session
**GET** `/api/session`

ตรวจสอบสถานะการเข้าสู่ระบบ

**Headers (Optional):**
```
Authorization: Bearer <token>
```

**Response (Authenticated):**
```json
{
  "isValid": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com"
  },
  "authMethod": "jwt"
}
```

**Response (Guest):**
```json
{
  "isValid": true,
  "user": {
    "id": "guest-timestamp",
    "username": "Guest User",
    "email": undefined
  },
  "authMethod": "guest"
}
```

**Response (Not Authenticated):**
```json
{
  "isValid": false
}
```

### 8. Get Profile
**GET** `/api/profile`

ดึงข้อมูลโปรไฟล์ผู้ใช้ (Protected Route)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com"
  }
}
```

## Frontend Usage

### React Context (AuthContext)

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { 
    user, 
    isLoggedIn, 
    isGuest, 
    login, 
    loginAsGuest, 
    signup, 
    logout 
  } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login('username', 'password');
    if (result.success) {
      // Navigate to home
    }
  };

  // Guest Login
  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      // Navigate to home
    }
  };

  // Signup
  const handleSignup = async () => {
    const result = await signup('username', 'password');
    if (result.success) {
      // Navigate to home
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    // Navigate to login
  };
};
```

## Error Handling

### Common Error Messages

- `"Username and password are required"` - ไม่กรอก username หรือ password
- `"Password must be at least 6 characters long"` - รหัสผ่านสั้นเกินไป
- `"Username already exists"` - ชื่อผู้ใช้ซ้ำ
- `"Invalid username or password"` - ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
- `"Access token required"` - ไม่มี token
- `"Invalid or expired token"` - Token ไม่ถูกต้องหรือหมดอายุ

## Security Features

1. **JWT Token Authentication** - ใช้ JWT token สำหรับการยืนยันตัวตน
2. **Password Validation** - รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
3. **Session Management** - จัดการ session และ token expiration
4. **Guest Mode** - อนุญาตให้ใช้งานแบบไม่ต้องสมัครสมาชิก
5. **CORS Configuration** - ตั้งค่า CORS สำหรับความปลอดภัย

## Guest Mode Features

- ไม่ต้องสมัครสมาชิก
- ไม่ต้องกรอกข้อมูลส่วนตัว
- สามารถใช้งานฟีเจอร์พื้นฐานได้
- ข้อมูลจะไม่ถูกบันทึกถาวร
- สามารถเปลี่ยนเป็นสมาชิกเต็มได้ในภายหลัง

## Database Schema

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

```env
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
REACT_APP_API_URL=http://localhost:3000
``` 
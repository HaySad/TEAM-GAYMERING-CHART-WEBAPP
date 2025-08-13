# คู่มือการแก้ไขปัญหา: เข้า IP ไม่ได้

## ปัญหา: เข้า http://27.145.145.20:3001/ ไม่ได้

### สาเหตุที่เป็นไปได้:

#### 1. **Server ไม่ได้รัน**
**ตรวจสอบ:**
```bash
# ดู process ที่ใช้ port 3001
netstat -ano | findstr :3001

# ถ้าไม่มีผลลัพธ์ แสดงว่า server ไม่ได้รัน
```

**วิธีแก้:**
```bash
# รัน server
npm run server
# หรือ
node server.js
```

#### 2. **Windows Firewall บล็อก**
**ตรวจสอบ:**
- เปิด Windows Defender Firewall
- ดูว่า Node.js หรือ port 3001 ถูก allow หรือไม่

**วิธีแก้:**
```cmd
# รันเป็น Administrator
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3001
```

#### 3. **Router Port Forwarding ไม่ถูกต้อง**
**ตรวจสอบ:**
- เข้าไปที่ Router Admin Panel (192.168.1.1)
- ดู Port Forwarding settings
- ตรวจสอบว่า:
  - External Port: 3001
  - Internal Port: 3001
  - Internal IP: IP ของเครื่องคุณ
  - Protocol: TCP
  - Status: Enabled

#### 4. **ISP บล็อก Port 3001**
**วิธีแก้:**
- ลองเปลี่ยน port เป็น 8080 หรือ 8000
- แก้ไขใน `server.js`:
```javascript
const PORT = process.env.PORT || 8080; // เปลี่ยนจาก 3001 เป็น 8080
```

#### 5. **CORS Error**
**ตรวจสอบ:**
- เปิด browser console (F12)
- ดู error messages

**วิธีแก้:**
- แก้ไข CORS ใน `server.js` (ดูด้านล่าง)

## ขั้นตอนการแก้ไข:

### ขั้นตอนที่ 1: ตรวจสอบ Server
```bash
# 1. รัน server
npm run server

# 2. ทดสอบจากเครื่องเดียวกัน
curl http://localhost:3001/api/session
```

### ขั้นตอนที่ 2: ตรวจสอบ Firewall
```cmd
# รันเป็น Administrator
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3001
```

### ขั้นตอนที่ 3: ตรวจสอบ Port Forwarding
1. เข้าไปที่ Router Admin Panel
2. ตรวจสอบ Port Forwarding settings
3. ตั้งค่าใหม่ถ้าจำเป็น

### ขั้นตอนที่ 4: ทดสอบจากเครื่องอื่น
```bash
# ทดสอบจากเครื่องอื่นในเครือข่ายเดียวกัน
curl http://192.168.1.100:3001/api/session

# ทดสอบจากอินเทอร์เน็ต
curl http://27.145.145.20:3001/api/session
```

## การแก้ไข CORS:

### แก้ไขใน `server.js`:
```javascript
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Allow all local network requests
    if (origin && origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
      return callback(null, true);
    }
    
    // Allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.1.100:3000',
      'http://192.168.1.100:3001',
      'http://27.145.145.20:3000',
      'http://27.145.145.20:3001',
      'https://27.145.145.20:3000',
      'https://27.145.145.20:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## การเปลี่ยน Port:

### ถ้า ISP บล็อก port 3001:

#### 1. แก้ไข `server.js`:
```javascript
const PORT = process.env.PORT || 8080; // เปลี่ยนจาก 3001 เป็น 8080
```

#### 2. แก้ไข Port Forwarding:
- External Port: 8080
- Internal Port: 8080

#### 3. แก้ไข CORS:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://192.168.1.100:3000',
  'http://192.168.1.100:8080',
  'http://27.145.145.20:3000',
  'http://27.145.145.20:8080'
];
```

#### 4. รันใหม่:
```bash
npm run server
```

#### 5. ทดสอบ:
```
http://27.145.145.20:8080/
```

## คำสั่งที่ใช้บ่อย:

### ดู process ที่ใช้ port:
```bash
netstat -ano | findstr :3001
```

### Kill process:
```bash
taskkill /PID [PID] /F
```

### ทดสอบ port:
```bash
telnet localhost 3001
```

### ทดสอบจากภายนอก:
```bash
curl http://27.145.145.20:3001/api/session
```

## หมายเหตุ:

1. **Public IP อาจเปลี่ยน** เมื่อ router restart
2. **Port Forwarding ต้องตั้งค่าใหม่** เมื่อเปลี่ยน port
3. **ISP บางรายอาจบล็อก port** บางตัว
4. **ควรใช้ Dynamic DNS** ถ้าต้องการ URL ที่เสถียร

## การทดสอบแบบง่าย:

### 1. ทดสอบจากเครื่องเดียวกัน:
```
http://localhost:3001/
```

### 2. ทดสอบจากเครือข่ายท้องถิ่น:
```
http://192.168.1.100:3001/
```

### 3. ทดสอบจากอินเทอร์เน็ต:
```
http://27.145.145.20:3001/
```

หากยังไม่ได้ ให้ตรวจสอบ:
1. Server รันอยู่หรือไม่
2. Firewall settings
3. Port Forwarding settings
4. ISP blocking

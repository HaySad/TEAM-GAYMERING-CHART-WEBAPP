# คู่มือการตั้งค่า Port Forwarding สำหรับ Web App

## ขั้นตอนการตั้งค่า

### 1. **หา IP Address ของเครื่องคุณ**

#### Windows:
```bash
ipconfig
```
หา IPv4 Address ในส่วน "Wireless LAN adapter Wi-Fi" หรือ "Ethernet adapter"

#### macOS/Linux:
```bash
ifconfig
# หรือ
ip addr
```

**ตัวอย่างผลลัพธ์:**
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### 2. **หา Public IP Address**

#### วิธีที่ 1: ใช้เว็บไซต์
- ไปที่ https://whatismyipaddress.com/
- หรือ https://ipinfo.io/

#### วิธีที่ 2: ใช้คำสั่ง
```bash
# Windows
curl ifconfig.me

# macOS/Linux
curl ifconfig.me
# หรือ
wget -qO- ifconfig.me
```

### 3. **ตั้งค่า Windows Firewall**

#### ขั้นตอน:
1. เปิด **Windows Defender Firewall**
   - กด `Win + R` → พิมพ์ `wf.msc` → Enter

2. คลิก **"Allow an app or feature through Windows Defender Firewall"**

3. คลิก **"Change settings"** (ต้องมีสิทธิ์ Admin)

4. คลิก **"Allow another app"**

5. คลิก **"Browse"** และเลือกไฟล์ Node.js
   - มักจะอยู่ที่: `C:\Program Files\nodejs\node.exe`

6. ตรวจสอบทั้ง **Private** และ **Public**

7. คลิก **"OK"**

#### หรือใช้คำสั่ง (ต้องรันเป็น Administrator):
```cmd
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3001
```

### 4. **ตั้งค่า Router Port Forwarding**

#### ขั้นตอน:

1. **หา Router IP Address:**
   ```bash
   ipconfig
   ```
   ดูที่ "Default Gateway" (มักจะเป็น 192.168.1.1)

2. **เข้าไปที่ Router Admin Panel:**
   - เปิด browser
   - ไปที่ `http://192.168.1.1` (หรือ IP ที่ได้จาก Default Gateway)
   - Login ด้วย username/password ของ router

3. **หา Port Forwarding:**
   - อาจเรียกว่า: "Port Forwarding", "Virtual Server", "NAT", "Port Mapping"
   - มักจะอยู่ใน Advanced Settings หรือ Security

4. **เพิ่ม Port Forwarding Rule:**
   ```
   Service Name: maimai-webapp
   External Port: 3001
   Internal Port: 3001
   Internal IP: 192.168.1.100 (IP ของเครื่องคุณ)
   Protocol: TCP
   Status: Enabled
   ```

5. **บันทึกการตั้งค่า**

### 5. **รัน Web App**

```bash
# รัน server
npm run server

# หรือรันพร้อม React app
npm run dev
```

### 6. **ทดสอบการเชื่อมต่อ**

#### ทดสอบจากเครื่องเดียวกัน:
```bash
curl http://localhost:3001/api/session
```

#### ทดสอบจากเครื่องอื่นในเครือข่ายเดียวกัน:
```bash
curl http://192.168.1.100:3001/api/session
```

#### ทดสอบจากอินเทอร์เน็ต:
```bash
curl http://[PUBLIC-IP]:3001/api/session
```

## การแก้ไขปัญหา

### 1. **ปัญหาที่พบบ่อย**

#### ❌ **ไม่สามารถเข้าถึงได้จากเครื่องอื่น**
**สาเหตุ:** Firewall หรือ Port Forwarding ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ Windows Firewall
2. ตรวจสอบ Router Port Forwarding
3. ตรวจสอบว่า server รันอยู่จริง

#### ❌ **CORS Error**
**สาเหตุ:** CORS ไม่ได้ตั้งค่าให้ยอมรับ IP ของเครื่องอื่น

**วิธีแก้:**
- แก้ไข CORS ใน `server.js` (ดูด้านล่าง)

#### ❌ **Connection Timeout**
**สาเหตุ:** Port Forwarding ไม่ถูกต้อง หรือ ISP บล็อก port

**วิธีแก้:**
1. ตรวจสอบ Router settings
2. ลองเปลี่ยน port เป็น 8080 หรือ 8000
3. ติดต่อ ISP ถ้าจำเป็น

### 2. **แก้ไข CORS สำหรับ IP ต่างๆ**

#### แก้ไขใน `server.js`:
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
      'http://192.168.1.100:3000', // IP ของเครื่องคุณ
      'http://[PUBLIC-IP]:3000'    // Public IP
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

### 3. **คำสั่งที่ใช้บ่อย**

#### ดู process ที่ใช้ port 3001:
```bash
# Windows
netstat -ano | findstr :3001

# macOS/Linux
lsof -i :3001
```

#### Kill process ที่ใช้ port 3001:
```bash
# Windows
taskkill /PID [PID] /F

# macOS/Linux
kill -9 [PID]
```

#### ทดสอบ port:
```bash
# Windows
telnet localhost 3001

# macOS/Linux
nc -zv localhost 3001
```

## ความปลอดภัย

### ⚠️ **คำเตือน:**
1. **เปิดให้ใครก็ได้เข้าถึงได้** - ควรใช้เฉพาะการทดสอบ
2. **ไม่มี HTTPS** - ข้อมูลอาจถูกดักจับได้
3. **ไม่มี Authentication** - ใครก็เข้าถึงได้
4. **Router อาจถูกโจมตี** - ควรเปลี่ยน password router

### 🔒 **คำแนะนำความปลอดภัย:**
1. ใช้เฉพาะการทดสอบ
2. ปิด port forwarding เมื่อไม่ใช้
3. เปลี่ยน password router เป็นประจำ
4. ใช้ VPN ถ้าจำเป็น
5. สำหรับ production ควรใช้ VPS หรือ Cloud hosting

## ตัวอย่างการใช้งาน

### 1. **แชร์ URL ให้เพื่อน:**
```
http://[PUBLIC-IP]:3001
```

### 2. **เข้าถึงจากมือถือ:**
- เชื่อมต่อ Wi-Fi เดียวกัน
- เปิด browser
- ไปที่ `http://192.168.1.100:3001`

### 3. **เข้าถึงจากอินเทอร์เน็ต:**
- เปิด browser
- ไปที่ `http://[PUBLIC-IP]:3001`

## หมายเหตุ

- **Public IP อาจเปลี่ยน** เมื่อ router restart
- **Port Forwarding ต้องตั้งค่าใหม่** เมื่อเปลี่ยน router
- **ISP บางรายอาจบล็อก port** บางตัว
- **ควรใช้ Dynamic DNS** ถ้าต้องการ URL ที่เสถียร

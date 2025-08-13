# คู่มือการตั้งค่า Web App ให้เข้าถึงได้จากเครื่องอื่น

## วิธีที่ 1: ใช้ ngrok (แนะนำสำหรับการทดสอบ)

### ขั้นตอน:
1. **ติดตั้ง ngrok:**
   ```bash
   npm install -g ngrok
   # หรือดาวน์โหลดจาก https://ngrok.com/
   ```

2. **รัน server:**
   ```bash
   npm run server
   ```

3. **เปิด terminal ใหม่และรัน ngrok:**
   ```bash
   ngrok http 3001
   ```

4. **แชร์ URL ที่ได้จาก ngrok** (เช่น `https://abc123.ngrok.io`)

### ข้อดี:
- ไม่ต้องตั้งค่า Firewall
- มี HTTPS อัตโนมัติ
- ใช้งานง่าย

### ข้อเสีย:
- URL เปลี่ยนทุกครั้งที่ restart
- จำกัด bandwidth (เวอร์ชันฟรี)

---

## วิธีที่ 2: ใช้ localtunnel

### ขั้นตอน:
1. **ติดตั้ง localtunnel:**
   ```bash
   npm install -g localtunnel
   ```

2. **รัน server:**
   ```bash
   npm run server
   ```

3. **เปิด terminal ใหม่และรัน localtunnel:**
   ```bash
   lt --port 3001
   ```

4. **แชร์ URL ที่ได้จาก localtunnel**

---

## วิธีที่ 3: ตั้งค่า Firewall และ Port Forwarding (สำหรับเครือข่ายท้องถิ่น)

### ขั้นตอน:

#### 1. **หา IP Address ของเครื่องคุณ:**
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
# หรือ
ip addr
```

#### 2. **ตั้งค่า Windows Firewall:**
1. เปิด Windows Defender Firewall
2. คลิก "Allow an app or feature through Windows Defender Firewall"
3. คลิก "Change settings"
4. คลิก "Allow another app"
5. เลือก Node.js หรือเพิ่ม port 3001
6. ตรวจสอบทั้ง Private และ Public

#### 3. **ตั้งค่า Router Port Forwarding:**
1. เข้าไปที่ Router Admin Panel (มักจะเป็น 192.168.1.1)
2. หา Port Forwarding หรือ Virtual Server
3. เพิ่ม rule:
   - External Port: 3001
   - Internal Port: 3001
   - Internal IP: IP ของเครื่องคุณ
   - Protocol: TCP

#### 4. **รัน server:**
```bash
npm run server
```

#### 5. **แชร์ URL:**
```
http://[Public-IP]:3001
```

---

## วิธีที่ 4: ใช้ PM2 สำหรับ Production

### ขั้นตอน:

#### 1. **ติดตั้ง PM2:**
```bash
npm install -g pm2
```

#### 2. **สร้าง ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'maimai-w',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

#### 3. **รันด้วย PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## วิธีที่ 5: ใช้ Docker

### ขั้นตอน:

#### 1. **สร้าง Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "server.js"]
```

#### 2. **สร้าง docker-compose.yml:**
```yaml
version: '3.8'
services:
  maimai-w:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### 3. **รันด้วย Docker:**
```bash
docker-compose up -d
```

---

## การแก้ไขปัญหา CORS

### แก้ไขใน server.js:
```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-ngrok-url.ngrok.io',
      'http://192.168.1.100:3000', // IP ของเครื่องคุณ
      'http://your-public-ip:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## การทดสอบ

### 1. **ทดสอบจากเครื่องเดียวกัน:**
```bash
curl http://localhost:3001/api/session
```

### 2. **ทดสอบจากเครื่องอื่น:**
```bash
curl http://[IP-ADDRESS]:3001/api/session
```

### 3. **ทดสอบผ่าน browser:**
เปิด browser และไปที่ URL ที่ได้

---

## หมายเหตุสำคัญ:

1. **ความปลอดภัย:** วิธีนี้จะเปิดให้ใครก็ได้เข้าถึงได้ ควรใช้เฉพาะการทดสอบ
2. **Performance:** การใช้ tunnel อาจทำให้ช้า
3. **Stability:** ngrok และ localtunnel อาจไม่เสถียร
4. **Production:** สำหรับ production ควรใช้ VPS หรือ Cloud hosting

---

## คำสั่งที่ใช้บ่อย:

```bash
# รัน server
npm run server

# รันพร้อม ngrok
npm run public

# ดู process ที่รันอยู่
netstat -ano | findstr :3001

# Kill process ที่ใช้ port 3001
taskkill /PID [PID] /F
```

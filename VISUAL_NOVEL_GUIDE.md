# 📖 Visual Novel System Guide

ระบบ Visual Novel แบบง่ายๆ สำหรับเว็บแอปพลิเคชัน

## 🌟 คุณสมบัติ

### ✨ คุณสมบัติหลัก
- **Typewriter Effect**: ข้อความแสดงทีละตัวอักษร สร้างความน่าติดตาม
- **Character System**: แสดงตัวละครพร้อม avatar และชื่อ
- **Background Changes**: เปลี่ยนพื้นหลังได้ตาม scene
- **Choice System**: ระบบตัวเลือกที่แยกเส้นเรื่องได้
- **Save/Load System**: บันทึกและโหลดความคืบหน้า
- **Auto-progression**: เลื่อนต่อโดยอัตโนมัติ (ถ้าต้องการ)
- **History Navigation**: ย้อนกลับไปดู scene ก่อนหน้าได้
- **Responsive Design**: รองรับทุกขนาดหน้าจอ

### 🎨 ระบบตกแต่ง
- พื้นหลังแบบ gradient สวยงาม
- Effect กระจกใส (glass effect)
- Animation เรียบๆ
- Typography ที่อ่านง่าย

## 🚀 วิธีใช้งาน

### 1. สร้างไฟล์เรื่อง (JSON)

```json
[
  {
    "id": "start",
    "characterName": "ผู้บรรยาย",
    "text": "เนื้อเรื่องเริ่มต้น...",
    "background": "/path/to/background.jpg",
    "nextId": "scene2"
  },
  {
    "id": "scene2",
    "characterName": "ตัวละคร A",
    "characterAvatar": "/path/to/avatar.png",
    "text": "สวัสดี! เธอชื่ออะไร?",
    "choices": [
      {
        "text": "ผมชื่อ... (ใส่ชื่อ)",
        "nextId": "good_path"
      },
      {
        "text": "ไม่อยากบอก",
        "nextId": "mystery_path"
      }
    ]
  }
]
```

### 2. นำไปใช้ใน Component

```tsx
import VisualNovel from '../components/VisualNovel';

const MyStory: React.FC = () => {
  const [storyData, setStoryData] = useState([]);

  useEffect(() => {
    fetch('/my-story.json')
      .then(res => res.json())
      .then(data => setStoryData(data));
  }, []);

  return (
    <VisualNovel
      scenes={storyData}
      startSceneId="start"
      onComplete={() => alert('จบแล้ว!')}
      enableSaveLoad={true}
      storyId="my_story"
    />
  );
};
```

## 📝 โครงสร้างข้อมูล Scene

| Property | ประเภท | จำเป็น | คำอธิบาย |
|----------|---------|---------|----------|
| `id` | string | ✅ | รหัสเฉพาะของ scene |
| `text` | string | ✅ | ข้อความที่จะแสดง |
| `characterName` | string | ❌ | ชื่อตัวละคร |
| `characterAvatar` | string | ❌ | URL ของรูป avatar |
| `background` | string | ❌ | URL ของภาพพื้นหลัง |
| `nextId` | string | ❌ | scene ถัดไป (ถ้าไม่มี choices) |
| `choices` | Choice[] | ❌ | ตัวเลือกสำหรับผู้เล่น |
| `delay` | number | ❌ | ความเร็วพิมพ์ (มิลลิวินาทีต่อตัวอักษร) |
| `autoNext` | boolean | ❌ | เลื่อนต่อโดยอัตโนมัติ |
| `autoNextDelay` | number | ❌ | เวลารอก่อนเลื่อนต่อ (มิลลิวินาที) |

### โครงสร้าง Choice

```typescript
interface DialogChoice {
  text: string;        // ข้อความตัวเลือก
  nextId: string;      // scene ถัดไปเมื่อเลือกตัวเลือกนี้
  action?: () => void; // ฟังก์ชันพิเศษ (เช่น เพิ่มคะแนน)
}
```

## 🎮 การใช้งานระบบ

### ควบคุมพื้นฐาน
- **คลิก**: ดำเนินต่อหรือแสดงข้อความเต็ม
- **ปุ่มย้อนกลับ**: กลับไป scene ก่อนหน้า
- **ปุ่มบันทึก**: บันทึกความคืบหน้า

### Ending System
- ใช้ `"nextId": "END"` เพื่อจบเรื่อง
- จะเรียก `onComplete()` callback

### การจัดการไฟล์
- วางไฟล์ JSON ในโฟลเดอร์ `public/`
- วางภาพพื้นหลังใน `public/images/backgrounds/`
- วางภาพตัวละครใน `public/images/characters/`

## 🛠 การปรับแต่ง

### CSS Classes ที่สำคัญ
- `.visual-novel`: คอนเทนเนอร์หลัก
- `.vn-dialog-box`: กล่องข้อความ
- `.vn-character-name`: ชื่อตัวละคร
- `.vn-text`: ข้อความหลัก
- `.vn-choices`: คอนเทนเนอร์ตัวเลือก
- `.vn-choice-btn`: ปุ่มตัวเลือก

### การเปลี่ยนธีม
แก้ไขใน `VisualNovel.css`:

```css
.visual-novel {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}

.vn-dialog-box {
  background: linear-gradient(145deg, rgba(your-rgba), rgba(your-rgba));
}
```

## 📚 ตัวอย่างการใช้งาน

### 1. เรื่องแบบธรรมดา
```json
[
  {
    "id": "start",
    "text": "เรื่องเริ่มต้น...",
    "nextId": "middle"
  },
  {
    "id": "middle", 
    "text": "ตอนกลาง...",
    "nextId": "END"
  }
]
```

### 2. เรื่องที่มีตัวเลือก
```json
[
  {
    "id": "choice_point",
    "text": "เธออยากไปทางไหน?",
    "choices": [
      {"text": "ไปทางซ้าย", "nextId": "left_path"},
      {"text": "ไปทางขวา", "nextId": "right_path"}
    ]
  }
]
```

### 3. Auto-progression
```json
[
  {
    "id": "dramatic_pause",
    "text": "เงียบ...",
    "autoNext": true,
    "autoNextDelay": 3000,
    "nextId": "next_scene"
  }
]
```

## 🔧 การ Debug

### ปัญหาที่พบบ่อย

1. **ไม่แสดงภาพ**: ตรวจสอบ path ของไฟล์รูป
2. **ไม่มี scene**: ตรวจสอบ `id` และ `nextId`
3. **ไม่บันทึกได้**: ตรวจสอบ localStorage และ `storyId`

### Console Commands สำหรับ Debug
```javascript
// ดู save data
localStorage.getItem('vn_save_your_story_id')

// ลบ save data
localStorage.removeItem('vn_save_your_story_id')
```

## 🎯 เคล็ดลับการเขียนเรื่อง

1. **เริ่มต้นที่ seduce**: สร้างตัวอย่างง่ายๆ ก่อน
2. **แผนผังเรื่อง**: วาดแผนผังการแยกเส้นเรื่อง
3. **ทดสอบบ่อยๆ**: ลองเล่นดูทุกครั้งที่เพิ่มเรื่อง
4. **Backup**: เก็บไฟล์ JSON เวอร์ชันเก่าไว้

---

Happy storytelling! 🎉

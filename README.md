# 📚 نظام المكتبة الرقمية الحديثة
## Modern Library System

نظام مكتبة رقمية متطور مع دعم كامل للغة العربية والتخطيط من اليمين إلى اليسار (RTL).

---

## ✨ الميزات الرئيسية

### 📖 إدارة الكتب
- ✅ عرض جميع الكتب المتاحة
- ✅ البحث المتقدم عن الكتب
- ✅ تصفية الكتب حسب التصنيف
- ✅ عرض تفاصيل الكتاب الكاملة
- ✅ تحميل الكتب بشكل آمن

### 📂 إدارة التصنيفات
- ✅ تنظيم الكتب في تصنيفات متعددة
- ✅ عرض التصنيفات الرئيسية
- ✅ تصفية الكتب حسب التصنيف

### 👥 نظام المستخدمين
- ✅ تسجيل دخول وتسجيل
- ✅ إدارة الملف الشخصي
- ✅ تتبع التحميلات

### 📊 لوحة التحكم الإدارية
- ✅ إضافة كتب جديدة
- ✅ تعديل بيانات الكتب
- ✅ حذف الكتب
- ✅ إدارة التصنيفات
- ✅ عرض الإحصائيات

### 📧 نموذج الاتصال
- ✅ استقبال رسائل من الزوار
- ✅ إشعارات للمسؤول
- ✅ إدارة الرسائل

### 📈 تتبع التحميلات
- ✅ عد التحميلات لكل كتاب
- ✅ إحصائيات الاستخدام
- ✅ تقارير التنزيلات

---

## 🛠️ المتطلبات

- Node.js (v14 أو أحدث)
- npm أو yarn
- متصفح حديث يدعم JavaScript

---

## 📦 التثبيت

### 1. استنساخ المستودع
```bash
git clone https://github.com/YahyaAljoby/modern-library-system.git
cd modern-library-system
```

### 2. تثبيت المكتبات
```bash
npm install
```

### 3. تشغيل الخادم
```bash
npm run dev
```

الخادم سيعمل على: `http://localhost:3000`

---

## 🚀 الاستخدام

### الصفحات الرئيسية

1. **الرئيسية** (`/`)
   - عرض الكتب المميزة
   - الإحصائيات العامة
   - شريط البحث

2. **الكتب** (`/html/books.html`)
   - عرض جميع الكتب
   - البحث والتصفية
   - تحميل الكتب

3. **التصنيفات** (`/html/categories.html`)
   - عرض جميع التصنيفات
   - تصفية الكتب حسب التصنيف

4. **من نحن** (`/html/about.html`)
   - معلومات عن المكتبة
   - أهدافنا ورؤيتنا

5. **اتصل بنا** (`/html/contact.html`)
   - نموذج الاتصال
   - معلومات التواصل

---

## 🔌 API Endpoints

### الكتب
- `GET /api/books` - الحصول على جميع الكتب
- `GET /api/books/:id` - الحصول على كتاب محدد
- `POST /api/books` - إضافة كتاب جديد
- `PUT /api/books/:id` - تحديث كتاب
- `DELETE /api/books/:id` - حذف كتاب

### التصنيفات
- `GET /api/categories` - الحصول على جميع التصنيفات

### التحميلات
- `POST /api/downloads/:bookId` - تسجيل تحميل

### الرسائل
- `POST /api/contacts` - إرسال رسالة
- `GET /api/contacts` - الحصول على جميع الرسائل

### الإحصائيات
- `GET /api/stats` - الحصول على الإحصائيات العامة

---

## 📁 هيكل المشروع

```
modern-library-system/
├── public/                 # الملفات الثابتة
│   ├── index.html         # الصفحة الرئيسية
│   ├── html/              # صفحات HTML
│   ├── css/               # ملفات CSS
│   ├── js/                # ملفات JavaScript
│   └── uploads/           # مجلد التحميلات
├── server.js              # خادم Express الرئيسي
├── library.db             # قاعدة البيانات SQLite
├── package.json           # معلومات المشروع
└── README.md              # هذا الملف
```

---

## 🗄️ قاعدة البيانات

### جداول قاعدة البيانات

#### جدول التصنيفات (categories)
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT UNIQUE)
- description (TEXT)
- icon (TEXT)
- createdAt (DATETIME)
```

#### جدول الكتب (books)
```sql
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- author (TEXT)
- description (TEXT)
- categoryId (INTEGER FOREIGN KEY)
- coverImage (TEXT)
- fileUrl (TEXT)
- language (TEXT)
- pageCount (INTEGER)
- downloadCount (INTEGER)
- rating (REAL)
- createdAt (DATETIME)
```

#### جدول المستخدمين (users)
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT)
- name (TEXT)
- role (TEXT)
- createdAt (DATETIME)
```

#### جدول التحميلات (downloads)
```sql
- id (INTEGER PRIMARY KEY)
- userId (INTEGER FOREIGN KEY)
- bookId (INTEGER FOREIGN KEY)
- downloadedAt (DATETIME)
```

#### جدول الرسائل (contacts)
```sql
- id (INTEGER PRIMARY KEY)
- firstName (TEXT)
- lastName (TEXT)
- email (TEXT)
- phone (TEXT)
- subject (TEXT)
- message (TEXT)
- isRead (INTEGER)
- createdAt (DATETIME)
```

---

## 🎨 التصميم والتخطيط

- ✅ دعم كامل للغة العربية
- ✅ تخطيط RTL (من اليمين إلى اليسار)
- ✅ واجهة مستخدم أنيقة وحديثة
- ✅ تصميم متجاوب (Responsive)
- ✅ ألوان جذابة وتدرجات لطيفة

---

## 🔒 الأمان

- ✅ التحقق من صحة المدخلات
- ✅ حماية من هجمات SQL Injection
- ✅ تشفير كلمات المرور
- ✅ CORS محدود

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT. انظر ملف `LICENSE` للمزيد من التفاصيل.

---

## 👨‍💻 المطور

**يحيى الجوبي** (Yahya Al-Joby)

---

## 📧 التواصل

للأسئلة والاقتراحات، يرجى استخدام نموذج الاتصال في الموقع.

---

## 🙏 شكر وتقدير

شكر خاص لجميع المساهمين والداعمين.

---

## 📚 موارد إضافية

- [Bootstrap Documentation](https://getbootstrap.com)
- [Font Awesome Icons](https://fontawesome.com)
- [SQLite Documentation](https://www.sqlite.org)
- [Express.js Documentation](https://expressjs.com)

---

**تم إنشاء هذا المشروع بـ ❤️ لنشر المعرفة والثقافة**

# تطبيق إدارة المنتجات والمجموعات

تطبيق ويب لإدارة المنتجات والمجموعات مع واجهة عربية سهلة الاستخدام. يتيح التطبيق إضافة وحذف المنتجات، وإنشاء مجموعات، وإمكانية رفع الصور مباشرة من جهاز المستخدم.

## المميزات

- واجهة عربية مع دعم RTL
- إضافة منتجات مع إمكانية رفع الصور
- إنشاء مجموعات من المنتجات المختارة
- حذف المنتجات بشكل فردي أو جماعي
- تجربة مستخدم سلسة وسريعة

## طريقة النشر على GitHub Pages

### الخطوة 1: إنشاء مستودع على GitHub

1. قم بإنشاء مستودع (repository) جديد على GitHub
2. قم برفع الكود إلى المستودع الجديد

### الخطوة 2: تكوين وإعداد GitHub Actions للنشر التلقائي

1. تأكد من أن ملف `.github/workflows/deploy.yml` موجود في المشروع
2. أضف بيانات الاعتماد Firebase كأسرار (Secrets) في إعدادات مستودع GitHub:
   - انتقل إلى Settings > Secrets and variables > Actions
   - أضف الأسرار التالية:
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN
     - VITE_FIREBASE_PROJECT_ID
     - VITE_FIREBASE_STORAGE_BUCKET
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID

### الخطوة 3: تفعيل GitHub Pages

1. انتقل إلى Settings > Pages
2. اختر فرع `gh-pages` كمصدر للنشر
3. اختر المجلد `/ (root)` 
4. انقر على حفظ

### الخطوة 4: عمل دفع (Push) إلى الفرع الرئيسي

1. بعد تنفيذ أي تغييرات، قم بعمل دفع إلى الفرع الرئيسي
2. سيقوم GitHub Actions تلقائياً ببناء المشروع ونشره على GitHub Pages

### الخطوة 5: الوصول إلى الموقع المنشور

- بعد اكتمال عملية النشر، يمكنك الوصول إلى موقعك عبر الرابط:
  `https://[اسم-المستخدم].github.io/[اسم-المستودع]/`

## طريقة النشر اليدوي (بديل)

إذا كنت لا ترغب في استخدام GitHub Actions، يمكنك النشر يدوياً باستخدام الأمر:

```bash
node deploy.js
```

## تهيئة المشروع محلياً

```bash
# تثبيت الاعتمادات
npm install

# تشغيل خادم التطوير
npm run dev
```

## التكنولوجيا المستخدمة

- React
- TypeScript
- Firebase (Firestore, Storage)
- Tailwind CSS
- shadcn UI Components
// سكريبت النشر على GitHub Pages
const { execSync } = require('child_process');
const ghpages = require('gh-pages');
const path = require('path');

// بناء التطبيق
console.log('🔨 جاري بناء التطبيق...');
execSync('npm run build', { stdio: 'inherit' });

// نشر التطبيق
console.log('🚀 جاري نشر التطبيق على GitHub Pages...');
ghpages.publish(
  path.join(process.cwd(), 'dist/public'), // مسار المجلد الذي يحتوي على الملفات المبنية
  {
    branch: 'gh-pages',
    message: 'نشر تلقائي 🚀',
    repo: process.env.GITHUB_REPO_URL || undefined, // عنوان مستودع GitHub إذا كان مختلفاً
  },
  (err) => {
    if (err) {
      console.error('❌ حدث خطأ أثناء النشر:', err);
      process.exit(1);
    }
    console.log('✅ تم النشر بنجاح على GitHub Pages!');
  }
);
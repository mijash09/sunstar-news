# 🚀 Sunstar News - cPanel Complete Deployment Guide
## Pure React.js Frontend + Laravel Backend + cPanel MySQL Database

यस गाइडमा **cPanel** मा **Laravel Backend**, **cPanel MySQL Database**, र **Pure React Frontend** सजिलैसँग सेटअप गर्ने सम्पूर्ण विधि समावेश छ।

---

## 📂 १. तयार पारिएका २ वटा Zip फाइलहरू

1. **`dist.zip`** (४.६ MB) ➔ **Pure React Frontend** (HTML + CSS + JS) — `public_html/` मा जान्छ।
2. **`backend.zip`** (२४ MB) ➔ **Laravel API Backend** (PHP + Composer Vendor समावेश भएको)।
3. **`schema.sql`** ➔ **MySQL Database Table Structure & Data** (phpMyAdmin मा Import गर्न)।

---

## 🛢️ २. cPanel मा MySQL Database बनाउने (१ मिनेट)

1. cPanel मा लगइन गर्नुहोस्।
2. **"MySQL® Database Wizard"** (वा **MySQL® Databases**) मा क्लिक गर्नुहोस्।
3. **Database Name** राख्नुहोस्: उदा. `sunstar` (पूरा नाम `username_sunstar` बन्नेछ)।
4. **Database User** बनाउनुहोस्: उदा. `dbuser` र सुरक्षित Password राख्नुहोस्।
5. **"All Privileges"** मा टिक लगाएर **Make Changes** थिच्नुहोस्।
6. अब cPanel को **"phpMyAdmin"** खोल्नुहोस्:
   - बायाँतर्फ भर्खरै बनेको Database मा क्लिक गर्नुहोस्।
   - माथिको **"Import"** ट्याबमा क्लिक गर्नुहोस्।
   - **`schema.sql`** फाइल छानेर **Import / Go** थिच्नुहोस्।
   - *बधाई छ! Users, Articles, Banners, Categories, Sessions, Cache लगायत सबै टेबलहरू बन्नेछन्। (Default Admin: `sitaram@sunstarnews.com` / `Sitaram@123`)*

---

## ⚙️ ३. Laravel Backend cPanel मा राख्ने

सबैभन्दा सुरक्षित र सफा तरिका:
1. cPanel को **File Manager** खोल्नुहोस्।
2. तपाईँको Home Directory (`/home/username/`) मा **`backend`** नामको नयाँ फोल्डर बनाउनुहोस् (यो `public_html` भन्दा बाहिर रहनेछ, जसले गर्दा Backend र Database Credentials पूर्ण सुरक्षित रहन्छन्)।
3. त्यो `backend` फोल्डर भित्र **`backend.zip`** अपलोड गर्नुहोस् र **Extract** गर्नुहोस्।
4. भित्र रहेको **`.env.cpanel`** फाइलको नाम परिवर्तन गरेर **`.env`** बनाउनुहोस् र त्यसमा आफ्नो Database विवरण भर्नुहोस्:
   ```env
   APP_NAME="Sunstar News API"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://sunstarnews.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=username_sunstar
   DB_USERNAME=username_dbuser
   DB_PASSWORD=your_actual_db_password

   SESSION_DRIVER=database
   CACHE_STORE=database
   FILESYSTEM_DISK=public
   ```

### 🔗 API Domain वा Subdomain Routing (२ विकल्पहरू):

#### विकल्प क (सिफारिस गरिएको): Subdomain `api.sunstarnews.com`
1. cPanel ➔ **"Domains"** ➔ **"Create A New Domain"** मा क्लिक गर्नुहोस्।
2. Domain Name: `api.sunstarnews.com`
3. Document Root: `backend/public` (वा `/home/username/backend/public`)
4. Done! अब तपाईँको Laravel API `https://api.sunstarnews.com/api` मा चल्नेछ।

#### विकल्प ख: Same Domain (सुन्दर व्यवस्था)
यदि एउटै डोमेनमा राख्न चाहनुहुन्छ भने `public_html/api` फोल्डर बनाएर त्यसमा `backend/public/index.php` लाई पोइन्ट गर्न सक्नुहुन्छ।

---

## 🌐 ४. Pure React Frontend cPanel मा राख्ने (३० सेकेन्ड)

1. cPanel File Manager मा गएर **`public_html`** खोल्नुहोस्।
2. पुरानो कुनै पनि फोहोर फाइल (जस्तै `node_modules`, `server.js`, `__MACOSX`, पुरानो `dist` आदि) छ भने **Delete** गर्नुहोस्।
3. **`dist.zip`** फाइललाई सिधै `public_html/` मा **Upload** गर्नुहोस्।
4. `dist.zip` मा Right Click गरेर **Extract** गर्नुहोस्।
   - यसले सिधै `index.html`, `_next/`, `assets/`, `.htaccess` निकाल्नेछ।
5. अब ब्राउजरमा **`https://sunstarnews.com`** खोल्नुहोस्!
   - कुनै पनि Node.js चलाउनु पर्दैन।
   - साइट बिजुलीको गतिमा Pure React बाट चल्नेछ!

# 🚀 Sunstar News (सनस्टार न्युज) - cPanel Deployment Guide

This guide provides step-by-step instructions for deploying the **Sunstar News Next.js Full-Stack Web Application** with a **MySQL / MariaDB Database** on **cPanel Web Hosting**.

---

## 📋 Prerequisites
1. **cPanel Account** with:
   - **MySQL Databases** & **phpMyAdmin** access.
   - **Setup Node.js App** (Phusion Passenger / CloudLinux Node Selector).
   - **File Manager** or SSH terminal access.
2. Node.js version **18.x or 20.x** enabled in cPanel.

---

## 🗄️ Step 1: Create MySQL Database & User in cPanel

1. Log into your **cPanel Dashboard**.
2. Go to **MySQL® Databases** (or **MySQL® Database Wizard**).
3. **Create Database**:
   - Database Name: `username_sunstardb` (e.g. `sunstar_news_db`).
4. **Create Database User**:
   - Username: `username_sunstaruser`
   - Password: Choose a strong password and save it securely.
5. **Add User to Database**:
   - Select your user and database.
   - Click **Add**.
   - Check **ALL PRIVILEGES** and click **Make Changes**.

---

## 📥 Step 2: Import `schema.sql` via phpMyAdmin

1. In cPanel, click on **phpMyAdmin**.
2. Select your newly created database (`username_sunstardb`) from the left menu.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select [`schema.sql`](file:///Users/lionheart/Imstara/sunstar-news/schema.sql) from your project folder.
5. Click **Import** (or **Go**).
   - *This creates all tables (`users`, `categories`, `provinces`, `districts`, `articles`, `db_articles`, `banners`, `opinions`) and seeds initial admin accounts (`Sitaram` / `Sitaram@123`).*

---

## ⚙️ Step 3: Setup Node.js App in cPanel

1. In cPanel, search for **Setup Node.js App** and click it.
2. Click **Create Application**.
3. Fill in the following details:
   - **Node.js version**: `18.x` or `20.x`
   - **Application mode**: `Production`
   - **Application root**: `sunstar-news` (folder name in File Manager)
   - **Application URL**: `sunstarnews.com` (or your domain/subdomain)
   - **Application startup file**: `server.js`
4. Under **Environment Variables**, click **Add Variable** for each:
   | Key | Value Example |
   |---|---|
   | `MYSQL_HOST` | `localhost` |
   | `MYSQL_USER` | `username_sunstaruser` |
   | `MYSQL_PASSWORD` | `YourDatabasePassword123!` |
   | `MYSQL_DATABASE` | `username_sunstardb` |
   | `MYSQL_PORT` | `3306` |
   | `JWT_SECRET` | `sunstar-news-secure-jwt-secret-key-2026` |
   | `NODE_ENV` | `production` |
5. Click **Create**.

---

## 📁 Step 4: Upload Project Files to cPanel

1. Build the application locally (or run on cPanel terminal):
   ```bash
   npm run build
   ```
2. Upload the following files/folders to your Application Root folder (`sunstar-news`) via cPanel **File Manager** or FTP/Git:
   - `.next/` (The compiled Next.js build)
   - `app/`
   - `components/`
   - `lib/`
   - `public/`
   - `package.json`
   - `package-lock.json`
   - `server.js`
   - `next.config.mjs`
   - `schema.sql`
   - `tsconfig.json`

*(Note: Do NOT upload `node_modules`. They will be installed on the cPanel server).*

---

## 💻 Step 5: Install Dependencies & Run Server in cPanel

1. In the cPanel **Node.js App** page, click **Run NPM Install** (or copy the virtualenv terminal command provided at the top of the page and run `npm install` in cPanel Terminal).
2. Click **Restart Application**.

---

## 🤖 Step 6: Setup GitHub Actions CI/CD (Auto-Deploy on Push)

Whenever you push code changes to the `main` branch, GitHub Actions can automatically build your Next.js application and deploy it to cPanel!

1. Go to your **GitHub Repository** -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret** and add the following FTP secrets:

| Secret Name | Description / Example |
|---|---|
| `CPANEL_FTP_SERVER` | Your server host / domain (e.g. `ftp.sunstarnews.com` or server IP) |
| `CPANEL_FTP_USERNAME` | Your cPanel FTP username (e.g. `deployer@sunstarnews.com` or cPanel username) |
| `CPANEL_FTP_PASSWORD` | Your FTP account password |
| `CPANEL_TARGET_DIR` | Directory on cPanel where app is hosted (e.g. `/sunstar-news/` or `/public_html/`) |
| `CPANEL_FTP_PORT` | `21` (default) or `22` for SFTP |

3. Once secrets are added, push to `main`:
   ```bash
   git add .
   git commit -m "Configure auto deployment to cPanel"
   git push origin main
   ```
4. GitHub Actions will run the workflow defined in [`.github/workflows/deploy-cpanel.yml`](file:///Users/lionheart/Imstara/sunstar-news/.github/workflows/deploy-cpanel.yml), compile the Next.js app, upload updated files, and restart the cPanel Node.js server automatically!

---

## 🔑 Default Administrator Credentials

Once deployed, log into your admin panel at `https://yourdomain.com/login`:
- **Username / Email**: `Sitaram` or `sitaram@sunstarnews.com`
- **Password**: `Sitaram@123`
- **Role**: ADMIN

---

## 🛠️ Troubleshooting & Tips

- **Database Connection Error**: Ensure `MYSQL_HOST` is set to `localhost` in cPanel. Ensure the database user has full privileges on the database.
- **Port Conflict**: cPanel automatically assigns the `PORT` environment variable to `server.js`.
- **Automatic App Restart**: Phusion Passenger automatically reloads the Node app when `tmp/restart.txt` is updated.
- **Image Uploads**: Ensure the `public/` folder has write permissions if hosting local media files.


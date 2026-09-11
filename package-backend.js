const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Laravel backend for cPanel...');

const rootDir = __dirname;
const zipFile = path.join(rootDir, 'backend.zip');

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// Make sure upload folders exist with .gitkeep
const uploadsDir = path.join(rootDir, 'backend', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '# Keep uploads directory\n');

const storageUploadsDir = path.join(rootDir, 'backend', 'storage', 'app', 'public', 'uploads');
if (!fs.existsSync(storageUploadsDir)) {
  fs.mkdirSync(storageUploadsDir, { recursive: true });
}
fs.writeFileSync(path.join(storageUploadsDir, '.gitkeep'), '# Keep storage uploads directory\n');

// Backup local .env and swap in .env.cpanel
const localEnvPath = path.join(rootDir, 'backend', '.env');
const cpanelEnvPath = path.join(rootDir, 'backend', '.env.cpanel');
let localEnvBackup = null;

if (fs.existsSync(localEnvPath)) {
  localEnvBackup = fs.readFileSync(localEnvPath, 'utf8');
}
if (fs.existsSync(cpanelEnvPath)) {
  fs.copyFileSync(cpanelEnvPath, localEnvPath);
}

// Package backend into backend.zip
console.log('📦 Creating clean backend.zip archive...');
try {
  execSync(`zip -q -r "${zipFile}" backend -x "backend/.git*" "backend/tests*" "backend/storage/logs/*.log" "*.DS_Store*"`, {
    stdio: 'inherit',
    cwd: rootDir
  });
  const stats = fs.statSync(zipFile);
  console.log(`✅ backend.zip created successfully! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
} catch (err) {
  console.error('❌ Failed to create backend.zip:', err.message);
} finally {
  // Always restore local .env so local development is never disrupted
  if (localEnvBackup !== null) {
    fs.writeFileSync(localEnvPath, localEnvBackup);
    console.log('🔄 Restored local SQLite backend/.env for local development.');
  }
}


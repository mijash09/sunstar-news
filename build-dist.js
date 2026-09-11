const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Pure Static React.js Frontend for cPanel...');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

// 1. Run next build to produce static export in dist/
console.log('📦 Compiling pure static HTML, React JS, and CSS...');
execSync('npx next build', { stdio: 'inherit', cwd: rootDir });

// 2. Create production .htaccess for Apache / LiteSpeed in cPanel
console.log('⚙️ Writing cPanel Apache / LiteSpeed .htaccess...');
const htaccessContent = `# ----------------------------------------------------------------------
# Sunstar News - React Static Frontend Configuration for cPanel
# ----------------------------------------------------------------------

# Disable Directory Indexing (Prevents "Index of /" file listing)
Options -Indexes

# Set Directory Index to index.html
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Forward API and storage calls directly to api.sunstarnews.com Laravel backend
  RewriteRule ^api/(.*)$ https://api.sunstarnews.com/api/$1 [L,R=307]
  RewriteRule ^storage/(.*)$ https://api.sunstarnews.com/storage/$1 [L,R=307]

  # Serve existing file or directory directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Check if a folder has an index.html file
  RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
  RewriteRule ^(.*)/?$ $1/index.html [L]

  # SPA Fallback: Route all other requests to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Gzip Compression for Fast Loading
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json image/svg+xml
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
`;
fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);

// 3. Copy schema.sql for phpMyAdmin
const schemaSrc = path.join(rootDir, 'schema.sql');
if (fs.existsSync(schemaSrc)) {
  fs.copyFileSync(schemaSrc, path.join(distDir, 'schema.sql'));
}

// 4. Create simple cPanel instructions in dist
const instructions = `# 🚀 Sunstar News - Pure React.js cPanel Deployment

यो फोल्डर **Pure Static React.js Frontend** हो। यसका लागि cPanel मा कुनै पनि Node.js वा Server.js को आवश्यकता पर्दैन!

### 📋 सजिलो २-चरणमा लाइभ गर्ने तरिका:
1. cPanel को **File Manager** खोल्नुहोस् र **public_html** मा जानुहोस्।
2. **dist.zip** अपलोड गर्नुहोस् र **Extract** गर्नुहोस्।
   (यसमा सिधै \`index.html\`, \`_next\`, \`assets\`, \`.htaccess\` आउनेछन्)।
3. वेबसाइट \`https://sunstarnews.com\` खोल्नुहोस् — साइट तुरुन्तै चल्नेछ!
`;
fs.writeFileSync(path.join(distDir, 'CPANEL_INSTRUCTIONS.md'), instructions);

// 5. Create dist.zip (without any parent folder prefix)
console.log('📦 Creating clean dist.zip archive for direct cPanel extraction...');
const zipFile = path.join(rootDir, 'dist.zip');
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  execSync(`cd "${distDir}" && zip -q -r "${zipFile}" . -x "*.DS_Store"`, { stdio: 'inherit' });
  console.log(`✅ dist.zip successfully created at: ${zipFile}`);
} catch (err) {
  console.warn('⚠️ Zip error:', err.message);
}

console.log('🎉 Done! Pure React.js frontend is completely ready in "dist/" and "dist.zip".');

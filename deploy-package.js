const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Creating deployment package for cPanel...\n');

// Check if .next/standalone exists
const standalonePath = path.join(__dirname, '.next', 'standalone');
if (!fs.existsSync(standalonePath)) {
  console.error('❌ Error: .next/standalone folder not found!');
  console.error('   Please run "npm run build" first.\n');
  process.exit(1);
}

// Create deploy directory
const deployDir = path.join(__dirname, 'deploy');
console.log('1️⃣  Creating deploy directory...');
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Copy standalone build
console.log('2️⃣  Copying standalone build...');
copyRecursive(standalonePath, deployDir);

// Copy public folder
console.log('3️⃣  Copying public folder...');
const publicSrc = path.join(__dirname, 'public');
const publicDest = path.join(deployDir, 'public');
if (fs.existsSync(publicSrc)) {
  copyRecursive(publicSrc, publicDest);
}

// Copy .next/static folder
console.log('4️⃣  Copying static assets...');
const staticSrc = path.join(__dirname, '.next', 'static');
const staticDest = path.join(deployDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.join(deployDir, '.next'), { recursive: true });
  copyRecursive(staticSrc, staticDest);
}

// Copy server.js
console.log('5️⃣  Copying server.js...');
fs.copyFileSync(
  path.join(__dirname, 'server.js'),
  path.join(deployDir, 'server.js')
);

// Create ZIP file
console.log('6️⃣  Creating ZIP archive...');
const zipFile = 'myonlineresume-deploy.zip';
const zipPath = path.join(__dirname, zipFile);

// Remove old ZIP if exists
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Create ZIP using different methods based on OS
try {
  if (process.platform === 'win32') {
    // Windows: Use PowerShell
    const psCommand = `Compress-Archive -Path "${deployDir}\\*" -DestinationPath "${zipPath}" -Force`;
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
  } else {
    // Linux/Mac: Use zip command
    execSync(`cd "${deployDir}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  }
  
  const stats = fs.statSync(zipPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n✅ Deployment package created successfully!');
  console.log(`📦 File: ${zipFile}`);
  console.log(`📊 Size: ${fileSizeMB} MB`);
  console.log('\n📋 Next steps:');
  console.log('   1. Upload this ZIP file to cPanel File Manager');
  console.log('   2. Extract it in your application directory');
  console.log('   3. Configure Node.js app in cPanel\n');
  
} catch (error) {
  console.error('❌ Error creating ZIP file:', error.message);
  console.log('\n💡 Manual alternative:');
  console.log(`   1. Manually ZIP the contents of: ${deployDir}`);
  console.log('   2. Upload to cPanel\n');
}

// Helper function to copy directories recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

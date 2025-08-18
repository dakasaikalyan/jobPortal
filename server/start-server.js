#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Job Portal Backend Server...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating one with default values...');
  
  const defaultEnv = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/job-portal

# JWT Configuration
JWT_SECRET=job-portal-secret-key-2024-change-in-production
JWT_EXPIRE=7d

# Email Configuration (for OTP and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env file with default values');
  console.log('⚠️  Please update the JWT_SECRET and other sensitive values in production!\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true,
    cwd: __dirname 
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting server...');
  
  // Check if MongoDB is running
  console.log('📊 Checking MongoDB connection...');
  
  const server = spawn('node', ['app.js'], { 
    stdio: 'inherit',
    shell: true,
    cwd: __dirname 
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
  });
  
  server.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n⚠️  Server exited with code ${code}`);
      console.log('💡 Make sure MongoDB is running and accessible');
      console.log('💡 You can start MongoDB with: mongod');
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}

console.log('💡 Make sure MongoDB is running on mongodb://127.0.0.1:27017');
console.log('💡 Or update MONGODB_URI in your .env file for a different connection\n');

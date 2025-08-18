#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Job Portal Development Environment...\n');

// Function to start a process
function startProcess(name, command, args, cwd, color = '\x1b[36m') {
  const reset = '\x1b[0m';
  console.log(`${color}Starting ${name}...${reset}`);
  
  const process = spawn(command, args, { 
    stdio: 'inherit',
    shell: true,
    cwd: cwd || __dirname 
  });
  
  process.on('error', (error) => {
    console.error(`❌ Failed to start ${name}:`, error.message);
  });
  
  process.on('close', (code) => {
    if (code !== 0) {
      console.log(`\n⚠️  ${name} exited with code ${code}`);
    }
  });
  
  return process;
}

// Start backend server
console.log('📡 Starting Backend Server...');
const backend = startProcess('Backend', 'node', ['start-server.js'], path.join(__dirname, 'server'));

// Wait a bit for backend to start
setTimeout(() => {
  console.log('\n🌐 Starting Frontend...');
  const frontend = startProcess('Frontend', 'npm', ['run', 'dev'], __dirname, '\x1b[32m');
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development environment...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development environment...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    process.exit(0);
  });
}, 3000);

console.log('\n💡 Development environment starting...');
console.log('💡 Backend will be available at: http://localhost:5000');
console.log('💡 Frontend will be available at: http://localhost:3000');
console.log('💡 Press Ctrl+C to stop all processes\n');

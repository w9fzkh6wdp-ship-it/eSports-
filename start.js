#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

console.log('🚀 Telegram Broadcaster - Starting...\n');

// Function to open browser
function openBrowser(url) {
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  let command;
  if (isWindows) {
    command = `start ${url}`;
  } else if (isMac) {
    command = `open ${url}`;
  } else if (isLinux) {
    command = `xdg-open ${url}`;
  }

  if (command) {
    require('child_process').exec(command, (err) => {
      if (err) {
        console.log(`📱 Open browser manually: ${url}`);
      } else {
        console.log(`✅ Browser opened automatically!`);
      }
    });
  }
}

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 Installing dependencies... (First time only)');
  console.log('This may take 2-3 minutes...\n');

  const npm = spawn('npm', ['install'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  npm.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Dependencies installed!\n');
      startServer();
    } else {
      console.error('\n❌ Installation failed. Please check your internet connection.');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔥 Starting Next.js server...\n');

  const nextServer = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  // Wait 3 seconds then open browser
  setTimeout(() => {
    console.log('\n📱 Opening browser...\n');
    openBrowser('http://localhost:3000');
  }, 3000);

  nextServer.on('error', (err) => {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  });

  nextServer.on('close', (code) => {
    if (code !== 0) {
      console.error('\n❌ Server stopped with error code:', code);
    }
    process.exit(code);
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping server...');
    nextServer.kill();
    process.exit(0);
  });
}

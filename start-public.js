const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting maimai_w server...');

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a bit for server to start, then start ngrok
setTimeout(() => {
  console.log('🌐 Starting ngrok tunnel...');
  
  const ngrok = spawn('ngrok', ['http', '3001'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  ngrok.on('error', (error) => {
    console.error('❌ ngrok error:', error);
    console.log('💡 Make sure ngrok is installed: npm install -g ngrok');
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.kill();
    ngrok.kill();
    process.exit();
  });

}, 3000);

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

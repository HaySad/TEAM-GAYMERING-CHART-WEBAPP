const http = require('http');
const net = require('net');

console.log('🔍 Testing maimai_w server connection...\n');

// Test 1: Check if server is running on localhost
function testLocalhost() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/api/session', (res) => {
      console.log('✅ Localhost test: PASSED');
      console.log(`   Status: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Localhost test: FAILED');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Localhost test: TIMEOUT');
      resolve(false);
    });
  });
}

// Test 2: Check if port is open
function testPort() {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      console.log('✅ Port 3001 test: PASSED');
      console.log('   Port is open and accessible');
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log('❌ Port 3001 test: TIMEOUT');
      console.log('   Port might be blocked or server not running');
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log('❌ Port 3001 test: FAILED');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    socket.connect(3001, 'localhost');
  });
}

// Test 3: Get local IP address
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

// Test 4: Get public IP
async function getPublicIP() {
  try {
    const https = require('https');
    
    return new Promise((resolve) => {
      const req = https.get('https://api.ipify.org', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      
      req.on('error', () => resolve(null));
      req.setTimeout(5000, () => resolve(null));
    });
  } catch (error) {
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('=== Connection Test Results ===\n');
  
  // Test 1: Localhost
  await testLocalhost();
  console.log('');
  
  // Test 2: Port
  await testPort();
  console.log('');
  
  // Test 3: Local IP
  const localIP = getLocalIP();
  if (localIP) {
    console.log('🌐 Local IP Address:');
    console.log(`   ${localIP}`);
    console.log(`   Local network URL: http://${localIP}:3001`);
  } else {
    console.log('❌ Could not determine local IP address');
  }
  console.log('');
  
  // Test 4: Public IP
  const publicIP = await getPublicIP();
  if (publicIP) {
    console.log('🌍 Public IP Address:');
    console.log(`   ${publicIP}`);
    console.log(`   Public URL: http://${publicIP}:3001`);
    console.log('   ⚠️  Note: This will only work if port forwarding is configured');
  } else {
    console.log('❌ Could not determine public IP address');
  }
  console.log('');
  
  // Instructions
  console.log('=== Instructions ===');
  console.log('1. Make sure server is running: npm run server');
  console.log('2. Configure Windows Firewall to allow port 3001');
  console.log('3. Configure Router Port Forwarding (see PORT_FORWARDING_GUIDE.md)');
  console.log('4. Test from another device using the URLs above');
  console.log('');
  
  console.log('=== Troubleshooting ===');
  console.log('• If localhost fails: Server is not running');
  console.log('• If port test fails: Firewall is blocking the port');
  console.log('• If public IP fails: Port forwarding not configured');
  console.log('• If CORS errors: Check server.js CORS configuration');
}

// Run tests
runTests().catch(console.error);

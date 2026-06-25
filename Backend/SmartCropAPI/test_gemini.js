const https = require('https');

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: "hello"
    }]
  }]
});

const req = https.request('https://generativelanguage.googleapis.com/v1beta/models/g' + 'emini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();

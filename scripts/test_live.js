const fs = require('fs');
const http = require('http');
const html = fs.readFileSync('scratch_live.html', 'utf8');
const regex = /src="([^"]+\.js)"/g;
let m;
const list = [];
while ((m = regex.exec(html)) !== null) {
  list.push(m[1]);
}
console.log('Total scripts:', list.length);
async function test() {
  for (const s of list) {
    await new Promise(r => {
      http.get('http://drumasialive.com' + (s.startsWith('/') ? s : '/' + s), res => {
        console.log(res.statusCode, s);
        r();
      }).on('error', e => {
        console.log('ERR', s, e.message);
        r();
      });
    });
  }
}
test();

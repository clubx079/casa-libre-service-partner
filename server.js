// Static server for the service-partner mockup page — no dependencies.
// Serves index.html (and any other file in this folder) on $PORT (default 3000).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const HIDDEN = new Set(['server.js', 'package.json', 'README.md', 'Dockerfile']);

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  const name = path.basename(file);
  const ok = file.startsWith(ROOT) && !HIDDEN.has(name) && !name.startsWith('.') && fs.existsSync(file) && fs.statSync(file).isFile();
  const target = ok ? file : path.join(ROOT, 'index.html');   // unknown paths → the page
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=300', 'X-Robots-Tag': 'noindex' });
  fs.createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`service-partner page on :${PORT}`));

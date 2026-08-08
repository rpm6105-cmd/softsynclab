// Builds the self-contained admin/index.html by inlining vendor/supabase.min.js
// and app.js. Source of truth stays in vendor/ + app.js.
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, '_index.html'), 'utf8');
const vendor = fs.readFileSync(path.join(dir, 'vendor', 'supabase.min.js'), 'utf8');
const app = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

let out = html.replace('/*__VENDOR_JS__*/', vendor);
out = out.replace('/*__APP_JS__*/', app);

fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
console.log('Built index.html:', fs.statSync(path.join(dir, 'index.html')).size, 'bytes');

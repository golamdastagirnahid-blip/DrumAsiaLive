const fs = require('fs');
const path = require('path');

const cssDir = path.join('out', '_next', 'static', 'css');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
if (cssFiles.length === 0) {
  console.error('No CSS file found in', cssDir);
  process.exit(1);
}
const cssFile = cssFiles[0];
const cssPath = path.join(cssDir, cssFile);
const cssContent = fs.readFileSync(cssPath, 'utf8');
console.log('Using CSS file:', cssFile, 'Size:', cssContent.length, 'bytes');

let inlinedCount = 0;
function processHtmlFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (item.name.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');
      if (!html.includes('id="da-inlined-css"')) {
        // Insert style tag right after <head>
        html = html.replace('<head>', '<head><style id="da-inlined-css">' + cssContent + '</style>');
        fs.writeFileSync(fullPath, html, 'utf8');
        inlinedCount++;
      }
    }
  }
}

processHtmlFiles('out');
console.log('Successfully inlined CSS into', inlinedCount, 'HTML files.');

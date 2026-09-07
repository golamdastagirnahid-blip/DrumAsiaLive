const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'out');
const CSS_DIR = path.join(OUT_DIR, '_next', 'static', 'css');

// 1. Get CSS
const cssFiles = fs.existsSync(CSS_DIR) ? fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css')) : [];
let inlinedCss = '';
if (cssFiles.length > 0) {
  inlinedCss = fs.readFileSync(path.join(CSS_DIR, cssFiles[0]), 'utf8');
  console.log('Read CSS:', cssFiles[0], 'size:', inlinedCss.length);
}

// 2. Base64 Images
const logoPath = path.resolve(__dirname, '..', 'public', 'logo.jpg');
const portraitPath = path.resolve(__dirname, '..', 'public', 'portrait.jpg');

const b64Logo = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : '';
const b64Portrait = fs.existsSync(portraitPath) ? fs.readFileSync(portraitPath).toString('base64') : '';

console.log('Logo b64 len:', b64Logo.length, 'Portrait b64 len:', b64Portrait.length);

const logoDataUri = 'data:image/jpeg;base64,' + b64Logo;
const portraitDataUri = 'data:image/jpeg;base64,' + b64Portrait;

// 3. Load Standalone Client Engine Script
const engineJsPath = path.resolve(__dirname, 'standalone-engine.js');
const engineJs = fs.readFileSync(engineJsPath, 'utf8');
const standaloneScript = '<script id="da-standalone-engine">\n' + engineJs + '\n</script>';

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Inlined CSS
  if (inlinedCss && !html.includes('id="da-inlined-css"')) {
    html = html.replace('</head>', '<style id="da-inlined-css">' + inlinedCss + '</style></head>');
  }

  // Inlined Images
  if (b64Logo) {
    html = html.replace(/src="\/brand\/logo\.jpg"/g, 'src="' + logoDataUri + '"');
    html = html.replace(/src="\/logo\.jpg"/g, 'src="' + logoDataUri + '"');
  }

  if (b64Portrait) {
    html = html.replace(/src="\/founder\/portrait\.jpg"/g, 'src="' + portraitDataUri + '"');
    html = html.replace(/src="\/portrait\.jpg"/g, 'src="' + portraitDataUri + '"');
  }

  // Viewport comfort & Meta robots
  if (!html.includes('name="robots"')) {
    html = html.replace('<head>', '<head>\n<meta name="robots" content="index, follow">');
  }

  // Viewport & Desktop Mode for Mobile
  const viewportTag = '<meta name="viewport" id="da-viewport" content="width=1280, initial-scale=0.3, minimum-scale=0.2, maximum-scale=5.0, user-scalable=yes">';
  const viewportEngineScript = `<script id="da-viewport-engine">
(function() {
  function fit() {
    var vp = document.getElementById('da-viewport') || document.querySelector('meta[name="viewport"]');
    if (!vp) return;
    var sw = window.screen.width;
    var sh = window.screen.height;
    var isLandscape = window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
    var realW = isLandscape ? Math.max(sw, sh) : Math.min(sw, sh);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || ('ontouchstart' in window && realW < 1024);

    if (isMobile || realW < 1280) {
      var tw = 1280;
      var scale = +(realW / tw).toFixed(4);
      if (scale > 1) scale = 1;
      vp.setAttribute('content', 'width=' + tw + ', initial-scale=' + scale + ', minimum-scale=' + (scale * 0.5).toFixed(4) + ', maximum-scale=5.0, user-scalable=yes');
    } else {
      vp.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    }
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
})();
</script>`;

  if (html.includes('id="da-viewport-engine"')) {
    html = html.replace(/<script id="da-viewport-engine">[\s\S]*?<\/script>/, viewportEngineScript);
  } else {
    html = html.replace('</head>', viewportEngineScript + '\n</head>');
  }

  // Replace any existing viewport meta tag with desktop-mode viewport tag
  if (html.includes('<meta name="viewport"')) {
    html = html.replace(/<meta name="viewport"[^>]*>/i, viewportTag);
  } else {
    html = html.replace('<head>', '<head>\n' + viewportTag);
  }

  // Standalone Engine replacement
  if (html.includes('id="da-standalone-engine"')) {
    html = html.replace(/<script id="da-standalone-engine">[\s\S]*?<\/script>/, standaloneScript);
  } else {
    html = html.replace('</body>', standaloneScript + '\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(p);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processHtmlFile(p);
    }
  }
}

if (fs.existsSync(OUT_DIR)) {
  walkDir(OUT_DIR);
  console.log('Processed all HTML files successfully.');

  // Copy fallbacks to root
  if (fs.existsSync(path.join(OUT_DIR, 'en', 'index.html'))) {
    fs.copyFileSync(path.join(OUT_DIR, 'en', 'index.html'), path.join(OUT_DIR, 'index.html'));
    fs.copyFileSync(path.join(OUT_DIR, 'en', 'index.html'), path.join(OUT_DIR, 'en.html'));
  }
  if (fs.existsSync(path.join(OUT_DIR, 'ms', 'index.html'))) {
    fs.copyFileSync(path.join(OUT_DIR, 'ms', 'index.html'), path.join(OUT_DIR, 'ms.html'));
  }

  // Subpage siblings in out/ root
  const subpages = [
    'rooms', 'backline', 'record', 'live', 'contact',
    'founders', 'faq', 'load-in', 'live-room', 'store',
    'membership', 'gallery', 'terms', 'privacy', 'cookies', 'cancellation'
  ];
  subpages.forEach(sub => {
    const enSub = path.join(OUT_DIR, 'en', sub, 'index.html');
    const outSub = path.join(OUT_DIR, sub + '.html');
    if (fs.existsSync(enSub)) {
      fs.copyFileSync(enSub, outSub);
      console.log('Created subpage sibling:', sub + '.html');
    }
  });

  // Copy public assets to out root (NO .htaccess - causes 500 on IONOS)
  ['logo.jpg', 'portrait.jpg', 'robots.txt', 'sitemap.xml'].forEach(file => {
    const src = path.resolve(__dirname, '..', 'public', file);
    const dest = path.join(OUT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log('Copied to out root:', file);
    }
  });

  // Ensure founder/portrait.jpg and brand/logo.jpg also exist in out
  const outFounder = path.join(OUT_DIR, 'founder');
  if (!fs.existsSync(outFounder)) fs.mkdirSync(outFounder, { recursive: true });
  if (fs.existsSync(portraitPath)) fs.copyFileSync(portraitPath, path.join(outFounder, 'portrait.jpg'));

  const outBrand = path.join(OUT_DIR, 'brand');
  if (!fs.existsSync(outBrand)) fs.mkdirSync(outBrand, { recursive: true });
  if (fs.existsSync(logoPath)) fs.copyFileSync(logoPath, path.join(outBrand, 'logo.jpg'));
}

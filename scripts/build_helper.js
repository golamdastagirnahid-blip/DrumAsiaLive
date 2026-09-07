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

// 3. Standalone Client Engine Script
const standaloneScript = `
<script id="da-standalone-engine">
(function() {
  // === STANDALONE AUDIO ENGINE ===
  var audioCtx = null;
  var masterGain = null;
  var isPlaying = false;
  var currentVol = 0.75;
  var intervalId = null;
  var step = 0;

  function getAudioContext() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(currentVol * 0.75, audioCtx.currentTime);

        var filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5200, audioCtx.currentTime);
        filter.Q.setValueAtTime(1.1, audioCtx.currentTime);

        masterGain.connect(filter);
        filter.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playStep(ctx) {
    if (!masterGain) return;
    var now = ctx.currentTime;

    // Kick on 0, 8, 10
    if (step === 0 || step === 8 || step === 10) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(step === 10 ? 95 : 125, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);
      gain.gain.setValueAtTime(step === 10 ? 0.35 : 0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // Snare on 4, 12
    if (step === 4 || step === 12) {
      var bufSize = Math.floor(ctx.sampleRate * 0.18);
      var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      var noise = ctx.createBufferSource();
      noise.buffer = buf;
      var filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      var sGain = ctx.createGain();
      sGain.gain.setValueAtTime(0.45, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      noise.connect(filter);
      filter.connect(sGain);
      sGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + 0.18);
    }

    // Hi-hat on every even step
    if (step % 2 === 0) {
      var hSize = Math.floor(ctx.sampleRate * 0.04);
      var hBuf = ctx.createBuffer(1, hSize, ctx.sampleRate);
      var hData = hBuf.getChannelData(0);
      for (var j = 0; j < hSize; j++) hData[j] = Math.random() * 2 - 1;
      var hat = ctx.createBufferSource();
      hat.buffer = hBuf;
      var hFilter = ctx.createBiquadFilter();
      hFilter.type = 'highpass';
      hFilter.frequency.setValueAtTime(6500, now);
      var hGain = ctx.createGain();
      hGain.gain.setValueAtTime(step % 4 === 0 ? 0.18 : 0.09, now);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      hat.connect(hFilter);
      hFilter.connect(hGain);
      hGain.connect(masterGain);
      hat.start(now);
      hat.stop(now + 0.04);
    }

    // Warm chords on 0, 8
    if (step === 0 || step === 8) {
      var chords = [
        [164.81, 196.0, 246.94, 329.63],
        [174.61, 220.0, 261.63, 349.23],
        [220.0, 261.63, 329.63, 440.0],
        [196.0, 246.94, 293.66, 392.0]
      ];
      var cIdx = Math.floor(now / 2.5) % chords.length;
      var chord = chords[cIdx];
      chord.forEach(function(freq, idx) {
        var cOsc = ctx.createOscillator();
        var cGain = ctx.createGain();
        cOsc.type = idx === 0 ? 'sawtooth' : 'sine';
        cOsc.frequency.setValueAtTime(freq, now);
        var lvl = idx === 0 ? 0.14 : 0.07;
        cGain.gain.setValueAtTime(0.001, now);
        cGain.gain.linearRampToValueAtTime(lvl, now + 0.08);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        cOsc.connect(cGain);
        cGain.connect(masterGain);
        cOsc.start(now);
        cOsc.stop(now + 0.9);
      });
    }
  }

  function startAudio() {
    var ctx = getAudioContext();
    if (!ctx) return;
    if (intervalId) clearInterval(intervalId);
    isPlaying = true;
    updateAudioUI(true);
    var stepMs = (60 / 96) / 4 * 1000;
    intervalId = setInterval(function() {
      playStep(ctx);
      step = (step + 1) % 16;
    }, stepMs);
  }

  function stopAudio() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isPlaying = false;
    updateAudioUI(false);
  }

  function toggleAudio() {
    if (isPlaying) stopAudio();
    else startAudio();
  }

  function setAudioVolume(vol) {
    currentVol = Math.max(0, Math.min(1, vol));
    if (audioCtx && masterGain) {
      masterGain.gain.setTargetAtTime(currentVol * 0.75, audioCtx.currentTime, 0.05);
    }
    var sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(function(s) { s.value = currentVol; });
  }

  function updateAudioUI(playing) {
    var playBtns = document.querySelectorAll('button[aria-label*="Jamming"], button[aria-label*="Audio"], button:has(svg)');
    playBtns.forEach(function(btn) {
      var label = btn.getAttribute('aria-label') || '';
      if (label.includes('Jamming') || label.includes('Audio') || btn.closest('.jamming-controller')) {
        btn.setAttribute('aria-label', playing ? 'Stop Jamming Room Audio' : 'Play Jamming Room Audio');
        var svg = btn.querySelector('svg');
        if (svg) {
          if (playing) {
            svg.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
          } else {
            svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
          }
        }
      }
    });

    var statusTexts = document.querySelectorAll('.tech');
    statusTexts.forEach(function(el) {
      if (el.textContent.trim() === 'JAM AUDIO' && playing) el.textContent = 'JAM LIVE';
      else if (el.textContent.trim() === 'JAM LIVE' && !playing) el.textContent = 'JAM AUDIO';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    // 1. Audio Play Buttons
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="Jamming"], button[aria-label*="Audio"], button:has(svg polygon)');
      if (btn) {
        e.preventDefault();
        toggleAudio();
      }
    });

    // 2. Audio Range Sliders
    document.addEventListener('input', function(e) {
      if (e.target.matches('input[type="range"]')) {
        setAudioVolume(parseFloat(e.target.value));
      }
    });

    // 3. Master Mute
    document.addEventListener('click', function(e) {
      var muteBtn = e.target.closest('button[title*="mute"], button[aria-label*="mute"]');
      if (muteBtn) {
        e.preventDefault();
        setAudioVolume(currentVol > 0 ? 0 : 0.75);
      }
    });

    // 4. Auto-unlock audio on first touch/click
    var unlock = function() {
      getAudioContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    // === HEADER & TRANSPORT SCROLL DYNAMICS ===
    var header = document.querySelector('header');
    var transport = document.querySelector('nav[aria-label*="Quick"], div.fixed.bottom-0');
    var lastScrollY = window.scrollY;

    function onScroll() {
      var y = window.scrollY;
      var delta = y - lastScrollY;

      if (header) {
        if (y <= 20) {
          header.style.background = 'transparent';
          header.style.backdropFilter = 'none';
          header.style.webkitBackdropFilter = 'none';
          header.style.boxShadow = 'none';
        } else {
          header.style.background = 'rgba(11, 12, 14, 0.96)';
          header.style.backdropFilter = 'blur(16px)';
          header.style.webkitBackdropFilter = 'blur(16px)';
          header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.9)';
        }
      }

      if (transport) {
        if (delta > 3) {
          transport.style.transform = 'translateY(0)';
          transport.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        } else if (delta < -3 && y > 80) {
          transport.style.transform = 'translateY(110%)';
          transport.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      }

      lastScrollY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // === MOBILE MENU DRAWER (VANILLA FALLBACK) ===
    var mobileDrawer = document.createElement('div');
    mobileDrawer.id = 'da-mobile-drawer';
    mobileDrawer.style.cssText = 'display:none;position:fixed;inset:0;z-index:99999;background:rgba(11,12,14,0.98);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);overflow-y:auto;padding:20px;';
    mobileDrawer.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:20px;">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<span style="font-family:\'Anton\',sans-serif;font-size:22px;text-transform:uppercase;color:#fff;">DRUM<span style="color:#FFA31A;">ASIA</span> LIVE</span>' +
      '</div>' +
      '<button id="da-close-btn" style="background:none;border:1px solid #333;color:#fff;width:40px;height:40px;border-radius:6px;font-size:20px;cursor:pointer;display:grid;place-items:center;">✕</button>' +
    '</div>' +
    '<nav style="display:flex;flex-direction:column;gap:8px;font-family:\'Inter\',sans-serif;">' +
      '<a href="#rooms" class="da-drawer-link" style="color:#FFA31A;font-weight:700;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>ROOMS & STUDIOS</span><span>&darr;</span></a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20want%20to%20book%20Studio%20Ori" target="_blank" class="da-drawer-link" style="color:#ccc;font-size:14px;padding:8px 0 8px 12px;text-decoration:none;">• Studio Ori (Hartamas)</a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20want%20to%20book%20Live%20Stage" target="_blank" class="da-drawer-link" style="color:#ccc;font-size:14px;padding:8px 0 8px 12px;text-decoration:none;">• Live Stage (Performance Hall)</a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20want%20to%20book%20Lagenda" target="_blank" class="da-drawer-link" style="color:#ccc;font-size:14px;padding:8px 0 8px 12px;text-decoration:none;">• Lagenda Room</a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20want%20to%20book%20Bilik%20Kompang" target="_blank" class="da-drawer-link" style="color:#ccc;font-size:14px;padding:8px 0 8px 12px;text-decoration:none;">• Bilik Kompang (Kota Damansara)</a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20would%20like%20to%20enquire%20about%20Backline%20Rental" target="_blank" class="da-drawer-link" style="color:#FFA31A;font-weight:700;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);">BACKLINE & GEAR RENTAL &rarr;</a>' +
      '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20would%20like%20to%20enquire%20about%20Recording%20Studio" target="_blank" class="da-drawer-link" style="color:#FFA31A;font-weight:700;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);">RECORDING STUDIO &rarr;</a>' +
      '<a href="#founder" class="da-drawer-link" style="color:#FFA31A;font-weight:700;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);">OUR STORY & FOUNDER &rarr;</a>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:20px;">' +
        '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%20Live%2C%20I%20would%20like%20to%20book%20a%20slot" target="_blank" style="background:#FFA31A;color:#000;font-weight:700;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-size:15px;letter-spacing:0.04em;">BOOK ON WHATSAPP</a>' +
        '<a href="tel:0125161670" style="background:transparent;border:1px solid #444;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;">CALL 012-516 1670</a>' +
      '</div>' +
    '</nav>';
    document.body.appendChild(mobileDrawer);

    function openMobileMenu() {
      mobileDrawer.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileDrawer.style.display = 'none';
      document.body.style.overflow = '';
    }

    // Toggle button listener
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.lucide-menu)');
      if (btn && btn.id !== 'da-close-btn') {
        e.preventDefault();
        openMobileMenu();
      }
    });

    document.getElementById('da-close-btn').addEventListener('click', closeMobileMenu);
    mobileDrawer.addEventListener('click', function(e) {
      if (e.target.matches('.da-drawer-link') || e.target.closest('.da-drawer-link')) {
        closeMobileMenu();
      }
    });

    // === BUTTONS & LINKS INTERCEPTOR ===
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;

      // Handle Room card booking
      if (a.textContent && a.textContent.trim().startsWith('Book →')) {
        e.preventDefault();
        var card = a.closest('.panel') || a.parentElement;
        var roomTitle = card ? card.querySelector('h3') : null;
        var roomName = roomTitle ? encodeURIComponent(roomTitle.textContent.trim()) : 'a%20room';
        window.open('https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20would%20like%20to%20book%20' + roomName, '_blank');
        return;
      }

      // Handle room anchors & smooth scroll
      if (href === '/rooms' || href === '/en/rooms' || href === '/ms/rooms' || href.endsWith('/rooms')) {
        var roomsSec = document.getElementById('rooms');
        if (roomsSec) {
          e.preventDefault();
          roomsSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (href === '/founders' || href === '/en/founders' || href.endsWith('/founders')) {
        var founderSec = document.getElementById('founder');
        if (founderSec) {
          e.preventDefault();
          founderSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (href.includes('/rooms/')) {
        var slug = href.split('/rooms/')[1].replace(/\\/.*$/, '');
        var cardElem = document.getElementById('rooms');
        if (cardElem) {
          e.preventDefault();
          cardElem.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (href.includes('wa.me') || href.includes('whatsapp')) {
        // Let WhatsApp links open smoothly in new tab
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });
})();
</script>
`;

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

  // Standalone Engine
  if (!html.includes('id="da-standalone-engine"')) {
    html = html.replace('</body>', standaloneScript + '\n</body>');
  } else {
    // Replace old engine with new engine
    html = html.replace(/<script id="da-standalone-engine">[\s\S]*?<\/script>/, standaloneScript);
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
  const subpages = ['rooms', 'backline', 'record', 'live', 'contact', 'founders', 'faq', 'load-in', 'live-room'];
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

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
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="Jamming"], button[aria-label*="Audio"], button:has(svg polygon)');
      if (btn) {
        e.preventDefault();
        toggleAudio();
      }
    });

    document.addEventListener('input', function(e) {
      if (e.target.matches('input[type="range"]')) {
        setAudioVolume(parseFloat(e.target.value));
      }
    });

    document.addEventListener('click', function(e) {
      var muteBtn = e.target.closest('button[title*="mute"], button[aria-label*="mute"]');
      if (muteBtn) {
        e.preventDefault();
        setAudioVolume(currentVol > 0 ? 0 : 0.75);
      }
    });

    var unlock = function() {
      getAudioContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    // Header & Transport Scroll Dynamics
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

    // Smooth navigation
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;

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

  // SEO Robots
  if (!html.includes('name="robots"')) {
    html = html.replace('<head>', '<head>\n<meta name="robots" content="index, follow">');
  }

  // Standalone Engine
  if (!html.includes('id="da-standalone-engine"')) {
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

/**
 * Standalone Engine for DrumAsia Live
 * Fully independent of Next.js client hydration:
 *  - Real-time Kuala Lumpur Timecode clock & Studio Open/Closed status
 *  - Procedural Web Audio API jamming sound engine
 *  - Top bar transparency on scroll (transparent at top, solid dark glass when scrolled)
 *  - Bottom transport bar motion (shows on scroll down, hides on scroll up)
 *  - Dropdown and mobile navigation to ALL pages
 */
(function() {
  // === 1. TIMECODE & STUDIO STATUS ENGINE ===
  function updateTimecode() {
    // Current Kuala Lumpur time (UTC+8)
    var now = new Date();
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    var klTime = new Date(utc + (3600000 * 8));

    var h = String(klTime.getHours()).padStart(2, '0');
    var m = String(klTime.getMinutes()).padStart(2, '0');
    var s = String(klTime.getSeconds()).padStart(2, '0');
    var ms = Math.floor(klTime.getMilliseconds() / 40);
    var frames = String(ms).padStart(2, '0');

    var timecodeStr = h + ':' + m + ':' + s + ':' + frames;

    // Find and update all timecode elements
    var timeElements = document.querySelectorAll('.timecode-display, [data-timecode]');
    timeElements.forEach(function(el) {
      el.textContent = timecodeStr;
    });

    // Also look for transport bar raw text node matching --:--:--:--
    var allTech = document.querySelectorAll('.tech');
    allTech.forEach(function(el) {
      if (el.textContent.includes('--:--:--:--') || /^\d{2}:\d{2}:\d{2}:\d{2}$/.test(el.textContent.trim())) {
        el.textContent = timecodeStr;
      }
      // Update Studio Status (Open 10am to 1am)
      if (el.textContent.includes('CLOSED OPENS') || el.textContent.includes('OPEN') || el.textContent.includes('OPENS')) {
        var hour = klTime.getHours();
        var isOpen = (hour >= 10 || hour < 1);
        if (isOpen) {
          el.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#37d18a;box-shadow:0 0 8px #37d18a;margin-right:6px;"></span>OPEN · CLOSES 1:00 AM';
        } else {
          el.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px #f59e0b;margin-right:6px;"></span>CLOSED · OPENS 10:00 AM';
        }
      }
    });
  }

  setInterval(updateTimecode, 100);
  updateTimecode();

  // === 2. PROCEDURAL WEB AUDIO API JAMMING ENGINE ===
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

  // === 3. HEADER & BOTTOM TRANSPORT BAR SCROLL DYNAMICS ===
  var header = null;
  var transport = null;
  var lastScrollY = window.scrollY;

  function onScroll() {
    if (!header) header = document.querySelector('header');
    if (!transport) transport = document.querySelector('nav[aria-label*="Quick"], div.fixed.bottom-0, .transport-bar');

    var y = window.scrollY;
    var delta = y - lastScrollY;

    // Header transparency
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

    // Bottom transport bar hide on scroll up, show on scroll down
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

  // === 4. DOM EVENT LISTENERS & NAVIGATION ===
  document.addEventListener('DOMContentLoaded', function() {
    onScroll();

    // Unlock Web Audio on first user gesture
    var unlock = function() {
      getAudioContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    // Audio button clicks
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="Jamming"], button[aria-label*="Audio"], button:has(svg polygon)');
      if (btn && btn.id !== 'da-close-btn') {
        e.preventDefault();
        toggleAudio();
      }
    });

    // Volume sliders
    document.addEventListener('input', function(e) {
      if (e.target.matches('input[type="range"]')) {
        setAudioVolume(parseFloat(e.target.value));
      }
    });

    // Master mute
    document.addEventListener('click', function(e) {
      var muteBtn = e.target.closest('button[title*="mute"], button[aria-label*="mute"], button:has(.lamp)');
      if (muteBtn) {
        e.preventDefault();
        setAudioVolume(currentVol > 0 ? 0 : 0.75);
      }
    });

    // === 5. SLIDE-OUT MOBILE MENU DRAWER ===
    var mobileDrawer = document.createElement('div');
    mobileDrawer.id = 'da-mobile-drawer';
    mobileDrawer.style.cssText = 'display:none;position:fixed;inset:0;z-index:999999;background:rgba(11,12,14,0.98);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);overflow-y:auto;padding:24px;';
    
    var drawerContent = [
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px;margin-bottom:20px;">',
        '<div style="display:flex;align-items:center;gap:10px;">',
          '<span style="font-family:Anton,sans-serif;font-size:22px;text-transform:uppercase;color:#fff;">DRUM<span style="color:#FFA31A;">ASIA</span> LIVE</span>',
        '</div>',
        '<button id="da-close-btn" style="background:none;border:1px solid #444;color:#fff;width:40px;height:40px;border-radius:6px;font-size:20px;cursor:pointer;display:grid;place-items:center;">✕</button>',
      '</div>',
      '<nav style="display:flex;flex-direction:column;gap:8px;font-family:Inter,sans-serif;">',
        '<div style="color:#888;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;">MAIN PAGES</div>',
        '<a href="rooms.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>ROOMS & STUDIOS</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="backline.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>BACKLINE RENTAL</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="record.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>RECORDING STUDIO</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="live.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>LIVE VENUE & STAGE</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="founders.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>OUR STORY / FOUNDER</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="contact.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>CONTACT & LOCATION</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<a href="faq.html" class="da-drawer-link" style="color:#fff;font-weight:600;font-size:16px;padding:10px 0;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;"><span>FAQ</span><span style="color:#FFA31A;">&rarr;</span></a>',
        '<div style="display:flex;flex-direction:column;gap:10px;margin-top:20px;">',
          '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%20Live%2C%20I%20would%20like%20to%20book%20a%20slot" target="_blank" style="background:#FFA31A;color:#000;font-weight:700;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-size:15px;letter-spacing:0.04em;">BOOK ON WHATSAPP</a>',
          '<a href="tel:0125161670" style="background:transparent;border:1px solid #444;color:#fff;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;">CALL 012-516 1670</a>',
        '</div>',
      '</nav>'
    ].join('');

    mobileDrawer.innerHTML = drawerContent;
    document.body.appendChild(mobileDrawer);

    function openDrawer() {
      mobileDrawer.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      mobileDrawer.style.display = 'none';
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.lucide-menu)');
      if (btn && btn.id !== 'da-close-btn') {
        e.preventDefault();
        openDrawer();
      }
    });

    document.getElementById('da-close-btn').addEventListener('click', closeDrawer);

    // === 6. UNIVERSAL LINK ROUTING ===
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;

      // WhatsApp links
      if (href.includes('wa.me') || href.includes('whatsapp')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        return;
      }

      // Handle room card booking
      if (a.textContent && a.textContent.trim().startsWith('Book →')) {
        e.preventDefault();
        var card = a.closest('.panel') || a.parentElement;
        var title = card ? card.querySelector('h3') : null;
        var rName = title ? encodeURIComponent(title.textContent.trim()) : 'a%20room';
        window.open('https://wa.me/60125161670?text=Hi%20DrumAsia%2C%20I%20would%20like%20to%20book%20' + rName, '_blank');
        return;
      }

      // Convert subpage paths so they always work whether in /en/ or root
      var pageMap = {
        '/rooms': 'rooms.html',
        '/en/rooms': 'rooms.html',
        '/backline': 'backline.html',
        '/en/backline': 'backline.html',
        '/record': 'record.html',
        '/en/record': 'record.html',
        '/live': 'live.html',
        '/en/live': 'live.html',
        '/contact': 'contact.html',
        '/en/contact': 'contact.html',
        '/founders': 'founders.html',
        '/en/founders': 'founders.html',
        '/faq': 'faq.html',
        '/en/faq': 'faq.html',
        '/load-in': 'load-in.html',
        '/en/load-in': 'load-in.html',
        '/store': 'store.html',
        '/en/store': 'store.html',
        '/membership': 'membership.html',
        '/en/membership': 'membership.html',
        '/gallery': 'gallery.html',
        '/en/gallery': 'gallery.html',
        '/live-room': 'live-room.html',
        '/en/live-room': 'live-room.html'
      };

      var cleanHref = href.replace(/\/$/, '');
      if (pageMap[cleanHref]) {
        // If the anchor exists on this page, scroll to it
        if (cleanHref.endsWith('rooms') && document.getElementById('rooms')) {
          e.preventDefault();
          document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
          return;
        }
        if (cleanHref.endsWith('founders') && document.getElementById('founder')) {
          e.preventDefault();
          document.getElementById('founder').scrollIntoView({ behavior: 'smooth' });
          return;
        }
        // Otherwise navigate to the dedicated html page
        e.preventDefault();
        window.location.href = pageMap[cleanHref];
      }
    });
  });
})();

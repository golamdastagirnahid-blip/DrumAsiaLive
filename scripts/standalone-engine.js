/**
 * Standalone Engine for DrumAsia Live
 * Fully independent of Next.js client hydration:
 *  - Real-time Kuala Lumpur Timecode, Date & Live Weather
 *  - Interactive Studio Theme Switcher (6 Instrument Themes)
 *  - Desktop Dropdown Mega-Menus for all pages (Rooms, Backline, Record, Live, More)
 *  - Mobile Slide-Out Navigation Drawer
 *  - Procedural Web Audio API jamming sound engine
 *  - Top bar transparency on scroll (transparent at top, solid dark glass when scrolled)
 *  - Bottom transport bar motion (shows on scroll down, hides on scroll up)
 *  - Universal subpage routing (.html siblings)
 */
(function() {
  // === 1. TIMECODE, LIVE DATE & LIVE WEATHER ENGINE ===
  var weatherText = '29°C · KL FAIR';

  // Fetch real-time Kuala Lumpur weather from free Open-Meteo API
  try {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=3.139&longitude=101.6869&current_weather=true')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data && data.current_weather) {
          var temp = Math.round(data.current_weather.temperature);
          var code = data.current_weather.weathercode;
          var cond = 'FAIR';
          if (code >= 95) cond = 'THUNDER';
          else if (code >= 61) cond = 'RAIN';
          else if (code >= 51) cond = 'DRIZZLE';
          else if (code >= 1 && code <= 3) cond = 'CLOUDY';
          else if (code === 0) cond = 'CLEAR';
          weatherText = temp + '°C · KL ' + cond;
          updateDisplay();
        }
      })
      .catch(function() { /* fallback remains */ });
  } catch(e) {}

  function updateDisplay() {
    var now = new Date();
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    var klTime = new Date(utc + (3600000 * 8));

    var h = String(klTime.getHours()).padStart(2, '0');
    var m = String(klTime.getMinutes()).padStart(2, '0');
    var s = String(klTime.getSeconds()).padStart(2, '0');
    var ms = Math.floor(klTime.getMilliseconds() / 40);
    var frames = String(ms).padStart(2, '0');

    var timecodeStr = h + ':' + m + ':' + s + ':' + frames;

    // Date formatting: "TUE 08 SEP 2026"
    var days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var dateStr = days[klTime.getDay()] + ' ' + String(klTime.getDate()).padStart(2, '0') + ' ' + months[klTime.getMonth()] + ' ' + klTime.getFullYear();

    // Studio status
    var hour = klTime.getHours();
    var isOpen = (hour >= 10 || hour < 1);
    var statusHtml = isOpen
      ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#37d18a;box-shadow:0 0 8px #37d18a;margin-right:6px;"></span>OPEN · CLOSES 1:00 AM'
      : '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px #f59e0b;margin-right:6px;"></span>CLOSED · OPENS 10:00 AM';

    // Update bottom transport bar
    var transportBar = document.querySelector('.transport');
    if (transportBar) {
      // 1. Update weather elements
      var wEls = transportBar.querySelectorAll('#da-weather-badge span, .da-weather-span, #da-weather-span');
      wEls.forEach(function(el) {
        if (!el.classList.contains('transport__label')) el.textContent = weatherText;
      });

      // 2. Update date elements
      var dEls = transportBar.querySelectorAll('.da-date-span, #da-date-span, .transport .engraved');
      dEls.forEach(function(el) {
        if (!el.textContent.includes('°C')) el.textContent = dateStr;
      });

      // 3. Update timecode elements
      var tcEls = transportBar.querySelectorAll('#da-tc-span, .da-tc-span, .transport .tabular-nums');
      tcEls.forEach(function(el) { el.textContent = timecodeStr; });

      // 4. Ensure enriched strip in transport flex-1 if needed
      var transportLeft = transportBar.querySelector('.flex-1');
      if (transportLeft && !transportLeft.hasAttribute('data-da-injected')) {
        transportLeft.setAttribute('data-da-injected', 'true');
        if (!transportLeft.textContent.includes('°C') && !transportLeft.querySelector('#da-weather-span')) {
          var wBadge = document.createElement('div');
          wBadge.id = 'da-weather-badge';
          wBadge.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:8px;';
          wBadge.innerHTML = '<span class="transport__label hidden lg:inline" style="color:#888;font-size:9px;text-transform:uppercase;letter-spacing:0.18em;font-family:JetBrains Mono,monospace;">WEATHER</span><span id="da-weather-span" style="color:var(--gel-accent);font-weight:600;font-size:11px;font-family:JetBrains Mono,monospace;white-space:nowrap;">' + weatherText + '</span>';
          transportLeft.appendChild(wBadge);
        }
      }
    }

    // Direct text fallback
    var allTech = document.querySelectorAll('.tech');
    allTech.forEach(function(el) {
      if (el.textContent.includes('--:--:--:--') || /^\d{2}:\d{2}:\d{2}:\d{2}$/.test(el.textContent.trim())) {
        el.textContent = timecodeStr;
      }
    });

    var dw = document.getElementById('da-drawer-weather');
    if (dw) dw.textContent = weatherText;
    var dt = document.getElementById('da-drawer-tc');
    if (dt) dt.textContent = timecodeStr;
  }

  setInterval(updateDisplay, 100);
  updateDisplay();

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
    // Live Audio Visualizer / Dancing Heartbeat
    updateVisualizer(step, true);
  }

  // === DANCING HEARTBEAT & 5-BAND EQUALIZER VISUALIZER ENGINE ===
  function updateVisualizer(curStep, active) {
    var rings = document.querySelectorAll('.da-pulse-ring');
    var dots = document.querySelectorAll('.da-pulse-dot');
    var eq1 = document.querySelectorAll('.da-eq-1');
    var eq2 = document.querySelectorAll('.da-eq-2');
    var eq3 = document.querySelectorAll('.da-eq-3');
    var eq4 = document.querySelectorAll('.da-eq-4');
    var eq5 = document.querySelectorAll('.da-eq-5');

    if (!active) {
      rings.forEach(function(r) { r.style.transform = 'scale(1)'; r.style.opacity = '0.2'; });
      dots.forEach(function(d) { d.style.transform = 'scale(1)'; d.style.boxShadow = '0 0 4px var(--gel-accent)'; });
      eq1.forEach(function(b) { b.style.height = '3px'; });
      eq2.forEach(function(b) { b.style.height = '3px'; });
      eq3.forEach(function(b) { b.style.height = '4px'; });
      eq4.forEach(function(b) { b.style.height = '3px'; });
      eq5.forEach(function(b) { b.style.height = '3px'; });
      return;
    }

    // Heavy Bass Kick on step 0, 8 -> Big Heartbeat Thump!
    if (curStep === 0 || curStep === 8) {
      rings.forEach(function(r) { r.style.transform = 'scale(2.3)'; r.style.opacity = '0.9'; });
      dots.forEach(function(d) { d.style.transform = 'scale(1.4)'; d.style.boxShadow = '0 0 16px var(--gel-accent)'; });
      eq1.forEach(function(b) { b.style.height = '14px'; });
      eq2.forEach(function(b) { b.style.height = '12px'; });
      eq3.forEach(function(b) { b.style.height = '10px'; });
      eq4.forEach(function(b) { b.style.height = '6px'; });
      eq5.forEach(function(b) { b.style.height = '7px'; });
    } else if (curStep === 4 || curStep === 12) {
      // Snare snap
      rings.forEach(function(r) { r.style.transform = 'scale(1.7)'; r.style.opacity = '0.7'; });
      dots.forEach(function(d) { d.style.transform = 'scale(1.2)'; d.style.boxShadow = '0 0 12px var(--gel-accent)'; });
      eq1.forEach(function(b) { b.style.height = '5px'; });
      eq2.forEach(function(b) { b.style.height = '7px'; });
      eq3.forEach(function(b) { b.style.height = '12px'; });
      eq4.forEach(function(b) { b.style.height = '14px'; });
      eq5.forEach(function(b) { b.style.height = '8px'; });
    } else if (curStep === 10) {
      // Syncopated kick pulse
      rings.forEach(function(r) { r.style.transform = 'scale(1.6)'; r.style.opacity = '0.65'; });
      dots.forEach(function(d) { d.style.transform = 'scale(1.25)'; });
      eq1.forEach(function(b) { b.style.height = '11px'; });
      eq2.forEach(function(b) { b.style.height = '10px'; });
      eq3.forEach(function(b) { b.style.height = '6px'; });
      eq4.forEach(function(b) { b.style.height = '4px'; });
      eq5.forEach(function(b) { b.style.height = '5px'; });
    } else {
      // Hi-hat and decay
      var isEven = (curStep % 2 === 0);
      rings.forEach(function(r) { r.style.transform = 'scale(1.15)'; r.style.opacity = '0.35'; });
      dots.forEach(function(d) { d.style.transform = 'scale(1)'; d.style.boxShadow = '0 0 6px var(--gel-accent)'; });
      eq1.forEach(function(b) { b.style.height = '4px'; });
      eq2.forEach(function(b) { b.style.height = '5px'; });
      eq3.forEach(function(b) { b.style.height = '6px'; });
      eq4.forEach(function(b) { b.style.height = isEven ? '9px' : '4px'; });
      eq5.forEach(function(b) { b.style.height = isEven ? '11px' : '3px'; });
    }
  }

  function startAudio() {
    var ctx = getAudioContext();
    if (!ctx) return;
    if (intervalId) clearInterval(intervalId);
    isPlaying = true;
    try { localStorage.setItem('da-music-playing', 'true'); } catch(e) {}
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
    try { localStorage.setItem('da-music-playing', 'false'); } catch(e) {}
    updateAudioUI(false);
    updateVisualizer(0, false);
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

  // === 4. STUDIO THEME SELECTOR ENGINE ===
  var THEMES = [
    { id: 'drum-stage', label: 'Drum Studio', icon: '🥁', swatch: '#E5A93C', desc: 'Drums & Cymbals · Brass Gold' },
    { id: 'guitar-lounge', label: 'Guitar Lounge', icon: '🎸', swatch: '#FF5E1A', desc: 'Guitars & Amps · Tube Amber' },
    { id: 'synth-keys', label: 'Synth & Keys', icon: '🎹', swatch: '#00E5FF', desc: 'Synthesizer & Keys · Electric Cyan' },
    { id: 'console', label: 'Console Master', icon: '🎛️', swatch: '#FFB800', desc: 'Mixing Desk & VU · SSL Gold' },
    { id: 'sky-session', label: 'Midnight Sky', icon: '🌌', swatch: '#38BDF8', desc: 'Sky & Starlight · Starlight Blue' },
    { id: 'pure-dark', label: 'Obsidian Dark', icon: '🖤', swatch: '#EF4444', desc: 'Stealth Black · Studio REC Red' },
    { id: 'stage-lights', label: 'Stage Lights', icon: '✨', swatch: '#FACC15', desc: 'Concert Truss · Spotlights & Magenta' }
  ];

  var THEME_VARS = {
    'drum-stage': {
      '--gel-base': '#08090C',
      '--gel-panel': '#121418',
      '--gel-panel-2': '#191C22',
      '--gel-accent': '#E5A93C',
      '--gel-secondary': '#A3782C',
      '--gel-glow': 'rgba(229, 169, 60, 0.45)'
    },
    'guitar-lounge': {
      '--gel-base': '#0F0B08',
      '--gel-panel': '#1A130D',
      '--gel-panel-2': '#241A12',
      '--gel-accent': '#FF5E1A',
      '--gel-secondary': '#D45D28',
      '--gel-glow': 'rgba(255, 94, 26, 0.5)'
    },
    'synth-keys': {
      '--gel-base': '#05080E',
      '--gel-panel': '#0C121D',
      '--gel-panel-2': '#121A28',
      '--gel-accent': '#00E5FF',
      '--gel-secondary': '#BD00FF',
      '--gel-glow': 'rgba(0, 229, 255, 0.5)'
    },
    'console': {
      '--gel-base': '#0B0C0E',
      '--gel-panel': '#15171B',
      '--gel-panel-2': '#1B1E23',
      '--gel-accent': '#FFB800',
      '--gel-secondary': '#22C55E',
      '--gel-glow': 'rgba(255, 184, 0, 0.45)'
    },
    'sky-session': {
      '--gel-base': '#030814',
      '--gel-panel': '#091224',
      '--gel-panel-2': '#0F1C34',
      '--gel-accent': '#38BDF8',
      '--gel-secondary': '#818CF8',
      '--gel-glow': 'rgba(56, 189, 248, 0.5)'
    },
    'pure-dark': {
      '--gel-base': '#030304',
      '--gel-panel': '#0B0C0E',
      '--gel-panel-2': '#14161A',
      '--gel-accent': '#EF4444',
      '--gel-secondary': '#71717A',
      '--gel-glow': 'rgba(239, 68, 68, 0.45)'
    },
    'stage-lights': {
      '--gel-base': '#090412',
      '--gel-panel': '#150A26',
      '--gel-panel-2': '#1F0F38',
      '--gel-accent': '#FACC15',
      '--gel-secondary': '#EC4899',
      '--gel-glow': 'rgba(236, 72, 153, 0.5)'
    }
  };

  function applyTheme(id) {
    document.documentElement.setAttribute('data-gel', id);
    try { localStorage.setItem('da-gel', id); } catch(e) {}

    // 1. Direct CSS variable injection on root for instantaneous visual updates
    var vars = THEME_VARS[id] || THEME_VARS['drum-stage'];
    for (var prop in vars) {
      document.documentElement.style.setProperty(prop, vars[prop]);
    }

    // 2. Direct Background SVGs switching
    var bgMap = {
      'drum-stage': '.da-bg-drum-stage',
      'guitar-lounge': '.da-bg-guitar-lounge',
      'synth-keys': '.da-bg-synth-keys',
      'console': '.da-bg-console',
      'sky-session': '.da-bg-sky-session',
      'pure-dark': '.da-bg-pure-dark',
      'stage-lights': '.da-bg-stage-lights'
    };
    for (var key in bgMap) {
      var bgEl = document.querySelector(bgMap[key]);
      if (bgEl) {
        if (key === id || (key === 'guitar-lounge' && id === 'amber-wash') || (key === 'synth-keys' && id === 'cool-wash')) {
          bgEl.style.opacity = '1';
          bgEl.style.display = 'block';
        } else {
          bgEl.style.opacity = '0';
        }
      }
    }

    // 3. Update trigger UI in header
    var found = THEMES.find(function(t) { return t.id === id; }) || THEMES[0];
    var themeLabels = document.querySelectorAll('[title*="Theme"], [aria-label*="theme"], [aria-label*="Active theme"]');
    themeLabels.forEach(function(el) {
      var spanText = el.querySelector('span.tech, span:last-child');
      if (spanText && spanText.textContent && !spanText.textContent.includes('0')) {
        spanText.textContent = found.label;
      }
      var dot = el.querySelector('span.rounded-full, span:first-child');
      if (dot) {
        dot.style.background = found.swatch;
        dot.style.boxShadow = '0 0 10px ' + found.swatch;
      }
    });

    // 4. Update active checkmark in the theme list
    var allItems = document.querySelectorAll('#da-theme-list [data-theme-id]');
    allItems.forEach(function(it) {
      var itId = it.getAttribute('data-theme-id');
      var check = it.querySelector('.da-check');
      if (itId === id) {
        it.style.borderColor = found.swatch;
        it.style.background = 'rgba(255,255,255,0.08)';
        if (check) check.style.display = 'inline-block';
      } else {
        it.style.borderColor = 'rgba(255,255,255,0.08)';
        it.style.background = 'rgba(255,255,255,0.04)';
        if (check) check.style.display = 'none';
      }
    });
  }

  // Restore saved theme on load
  try {
    var savedTheme = localStorage.getItem('da-gel');
    if (savedTheme) applyTheme(savedTheme);
  } catch(e) {}

  // Forward declaration for mobile drawer closer
  var closeDrawer = function() {};

  // === CONTINUOUS UNINTERRUPTED MUSIC SPA ROUTING ===
  function navigateTo(url, push) {
    if (push !== false && window.history && window.history.pushState) {
      window.history.pushState({}, '', url);
    }
    fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        if (doc.title) document.title = doc.title;

        var newMain = doc.querySelector('main#main') || doc.querySelector('main');
        var curMain = document.querySelector('main#main') || document.querySelector('main');
        if (newMain && curMain) {
          curMain.innerHTML = newMain.innerHTML;
        }

        window.scrollTo({ top: 0, behavior: 'instant' });

        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach(function(link) {
          var lh = link.getAttribute('href');
          if (lh && currentPath.includes(lh.replace(/\.html$/, ''))) {
            link.style.color = 'var(--gel-accent)';
          } else if (lh) {
            link.style.color = '';
          }
        });

        closeDrawer();
        updateAudioUI(isPlaying);
      })
      .catch(function() {
        window.location.href = url;
      });
  }

  // Shared Menu Data Definition (used by both Desktop Mega-Menus and Mobile 3-Dot Slide Drawer)
  var MENUS_DATA = {
    'rooms': {
      title: 'STUDIO ROOMS',
      badge: '5 ROOMS',
      icon: '🥁',
      mainHref: 'rooms.html',
      items: [
        { name: 'Studio Ori', desc: 'Desa Sri Hartamas — Signature Rehearsal & Live Tracking', href: 'rooms.html' },
        { name: 'Live Stage', desc: 'Full Performance Hall with Stage Lighting & PA', href: 'rooms.html' },
        { name: 'Lagenda Room', desc: 'Acoustic-Treated High-Energy Band Rehearsal', href: 'rooms.html' },
        { name: 'Bilik Kompang', desc: 'Kota Damansara Branch Studio', href: 'rooms.html' },
        { name: 'View All Rooms & Pricing →', desc: 'Compare room specs, rates and features', href: 'rooms.html', highlight: true }
      ]
    },
    'backline': {
      title: 'BACKLINE RENTAL',
      badge: 'GEAR',
      icon: '🎸',
      mainHref: 'backline.html',
      items: [
        { name: 'Drum Kits & Snare Drums', desc: 'Tama Starclassic, Pearl Masters, DW Collector Series', href: 'backline.html' },
        { name: 'Guitar & Bass Amplifiers', desc: 'Marshall JCM, Fender Twin Reverb, Ampeg SVT', href: 'backline.html' },
        { name: 'Keyboards & Stage Pianos', desc: 'Nord Stage, Roland RD, Yamaha Motif', href: 'backline.html' },
        { name: 'Browse Full Backline Catalog →', desc: 'Day rates, delivery & on-stage support', href: 'backline.html', highlight: true }
      ]
    },
    'record': {
      title: 'RECORDING & PRODUCTION',
      badge: 'STUDIO',
      icon: '🎙️',
      mainHref: 'record.html',
      items: [
        { name: 'Multi-Track Studio Recording', desc: 'Live band tracking, vocal recording, mixing & mastering', href: 'record.html' },
        { name: 'Live Room Session Recording', desc: 'Capture your live show with multi-camera & audio stem', href: 'live-room.html' },
        { name: 'Recording Rates & Studio Booking →', desc: 'Desa Sri Hartamas studio suite', href: 'record.html', highlight: true }
      ]
    },
    'live': {
      title: 'LIVE VENUE & STAGE',
      badge: 'STAGE',
      icon: '⚡',
      mainHref: 'live.html',
      items: [
        { name: 'Gig Venue & Show Booking', desc: 'Basement stage with pro sound engineer & lighting technician', href: 'live.html' },
        { name: 'Stage Specs & Capacity', desc: 'Full load-in specs, crowd capacity and rider', href: 'load-in.html' },
        { name: 'Book Live Venue →', desc: 'WhatsApp live coordinator for calendar slots', href: 'live.html', highlight: true }
      ]
    },
    'more': {
      title: 'EXPLORE DRUM ASIA',
      badge: 'INFO',
      icon: '📍',
      mainHref: 'founders.html',
      items: [
        { name: 'Our Story & Founder', desc: 'Desa Sri Hartamas since 2014 — Meet the founder', href: 'founders.html' },
        { name: 'Contact, Location & Map', desc: '7-2 Jalan 22a/70a, Desa Sri Hartamas, Kuala Lumpur', href: 'contact.html' },
        { name: 'Load-In & Gear Logistics', desc: 'Parking, elevator, load-in bay instructions', href: 'load-in.html' },
        { name: 'FAQ & Studio Rules', desc: 'Cancellations, booking policy and session guidelines', href: 'faq.html' }
      ]
    }
  };

  // === 5. DESKTOP MEGA-DROPDOWNS & NAVIGATION ENHANCEMENT ===
  function setupDesktopDropdowns() {
    var navUl = document.querySelector('header nav ul');
    if (!navUl) return;

    var topLis = navUl.querySelectorAll('li');
    topLis.forEach(function(li) {
      var btn = li.querySelector('button, a');
      if (!btn) return;
      var text = btn.textContent.trim().toLowerCase();
      var menuKey = null;
      if (text.includes('room')) menuKey = 'rooms';
      else if (text.includes('backline')) menuKey = 'backline';
      else if (text.includes('record')) menuKey = 'record';
      else if (text.includes('live')) menuKey = 'live';
      else if (text.includes('more') || text.includes('learn') || text.includes('store')) menuKey = 'more';

      // Make top item a direct clickable link with continuous audio navigation
      if (btn.tagName === 'BUTTON' && menuKey) {
        btn.onclick = function(e) {
          e.preventDefault();
          if (menuKey === 'rooms') navigateTo('rooms.html');
          else if (menuKey === 'backline') navigateTo('backline.html');
          else if (menuKey === 'record') navigateTo('record.html');
          else if (menuKey === 'live') navigateTo('live.html');
          else if (menuKey === 'more') navigateTo('contact.html');
        };
      }

      if (menuKey && MENUS_DATA[menuKey] && !li.querySelector('.da-mega-dropdown')) {
        li.style.position = 'relative';
        var menuDef = MENUS_DATA[menuKey];
        var drop = document.createElement('div');
        drop.className = 'da-mega-dropdown';
        drop.style.cssText = 'display:none;position:absolute;top:100%;left:0;min-width:320px;background:rgba(14,16,20,0.98);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:12px;box-shadow:0 16px 40px rgba(0,0,0,0.9);backdrop-filter:blur(20px);z-index:9999;';

        var html = '<div style="font-family:JetBrains Mono,monospace;font-size:9.5px;color:var(--gel-accent);letter-spacing:0.2em;margin-bottom:8px;padding:0 8px;">' + menuDef.title + '</div><div style="display:flex;flex-direction:column;gap:4px;">';
        menuDef.items.forEach(function(it) {
          html += '<a href="' + it.href + '" style="display:block;padding:8px;border-radius:6px;text-decoration:none;transition:all 0.2s;background:' + (it.highlight ? 'rgba(255,163,26,0.1)' : 'transparent') + ';border:' + (it.highlight ? '1px solid rgba(255,163,26,0.3)' : '1px solid transparent') + ';" onmouseover="this.style.background=\'rgba(255,255,255,0.06)\'" onmouseout="this.style.background=\'' + (it.highlight ? 'rgba(255,163,26,0.1)' : 'transparent') + '\'">' +
            '<div style="color:' + (it.highlight ? 'var(--gel-accent)' : '#fff') + ';font-size:13px;font-weight:600;font-family:Inter,sans-serif;">' + it.name + '</div>' +
            '<div style="color:#888;font-size:11px;font-family:Inter,sans-serif;margin-top:2px;">' + it.desc + '</div>' +
          '</a>';
        });
        html += '</div>';
        drop.innerHTML = html;
        li.appendChild(drop);

        // Hover handlers
        var closeTimer = null;
        li.addEventListener('mouseenter', function() {
          if (closeTimer) clearTimeout(closeTimer);
          drop.style.display = 'block';
        });
        li.addEventListener('mouseleave', function() {
          closeTimer = setTimeout(function() { drop.style.display = 'none'; }, 150);
        });
      }
    });
  }

  // === 6. MOBILE 3-DOT / SLIDE NAVIGATION DRAWER (WITH ALL DROPDOWNS) ===
  function setupMobileDrawer() {
    var existing = document.getElementById('da-mobile-drawer');
    if (existing) existing.remove();

    var mobileDrawer = document.createElement('div');
    mobileDrawer.id = 'da-mobile-drawer';
    mobileDrawer.style.cssText = 'display:none;position:fixed;inset:0;z-index:999999;background:rgba(10,11,14,0.98);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);overflow-y:auto;padding:16px 16px 40px 16px;box-sizing:border-box;font-family:Inter,sans-serif;';

    var html = [
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:14px;margin-bottom:14px;">',
        '<div style="display:flex;align-items:center;gap:10px;">',
          '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#37D18A;box-shadow:0 0 8px #37D18A;"></span>',
          '<span style="font-family:Anton,sans-serif;font-size:21px;text-transform:uppercase;color:#fff;letter-spacing:0.04em;">DRUM<span style="color:var(--gel-accent);">ASIA</span> LIVE</span>',
        '</div>',
        '<button id="da-close-btn" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;width:38px;height:38px;border-radius:8px;font-size:18px;cursor:pointer;display:grid;place-items:center;">✕</button>',
      '</div>',

      // Quick Booking Strip
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">',
        '<a href="https://wa.me/60125161670?text=Hi%20DrumAsia%20Live%2C%20I%20would%20like%20to%20book%20a%20slot" target="_blank" style="background:var(--gel-accent);color:#0B0C0E;font-weight:700;text-align:center;padding:11px 8px;border-radius:6px;text-decoration:none;font-size:11px;letter-spacing:0.08em;font-family:JetBrains Mono,monospace;display:flex;align-items:center;justify-content:center;gap:6px;">',
          '<span>WHATSAPP BOOK</span>',
        '</a>',
        '<a href="tel:0125161670" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;font-weight:600;text-align:center;padding:11px 8px;border-radius:6px;text-decoration:none;font-size:11px;letter-spacing:0.08em;font-family:JetBrains Mono,monospace;display:flex;align-items:center;justify-content:center;gap:6px;">',
          '<span>012-516 1670</span>',
        '</a>',
      '</div>',

      // Dropdown Categories Accordions
      '<div style="color:#888;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;padding-left:2px;font-family:JetBrains Mono,monospace;">ALL STUDIO MENUS &amp; SERVICES</div>',
      '<div style="display:flex;flex-direction:column;gap:8px;" id="da-drawer-accordions">'
    ];

    Object.keys(MENUS_DATA).forEach(function(key, idx) {
      var m = MENUS_DATA[key];
      var isOpen = (idx === 0);

      html.push(
        '<div class="da-accordion-group" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;">',
          '<button type="button" class="da-accordion-toggle" data-target="da-acc-' + key + '" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:none;border:none;cursor:pointer;text-align:left;">',
            '<div style="display:flex;align-items:center;gap:10px;">',
              '<span style="font-size:16px;">' + m.icon + '</span>',
              '<span style="font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:#fff;letter-spacing:0.02em;">' + m.title + '</span>',
            '</div>',
            '<div style="display:flex;align-items:center;gap:8px;">',
              '<span style="font-family:JetBrains Mono,monospace;font-size:9.5px;color:var(--gel-accent);background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.08);">' + m.badge + '</span>',
              '<span class="da-accordion-arrow" style="color:#888;font-size:12px;transition:transform 0.2s;display:inline-block;transform:' + (isOpen ? 'rotate(180deg)' : 'rotate(0deg)') + ';">▼</span>',
            '</div>',
          '</button>',
          '<div id="da-acc-' + key + '" class="da-accordion-content" style="display:' + (isOpen ? 'flex' : 'none') + ';flex-direction:column;gap:4px;padding:4px 10px 10px 10px;border-top:1px solid rgba(255,255,255,0.06);">'
      );

      m.items.forEach(function(it) {
        html.push(
          '<a href="' + it.href + '" class="da-drawer-item" style="display:block;padding:9px 10px;border-radius:6px;text-decoration:none;background:' + (it.highlight ? 'rgba(255,163,26,0.12)' : 'rgba(255,255,255,0.02)') + ';border:' + (it.highlight ? '1px solid rgba(255,163,26,0.3)' : '1px solid rgba(255,255,255,0.04)') + ';margin-top:2px;">',
            '<div style="display:flex;justify-content:space-between;align-items:center;">',
              '<span style="color:' + (it.highlight ? 'var(--gel-accent)' : '#fff') + ';font-size:13.5px;font-weight:600;font-family:Inter,sans-serif;">' + it.name + '</span>',
              '<span style="color:' + (it.highlight ? 'var(--gel-accent)' : '#666') + ';font-size:12px;">→</span>',
            '</div>',
            '<div style="color:#888;font-size:11px;font-family:Inter,sans-serif;margin-top:2px;line-height:1.4;">' + it.desc + '</div>',
          '</a>'
        );
      });

      html.push('</div></div>');
    });

    html.push(
      '</div>',

      // Direct shortcuts
      '<div style="margin-top:16px;display:flex;flex-direction:column;gap:6px;">',
        '<div style="color:#888;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px;padding-left:2px;font-family:JetBrains Mono,monospace;">QUICK SHORTCUTS</div>',
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">',
          '<a href="load-in.html" style="display:block;padding:10px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);text-decoration:none;">',
            '<div style="color:#fff;font-size:12px;font-weight:600;">Load-In Bay</div>',
            '<div style="color:#777;font-size:10px;margin-top:1px;">Gear parking &amp; lift</div>',
          '</a>',
          '<a href="faq.html" style="display:block;padding:10px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);text-decoration:none;">',
            '<div style="color:#fff;font-size:12px;font-weight:600;">FAQ &amp; Rules</div>',
            '<div style="color:#777;font-size:10px;margin-top:1px;">Booking policy</div>',
          '</a>',
        '</div>',
      '</div>',

      // Studio Themes & Language Footer
      '<div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:8px;">',
        '<button type="button" id="da-drawer-theme-btn" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;cursor:pointer;">',
          '<div style="display:flex;align-items:center;gap:10px;">',
            '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--gel-accent);box-shadow:0 0 8px var(--gel-accent);"></span>',
            '<span style="font-family:JetBrains Mono,monospace;font-size:11.5px;color:#fff;text-transform:uppercase;letter-spacing:0.1em;">CHANGE STUDIO THEME</span>',
          '</div>',
          '<span style="font-family:JetBrains Mono,monospace;font-size:10px;color:#888;">7 PRESETS →</span>',
        '</button>',
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 4px;">',
          '<div style="font-family:JetBrains Mono,monospace;font-size:10.5px;color:#888;" id="da-drawer-weather">' + weatherText + '</div>',
          '<div style="font-family:JetBrains Mono,monospace;font-size:10.5px;color:var(--gel-accent);letter-spacing:0.08em;" id="da-drawer-tc">00:00:00:00</div>',
        '</div>',
      '</div>'
    );

    mobileDrawer.innerHTML = html.join('');
    document.body.appendChild(mobileDrawer);

    // Accordion toggle click handlers
    mobileDrawer.querySelectorAll('.da-accordion-toggle').forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var targetId = btn.getAttribute('data-target');
        var content = document.getElementById(targetId);
        var arrow = btn.querySelector('.da-accordion-arrow');
        if (!content) return;
        var isShown = (content.style.display === 'flex');
        content.style.display = isShown ? 'none' : 'flex';
        if (arrow) arrow.style.transform = isShown ? 'rotate(0deg)' : 'rotate(180deg)';
      };
    });

    // Theme button inside drawer
    var drawerThemeBtn = document.getElementById('da-drawer-theme-btn');
    if (drawerThemeBtn) {
      drawerThemeBtn.onclick = function(e) {
        e.preventDefault();
        closeDrawer();
        var themeModal = document.getElementById('da-theme-modal');
        if (themeModal) themeModal.style.display = 'grid';
      };
    }

    // Close button
    var closeBtn = document.getElementById('da-close-btn');
    if (closeBtn) closeBtn.onclick = closeDrawer;

    // Links inside drawer close the drawer and navigate
    mobileDrawer.querySelectorAll('a').forEach(function(a) {
      a.onclick = function(e) {
        var href = a.getAttribute('href');
        if (!href) return;
        if (href.startsWith('http') || href.startsWith('tel:')) return;
        e.preventDefault();
        closeDrawer();
        navigateTo(href);
      };
    });
  }

  // === 6. THEME PICKER MODAL UI ===
  function setupThemeModal() {
    var existing = document.getElementById('da-theme-modal');
    if (existing) existing.remove();

    var themeModal = document.createElement('div');
    themeModal.id = 'da-theme-modal';
    themeModal.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999999;background:rgba(0,0,0,0.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);place-items:center;padding:16px;box-sizing:border-box;';

    var currentGel = document.documentElement.getAttribute('data-gel') || 'drum-stage';

    var modalInner = [
      '<div style="background:#111317;border:1px solid rgba(255,255,255,0.15);border-radius:14px;max-width:420px;width:100%;max-height:85vh;overflow-y:auto;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,0.95);font-family:Inter,sans-serif;box-sizing:border-box;">',
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;margin-bottom:14px;">',
          '<div style="display:flex;align-items:center;gap:8px;">',
            '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#37D18A;box-shadow:0 0 8px #37D18A;"></span>',
            '<span style="font-family:Anton,sans-serif;font-size:18px;text-transform:uppercase;color:#fff;letter-spacing:0.04em;">STUDIO THEMES</span>',
          '</div>',
          '<button id="da-theme-close" style="background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;">✕</button>',
        '</div>',
        '<div style="color:#888;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;font-family:JetBrains Mono,monospace;">7 PREMIER INSTRUMENT PRESETS</div>',
        '<div style="display:flex;flex-direction:column;gap:8px;" id="da-theme-list"></div>',
      '</div>'
    ].join('');
    themeModal.innerHTML = modalInner;
    document.body.appendChild(themeModal);

    var listEl = document.getElementById('da-theme-list');
    THEMES.forEach(function(t) {
      var isCurrent = (t.id === currentGel);
      var item = document.createElement('div');
      item.setAttribute('data-theme-id', t.id);
      item.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:8px;background:' + (isCurrent ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (isCurrent ? t.swatch : 'rgba(255,255,255,0.08)') + ';cursor:pointer;transition:all 0.15s;user-select:none;';
      item.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:20px;line-height:1;">' + t.icon + '</span>' +
        '<div>' +
          '<div style="color:#fff;font-weight:600;font-size:14px;letter-spacing:0.02em;">' + t.label + '</div>' +
          '<div style="color:#888;font-size:11px;margin-top:2px;">' + t.desc + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<span class="da-check" style="display:' + (isCurrent ? 'inline-block' : 'none') + ';color:' + t.swatch + ';font-weight:bold;font-size:15px;">✓</span>' +
        '<span style="width:14px;height:14px;border-radius:50%;background:' + t.swatch + ';box-shadow:0 0 10px ' + t.swatch + ';display:inline-block;"></span>' +
      '</div>';

      item.onmouseover = function() { item.style.borderColor = t.swatch; };
      item.onmouseout = function() {
        var active = document.documentElement.getAttribute('data-gel') || 'drum-stage';
        if (t.id !== active) item.style.borderColor = 'rgba(255,255,255,0.08)';
      };

      var selectTheme = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        applyTheme(t.id);
        themeModal.style.display = 'none';
      };

      item.onclick = selectTheme;
      item.ontouchend = selectTheme;
      listEl.appendChild(item);
    });

    document.getElementById('da-theme-close').onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      themeModal.style.display = 'none';
    };
    themeModal.onclick = function(e) {
      if (e.target === themeModal) {
        e.preventDefault();
        themeModal.style.display = 'none';
      }
    };

    // Attach to theme buttons in header (using safe attribute inspection without fragile :has())
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
      var title = (btn.getAttribute('title') || '').toLowerCase();
      if ((aria.includes('theme') || title.includes('theme') || aria.includes('active theme')) && !aria.includes('mute') && !title.includes('mute')) {
        e.preventDefault();
        e.stopPropagation();
        var cur = document.documentElement.getAttribute('data-gel') || 'drum-stage';
        var allItems = document.querySelectorAll('#da-theme-list [data-theme-id]');
        allItems.forEach(function(it) {
          var itId = it.getAttribute('data-theme-id');
          var check = it.querySelector('.da-check');
          var th = THEMES.find(function(x) { return x.id === itId; });
          if (itId === cur) {
            it.style.borderColor = th ? th.swatch : '#FFA31A';
            it.style.background = 'rgba(255,255,255,0.08)';
            if (check) check.style.display = 'inline-block';
          } else {
            it.style.borderColor = 'rgba(255,255,255,0.08)';
            it.style.background = 'rgba(255,255,255,0.04)';
            if (check) check.style.display = 'none';
          }
        });
        themeModal.style.display = 'grid';
      }
    });
  }

  // === 7. INITIALIZE DOM ENHANCEMENTS ===
  document.addEventListener('DOMContentLoaded', function() {
    onScroll();
    setupDesktopDropdowns();
    setupMobileDrawer();
    setupThemeModal();

    // Unlock Web Audio on first gesture
    var unlock = function() {
      getAudioContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    // Audio Play Buttons & Dancing Visualizer Trigger
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="Jamming"], button[aria-label*="Audio"], button:has(svg polygon), .da-beat-visualizer');
      if (btn && btn.id !== 'da-close-btn' && btn.id !== 'da-theme-close') {
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
      var muteBtn = e.target.closest('button[title*="mute"], button[aria-label*="mute"]');
      if (muteBtn) {
        e.preventDefault();
        setAudioVolume(currentVol > 0 ? 0 : 0.75);
      }
    });

    // Mobile Navigation Drawer open & close controllers
    function openDrawer() {
      var d = document.getElementById('da-mobile-drawer');
      if (d) {
        d.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    }

    closeDrawer = function() {
      var d = document.getElementById('da-mobile-drawer');
      if (d) {
        d.style.display = 'none';
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.lucide-menu), #da-menu-btn, .da-menu-btn');
      if (btn && btn.id !== 'da-close-btn') {
        e.preventDefault();
        openDrawer();
      }
    });

    var closeBtn = document.getElementById('da-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    window.addEventListener('popstate', function() {
      navigateTo(window.location.href, false);
    });

    // Auto-resume continuous audio if previously playing
    try {
      if (localStorage.getItem('da-music-playing') === 'true') {
        var autoStartAudio = function() {
          if (!isPlaying && localStorage.getItem('da-music-playing') === 'true') {
            startAudio();
          }
          window.removeEventListener('click', autoStartAudio);
          window.removeEventListener('touchstart', autoStartAudio);
          window.removeEventListener('scroll', autoStartAudio);
        };
        window.addEventListener('click', autoStartAudio, { once: true });
        window.addEventListener('touchstart', autoStartAudio, { once: true });
        window.addEventListener('scroll', autoStartAudio, { once: true });
        startAudio();
      }
    } catch(e) {}

    // Universal Link Routing
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;

      // Logo and Home link routing — ALWAYS goes back to home page cleanly
      var isLogo = (a.getAttribute('aria-label') || '').includes('home') || 
                   a.querySelector('img[alt*="Logo"]') || 
                   href === '/' || 
                   href === '/en' || 
                   href === '/en/' || 
                   href === '/ms' || 
                   href === '/ms/' || 
                   href === 'index.html';

      if (isLogo) {
        e.preventDefault();
        var currentPath = window.location.pathname;
        if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/') || currentPath === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigateTo('index.html');
        }
        return;
      }

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
        e.preventDefault();
        navigateTo(pageMap[cleanHref]);
      } else if (href.endsWith('.html') && !href.startsWith('http')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });
})();

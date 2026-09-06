/**
 * /lib/jamming-audio.ts
 * Authentic Web Audio API procedural Jamming Room Sound Engine.
 * Generates an organic, warm live studio jamming ambience:
 *  - Acoustic studio room resonance
 *  - Rhythmic warm kick, snare and hi-hat groove
 *  - Warm analog chord progression
 *  - Master volume & gain staging
 */

export interface JammingAudioState {
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  tempo: number;
}

const STORAGE_PLAYING = "da-jam-playing";
const STORAGE_VOLUME = "da-jam-volume";

class JammingAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private intervalId: number | null = null;
  private step = 0;
  private isPlaying = false;
  private volume = 0.8;
  private listeners: Set<(state: JammingAudioState) => void> = new Set();
  private hasInit = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initPersistence();
    }
  }

  private initPersistence() {
    if (this.hasInit || typeof window === "undefined") return;
    this.hasInit = true;
    try {
      const savedVol = window.localStorage.getItem(STORAGE_VOLUME);
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v)) this.volume = Math.max(0, Math.min(1, v));
      }
      const savedPlaying = window.localStorage.getItem(STORAGE_PLAYING);
      
      const autoStart = () => {
        // Start on first touch or click unless user explicitly turned it off
        if (window.localStorage.getItem(STORAGE_PLAYING) !== "false" && !this.isPlaying) {
          this.start();
        }
      };

      if (savedPlaying === "true") {
        this.isPlaying = true;
        const ctx = this.getAudioContext();
        if (ctx && ctx.state === "running") {
          this.start();
        } else {
          window.addEventListener("click", autoStart, { once: true });
          window.addEventListener("touchstart", autoStart, { once: true });
          window.addEventListener("keydown", autoStart, { once: true });
        }
      } else if (savedPlaying === null) {
        // First time visitor: unlock and start on first click/touch
        window.addEventListener("click", autoStart, { once: true });
        window.addEventListener("touchstart", autoStart, { once: true });
      }
    } catch {
      /* noop */
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume * 0.85, this.ctx.currentTime);

        // Warm studio room low-pass filter
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setValueAtTime(5200, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(1.1, this.ctx.currentTime);

        this.masterGain.connect(this.filterNode);
        this.filterNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(cb: (state: JammingAudioState) => void) {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  public getState(): JammingAudioState {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      tempo: 96,
    };
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_VOLUME, String(this.volume));
      } catch {
        /* noop */
      }
    }
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.45, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_PLAYING, "true");
      } catch {
        /* noop */
      }
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isPlaying = true;
    this.notify();

    // 96 BPM 16th note interval = (60 / 96) / 4 = 156.25ms
    const stepDuration = (60 / 96) / 4 * 1000;

    this.intervalId = window.setInterval(() => {
      this.playStep(ctx);
      this.step = (this.step + 1) % 16;
    }, stepDuration);
  }

  public stop() {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_PLAYING, "false");
      } catch {
        /* noop */
      }
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  private playStep(ctx: AudioContext) {
    if (!this.masterGain) return;
    const now = ctx.currentTime;

    // 1) Warm acoustic kick on beats 0, 8 (and occasional ghost at 10)
    if (this.step === 0 || this.step === 8 || this.step === 10) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const startFreq = this.step === 10 ? 95 : 125;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

      const amp = this.step === 10 ? 0.35 : 0.75;
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // 2) Snare drum with studio snap on beats 4 and 12
    if (this.step === 4 || this.step === 12) {
      // Noise burst for snare wire
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.18);

      // Drum body tone
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = "triangle";
      body.frequency.setValueAtTime(185, now);
      body.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      bodyGain.gain.setValueAtTime(0.4, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      body.connect(bodyGain);
      bodyGain.connect(this.masterGain);
      body.start(now);
      body.stop(now + 0.13);
    }

    // 3) Acoustic hi-hat on every odd 16th or 8th
    if (this.step % 2 === 0) {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const hat = ctx.createBufferSource();
      hat.buffer = buffer;

      const hatFilter = ctx.createBiquadFilter();
      hatFilter.type = "highpass";
      hatFilter.frequency.setValueAtTime(6500, now);

      const hatGain = ctx.createGain();
      const hatVol = this.step % 4 === 0 ? 0.18 : 0.09;
      hatGain.gain.setValueAtTime(hatVol, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      hat.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.masterGain);
      hat.start(now);
      hat.stop(now + 0.05);
    }

    // 4) Warm musical studio chords & bass groove (Em7 - G - Am7 - C)
    if (this.step === 0 || this.step === 8) {
      const chords: number[][] = [
        [164.81, 196.0, 246.94, 329.63], // E3, G3, B3, E4 (Em)
        [174.61, 220.0, 261.63, 349.23], // F3, A3, C4, F4
        [220.0, 261.63, 329.63, 440.0],  // A3, C4, E4, A4 (Am)
        [196.0, 246.94, 293.66, 392.0],  // G3, B3, D4, G4 (G)
      ];
      const defaultChord: number[] = [164.81, 196.0, 246.94, 329.63];
      const chordIndex = Math.floor(now / 2.5) % chords.length;
      const chord: number[] = chords[chordIndex] ?? defaultChord;

      chord.forEach((freq, idx) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = idx === 0 ? "sawtooth" : "sine";
        chordOsc.frequency.setValueAtTime(freq, now);

        const level = idx === 0 ? 0.16 : 0.08;
        chordGain.gain.setValueAtTime(0.001, now);
        chordGain.gain.linearRampToValueAtTime(level, now + 0.08);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        chordOsc.connect(chordGain);
        chordGain.connect(this.masterGain!);
        chordOsc.start(now);
        chordOsc.stop(now + 0.9);
      });
    }
  }
}

// Global Singleton
export const jammingAudio = new JammingAudioEngine();

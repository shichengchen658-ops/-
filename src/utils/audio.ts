/**
 * Sound synthesis engine using Web Audio API for cheerful cartoon feedback
 * Zero external audio files required - works completely offline & reliably!
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  // Background Music (BGM) Engine
  private bgmGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private bgmTimer: number | null = null;
  private nextNoteTime: number = 0;
  private bgmStep: number = 0;
  public isBgmPlaying: boolean = false;
  public isBgmMuted: boolean = false;
  private bgmListeners: Array<(isMuted: boolean, isPlaying: boolean) => void> = [];

  // Cheerful, light-hearted pentatonic cartoon melody in C Major (32 steps, 120 BPM, ~0.22s per step)
  private readonly melodyPattern: Array<{
    note: number | null; // frequency in Hz (null = rest)
    bass?: number | null; // root bass in Hz
    duration: number; // in seconds
    isAccent?: boolean;
  }> = [
    // Phrase 1: C - E - G - E (bouncy opening)
    { note: 523.25, bass: 130.81, duration: 0.18, isAccent: true }, // C5 + C3
    { note: 659.25, duration: 0.15 }, // E5
    { note: 783.99, duration: 0.18 }, // G5
    { note: 659.25, duration: 0.15 }, // E5
    // Phrase 2: A - G - E - C (joyful skip)
    { note: 880.00, bass: 174.61, duration: 0.18, isAccent: true }, // A5 + F3
    { note: 783.99, duration: 0.15 }, // G5
    { note: 659.25, duration: 0.15 }, // E5
    { note: 523.25, duration: 0.18 }, // C5
    // Phrase 3: D - E - D - B (playful question)
    { note: 587.33, bass: 196.00, duration: 0.18, isAccent: true }, // D5 + G3
    { note: 659.25, duration: 0.15 }, // E5
    { note: 587.33, duration: 0.15 }, // D5
    { note: 493.88, duration: 0.18 }, // B4
    // Phrase 4: C - G - E - G (satisfying answer)
    { note: 523.25, bass: 130.81, duration: 0.20, isAccent: true }, // C5 + C3
    { note: 392.00, duration: 0.15 }, // G4
    { note: 329.63, duration: 0.15 }, // E4
    { note: 392.00, duration: 0.18 }, // G4

    // Phrase 5: E - G - A - G (swelling excitement)
    { note: 659.25, bass: 220.00, duration: 0.18, isAccent: true }, // E5 + A3
    { note: 783.99, duration: 0.15 }, // G5
    { note: 880.00, duration: 0.18 }, // A5
    { note: 783.99, duration: 0.15 }, // G5
    // Phrase 6: F - E - D - C (rippling cascade)
    { note: 698.46, bass: 174.61, duration: 0.18, isAccent: true }, // F5 + F3
    { note: 659.25, duration: 0.15 }, // E5
    { note: 587.33, duration: 0.15 }, // D5
    { note: 523.25, duration: 0.18 }, // C5
    // Phrase 7: D - G - B - D (ascending leap)
    { note: 587.33, bass: 196.00, duration: 0.18, isAccent: true }, // D5 + G3
    { note: 783.99, duration: 0.15 }, // G5
    { note: 493.88, duration: 0.15 }, // B4
    { note: 587.33, duration: 0.18 }, // D5
    // Phrase 8: C - rest - high chime (loop cadence)
    { note: 523.25, bass: 130.81, duration: 0.22, isAccent: true }, // C5 + C3
    { note: null, duration: 0.15 }, // Rest
    { note: 659.25, duration: 0.14 }, // E5
    { note: 783.99, duration: 0.20 }, // G5
  ];

  constructor() {
    // Lazy audio context creation on user interaction
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // --- Background Music (BGM) Engine ---

  public startBgm() {
    if (this.isBgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    if (!this.bgmGain) {
      this.bgmGain = ctx.createGain();
      this.bgmFilter = ctx.createBiquadFilter();
      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.setValueAtTime(1600, ctx.currentTime);
      this.bgmFilter.Q.setValueAtTime(1.0, ctx.currentTime);

      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : 0.05, ctx.currentTime);
      this.bgmGain.connect(this.bgmFilter);
      this.bgmFilter.connect(ctx.destination);
    }

    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.scheduleBgm();
    this.notifyBgmListeners();
  }

  public stopBgm() {
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
    this.notifyBgmListeners();
  }

  public toggleBgm(): boolean {
    this.isBgmMuted = !this.isBgmMuted;
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : 0.05, now);
    }
    if (!this.isBgmPlaying && !this.isBgmMuted) {
      this.startBgm();
    }
    this.notifyBgmListeners();
    return this.isBgmMuted;
  }

  public setBgmMuted(muted: boolean) {
    this.isBgmMuted = muted;
    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.isBgmMuted ? 0 : 0.05, now);
    }
    this.notifyBgmListeners();
  }

  public subscribeBgm(listener: (isMuted: boolean, isPlaying: boolean) => void): () => void {
    this.bgmListeners.push(listener);
    listener(this.isBgmMuted, this.isBgmPlaying);
    return () => {
      this.bgmListeners = this.bgmListeners.filter((l) => l !== listener);
    };
  }

  private notifyBgmListeners() {
    this.bgmListeners.forEach((l) => l(this.isBgmMuted, this.isBgmPlaying));
  }

  private scheduleBgm() {
    if (!this.isBgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const stepInterval = 0.22; // ~136 steps per min
    const lookahead = 0.28;

    while (this.nextNoteTime < ctx.currentTime + lookahead) {
      const stepData = this.melodyPattern[this.bgmStep];
      if (stepData && !this.isBgmMuted) {
        if (stepData.note) {
          this.playBgmNote(ctx, stepData.note, this.nextNoteTime, stepData.duration, stepData.isAccent);
        }
        if (stepData.bass) {
          this.playBgmBass(ctx, stepData.bass, this.nextNoteTime, stepData.duration * 1.6);
        }
      }

      this.nextNoteTime += stepInterval;
      this.bgmStep = (this.bgmStep + 1) % this.melodyPattern.length;
    }

    this.bgmTimer = window.setTimeout(() => this.scheduleBgm(), 80);
  }

  private playBgmNote(ctx: AudioContext, freq: number, time: number, dur: number, isAccent?: boolean) {
    if (!this.bgmGain) return;
    try {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      const baseVol = isAccent ? 0.32 : 0.22;
      noteGain.gain.setValueAtTime(0.001, time);
      noteGain.gain.linearRampToValueAtTime(baseVol, time + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + dur + 0.02);
    } catch {
      // Safe fallback
    }
  }

  private playBgmBass(ctx: AudioContext, freq: number, time: number, dur: number) {
    if (!this.bgmGain) return;
    try {
      const osc = ctx.createOscillator();
      const bassGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      bassGain.gain.setValueAtTime(0.001, time);
      bassGain.gain.linearRampToValueAtTime(0.24, time + 0.02);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(bassGain);
      bassGain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + dur + 0.02);
    } catch {
      // Safe fallback
    }
  }


  // Click / Bubble Pop Sound
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Munch / Eating Sound ("Crunch-chomp-nom!")
   * Triggered when a correct food item is selected in FeedingArena
   */
  public playMunch() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Two distinct biting chomps in quick succession for a realistic cartoon munch
    const chomps = [
      { time: 0, startFreq: 520, endFreq: 220, dur: 0.08 },
      { time: 0.1, startFreq: 460, endFreq: 180, dur: 0.09 },
    ];

    chomps.forEach(({ time, startFreq, endFreq, dur }) => {
      if (!ctx) return;
      const t = now + time;

      // 1. Tonal bite impulse (triangle wave with pitch drop)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);

      oscGain.gain.setValueAtTime(0.28, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.01);

      // 2. Crunchy noise burst for crispy food texture
      try {
        const bufferSize = Math.floor(ctx.sampleRate * dur);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        // Bandpass filter centered around 1400Hz for crunch sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, t);
        filter.Q.setValueAtTime(2.5, t);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        whiteNoise.start(t);
        whiteNoise.stop(t + dur);
      } catch {
        // Fallback gracefully if buffer creation fails
      }
    });
  }

  /**
   * Cheer Sound ("YAY! WOO-HOO!")
   * Triggered upon game completion
   * Synthesizes joyous crowd cheering, whistles, and celebratory major chords
   */
  public playCheer() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Crowd Cheering Layer: Filtered noise swelling up like a cheering crowd
    try {
      const duration = 2.4;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Two formant bandpass filters simulating vocal resonances ("Wooo!")
      const formant1 = ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(600, now);
      formant1.frequency.exponentialRampToValueAtTime(1100, now + 0.8);
      formant1.frequency.exponentialRampToValueAtTime(750, now + duration);
      formant1.Q.setValueAtTime(4.0, now);

      const formant2 = ctx.createBiquadFilter();
      formant2.type = 'bandpass';
      formant2.frequency.setValueAtTime(1400, now);
      formant2.frequency.exponentialRampToValueAtTime(2200, now + 0.7);
      formant2.frequency.exponentialRampToValueAtTime(1600, now + duration);
      formant2.Q.setValueAtTime(3.5, now);

      const crowdGain = ctx.createGain();
      // Swell up, hold excitement, fade out
      crowdGain.gain.setValueAtTime(0.01, now);
      crowdGain.gain.linearRampToValueAtTime(0.24, now + 0.35);
      crowdGain.gain.setValueAtTime(0.24, now + 1.2);
      crowdGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(formant1);
      noiseSource.connect(formant2);
      formant1.connect(crowdGain);
      formant2.connect(crowdGain);
      crowdGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // Fallback
    }

    // 2. Playful Ascending "Whoop!" Whistle
    const whistle = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(480, now + 0.05);
    whistle.frequency.exponentialRampToValueAtTime(1150, now + 0.45);
    whistle.frequency.exponentialRampToValueAtTime(950, now + 0.85);

    whistleGain.gain.setValueAtTime(0.001, now + 0.05);
    whistleGain.gain.linearRampToValueAtTime(0.18, now + 0.25);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    whistle.connect(whistleGain);
    whistleGain.connect(ctx.destination);

    whistle.start(now + 0.05);
    whistle.stop(now + 0.92);

    // 3. Triumphant Major Chime Cascade (C5 -> E5 -> G5 -> C6 -> E6 -> G6)
    const triumphantChimes = [
      { time: 0, freq: 523.25 },  // C5
      { time: 0.12, freq: 659.25 }, // E5
      { time: 0.24, freq: 783.99 }, // G5
      { time: 0.36, freq: 1046.50 }, // C6
      { time: 0.52, freq: 1318.51 }, // E6
      { time: 0.70, freq: 1567.98 }, // G6 High hold
    ];

    triumphantChimes.forEach(({ time, freq }) => {
      if (!ctx) return;
      const t = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  // Correct / Joy Chime (C major arpeggio for combos)
  public playSuccess(comboCount: number = 1) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitchOffset = Math.min(comboCount * 30, 200);
    const notes = [
      523.25 + pitchOffset,
      659.25 + pitchOffset,
      783.99 + pitchOffset,
      1046.5 + pitchOffset,
    ];

    notes.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.22, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.26);
    });
  }

  // Error / Bonk Sound (Gentle wobble)
  public playError() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Level Clear / Fanfare Sound (Alias to playCheer for consistency)
  public playFanfare() {
    this.playCheer();
  }
}

export const sound = new SoundController();

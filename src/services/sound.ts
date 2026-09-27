/**
 * Procedural Audio Synthesizer for "The Orchard"
 * Uses browser Web Audio API to create cozy acoustic chimes, rustles, and fanfares without external audio assets.
 */
class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.4;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public playPluck(pitchScale = 1, isCrit = false): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = isCrit ? 660 : 380 + Math.min(300, pitchScale * 15);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isCrit ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

      const peakGain = (isCrit ? 0.35 : 0.25) * this.volume;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isCrit ? 0.22 : 0.12));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (isCrit ? 0.25 : 0.15));

      if (isCrit) {
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(1320, now);
        overtone.frequency.exponentialRampToValueAtTime(1760, now + 0.1);

        overGain.gain.setValueAtTime(0.15 * this.volume, now);
        overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        overtone.connect(overGain);
        overGain.connect(ctx.destination);
        overtone.start(now);
        overtone.stop(now + 0.2);
      }
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  public playRustle(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  public playCoin(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + idx * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.2);
      });
    } catch {
      // Audio fallback
    }
  }

  public playFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  public playPress(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const freq = 220 + i * 90;
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + i * 0.06 + 0.08);

        gain.gain.setValueAtTime(0.18 * this.volume, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.1);
      }
    } catch {
      // Audio fallback
    }
  }

  public playBirdChirp(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 1760, duration: 0.06, delay: 0 },
        { freq: 2349, duration: 0.09, delay: 0.07 },
        { freq: 2793, duration: 0.11, delay: 0.18 },
      ];

      notes.forEach(({ freq, duration, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + delay + duration * 0.5);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + delay + duration);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.16 * this.volume, now + delay + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.02);
      });
    } catch {
      // Audio fallback
    }
  }

  public playCrowCall(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Two throaty caws: ~420Hz dropping slightly with noise rasp
      [0, 0.22].forEach((delay) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now + delay);
        osc.frequency.exponentialRampToValueAtTime(360, now + delay + 0.14);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now + delay);
        filter.Q.setValueAtTime(3.0, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.18);
      });
    } catch {
      // Audio fallback
    }
  }

  public playTractorRev(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Rhythmic diesel chug pulses: 65Hz - 110Hz
      for (let i = 0; i < 6; i++) {
        const pulseTime = now + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(65 + (i % 2 === 0 ? 15 : 0), pulseTime);
        osc.frequency.exponentialRampToValueAtTime(45, pulseTime + 0.07);

        gain.gain.setValueAtTime(0.01, pulseTime);
        gain.gain.linearRampToValueAtTime(0.22 * this.volume, pulseTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(pulseTime);
        osc.stop(pulseTime + 0.085);
      }
    } catch {
      // Audio fallback
    }
  }

  public playCatPurr(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Gentle soft meow: upward then gentle downward pitch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.38);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16 * this.volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }
}

export const SoundEngine = new SoundEffectsService();

export class AudioManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  ensureContext() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  tone({ frequency = 220, duration = 0.12, type = 'sine', gain = 0.08 }) {
    if (!this.enabled) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playJump() {
    this.tone({ frequency: 520, duration: 0.08, type: 'triangle' });
  }

  playHit() {
    this.tone({ frequency: 120, duration: 0.22, type: 'square' });
  }

  playScore() {
    this.tone({ frequency: 760, duration: 0.1, type: 'sine' });
  }
}

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.volume = 0.65;
    this.musicOsc = null;
  }

  ensureContext() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  configure({ sfx, music, volume }) {
    this.sfxEnabled = sfx;
    this.musicEnabled = music;
    this.volume = volume;
    if (!music) this.stopMusic();
  }

  tone({ frequency = 220, duration = 0.12, type = 'sine', gain = 0.08 }) {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    amp.gain.setValueAtTime(gain * this.volume, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  startMusic() {
    if (!this.musicEnabled) return;
    this.ensureContext();
    if (this.musicOsc) return;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 140;
    amp.gain.value = 0.015 * this.volume;
    osc.connect(amp).connect(this.ctx.destination);
    osc.start();
    this.musicOsc = { osc, amp };
  }

  stopMusic() {
    if (!this.musicOsc) return;
    this.musicOsc.osc.stop();
    this.musicOsc = null;
  }

  playJump() { this.tone({ frequency: 520, duration: 0.08, type: 'triangle' }); }
  playPowerUp() { this.tone({ frequency: 880, duration: 0.12, type: 'sine' }); }
  playHit() { this.tone({ frequency: 120, duration: 0.24, type: 'square' }); }
  playScore() { this.tone({ frequency: 760, duration: 0.1, type: 'sine' }); }
  playGameOver() { this.tone({ frequency: 90, duration: 0.35, type: 'sawtooth' }); }
}

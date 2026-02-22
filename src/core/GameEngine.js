import { GAME_CONFIG, DIFFICULTY_PRESETS, SKINS } from '../config/gameConfig.js';
import { InputManager } from '../systems/InputManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { StorageService } from '../utils/storage.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { StartScene } from '../scenes/StartScene.js';
import { PlayingScene } from '../scenes/PlayingScene.js';
import { PauseScene } from '../scenes/PauseScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = GAME_CONFIG.width;
    this.height = GAME_CONFIG.height;
    this.config = GAME_CONFIG;
    this.input = new InputManager(canvas);
    this.audio = new AudioManager();
    this.particles = new ParticleSystem();
    this.storage = new StorageService();
    this.persistent = this.storage.load();
    this.achievements = new AchievementSystem(this.persistent);
    this.currentScene = null;
    this.backgroundTime = 0;
    this.lastTime = performance.now();
    this.startButton = document.getElementById('startButton');
  }

  init() {
    this.input.init();
    this.audio.setEnabled(this.persistent.settings.sound);
    this.installUiHotkeys();
    this.installUiButtons();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setScene('start');
    requestAnimationFrame((t) => this.loop(t));
  }

  installUiButtons() {
    if (!this.startButton) return;
    this.startButton.addEventListener('click', () => {
      this.input.jumpQueued = true;
    });
  }

  installUiHotkeys() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyO') {
        this.persistent.settings.sound = !this.persistent.settings.sound;
        this.audio.setEnabled(this.persistent.settings.sound);
      }
      if (event.code === 'KeyM') {
        const unlocked = SKINS.filter((s) => this.persistent.unlockedSkins.includes(s.id));
        const idx = unlocked.findIndex((s) => s.id === this.persistent.selectedSkin);
        const next = unlocked[(idx + 1) % unlocked.length] ?? unlocked[0];
        this.persistent.selectedSkin = next.id;
      }
      if (event.code === 'KeyL') {
        const order = ['easy', 'normal', 'hard'];
        const idx = order.indexOf(this.persistent.settings.difficulty);
        this.persistent.settings.difficulty = order[(idx + 1) % order.length];
      }
      if (event.code === 'KeyG') {
        const order = ['low', 'medium', 'high'];
        const idx = order.indexOf(this.persistent.settings.graphics);
        this.persistent.settings.graphics = order[(idx + 1) % order.length];
      }
      this.savePersistent();
    });
  }

  getDifficultyPreset() {
    return DIFFICULTY_PRESETS[this.persistent.settings.difficulty] ?? DIFFICULTY_PRESETS.normal;
  }

  savePersistent() {
    this.storage.save(this.persistent);
  }

  setScene(name, payload) {
    if (name === 'start') this.currentScene = new StartScene(this);
    if (name === 'playing') this.currentScene = new PlayingScene(this);
    if (name === 'pause') this.currentScene = new PauseScene(this, payload);
    if (name === 'gameover') this.currentScene = new GameOverScene(this, payload);
    const showStartButton = name === 'start' || name === 'gameover';
    this.startButton?.classList.toggle('is-hidden', !showStartButton);
    if (this.startButton) this.startButton.textContent = name === 'gameover' ? 'Nochmal spielen' : 'Spiel starten';
    this.currentScene.enter?.();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  renderBackground(ctx) {
    const t = this.backgroundTime;
    const dayFactor = (Math.sin(t * 0.08) + 1) * 0.5;
    const top = `rgb(${20 + dayFactor * 70},${40 + dayFactor * 90},${90 + dayFactor * 130})`;
    const bottom = `rgb(${3 + dayFactor * 20},${12 + dayFactor * 25},${28 + dayFactor * 45})`;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    const layers = [0.15, 0.3, 0.5];
    layers.forEach((depth, index) => {
      const y = this.height * (0.68 + index * 0.08);
      ctx.fillStyle = `rgba(255,255,255,${0.08 + index * 0.05})`;
      for (let i = -2; i < 8; i += 1) {
        const x = ((i * 240 - t * 35 * depth) % (this.width + 300)) - 150;
        ctx.beginPath();
        ctx.ellipse(x, y, 160, 45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  loop(time) {
    const dt = Math.min(0.033, (time - this.lastTime) / 1000);
    this.lastTime = time;
    this.currentScene.update(dt);
    this.particles.update(dt);
    this.currentScene.render(this.ctx);

    this.drawOverlay();
    requestAnimationFrame((t) => this.loop(t));
  }

  drawOverlay() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Sound:${this.persistent.settings.sound ? 'on' : 'off'} · Diff:${this.persistent.settings.difficulty} · Gfx:${this.persistent.settings.graphics} · Skin:${this.persistent.selectedSkin}`,
      this.width - 14,
      this.height - 14,
    );
  }
}

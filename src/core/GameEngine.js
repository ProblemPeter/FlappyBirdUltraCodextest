import { GAME_CONFIG, DIFFICULTY_PRESETS, SKINS, BACKGROUNDS } from '../config/gameConfig.js';
import { InputManager } from '../systems/InputManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { StorageService } from '../utils/storage.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { StartScene } from '../scenes/StartScene.js';
import { PlayingScene } from '../scenes/PlayingScene.js';
import { PauseScene } from '../scenes/PauseScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';
import { ShopScene } from '../scenes/ShopScene.js';

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
    this.audio.configure({
      sfx: this.persistent.settings.sfx,
      music: this.persistent.settings.music,
      volume: this.persistent.settings.masterVolume,
    });
    this.installUiHotkeys();
    this.installUiButtons();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setScene('start');
    requestAnimationFrame((t) => this.loop(t));
  }

  installUiButtons() {
    if (!this.startButton) return;
    this.startButton.addEventListener('click', () => (this.input.jumpQueued = true));
  }

  installUiHotkeys() {
    window.addEventListener('keydown', (event) => {
      const s = this.persistent.settings;
      if (event.code === 'KeyO') s.sfx = !s.sfx;
      if (event.code === 'KeyI') s.music = !s.music;
      if (event.code === 'Equal') s.masterVolume = Math.min(1, s.masterVolume + 0.05);
      if (event.code === 'Minus') s.masterVolume = Math.max(0.1, s.masterVolume - 0.05);
      if (event.code === 'KeyL') {
        const order = ['easy', 'normal', 'hard'];
        s.difficulty = order[(order.indexOf(s.difficulty) + 1) % order.length];
      }
      if (event.code === 'KeyG') {
        const order = ['low', 'medium', 'high'];
        s.graphics = order[(order.indexOf(s.graphics) + 1) % order.length];
      }
      if (event.code === 'KeyT') {
        const order = ['tap-only', 'tap-hold', 'tap-hold-swipe'];
        s.touchScheme = order[(order.indexOf(s.touchScheme) + 1) % order.length];
      }
      if (event.code === 'KeyM') {
        const unlocked = SKINS.filter((k) => this.persistent.unlockedSkins.includes(k.id));
        const idx = unlocked.findIndex((k) => k.id === this.persistent.selectedSkin);
        this.persistent.selectedSkin = unlocked[(idx + 1) % unlocked.length].id;
      }
      if (event.code === 'KeyH') {
        const unlocked = BACKGROUNDS.filter((b) => this.persistent.unlockedBackgrounds.includes(b.id));
        const idx = unlocked.findIndex((b) => b.id === this.persistent.selectedBackground);
        this.persistent.selectedBackground = unlocked[(idx + 1) % unlocked.length].id;
      }
      this.audio.configure({ sfx: s.sfx, music: s.music, volume: s.masterVolume });
      if (event.code === 'KeyS') this.setScene('shop', this.currentScene instanceof PlayingScene ? 'playing' : 'start');
      this.savePersistent();
    });
  }

  getDifficultyPreset() {
    return DIFFICULTY_PRESETS[this.persistent.settings.difficulty] ?? DIFFICULTY_PRESETS.normal;
  }

  savePersistent() { this.storage.save(this.persistent); }

  setScene(name, payload) {
    if (name === 'start') this.currentScene = new StartScene(this);
    if (name === 'playing') this.currentScene = new PlayingScene(this);
    if (name === 'pause') this.currentScene = new PauseScene(this, payload);
    if (name === 'gameover') this.currentScene = new GameOverScene(this, payload);
    if (name === 'shop') this.currentScene = new ShopScene(this, payload ?? 'start');

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
    const selected = BACKGROUNDS.find((b) => b.id === this.persistent.selectedBackground) ?? BACKGROUNDS[0];
    const t = this.backgroundTime;
    const dayFactor = (Math.sin(t * 0.08) + 1) * 0.5;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, selected.colors[0]);
    grad.addColorStop(1, selected.colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    const layers = [0.15, 0.3, 0.5];
    layers.forEach((depth, index) => {
      const y = this.height * (0.68 + index * 0.08);
      ctx.fillStyle = `rgba(255,255,255,${(0.06 + index * 0.04) * (0.6 + dayFactor * 0.5)})`;
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
    const s = this.persistent.settings;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(
      `SFX:${s.sfx ? 'on' : 'off'} Music:${s.music ? 'on' : 'off'} Vol:${Math.round(s.masterVolume * 100)} Diff:${s.difficulty} Gfx:${s.graphics} Touch:${s.touchScheme}`,
      this.width - 14,
      this.height - 14,
    );
  }
}

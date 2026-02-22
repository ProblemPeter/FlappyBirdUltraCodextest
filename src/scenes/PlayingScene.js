import { Scene } from '../core/Scene.js';
import { Bird } from '../entities/Bird.js';
import { Pipe } from '../entities/Pipe.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';
import { PowerUp } from '../entities/PowerUp.js';
import { Coin } from '../entities/Coin.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SKINS, POWERUP_DURATIONS } from '../config/gameConfig.js';

const pipeTypesByLevel = [
  ['normal', 'narrow'],
  ['normal', 'moving', 'narrow', 'challenge'],
  ['normal', 'moving', 'rotating', 'fast', 'challenge'],
];

export class PlayingScene extends Scene {
  enter() {
    const skin = SKINS.find((s) => s.id === this.game.persistent.selectedSkin) ?? SKINS[0];
    this.bird = new Bird(this.game.width * 0.26, this.game.height * 0.5, this.game.config, skin);
    this.pipes = [];
    this.enemies = [];
    this.projectiles = [];
    this.powerUps = [];
    this.coins = [];
    this.spawnTimer = 0;
    this.enemyTimer = 2.5;
    this.powerUpTimer = 6;
    this.projectileTimer = 4;
    this.coinTimer = 2;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.slowmoTimer = 0;
    this.turboTimer = 0;
    this.magnetTimer = 0;
    this.playTime = 0;
    this.level = 1;
    this.powerUpUses = 0;
    this.game.audio.startMusic();
  }

  getSpeed() {
    const preset = this.game.getDifficultyPreset();
    const turbo = this.turboTimer > 0 ? 1.35 : 1;
    return (this.game.config.baseScrollSpeed * preset.speedFactor + this.score * 3.5) * turbo;
  }

  onJump() {
    const canHoldTurbo = this.game.input.holdActive && this.turboTimer > 0;
    if (canHoldTurbo) this.bird.velocityY = this.game.config.turboImpulse;
    else {
      const useDouble = this.bird.doubleJumpCharges > 0;
      this.bird.jump(useDouble);
    }
    this.game.audio.playJump();
    this.game.particles.burst(this.bird.x - 10, this.bird.y + 15, '#ffffff', 8);
  }

  spawnPipe() {
    const typePool = pipeTypesByLevel[Math.min(2, this.level - 1)];
    const type = typePool[(Math.random() * typePool.length) | 0];
    const width = type === 'narrow' ? 56 : 82;
    const gap = Math.max(150, this.game.config.pipeGap - this.level * 12 - (type === 'challenge' ? 15 : 0));
    const gapY = 120 + Math.random() * (this.game.height - 240);
    const pipe = new Pipe(this.game.width + 60, width, gapY, gap, type);
    this.pipes.push(pipe);
    if (pipe.challenge) this.coins.push(new Coin(pipe.x + pipe.width / 2, pipe.gapY, Math.random() < 0.25));
  }

  spawnEnemy() { this.enemies.push(new Enemy(this.game.width + 40, 120 + Math.random() * (this.game.height - 240))); }
  spawnProjectile() { this.projectiles.push(new Projectile(this.game.width + 10, 90 + Math.random() * (this.game.height - 180))); }

  spawnPowerUp() {
    const options = ['invulnerability', 'slowmo', 'doubleJump', 'multiplier', 'magnet', 'turbo'];
    const type = options[(Math.random() * options.length) | 0];
    const x = this.game.width + 20;
    let y = 110 + Math.random() * (this.game.height - 220);
    for (let i = 0; i < 5; i += 1) {
      const insidePipe = this.pipes.some((pipe) => {
        if (x < pipe.x || x > pipe.x + pipe.width) return false;
        const top = pipe.gapY - pipe.gapSize / 2;
        const bottom = pipe.gapY + pipe.gapSize / 2;
        return y < top || y > bottom;
      });
      if (!insidePipe) break;
      y = 110 + Math.random() * (this.game.height - 220);
    }
    this.powerUps.push(new PowerUp(x, y, type));
  }

  increaseScore(amount = 1) {
    const multiplier = this.bird.multiplierTimer > 0 ? 2 : 1;
    this.score += amount * multiplier;
    this.combo += 1;
    this.maxCombo = Math.max(this.combo, this.maxCombo);
    this.level = Math.min(3, 1 + Math.floor(this.score / 15));
    this.game.audio.playScore();
  }

  applyPowerUp(type) {
    if (type === 'slowmo') this.slowmoTimer = POWERUP_DURATIONS.slowmo;
    else if (type === 'magnet') this.magnetTimer = POWERUP_DURATIONS.magnet;
    else if (type === 'turbo') this.turboTimer = POWERUP_DURATIONS.turbo;
    else this.bird.grantPowerUp(type, POWERUP_DURATIONS[type]);
    this.powerUpUses += 1;
    if (this.combo >= 3) this.score += 2;
  }

  gameOver() {
    this.game.audio.playHit();
    this.game.audio.playGameOver();
    this.game.audio.stopMusic();
    this.game.setScene('gameover', {
      score: this.score,
      maxCombo: this.maxCombo,
      playTime: this.playTime,
      powerUpUses: this.powerUpUses,
      avgReaction: this.bird.reactionSamples.length
        ? this.bird.reactionSamples.reduce((a, b) => a + b, 0) / this.bird.reactionSamples.length
        : 0,
    });
  }

  update(dt) {
    if (this.game.input.consumePause()) this.game.setScene('pause', this);
    if (this.game.input.consumeJump()) this.onJump();

    const preset = this.game.getDifficultyPreset();
    const timeScale = this.slowmoTimer > 0 ? 0.65 : 1;
    const scaledDt = dt * timeScale;
    this.playTime += scaledDt;
    this.game.backgroundTime += scaledDt;
    this.slowmoTimer = Math.max(0, this.slowmoTimer - dt);
    this.turboTimer = Math.max(0, this.turboTimer - dt);
    this.magnetTimer = Math.max(0, this.magnetTimer - dt);

    this.bird.update(scaledDt, preset.gravityFactor);

    this.spawnTimer -= scaledDt; this.enemyTimer -= scaledDt; this.powerUpTimer -= scaledDt; this.projectileTimer -= scaledDt; this.coinTimer -= scaledDt;

    if (this.spawnTimer <= 0) { this.spawnTimer = this.game.config.pipeSpawnInterval; this.spawnPipe(); this.bird.onThreat(); }
    if (this.level > 1 && this.enemyTimer <= 0) { this.enemyTimer = 3.1; this.spawnEnemy(); }
    if (this.level > 1 && this.projectileTimer <= 0) { this.projectileTimer = 2.8; this.spawnProjectile(); }
    if (this.powerUpTimer <= 0) { this.powerUpTimer = 8; this.spawnPowerUp(); }
    if (this.coinTimer <= 0) { this.coinTimer = 2.2; this.coins.push(new Coin(this.game.width + 40, 100 + Math.random() * (this.game.height - 200), Math.random() < 0.1)); }

    const speed = this.getSpeed();
    for (const pipe of this.pipes) {
      pipe.update(scaledDt, speed, this.game.height);
      if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
        pipe.scored = true;
        this.increaseScore(pipe.challenge ? 2 : 1);
      }
      if (pipe.getRects(this.game.height).some((r) => CollisionSystem.circleRect(this.bird.getCircle(), r))) {
        this.combo = 0;
        if (this.bird.invulnerableTimer <= 0) return this.gameOver();
      }
    }

    for (const enemy of this.enemies) {
      enemy.update(scaledDt, speed);
      if (CollisionSystem.circles(this.bird.getCircle(), enemy.getCircle()) && this.bird.invulnerableTimer <= 0) return this.gameOver();
    }
    for (const shot of this.projectiles) {
      shot.update(scaledDt);
      if (CollisionSystem.circles(this.bird.getCircle(), shot.getCircle()) && this.bird.invulnerableTimer <= 0) return this.gameOver();
    }

    for (const power of this.powerUps) {
      power.update(scaledDt, speed);
      if (CollisionSystem.circles(this.bird.getCircle(), power.getCircle())) {
        this.applyPowerUp(power.type);
        power.active = false;
        this.game.audio.playPowerUp();
        this.game.particles.burst(power.x, power.y, '#e0fbfc', 14);
      }
    }

    for (const coin of this.coins) {
      coin.update(scaledDt, speed, this.magnetTimer > 0 ? this.bird : null);
      if (CollisionSystem.circles(this.bird.getCircle(), coin.getCircle())) {
        coin.active = false;
        if (coin.isCoupon) this.game.persistent.coupons += 1;
        else this.game.persistent.coins += 1;
      }
    }

    this.pipes = this.pipes.filter((p) => p.x > -150);
    this.enemies = this.enemies.filter((e) => e.x > -100);
    this.projectiles = this.projectiles.filter((p) => p.x > -40);
    this.powerUps = this.powerUps.filter((p) => p.active && p.x > -80);
    this.coins = this.coins.filter((c) => c.active && c.x > -40);

    if (this.bird.y > this.game.height || this.bird.y < -40) this.gameOver();
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    for (const pipe of this.pipes) pipe.render(ctx, this.game.height);
    for (const enemy of this.enemies) enemy.render(ctx);
    for (const shot of this.projectiles) shot.render(ctx);
    for (const power of this.powerUps) power.render(ctx);
    for (const coin of this.coins) coin.render(ctx);

    this.bird.render(ctx);
    this.game.particles.render(ctx);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`Score: ${this.score}`, 24, 50);
    ctx.font = '20px sans-serif';
    ctx.fillText(`Level ${this.level} · Combo ${this.combo} · Coins ${this.game.persistent.coins}`, 24, 78);
  }
}

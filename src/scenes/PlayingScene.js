import { Scene } from '../core/Scene.js';
import { Bird } from '../entities/Bird.js';
import { Pipe } from '../entities/Pipe.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';
import { PowerUp } from '../entities/PowerUp.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SKINS } from '../config/gameConfig.js';

const pipeTypesByLevel = [
  ['normal', 'narrow'],
  ['normal', 'moving', 'narrow'],
  ['normal', 'moving', 'rotating', 'fast'],
];

export class PlayingScene extends Scene {
  enter() {
    const skin = SKINS.find((s) => s.id === this.game.persistent.selectedSkin) ?? SKINS[0];
    this.bird = new Bird(this.game.width * 0.26, this.game.height * 0.5, this.game.config, skin);
    this.pipes = [];
    this.enemies = [];
    this.projectiles = [];
    this.powerUps = [];
    this.spawnTimer = 0;
    this.enemyTimer = 2.2;
    this.powerUpTimer = 6;
    this.projectileTimer = 4;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.slowmoTimer = 0;
    this.playTime = 0;
    this.level = 1;
  }

  getSpeed() {
    const preset = this.game.getDifficultyPreset();
    return this.game.config.baseScrollSpeed * preset.speedFactor + this.score * 3.2;
  }

  onJump() {
    const useDouble = this.bird.doubleJumpCharges > 0;
    this.bird.jump(useDouble);
    this.game.audio.playJump();
    this.game.particles.burst(this.bird.x - 10, this.bird.y + 15, '#ffffff', 6);
  }

  spawnPipe() {
    const typePool = pipeTypesByLevel[Math.min(2, this.level - 1)];
    const type = typePool[(Math.random() * typePool.length) | 0];
    const width = type === 'narrow' ? 56 : 82;
    const gap = Math.max(150, this.game.config.pipeGap - this.level * 10);
    this.pipes.push(new Pipe(this.game.width + 60, width, 120 + Math.random() * (this.game.height - 240), gap, type));
  }

  spawnEnemy() {
    this.enemies.push(new Enemy(this.game.width + 40, 120 + Math.random() * (this.game.height - 240)));
  }

  spawnProjectile() {
    this.projectiles.push(new Projectile(this.game.width + 10, 90 + Math.random() * (this.game.height - 180)));
  }

  spawnPowerUp() {
    const options = ['invulnerability', 'slowmo', 'doubleJump', 'multiplier'];
    const type = options[(Math.random() * options.length) | 0];
    this.powerUps.push(new PowerUp(this.game.width + 20, 110 + Math.random() * (this.game.height - 220), type));
  }

  increaseScore() {
    const multiplier = this.bird.multiplierTimer > 0 ? 2 : 1;
    this.score += multiplier;
    this.combo += 1;
    this.maxCombo = Math.max(this.combo, this.maxCombo);
    this.level = Math.min(3, 1 + Math.floor(this.score / 15));
    this.game.audio.playScore();
  }

  applyPowerUp(type) {
    if (type === 'slowmo') {
      this.slowmoTimer = 4;
      return;
    }
    this.bird.grantPowerUp(type, 6);
  }

  gameOver() {
    this.game.audio.playHit();
    this.game.setScene('gameover', {
      score: this.score,
      maxCombo: this.maxCombo,
      playTime: this.playTime,
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

    this.bird.update(scaledDt, preset.gravityFactor);

    this.spawnTimer -= scaledDt;
    this.enemyTimer -= scaledDt;
    this.powerUpTimer -= scaledDt;
    this.projectileTimer -= scaledDt;

    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.game.config.pipeSpawnInterval;
      this.spawnPipe();
      this.bird.onThreat();
    }
    if (this.level > 1 && this.enemyTimer <= 0) {
      this.enemyTimer = 3.1;
      this.spawnEnemy();
    }
    if (this.level > 1 && this.projectileTimer <= 0) {
      this.projectileTimer = 2.8;
      this.spawnProjectile();
    }
    if (this.powerUpTimer <= 0) {
      this.powerUpTimer = 8;
      this.spawnPowerUp();
    }

    const speed = this.getSpeed();
    for (const pipe of this.pipes) {
      pipe.update(scaledDt, speed, this.game.height);
      if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
        pipe.scored = true;
        this.increaseScore();
      }
      if (pipe.getRects(this.game.height).some((r) => CollisionSystem.circleRect(this.bird.getCircle(), r))) {
        if (this.bird.invulnerableTimer <= 0) return this.gameOver();
      }
    }

    for (const enemy of this.enemies) {
      enemy.update(scaledDt, speed);
      if (CollisionSystem.circles(this.bird.getCircle(), enemy.getCircle()) && this.bird.invulnerableTimer <= 0) {
        return this.gameOver();
      }
    }

    for (const shot of this.projectiles) {
      shot.update(scaledDt);
      if (CollisionSystem.circles(this.bird.getCircle(), shot.getCircle()) && this.bird.invulnerableTimer <= 0) {
        return this.gameOver();
      }
    }

    for (const power of this.powerUps) {
      power.update(scaledDt, speed);
      if (CollisionSystem.circles(this.bird.getCircle(), power.getCircle())) {
        this.applyPowerUp(power.type);
        power.active = false;
        this.game.particles.burst(power.x, power.y, '#e0fbfc', 14);
      }
    }

    this.pipes = this.pipes.filter((p) => p.x > -150);
    this.enemies = this.enemies.filter((e) => e.x > -100);
    this.projectiles = this.projectiles.filter((p) => p.x > -40);
    this.powerUps = this.powerUps.filter((p) => p.active && p.x > -80);

    if (this.bird.y > this.game.height || this.bird.y < -40) this.gameOver();
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    for (const pipe of this.pipes) pipe.render(ctx, this.game.height);
    for (const enemy of this.enemies) enemy.render(ctx);
    for (const shot of this.projectiles) shot.render(ctx);
    for (const power of this.powerUps) power.render(ctx);

    this.bird.render(ctx);
    this.game.particles.render(ctx);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`Score: ${this.score}`, 24, 50);
    ctx.font = '20px sans-serif';
    ctx.fillText(`Level ${this.level} · Combo ${this.combo}`, 24, 78);
  }
}

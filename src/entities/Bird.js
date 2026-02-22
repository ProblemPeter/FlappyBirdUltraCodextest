import { Entity } from './Entity.js';

export class Bird extends Entity {
  constructor(x, y, config, skin) {
    super(x, y);
    this.config = config;
    this.radius = 22;
    this.velocityY = 0;
    this.rotation = 0;
    this.skin = skin;
    this.doubleJumpCharges = 0;
    this.invulnerableTimer = 0;
    this.multiplierTimer = 0;
    this.reactionSamples = [];
    this.lastThreatTime = performance.now();
  }

  onThreat() {
    this.lastThreatTime = performance.now();
  }

  jump(isDoubleJumpEnabled) {
    const canUseDouble = isDoubleJumpEnabled && this.doubleJumpCharges > 0;
    if (canUseDouble) this.doubleJumpCharges -= 1;
    if (!isDoubleJumpEnabled || canUseDouble) this.velocityY = this.config.jumpImpulse;

    const reaction = performance.now() - this.lastThreatTime;
    if (reaction > 0 && reaction < this.config.reactionWindowMs) {
      this.reactionSamples.push(reaction);
      if (this.reactionSamples.length > 40) this.reactionSamples.shift();
    }
  }

  grantPowerUp(type, duration) {
    if (type === 'invulnerability') this.invulnerableTimer = duration;
    if (type === 'doubleJump') this.doubleJumpCharges = 2;
    if (type === 'multiplier') this.multiplierTimer = duration;
  }

  update(dt, gravityFactor = 1) {
    this.velocityY += this.config.gravity * gravityFactor * dt;
    this.velocityY = Math.min(this.velocityY, this.config.terminalVelocity);
    this.y += this.velocityY * dt;
    this.rotation = Math.max(-0.5, Math.min(1.3, this.velocityY / 700));
    this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    this.multiplierTimer = Math.max(0, this.multiplierTimer - dt);
  }

  getCircle() {
    return { x: this.x, y: this.y, radius: this.radius * 0.75 };
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.skin.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius, this.radius * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.skin.wing;
    ctx.beginPath();
    ctx.ellipse(-4, 4, this.radius * 0.8, this.radius * 0.35, 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(8, -7, 3, 0, Math.PI * 2);
    ctx.fill();

    if (this.invulnerableTimer > 0) {
      ctx.strokeStyle = '#8ef7ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor(x, y, vx = -420) {
    super(x, y);
    this.radius = 8;
    this.vx = vx;
  }

  update(dt) {
    this.x += this.vx * dt;
  }

  render(ctx) {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  getCircle() {
    return { x: this.x, y: this.y, radius: this.radius };
  }
}

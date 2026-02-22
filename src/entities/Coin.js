import { Entity } from './Entity.js';

export class Coin extends Entity {
  constructor(x, y, isCoupon = false) {
    super(x, y);
    this.radius = isCoupon ? 12 : 9;
    this.isCoupon = isCoupon;
  }

  update(dt, speed, magnetTarget) {
    this.x -= speed * dt;
    if (magnetTarget) {
      const dx = magnetTarget.x - this.x;
      const dy = magnetTarget.y - this.y;
      const d = Math.hypot(dx, dy) || 1;
      this.x += (dx / d) * 260 * dt;
      this.y += (dy / d) * 260 * dt;
    }
  }

  render(ctx) {
    ctx.fillStyle = this.isCoupon ? '#80ffdb' : '#ffd166';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  getCircle() {
    return { x: this.x, y: this.y, radius: this.radius };
  }
}

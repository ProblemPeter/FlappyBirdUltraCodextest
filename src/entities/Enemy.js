import { Entity } from './Entity.js';

export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y);
    this.radius = 18;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt, speed) {
    this.x -= speed * dt * 1.1;
    this.y += Math.sin(performance.now() / 320 + this.phase) * 60 * dt;
  }

  render(ctx) {
    ctx.fillStyle = '#ef476f';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  getCircle() {
    return { x: this.x, y: this.y, radius: this.radius };
  }
}

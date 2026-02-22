import { Entity } from './Entity.js';

export class PowerUp extends Entity {
  constructor(x, y, type) {
    super(x, y);
    this.type = type;
    this.radius = 14;
  }

  update(dt, speed) {
    this.x -= speed * dt;
  }

  render(ctx) {
    const colors = {
      invulnerability: '#90e0ef',
      slowmo: '#a0c4ff',
      doubleJump: '#ffafcc',
      multiplier: '#caffbf',
    };
    ctx.fillStyle = colors[this.type] || '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#102';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('P', this.x, this.y + 4);
  }

  getCircle() {
    return { x: this.x, y: this.y, radius: this.radius };
  }
}

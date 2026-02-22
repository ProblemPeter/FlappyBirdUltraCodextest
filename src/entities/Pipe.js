import { Entity } from './Entity.js';

export class Pipe extends Entity {
  constructor(x, width, gapY, gapSize, type = 'normal') {
    super(x, 0);
    this.width = width;
    this.gapY = gapY;
    this.gapSize = gapSize;
    this.type = type;
    this.challenge = type === 'challenge';
    this.scored = false;
    this.offset = Math.random() * 5;
  }

  update(dt, speed, playfieldHeight) {
    const speedFactor = this.type === 'fast' ? 1.3 : this.type === 'challenge' ? 1.15 : 1;
    this.x -= speed * dt * speedFactor;
    if (this.type === 'moving' || this.type === 'challenge') {
      this.gapY += Math.sin(performance.now() / 400 + this.offset) * 40 * dt;
      this.gapY = Math.max(120, Math.min(playfieldHeight - 120, this.gapY));
    }
    if (this.type === 'rotating' || this.type === 'challenge') this.offset += dt * 2;
  }

  getRects(playfieldHeight) {
    const topHeight = this.gapY - this.gapSize / 2;
    const bottomY = this.gapY + this.gapSize / 2;
    return [
      { x: this.x, y: 0, width: this.width, height: topHeight },
      { x: this.x, y: bottomY, width: this.width, height: playfieldHeight - bottomY },
    ];
  }

  render(ctx, playfieldHeight) {
    const rects = this.getRects(playfieldHeight);
    ctx.fillStyle = this.challenge ? '#f4a261' : '#2a9d8f';
    for (const rect of rects) {
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = this.challenge ? '#e76f51' : '#1f7d72';
      ctx.fillRect(rect.x - 5, rect.y + (rect.y === 0 ? rect.height - 24 : 0), rect.width + 10, 24);
      ctx.fillStyle = this.challenge ? '#f4a261' : '#2a9d8f';
    }
    if (this.type === 'rotating' || this.type === 'challenge') {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.gapY);
      ctx.rotate(this.offset);
      ctx.fillStyle = '#e63946';
      ctx.fillRect(-8, -42, 16, 84);
      ctx.restore();
    }
  }
}

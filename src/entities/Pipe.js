import { Entity } from './Entity.js';

export class Pipe extends Entity {
  constructor(x, width, gapY, gapSize, type = 'normal') {
    super(x, 0);
    this.width = width;
    this.gapY = gapY;
    this.gapSize = gapSize;
    this.type = type;
    this.scored = false;
    this.offset = Math.random() * 5;
  }

  update(dt, speed, playfieldHeight) {
    this.x -= speed * dt * (this.type === 'fast' ? 1.25 : 1);
    if (this.type === 'moving') {
      this.gapY += Math.sin(performance.now() / 400 + this.offset) * 40 * dt;
      this.gapY = Math.max(120, Math.min(playfieldHeight - 120, this.gapY));
    }
    if (this.type === 'rotating') this.offset += dt * 2;
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
    ctx.fillStyle = '#2a9d8f';
    for (const rect of rects) {
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = '#1f7d72';
      ctx.fillRect(rect.x - 5, rect.y + (rect.y === 0 ? rect.height - 24 : 0), rect.width + 10, 24);
      ctx.fillStyle = '#2a9d8f';
    }
    if (this.type === 'rotating') {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.gapY);
      ctx.rotate(this.offset);
      ctx.fillStyle = '#e76f51';
      ctx.fillRect(-8, -42, 16, 84);
      ctx.restore();
    }
  }
}

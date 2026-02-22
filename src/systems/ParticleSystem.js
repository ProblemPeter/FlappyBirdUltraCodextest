export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  burst(x, y, color = '#ffffff', amount = 12) {
    for (let i = 0; i < amount; i += 1) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 250,
        vy: (Math.random() - 0.5) * 250,
        life: 1,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  update(dt) {
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.life -= dt * 1.5;
      p.vy += 240 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

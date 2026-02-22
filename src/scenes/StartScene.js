import { Scene } from '../core/Scene.js';

export class StartScene extends Scene {
  update(dt) {
    this.game.backgroundTime += dt;
    if (this.game.input.consumeJump()) this.game.setScene('playing');
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    const pulse = 0.7 + Math.sin(performance.now() / 250) * 0.3;
    ctx.fillStyle = `rgba(10,15,30,${0.3 + pulse * 0.2})`;
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 68px sans-serif';
    ctx.fillText('Flappy Evolution', this.game.width / 2, this.game.height * 0.36);
    ctx.font = '24px sans-serif';
    ctx.fillText('Drücke SPACE / Tippe zum Starten', this.game.width / 2, this.game.height * 0.54);
    ctx.font = '18px sans-serif';
    ctx.fillText('P = Pause · O = Einstellungen · M = Skin wechseln', this.game.width / 2, this.game.height * 0.62);
  }
}

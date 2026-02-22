import { Scene } from '../core/Scene.js';

export class StartScene extends Scene {
  update(dt) {
    this.game.backgroundTime += dt;
    const swipe = this.game.input.consumeSwipe();
    if (swipe.right) this.game.setScene('shop', 'start');
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
    ctx.fillText('Flappy Evolution Pro', this.game.width / 2, this.game.height * 0.34);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#80ffdb';
    ctx.fillText(`Version ${window.__APP_VERSION__ ?? 'v4'} (neu)`, this.game.width / 2, this.game.height * 0.46);
    ctx.fillStyle = '#fff';
    ctx.fillText('Tippen/SPACE zum Starten', this.game.width / 2, this.game.height * 0.52);
    ctx.fillText('Swipe rechts / B für Shop', this.game.width / 2, this.game.height * 0.58);
    ctx.fillText('P Pause · O SFX · I Musik · L Schwierigkeit · G Grafik', this.game.width / 2, this.game.height * 0.64);
  }
}

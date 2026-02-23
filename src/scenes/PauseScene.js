import { Scene } from '../core/Scene.js';

export class PauseScene extends Scene {
  constructor(game, returnScene) {
    super(game);
    this.returnScene = returnScene;
  }

  update() {
    for (const action of this.game.input.consumeActions()) {
      if (action === 'resume') this.game.currentScene = this.returnScene;
      if (action === 'openShop') this.game.setScene('shop', 'playing');
    }
    if (this.game.input.consumePause() || this.game.input.consumeJump()) this.game.currentScene = this.returnScene;
    const swipe = this.game.input.consumeSwipe();
    if (swipe.right) this.game.setScene('shop', 'playing');
  }

  render(ctx) {
    this.returnScene.render(ctx);
    ctx.fillStyle = 'rgba(3,7,20,0.65)';
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText('Pause', this.game.width / 2, this.game.height * 0.45);
    ctx.font = '24px sans-serif';
    ctx.fillText('P oder SPACE zum Fortsetzen', this.game.width / 2, this.game.height * 0.55);
    ctx.fillText('Swipe rechts für Shop', this.game.width / 2, this.game.height * 0.62);
  }
}

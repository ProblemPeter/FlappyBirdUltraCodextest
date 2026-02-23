import { Scene } from '../core/Scene.js';

export class GameOverScene extends Scene {
  constructor(game, results) {
    super(game);
    this.results = results;
    this.achievementMessages = [];
  }

  enter() {
    const state = this.game.persistent;
    state.highScore = Math.max(state.highScore, this.results.score);
    this.achievementMessages = this.game.achievements.evaluate(this.results);
    this.game.savePersistent();
  }

  update() {
    this.game.backgroundTime += 0.01;
    for (const action of this.game.input.consumeActions()) {
      if (action === 'openShop') this.game.setScene('shop', 'start');
    }
    const swipe = this.game.input.consumeSwipe();
    if (swipe.right) this.game.setScene('shop', 'start');
    if (this.game.input.consumeJump()) this.game.setScene('playing');
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    ctx.fillStyle = 'rgba(0,0,0,0.58)';
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText('Game Over', this.game.width / 2, 150);

    ctx.font = '24px sans-serif';
    const lines = [
      `Score: ${this.results.score}`,
      `Highscore: ${this.game.persistent.highScore}`,
      `Gespielte Zeit: ${this.results.playTime.toFixed(1)} s`,
      `Power-Ups genutzt: ${this.results.powerUpUses}`,
      `Max Combo: ${this.results.maxCombo}`,
      `Ø Reaktionszeit: ${Math.round(this.results.avgReaction)} ms`,
      `Coins: ${this.game.persistent.coins} | Coupons: ${this.game.persistent.coupons}`,
    ];
    lines.forEach((line, i) => ctx.fillText(line, this.game.width / 2, 230 + i * 40));

    ctx.fillStyle = '#80ffdb';
    ctx.font = '20px sans-serif';
    ctx.fillText('Swipe rechts für Shop · SPACE/Tap für Neustart', this.game.width / 2, 600);
  }
}

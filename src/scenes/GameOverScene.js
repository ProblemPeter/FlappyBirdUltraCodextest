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

    if (this.results.score >= 20 && !state.unlockedSkins.includes('neon')) state.unlockedSkins.push('neon');
    if (this.results.score >= 45 && !state.unlockedSkins.includes('forest')) state.unlockedSkins.push('forest');
    this.game.savePersistent();
  }

  update() {
    this.game.backgroundTime += 0.01;
    if (this.game.input.consumeJump()) this.game.setScene('playing');
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText('Game Over', this.game.width / 2, 170);

    ctx.font = '26px sans-serif';
    const lines = [
      `Score: ${this.results.score}`,
      `Highscore: ${this.game.persistent.highScore}`,
      `Max Combo: ${this.results.maxCombo}`,
      `Ø Reaktionszeit: ${Math.round(this.results.avgReaction)} ms`,
      `Gespielte Zeit: ${this.results.playTime.toFixed(1)} s`,
    ];
    lines.forEach((line, i) => ctx.fillText(line, this.game.width / 2, 250 + i * 42));

    if (this.achievementMessages.length) {
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#ffd166';
      ctx.fillText(`Neue Achievements: ${this.achievementMessages.join(', ')}`, this.game.width / 2, 500);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText('SPACE / Tap für Neustart', this.game.width / 2, 590);
  }
}

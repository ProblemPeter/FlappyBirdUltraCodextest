import { Scene } from '../core/Scene.js';
import { SHOP_CATEGORIES } from '../shop/shopData.js';

export class ShopScene extends Scene {
  constructor(game, returnScene = 'start') {
    super(game);
    this.returnScene = returnScene;
    this.category = 'skins';
    this.index = 0;
  }

  update() {
    for (const action of this.game.input.consumeActions()) {
      if (action === 'shopPrev') this.changeIndex(-1);
      if (action === 'shopNext') this.changeIndex(1);
      if (action === 'shopBuy') this.buyOrSelect();
      if (action === 'resume') this.game.setScene(this.returnScene);
    }
    const swipe = this.game.input.consumeSwipe();
    if (swipe.left || swipe.right) {
      this.category = this.category === 'skins' ? 'backgrounds' : 'skins';
      this.index = 0;
    }
    if (this.game.input.consumePause()) this.game.setScene(this.returnScene);
    if (this.game.input.consumeJump()) this.buyOrSelect();
  }

  changeIndex(step) {
    const list = SHOP_CATEGORIES[this.category];
    this.index = (this.index + step + list.length) % list.length;
  }

  buyOrSelect() {
    const item = SHOP_CATEGORIES[this.category][this.index];
    const unlocked = this.category === 'skins' ? this.game.persistent.unlockedSkins : this.game.persistent.unlockedBackgrounds;
    if (!unlocked.includes(item.id)) {
      if (this.game.persistent.coins >= item.cost) {
        this.game.persistent.coins -= item.cost;
        unlocked.push(item.id);
      } else return;
    }
    if (this.category === 'skins') this.game.persistent.selectedSkin = item.id;
    else this.game.persistent.selectedBackground = item.id;
    this.game.savePersistent();
  }

  render(ctx) {
    this.game.renderBackground(ctx);
    const list = SHOP_CATEGORIES[this.category];
    const item = list[this.index % list.length];

    ctx.fillStyle = 'rgba(2,8,22,0.7)';
    ctx.fillRect(120, 90, this.game.width - 240, this.game.height - 180);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('Shop', this.game.width / 2, 160);
    ctx.font = '22px sans-serif';
    ctx.fillText(`Kategorie: ${this.category} (Swipe links/rechts)`, this.game.width / 2, 210);
    ctx.fillText(`Coins: ${this.game.persistent.coins} | Coupons: ${this.game.persistent.coupons}`, this.game.width / 2, 245);

    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(item.id, this.game.width / 2, 350);
    ctx.font = '28px sans-serif';
    ctx.fillText(`Preis: ${item.cost} Coins`, this.game.width / 2, 400);
    ctx.font = '20px sans-serif';
    ctx.fillText('Tippen = Kaufen/Auswählen · ◀ ▶ = Items · Weiter = Zurück', this.game.width / 2, 520);

    const unlocked = this.category === 'skins' ? this.game.persistent.unlockedSkins : this.game.persistent.unlockedBackgrounds;
    ctx.fillStyle = unlocked.includes(item.id) ? '#80ffdb' : '#ffd166';
    ctx.fillText(unlocked.includes(item.id) ? 'Freigeschaltet' : 'Gesperrt', this.game.width / 2, 450);
  }
}

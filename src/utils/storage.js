const KEY = 'flappy-evolution-state';

const defaults = {
  highScore: 0,
  coins: 0,
  coupons: 0,
  unlockedSkins: ['classic'],
  selectedSkin: 'classic',
  unlockedBackgrounds: ['sky'],
  selectedBackground: 'sky',
  settings: {
    sfx: true,
    music: true,
    masterVolume: 0.65,
    difficulty: 'normal',
    graphics: 'high',
    touchScheme: 'tap-hold-swipe',
  },
  achievements: {},
};

export class StorageService {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaults);
      return { ...structuredClone(defaults), ...JSON.parse(raw) };
    } catch {
      return structuredClone(defaults);
    }
  }

  save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
}

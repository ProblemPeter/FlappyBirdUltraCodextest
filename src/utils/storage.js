const KEY = 'flappy-evolution-state';

const defaults = {
  highScore: 0,
  unlockedSkins: ['classic'],
  selectedSkin: 'classic',
  settings: { sound: true, difficulty: 'normal', graphics: 'high' },
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

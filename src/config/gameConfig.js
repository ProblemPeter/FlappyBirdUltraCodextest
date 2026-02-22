export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  gravity: 1650,
  jumpImpulse: -520,
  turboImpulse: -760,
  terminalVelocity: 920,
  baseScrollSpeed: 250,
  pipeGap: 210,
  pipeSpawnInterval: 1.4,
  reactionWindowMs: 900,
};

export const DIFFICULTY_PRESETS = {
  easy: { speedFactor: 0.85, gravityFactor: 0.92 },
  normal: { speedFactor: 1, gravityFactor: 1 },
  hard: { speedFactor: 1.2, gravityFactor: 1.08 },
};

export const SKINS = [
  { id: 'classic', body: '#ffe066', wing: '#ffb703', cost: 0 },
  { id: 'neon', body: '#9d4edd', wing: '#5a189a', cost: 120 },
  { id: 'forest', body: '#7bd389', wing: '#3d5a40', cost: 180 },
  { id: 'ruby', body: '#ff4d6d', wing: '#c9184a', cost: 220 },
];

export const BACKGROUNDS = [
  { id: 'sky', colors: ['#1b3a6b', '#10213a'], cost: 0 },
  { id: 'sunset', colors: ['#ff7b00', '#5f0f40'], cost: 140 },
  { id: 'neoncity', colors: ['#3a0ca3', '#111827'], cost: 200 },
];

export const POWERUP_DURATIONS = {
  invulnerability: 5,
  slowmo: 4,
  doubleJump: 7,
  multiplier: 7,
  magnet: 6,
  turbo: 2,
};

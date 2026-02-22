export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  gravity: 1700,
  jumpImpulse: -520,
  terminalVelocity: 900,
  baseScrollSpeed: 260,
  pipeGap: 210,
  pipeSpawnInterval: 1.45,
  reactionWindowMs: 900,
  mobileBreakpoint: 900,
};

export const DIFFICULTY_PRESETS = {
  easy: { speedFactor: 0.9, gravityFactor: 0.95 },
  normal: { speedFactor: 1, gravityFactor: 1 },
  hard: { speedFactor: 1.2, gravityFactor: 1.08 },
};

export const SKINS = [
  { id: 'classic', body: '#ffe066', wing: '#ffb703' },
  { id: 'neon', body: '#9d4edd', wing: '#5a189a' },
  { id: 'forest', body: '#7bd389', wing: '#3d5a40' },
];

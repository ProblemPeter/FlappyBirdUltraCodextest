import { GameEngine } from './core/GameEngine.js';

const canvas = document.getElementById('gameCanvas');
const game = new GameEngine(canvas);
game.init();

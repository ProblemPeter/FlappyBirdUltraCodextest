export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.jumpQueued = false;
    this.pauseQueued = false;
    this.handlers = [];
  }

  init() {
    const onKeyDown = (event) => {
      this.keys.add(event.code);
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) this.jumpQueued = true;
      if (event.code === 'KeyP' || event.code === 'Escape') this.pauseQueued = true;
    };

    const onKeyUp = (event) => this.keys.delete(event.code);
    const onTouch = () => {
      this.jumpQueued = true;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    this.canvas.addEventListener('pointerdown', onTouch);

    this.handlers.push(['keydown', onKeyDown], ['keyup', onKeyUp], ['pointerdown', onTouch]);
  }

  consumeJump() {
    const value = this.jumpQueued;
    this.jumpQueued = false;
    return value;
  }

  consumePause() {
    const value = this.pauseQueued;
    this.pauseQueued = false;
    return value;
  }

  dispose() {
    for (const [name, handler] of this.handlers) {
      const target = name === 'pointerdown' ? this.canvas : window;
      target.removeEventListener(name, handler);
    }
  }
}

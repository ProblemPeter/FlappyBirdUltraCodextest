export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.jumpQueued = false;
    this.pauseQueued = false;
    this.holdActive = false;
    this.swipeLeft = false;
    this.swipeRight = false;
    this.touchStart = null;
    this.handlers = [];
  }

  init() {
    const onKeyDown = (event) => {
      this.keys.add(event.code);
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) this.jumpQueued = true;
      if (event.code === 'KeyP' || event.code === 'Escape') this.pauseQueued = true;
      if (event.code === 'KeyB') this.swipeRight = true;
    };
    const onKeyUp = (event) => this.keys.delete(event.code);

    const onPointerDown = (event) => {
      this.jumpQueued = true;
      this.holdActive = true;
      this.touchStart = { x: event.clientX, y: event.clientY };
    };
    const onPointerMove = (event) => {
      if (!this.touchStart) return;
      const dx = event.clientX - this.touchStart.x;
      if (Math.abs(dx) > 65) {
        if (dx > 0) this.swipeRight = true;
        else this.swipeLeft = true;
        this.touchStart = { x: event.clientX, y: event.clientY };
      }
    };
    const onPointerUp = () => {
      this.holdActive = false;
      this.touchStart = null;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    this.canvas.addEventListener('pointerdown', onPointerDown);
    this.canvas.addEventListener('pointermove', onPointerMove);
    this.canvas.addEventListener('pointerup', onPointerUp);
    this.canvas.addEventListener('pointercancel', onPointerUp);

    this.handlers.push(
      ['keydown', onKeyDown, window],
      ['keyup', onKeyUp, window],
      ['pointerdown', onPointerDown, this.canvas],
      ['pointermove', onPointerMove, this.canvas],
      ['pointerup', onPointerUp, this.canvas],
      ['pointercancel', onPointerUp, this.canvas],
    );
  }

  consumeJump() {
    const v = this.jumpQueued;
    this.jumpQueued = false;
    return v;
  }

  consumePause() {
    const v = this.pauseQueued;
    this.pauseQueued = false;
    return v;
  }

  consumeSwipe() {
    const payload = { left: this.swipeLeft, right: this.swipeRight };
    this.swipeLeft = false;
    this.swipeRight = false;
    return payload;
  }

  dispose() {
    for (const [name, handler, target] of this.handlers) target.removeEventListener(name, handler);
  }
}

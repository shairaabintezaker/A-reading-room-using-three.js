export class KeyboardController {
  constructor() {
    this.keys = {};
    this.onKeyDownCallbacks = new Map();

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      this.keys[key] = true;

      const callback = this.onKeyDownCallbacks.get(key);
      if (callback) {
        callback();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys[event.key.toLowerCase()] = false;
    });
  }

  isPressed(key) {
    return Boolean(this.keys[key.toLowerCase()]);
  }

  onKeyDown(key, callback) {
    this.onKeyDownCallbacks.set(key.toLowerCase(), callback);
  }
}

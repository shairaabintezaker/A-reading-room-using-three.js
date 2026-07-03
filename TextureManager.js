import * as THREE from "three";

export class TextureManager {
  constructor() {
    this.cache = new Map();
  }

  load(path, repeatX = 1, repeatY = 1) {
    const cacheKey = `${path}_${repeatX}_${repeatY}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const texture = new THREE.TextureLoader().load(
      path,
      () => console.log("Loaded:", path),
      undefined,
      () => console.error("Failed texture:", path)
    );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.colorSpace = THREE.SRGBColorSpace;

    this.cache.set(cacheKey, texture);
    return texture;
  }
}

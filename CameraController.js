import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class CameraController {
  constructor(camera, renderer, keyboard) {
    this.camera = camera;
    this.keyboard = keyboard;
    this.speed = 0.07;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.target.set(0, 1.4, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI /2.05;
    this.controls.update();
  }

  update() {
    this.updateMovement();
    this.controls.update();
  }

  updateMovement() {
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, this.camera.up).normalize();

    if (this.keyboard.isPressed("w")) {
      this.camera.position.addScaledVector(forward, this.speed);
      this.controls.target.addScaledVector(forward, this.speed);
    }

    if (this.keyboard.isPressed("s")) {
      this.camera.position.addScaledVector(forward, -this.speed);
      this.controls.target.addScaledVector(forward, -this.speed);
    }

    if (this.keyboard.isPressed("a")) {
      this.camera.position.addScaledVector(right, -this.speed);
      this.controls.target.addScaledVector(right, -this.speed);
    }

    if (this.keyboard.isPressed("d")) {
      this.camera.position.addScaledVector(right, this.speed);
      this.controls.target.addScaledVector(right, this.speed);
    }
    if (this.keyboard.isPressed("arrowup")) {
  this.camera.position.y += this.speed;
  this.controls.target.y += this.speed;
}

if (this.keyboard.isPressed("arrowdown")) {
  this.camera.position.y -= this.speed;
  this.controls.target.y -= this.speed;
}
    
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -5.2, 5.2);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -5.2, 5.2);
    this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, 1.1, 3.7);
    this.controls.target.x = THREE.MathUtils.clamp(this.controls.target.x, -5.2, 5.2);
this.controls.target.z = THREE.MathUtils.clamp(this.controls.target.z, -5.2, 5.2);
this.controls.target.y = THREE.MathUtils.clamp(this.controls.target.y, 1.1, 3.7);
  }

  
}

import * as THREE from "three";

import { TextureManager } from "../utils/TextureManager.js";
import { KeyboardController } from "./KeyboardController.js";
import { CameraController } from "./CameraController.js";
import { DoorModel } from "../objects/DoorModel.js";
import { Lights } from "../objects/Lights.js";
import { Room } from "../objects/Room.js";
import { ReadingTable } from "../objects/ReadingTable.js";
import { Chair } from "../objects/Chair.js";
import { Bookshelf } from "../objects/Bookshelf.js";
import { DeskLamp } from "../objects/DeskLamp.js";
import { WindowView } from "../objects/WindowView.js";
import { TableItems } from "../objects/TableItems.js";
import { Rug } from "../objects/Rug.js";
import { PlantModel } from "../objects/PlantModel.js";
import { LightBeams } from "../objects/LightBeams.js";
import { FireplaceModel } from "../objects/FireplaceModel.js";
import { ClockModel } from "../objects/ClockModel.js";
import { ACModel } from "../objects/ACModel.js";

export class App {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.textureManager = new TextureManager();
    this.keyboard = new KeyboardController();

    this.cameraController = null;

    this.isDay = true;
    this.lampOn = true;

    this.lights = null;
    this.readingTable = null;
    this.windowView = null;
    this.lightBeams = null;
    this.fireplaceModel = null;
    this.deskLamp = null;
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControllers();
    this.createWorld();
    this.setupKeyboardActions();
    this.setupResizeHandler();

    this.setDayMode();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202026);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 2.2, 7);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    document.body.appendChild(this.renderer.domElement);
  }

  createControllers() {
    this.cameraController = new CameraController(this.camera, this.renderer, this.keyboard);
  }

  createWorld() {
    this.lights = new Lights(this.scene);
    new ACModel(this.scene);
    new Room(this.scene, this.textureManager);
    this.readingTable = new ReadingTable(this.scene, this.textureManager);
    new Chair(this.scene, this.textureManager);
    new Bookshelf(this.scene, this.textureManager);
    this.deskLamp = new DeskLamp(this.scene, this.lights);
    this.windowView = new WindowView(this.scene);
    new TableItems(this.scene);
    new Rug(this.scene);
    new PlantModel(this.scene);
    this.lightBeams = new LightBeams(this.scene);
    this.fireplaceModel = new FireplaceModel(this.scene);
    new ClockModel(this.scene);
    new DoorModel(this.scene);
  }

  setupKeyboardActions() {
    this.keyboard.onKeyDown("j", () => this.setDayMode());
    this.keyboard.onKeyDown("n", () => this.setNightMode());

    this.keyboard.onKeyDown("l", () => {
      this.lampOn = !this.lampOn;
      this.lights.setLamp(this.lampOn, this.isDay);
    });
     this.renderer.domElement.oncontextmenu = (event) => {
  event.preventDefault();
  this.readingTable.changeTexture();
};
    this.keyboard.onKeyDown("i", () => {
  this.lights.changeLampIntensity(1);
});

this.keyboard.onKeyDown("k", () => {
  this.lights.changeLampIntensity(-1);
});
  }

  setDayMode() {
    this.isDay = true;
    this.scene.background = new THREE.Color(0x6f8fb0);

    this.lights.setDayMode(this.lampOn);
    this.windowView.setDayMode();
    this.lightBeams.setDayMode();
  }

  setNightMode() {
    this.isDay = false;
    this.scene.background = new THREE.Color(0x050816);

    this.lights.setNightMode(this.lampOn);
    this.windowView.setNightMode();
    this.lightBeams.setNightMode();
  }

  setupResizeHandler() {
    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    this.cameraController.update();
    this.lights.updateMovingLight(time);
    this.lightBeams.update(time, this.isDay);

    if (this.fireplaceModel) {
      this.fireplaceModel.update();
    }

    if (this.deskLamp) {
      this.deskLamp.update(this.keyboard);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

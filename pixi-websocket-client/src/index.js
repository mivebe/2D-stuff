import * as PIXI from 'pixi.js';
import { io } from "socket.io-client";
import assetMap from './assetMap.json';
import Background from './features/Background';
import ProgressBar from './features/ProgressBar';
import CircularProgressBar from './features/CircularProgressBar';
import LoadingScreen from './features/LoadingScreen';

class App {
  constructor() {
    this.canvas = document.getElementById('main');
    this.socket = io('http://localhost:3001/', { timeout: 10000 }); // TODO env

    this.app = new PIXI.Application();
    this.stage = this.app.stage;
    this.stage.label = 'Stage';

    window.PIXI = PIXI;
    window.getApp = () => this;  // For Dev accessibility
    window.getStage = () => this.stage; // For feature default container ( Background )
    globalThis.__PIXI_APP__ = this.app; // For Pixi Dev Tools extension

    this.features = {};

    window.onresize = this._handleResize.bind(this);
  }

  async init() {
    const initOptions = {
      resizeTo: window,
      canvas: this.canvas,
      antialias: true,
      background: '#335533',
    };

    await this.app.init(initOptions);

    this._attachListeners();
    await this.loadAssets();
    this.initScene();
  }

  _attachListeners() {
    this.socket.on('message', text => {
      const el = document.createElement('li');
      el.innerHTML = text;
      el.style.backgroundColor = 'transparent';
      document.querySelector('ul').appendChild(el);
    });

    let btn = document.querySelector('button');
    btn.addEventListener('click', () => {
      const text = document.querySelector('input').value;
      this.socket.emit('message', text);
    });
  }

  async loadAssets() {
    await PIXI.Assets.init({ manifest: assetMap });

    this.features['progressBar'] = new CircularProgressBar({ current: 20, autoStart: true });

    await PIXI.Assets.loadBundle('loading-scene', p => this.features.progressBar.update(p * 100));

    this.features.progressBar.hide({ removeAfter: true });
    this.features['background'] = new Background(Background.TYPES.SINGLE);
    this.features['loadingScreen'] = new LoadingScreen();

    PIXI.Assets.loadBundle('main-scene', p => this.features.loadingScreen.update(p * 100));
  }

  initScene() {



  }

  _handleResize() {
    Object.values(this.features).forEach(f => f.onResize?.());
  }
}

window.onload = () => new App().init();
screen.orientation.addEventListener("change", (event) => {
  const type = event.target.type;
  const angle = event.target.angle;
  console.log(`%cScreenOrientation change: ${type}, ${angle} degrees.`, 'color: yellow');
});
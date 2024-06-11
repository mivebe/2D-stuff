import * as PIXI from 'pixi.js';
import { io } from "socket.io-client";

class App {
  constructor() {
    this.canvas = document.getElementById('main');
    this.socket = io('http://localhost:3001/'); // TODO env

    this.app = new PIXI.Application();
    this.stage = this.app.stage;

    window.PIXI = PIXI;
    window.app = this.app;
    console.log('APP', app);
  }

  async init() {
    const initOptions = {
      resizeTo: window,
      canvas: this.canvas,
      antialias: true,
      background: '#3D105C'
    };

    this.app.init(initOptions);

    this.attachListeners();
    this.loadAssets();
    this.initScene();
  }

  attachListeners() {
    this.socket.on('message', text => {
      const el = document.createElement('li');
      el.innerHTML = text;
      el.style.backgroundColor = 'transparent';
      document.querySelector('ul').appendChild(el);
    });

    let btn = document.querySelector('button');
    btn.addEventListener('click', () => {
      const text = document.querySelector('input').value;
      console.log(text);
      this.socket.emit('message', text);
    });
  }

  loadAssets() {
    // PIXI.Assets
  }

  initScene() {
    const graphic = new PIXI.Graphics();
    graphic.fill(0x335533);
    graphic.rect(150, 150, 200, 300);
    this.app.stage.addChild(graphic);
  }
}

window.onload = () => new App().init();
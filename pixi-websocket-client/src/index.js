import * as PIXI from 'pixi.js';
import { io } from "socket.io-client";

class App {
  async init() {
    const canvas = document.getElementById('main');
    const socket = io('http://localhost:3001/');

    const app = new PIXI.Application({
      resizeTo: window,
      view: canvas,
      antialias: true,
      background: '#1099bb'
    });
    window.app = app;
    console.log('APP', app);

    const graphic = new PIXI.Graphics();
    graphic.beginFill(0x335533);
    graphic.drawRect(150, 150, 200, 300);
    app.stage.addChild(graphic)

    socket.on('message', text => {
      const el = document.createElement('li');
      el.innerHTML = text;
      el.style.backgroundColor = 'transparent';
      document.querySelector('ul').appendChild(el);
    });

    let btn = document.querySelector('button');
    btn.addEventListener('click', () => {
      const text = document.querySelector('input').value;
      console.log(text);
      socket.emit('message', text);
    });
  }

}

window.onload = () => new App().init();
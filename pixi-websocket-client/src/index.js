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
    })

    console.log('asd');

    socket.on('message', text => {
      const el = document.createElement('li');
      el.innerHTML = text;
      document.querySelector('ul').appendChild(el);
    })

    let btn = document.querySelector('button');
    btn.addEventListener('click', () => {
      const text = document.querySelector('input').value;
      console.log(text);
      socket.emit('message', text);
    })
  }

}

window.onload = () => new App().init();
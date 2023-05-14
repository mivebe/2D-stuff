import * as PIXI from 'pixi.js';
import '../styles/index.css';
import shaderCode from './shaders/smoke.frag';

class App {
  async init() {
    const canvas = document.getElementById('main')

    const app = new PIXI.Application({
      resizeTo: window,
      view: canvas,
      antialias: true,
      background: '#1099bb'
    })

    const { stage, renderer } = app;
    const { innerWidth: width, innerHeight: height } = window;

    const uniforms = {
      res: [width, height],
      time: 0.0,
      alpha: 1.0,
      speed: [0.7, 0.4],
      shift: 1.6,
      clusters: 8.0,
      density: 1.0,
    }

    const smokeShader = new PIXI.Filter('', shaderCode, uniforms);
    smokeShader.autoFit = false;

    const bg = PIXI.Sprite.from('../assets/images/background.jpg');
    bg.width = width;
    bg.height = height;
    bg.filters = [smokeShader];
    stage.addChild(bg);

    const logo = PIXI.Sprite.from('../assets/images/orichalcos.png');
    logo.x = width / 2;
    logo.y = height / 2;
    logo.anchor.set(0.5);
    logo.blendMode = PIXI.BLEND_MODES.ADD;
    stage.addChild(logo);

    let delta = 0

    function tick() {
      smokeShader.uniforms.time = delta;
      delta += 0.01;

      renderer.render(stage);
      requestAnimationFrame(tick);
    }

    tick()
  }

}

window.onload = () => new App().init();

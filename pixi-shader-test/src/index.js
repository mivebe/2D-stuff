import * as PIXI from 'pixi.js';
import '../styles/index.css';
import smokeCode from './shaders/smoke.frag';
import lightCode from './shaders/light.frag';

class App {
  async init() {
    const canvas = document.getElementById('main')

    const app = new PIXI.Application({
      resizeTo: window,
      view: canvas,
      antialias: true,
      background: '#1099bb',
      backgroundAlpha: 0.2,
    })

    const { stage, renderer } = app;
    const { innerWidth: width, innerHeight: height } = window;

    window.addEventListener('pointermove', e => lightUniforms.mouse = [e.x, e.y])

    const smokeUniforms = {
      res: [width, height],
      time: 0.0,
      alpha: 1.0,
      speed: [0.7, 0.4],
      shift: 1.6,
      clusters: 8.0,
      density: 1.0,
    }

    const lightUniforms = {
      res: [width, height],
      mouse: [0.0, 0.0],
      time: 0.0,
    }

    const colorMatrix = new PIXI.filters.ColorMatrixFilter();
    const smokeShader = new PIXI.Filter('', smokeCode, smokeUniforms);
    const lightShader = new PIXI.Filter('', lightCode, lightUniforms);
    smokeShader.autoFit = false;
    lightShader.autoFit = false;

    const bg = PIXI.Sprite.from('../assets/images/background.jpg');
    bg.width = width;
    bg.height = height;
    bg.filters = [colorMatrix, lightShader];
    colorMatrix.contrast(2);
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
      lightShader.uniforms.time = delta;
      delta += 0.01;

      renderer.render(stage);
      requestAnimationFrame(tick);
    }

    tick()
  }

}

window.onload = () => new App().init();

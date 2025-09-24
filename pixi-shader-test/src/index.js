import { Application, Geometry, Mesh, Shader } from 'pixi.js';
import '../styles/index.css';
import sunCode from './shaders/sun.frag';
import sunVert from './shaders/sun.vert';
import { Howl } from 'howler';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

class App {
  async init() {
    const app = new Application();
    await app.init({
      resizeTo: window,
      preference: 'webgl',
    });
    
    document.body.appendChild(app.canvas);

    const shader = Shader.from({
      gl: {
        vertex: sunVert,
        fragment: sunCode,
      },
      resources: {
        shaderToyUniforms: {
          uResolution: { value: [app.screen.width, app.screen.height, 1], type: 'vec3<f32>' },
          uTime: { value: 0, type: 'f32' },
          uPulse: { value: 0.8, type: 'f32' },
          uColor: { value: [1., 1., 1.], type: 'vec3<f32>' },
          uFuzz: { value: 1.0, type: 'f32' },
          uScale: { value: 1.0, type: 'f32' }, 
          uGlow: { value: 4, type: 'f32' },
          uClearCenter: { value: 0.35, type: 'f32' },
          uClearRadius: { value: 0.4, type: 'f32' },
          uCenterColor: { value: [.0, .0, .0, .1], type: 'vec4<f32>' },
          uWaveDensity: { value: 1., type: 'i32' },
          uWaveTexture: { value: 1.3, type: 'f32' },
        },
      },
    });

    const quadGeometry = new Geometry({
      attributes: {
        aPosition: new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]),
        aUV: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      },
      indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3]),
    });

    const quad = new Mesh({
      geometry: quadGeometry,
      shader,
    });

    quad.width = app.screen.width;
    quad.height = app.screen.height;
    app.stage.addChild(quad);

    const startAudio = () => {
      const sound = new Howl({
          src: ['../assets/sounds/music_level_2.mp4'],
          html5: true,
          loop: true,
      });

      const soundNode = sound._sounds[0]._node;      
      
      const audioMotion = new AudioMotionAnalyzer(null, {
          source: soundNode,
          useCanvas: false,
          fftSize: 2048,
      });
      
      sound.play();
     
      const PUMP_FACTOR = 7.0;
      
      let smoothedVolume = 0;
      let smoothedTrebleVolume = 0;
      let pulseStrength = 0;
      let pulseStrengthTreble = 0;

      const SMOOTHING_FACTOR = 0.05;
      const DECAY_FACTOR = 0.98;

      app.ticker.add(() => {
          const uniforms = shader.resources.shaderToyUniforms.uniforms;
          const averageVolume = audioMotion.getEnergy(30,50);
          const averageTrebleVolume = audioMotion.getEnergy(1500, 5000);

          const volumeBaseLine = 0.8;
          
          let normalizedVolume = volumeBaseLine;
          if (averageVolume > volumeBaseLine) {
            normalizedVolume = averageVolume;
          }

          smoothedVolume = smoothedVolume * (1 - SMOOTHING_FACTOR) + normalizedVolume * SMOOTHING_FACTOR;
          
          pulseStrength = pulseStrength * DECAY_FACTOR;
          if (smoothedVolume > pulseStrength) {
              pulseStrength = smoothedVolume;
          }

          const trebleVolumeBaseLine = 0.7;
          let normalizdeTreble = trebleVolumeBaseLine;
          if (averageTrebleVolume > trebleVolumeBaseLine) {
            normalizdeTreble = averageTrebleVolume;
          }
          
          smoothedTrebleVolume = smoothedTrebleVolume * (1 - SMOOTHING_FACTOR) + normalizdeTreble * SMOOTHING_FACTOR;
          
          pulseStrengthTreble = pulseStrengthTreble * DECAY_FACTOR;
          if (smoothedTrebleVolume > pulseStrengthTreble) {
              pulseStrengthTreble = smoothedTrebleVolume;
          }

          uniforms.uTime += app.ticker.elapsedMS / 1000;
          uniforms.uPulse = - pulseStrength * PUMP_FACTOR * 0.9 + volumeBaseLine * PUMP_FACTOR;
          uniforms.uFuzz = pulseStrengthTreble * 2.5 - trebleVolumeBaseLine * 1.0;
          uniforms.uWaveTexture = pulseStrength * 2.0 - volumeBaseLine * 1.0;
          uniforms.uGlow = pulseStrengthTreble * 3.0 - trebleVolumeBaseLine * 1.0;
          
        });

      document.body.removeEventListener('click', startAudio);
    };

    document.body.addEventListener('click', startAudio);
    
    app.ticker.add(() => {
      const uniforms = shader.resources.shaderToyUniforms.uniforms;
      uniforms.uTime += app.ticker.elapsedMS / 1000;
      
      // const colorSpeed = 30.2;
      // uniforms.uColor = [
      //   (Math.sin(uniforms.uTime / 1000 * colorSpeed) + 1.0) / 2.0,
      //   (Math.sin(uniforms.uTime / 1000 * colorSpeed + 2.0) + 1.0) / 2.0,
      //   (Math.sin(uniforms.uTime / 1000 * colorSpeed + 4.0) + 1.0) / 2.0,
      // ]
    });

    app.renderer.on('resize', (width, height) => {
      shader.resources.shaderToyUniforms.uniforms.uResolution = [width, height, 1];
      quad.width = width;
      quad.height = height;
    });
  }
}

window.onload = () => new App().init();
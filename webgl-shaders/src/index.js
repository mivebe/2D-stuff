import '../styles/index.css';
import vertSource from '../shaders/twoTriangles.vert';

import circle from '../shaders/circle.frag';
import light from '../shaders/light.frag';
import polygon from '../shaders/polygon.frag';
import rectangle from '../shaders/rectangle.frag';
import rotation from '../shaders/rotation.frag';
import scaling from '../shaders/scaling.frag';
import sineCosine from '../shaders/sineCosine.frag';
import smoke from '../shaders/smoke.frag';

// raw .frag library rendered on a fullscreen quad. every shader reads some
// subset of u_resolution / u_time / u_mouse, set only when the program has them.
const SHADERS = [
  { name: 'polygon', source: polygon },
  { name: 'circle', source: circle },
  { name: 'rectangle', source: rectangle },
  { name: 'rotation', source: rotation },
  { name: 'scaling', source: scaling },
  { name: 'sineCosine', source: sineCosine },
  { name: 'light', source: light },
  { name: 'smoke', source: smoke },
];

const canvas = document.querySelector('canvas');
/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext('webgl2');
if (!gl) throw new Error('WebGL2 is not supported');

const mouse = { x: 0, y: 0 };
window.addEventListener('pointermove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function link(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

// fullscreen quad shared by every program
const positions = new Float32Array([-1, 1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const vertexShader = compile(gl.VERTEX_SHADER, vertSource);

let active = null;

function selectShader(entry) {
  const status = document.getElementById('status');
  try {
    const fragmentShader = compile(gl.FRAGMENT_SHADER, entry.source);
    const program = link(vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    active = {
      program,
      vao,
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uTime: gl.getUniformLocation(program, 'u_time'),
      uMouse: gl.getUniformLocation(program, 'u_mouse'),
    };
    status.textContent = '';
    status.classList.remove('error');
  } catch (err) {
    active = null;
    status.textContent = `${entry.name}: ${err.message}`;
    status.classList.add('error');
  }
}

function resize() {
  const width = canvas.clientWidth | 0;
  const height = canvas.clientHeight | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

const start = performance.now();

function render() {
  resize();
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (active) {
    gl.useProgram(active.program);
    gl.bindVertexArray(active.vao);
    if (active.uResolution) gl.uniform2f(active.uResolution, gl.canvas.width, gl.canvas.height);
    if (active.uTime) gl.uniform1f(active.uTime, (performance.now() - start) / 1000);
    if (active.uMouse) gl.uniform2f(active.uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
    gl.bindVertexArray(null);
    gl.useProgram(null);
  }

  requestAnimationFrame(render);
}

// shader picker
const picker = document.getElementById('picker');
SHADERS.forEach((entry, i) => {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = entry.name;
  picker.appendChild(option);
});
picker.addEventListener('change', () => selectShader(SHADERS[Number(picker.value)]));

// optional ?shader=<name> deep link, falls back to the first entry
const requested = new URLSearchParams(location.search).get('shader');
const initial = Math.max(0, SHADERS.findIndex(s => s.name === requested));
picker.value = String(initial);
selectShader(SHADERS[initial]);
requestAnimationFrame(render);

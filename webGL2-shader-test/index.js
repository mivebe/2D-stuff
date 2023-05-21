const canvas = document.querySelector('canvas');
/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext('webgl2');
if (!gl) throw 'WebGL2 is not supported';

function resizeCanvasToDisplay(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}

function clear() {
  //resize
  resizeCanvasToDisplay(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

const vertexShaderSource2 = fetch('./shaders/twoTriangles.vert').then((res) => res.text());
var vertexShaderSource = `#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

in vec2 a_position;

// all shaders have a main function
void main() {

  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource2 = fetch('./shaders/polygon.frag').then((res) => res.text());
var fragmentShaderSource = `#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535;
uniform vec2 u_resolution;
out vec4 outColor;

float polyShape(vec2 position, float radius, float sides) {
  position = position * 2.0 - 1.0;
  float angle = atan(position.x, position.y);
  float slice = PI * 2.0 / sides;
  
  return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

void main() {
  vec2 position = gl_FragCoord.xy / u_resolution.x;
  
  float polygon = polyShape(position, 0.6, 6.0);
  
  vec3 color = vec3(polygon);
  
  outColor = vec4(color, 1.0);
  // outColor = vec4(1.0,0.1,0.3, 1.0);
}`;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource2);

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var program = createProgram(gl, vertexShader, fragmentShader);

// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

// Create a buffer and put three 2d clip space points in it
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var positions = [
  -1, 1,
  1, 1,
  -1, -1,
  -1, -1,
  1, -1,
  1, 1
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
var vao = gl.createVertexArray();

// and make it the one we're currently working with
gl.bindVertexArray(vao);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

gl.bindVertexArray(null);
gl.useProgram(null);


function render() {
  clear();

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width / 2, gl.canvas.height / 2);
  // gl.uniform4f(colorLocation, 0.1, 0.7, 0.3, 1);

  // draw
  var primitiveType = gl.TRIANGLES;
  // var primitiveType = gl.TRIANGLE_STRIP;
  var offset = 0;
  var count = positions.length / 2;
  gl.drawArrays(primitiveType, offset, count);

  gl.bindVertexArray(null);
  gl.useProgram(null)

  requestAnimationFrame(render)
}

requestAnimationFrame(render);
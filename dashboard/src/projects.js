// single source of truth for the dashboard.
// the app uses id/title/blurb/category to list + iframe each project;
// scripts/build-projects.mjs uses source/tool to build each one into
// public/projects/<id>/ so the dashboard can embed it.
export const projects = [
  {
    id: 'pixi-websocket-client',
    title: 'Pixi Websocket Client',
    blurb: 'Pixi.js v8 websocket template: socket.io messaging, asset manifest, circular progress loader and responsive background.',
    category: 'Pixi',
    source: '../pixi-websocket-client',
    tool: 'webpack',
  },
  {
    id: 'pixi-shader-test',
    title: 'Pixi Shader Filters',
    blurb: 'GLSL fragment shaders (smoke, light) applied as Pixi.js sprite filters over a background, animated by time and pointer.',
    category: 'Pixi',
    source: '../pixi-shader-test',
    tool: 'webpack',
  },
  {
    id: 'pixi-test',
    title: 'Pixi Sandbox',
    blurb: 'Sprite rendering with pointer and keyboard movement, a swingable sword, bullets with collision and sound effects.',
    category: 'Pixi',
    source: '../pixi-test',
    tool: 'webpack',
  },
  {
    id: 'webgl-shaders',
    title: 'WebGL2 Shader Gallery',
    blurb: 'A pickable gallery of raw WebGL2 fragment shaders rendered on a fullscreen quad, driven by resolution, time and mouse uniforms.',
    category: 'WebGL',
    source: '../webgl-shaders',
    tool: 'webpack',
  },
]

export function getProject(id) {
  return projects.find((p) => p.id === id)
}

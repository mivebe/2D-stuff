# 2D-stuff

A collection of 2D graphics experiments spanning Pixi.js sandboxes, GLSL shader
filters, and raw WebGL2 rendering, gathered under a unified dashboard. Mirrors the
dashboard approach from [3D-stuff](https://github.com/mivebe/3D-stuff).

## Dashboard

The [dashboard](dashboard/) lists every project and embeds each one as an isolated
iframe. Build and run it locally:

```
cd dashboard
npm install
npm run build:all   # build every project + the dashboard shell
npm run dev          # work on the dashboard shell
```

## Projects

### Pixi.js

| Project | Description | Tech |
|---|---|---|
| [Pixi Websocket Client](pixi-websocket-client/) | Websocket template: socket.io messaging, asset manifest, bundled loading, circular progress loader, responsive background | Pixi.js v8, socket.io, webpack |
| [Pixi Shader Filters](pixi-shader-test/) | GLSL fragment shaders (smoke, light) applied as sprite filters over a background, animated by time and pointer | Pixi.js v7, GLSL, webpack |
| [Arena Survivor](arena-survivor/) | Top-down arena survivor: WASD/gamepad movement, mouse-aimed gun and heavy melee sword, four enemy archetypes, XP-driven level-up upgrades over escalating waves | Pixi.js v8, TypeScript, Vite |

### WebGL

| Project | Description | Tech |
|---|---|---|
| [WebGL2 Shader Gallery](webgl-shaders/) | Pickable gallery of raw WebGL2 fragment shaders rendered on a fullscreen quad, driven by resolution, time and mouse uniforms | raw WebGL2, GLSL, webpack |

## Architecture

Each project is a self-contained npm package that builds with webpack 5 to a
static `dist/`:

```
npm install
npm run start   # webpack dev server
npm run build   # static build into dist/
```

The webpack configs share one shape (relative `app.js`, `style-loader`/`css-loader`
for CSS, `asset/source` for `.frag`/`.vert`/`.glsl`, `copy-webpack-plugin` for
runtime assets). Pixi.js is on v8 where the code targets it and v7 elsewhere; the
v8 migration of the v7 projects is the remaining unification step.

The dashboard is a Vite + React shell. Project metadata lives in
[`dashboard/src/projects.js`](dashboard/src/projects.js) as the single source of
truth. Each project builds independently into `dashboard/public/projects/<id>/`
and is embedded by id. See [`dashboard/README.md`](dashboard/README.md) for the
full set of scripts.

## Author

[@mivebe](https://github.com/mivebe)

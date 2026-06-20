# 2D-stuff

A collection of 2D graphics experiments built with Pixi.js and raw WebGL2.
The [`dashboard/`](dashboard/) folder lists every project and embeds each one as
an isolated iframe, mirroring the approach in
[3D-stuff](https://github.com/mivebe/3D-stuff).

## Projects

| Project | Stack | What it is |
|---|---|---|
| [pixi-websocket-client](pixi-websocket-client/) | Pixi.js v8, socket.io | Websocket client template: asset manifest, bundled loading, circular progress, responsive background |
| [pixi-shader-test](pixi-shader-test/) | Pixi.js v7 | GLSL fragment shaders applied as sprite filters (smoke, light), driven by time and pointer |
| [pixi-test](pixi-test/) | Pixi.js v7 | Sandbox: sprite movement, pointer/keyboard controls, sword, bullets with collision, sounds |
| [webgl-shaders](webgl-shaders/) | raw WebGL2 | Pickable gallery of fragment shaders rendered on a fullscreen quad |

## Shared scaffolding

Every project is a self-contained npm package that builds with webpack 5 to a
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

## Dashboard

```
cd dashboard
npm install
npm run build:all     # build every project + the dashboard shell
npm run thumbnails    # screenshot each built project for the cards (needs Chrome)
npm run dev           # work on the dashboard shell
```

Project metadata lives in [`dashboard/src/projects.js`](dashboard/src/projects.js).
Each project builds into `dashboard/public/projects/<id>/` and is embedded by id.
See [`dashboard/README.md`](dashboard/README.md) for details.

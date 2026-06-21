# Pixi Shader Filters

GLSL fragment shaders (smoke, light) applied as Pixi.js sprite filters over a
background, animated by time and pointer.

### Install
```
npm install
```

### Start
```
npm run start
```

### Build
```
npm run build
```

Shaders live as `.frag`/`.vert` files and are imported directly, parsed by the
webpack `asset/source` loader rather than inlined as HTML or JS strings. If you
prefer another setup, swap the import source; the structure stays the same.

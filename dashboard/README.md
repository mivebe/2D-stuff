# 2D Portfolio Dashboard

A Vite + React launcher that lists every project in this repo and embeds each one
as an isolated iframe. Mirrors the dashboard approach from
[3D-stuff](https://github.com/mivebe/3D-stuff).

Project metadata lives in [`src/projects.js`](src/projects.js) (the single source
of truth). Each project builds independently into `public/projects/<id>/`.

### Install
```
npm install
```

### Develop the dashboard shell
```
npm run dev
```

### Build everything (projects + dashboard)
```
npm run build:all
```

### Useful scripts
- `npm run build:projects` - build each project into `public/projects/<id>/` (pass ids to limit, e.g. `npm run build:projects pixi-test`).
- `npm run thumbnails` - screenshot each built project into `public/thumbnails/<id>.jpg`. Needs Chrome; set `CHROME_PATH` if it is not in a default location.
- `npm run build` - build only the dashboard shell (assumes projects are already built).

Cards show a placeholder when a thumbnail is missing, so the dashboard is usable
before thumbnails are generated.

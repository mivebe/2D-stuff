# Pixi Shader Tests

### Install
```javascript
npm install
```

### Start
```javascript
npm run start
```

### Build
```javascript
npm run build
```

# Description
This is a project I made for testing application of GLSL fragment shaders as filters of sprite images with PIXI.js.

I think putting shaders in .html files is boring and untidy and I also dont feel like putting them in the .js file as multiline string.
I happen to have my environment set up for reading and writing them as .frag and .vert files so I decided to import them directly and parse them with Webpack raw-loader.
If you happen to choose any other option the same logic and structure should apply, just change the source of the code.
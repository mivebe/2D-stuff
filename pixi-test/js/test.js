import * as PIXI from 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.0.4/pixi.min.mjs';

console.log(PIXI);

window.p = PIXI;

PIXI.Assets.add('asd1', './images/r1.png')
PIXI.Assets.add('asd2', './images/r2.png')
PIXI.Assets.add('asd3', './images/r3.png')
PIXI.Assets.add('asd4', './images/r4.png')
PIXI.Assets.add('asd5', './images/r5.png')
PIXI.Assets.add('asd6', './images/r6.png')

PIXI.Assets.load('asd1').then(texture => {
    console.log(texture);
});
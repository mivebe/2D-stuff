import *  as PIXI from './pixi.mjs'
import { handleKeyboardMovement } from './controls/keyboardInput.js';
import { move } from './controls/movement.js';
import { showProgress } from './utils.js';

let app;
let blue, red, sword
let assets = []
let bulletVelocity = 3
let bullets = []


window.onload = function () {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0xAAAAAA
    })

    const gameDiv = document.getElementById("main-container")
    gameDiv.appendChild(app.view)


    blue = PIXI.Sprite.from("./images/blue.png")
    blue.anchor.set(0.5)
    blue.x = app.view.width / 4;
    blue.y = app.view.height / 4;

    red = PIXI.Sprite.from("./images/red.png")
    red.anchor.set(0.5)
    red.x = app.view.width / 2;
    red.y = app.view.height / 4;

    sword = PIXI.Sprite.from("./images/sword.png")
    sword.anchor.set(0.5, 1)

    app.stage.addChild(blue)
    app.stage.addChild(red)

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (e) => {
        move(blue, e.global)
        move(sword, { x: e.global.x, y: e.global.y - 24 })
    });

    gameDiv.addEventListener('pointerdown', (e) => {
        e.preventDefault()
        console.log(e);
        e.which === 2 ? draw() : shoot()
    })

    gameDiv.addEventListener('wheel', (e) => swing(e.deltaY))

    // handleContorollerInput()
    app.ticker.add(gameLoop)
    app.ticker.add(() => {
        let delta = handleKeyboardMovement();
        let position = {
            x: red.x + delta.x,
            y: red.y + delta.y,
        };
        move(red, position);
    });

    // app.ticker.add(() => {
    //     let [d1, d2] = handleContorollerInput2();
    //     if (d1) {
    //         let p1 = {
    //             x: red.x + d1.x,
    //             y: red.y + d1.y,
    //         };

    //         move(red, p1);
    //     }

    //     if (d2) {
    //         let p2 = {
    //             x: blue.x + d2.x,
    //             y: blue.y + d2.y,
    //         };

    //         move(blue, p2);
    //     }
    // })

}
const drawSwordSound = new Audio('./sounds/drawSword.mp3');
const swordSwingSound = new Audio('./sounds/swordSwing.mp3');
swordSwingSound.volume = 0.2

function draw() {
    console.log("pull sword");

    sword.x = blue.x
    sword.y = blue.y - 24
    sword.angle = 0
    app.stage.addChild(sword)
    drawSwordSound.play()
}

function swing(delta) {
    console.log('swing');
    let step = delta > 0 ? 25 : -25
    sword.angle += step
    if (sword.angle > 65) { sword.angle = 65 }
    if (sword.angle < -65) { sword.angle = -65 }
    swordSwingSound.currentTime = 0
    swordSwingSound.play()
}

function shoot() {
    console.log("PEW");
    const audio = new Audio('./sounds/pew.mp3');
    audio.play();
    let bullet = createBullet()
    bullets.push(bullet)
}

function createBullet() {
    let bullet = PIXI.Sprite.from('images/green.png')
    bullet.anchor.set(0.5)
    bullet.x = blue.x
    bullet.y = blue.y
    app.stage.addChild(bullet)
    return bullet
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].position.y -= bulletVelocity
        if (bullets[i].position.y < 0) {
            app.stage.removeChild(bullets[i])
            bullets[i].destroy();
            bullets.splice(i, 1);
        }
    }
}

function detectCollision(a, b) {
    let boxA = a.getBounds();
    let boxB = b.getBounds();

    return boxA.x + boxA.width > boxB.x &&
        boxB.x + boxB.width > boxA.x &&
        boxA.y + boxA.height > boxB.y &&
        boxB.y + boxB.height > boxA.y;

}

const killSound = new Audio('./sounds/kill.mp3');
killSound.volume = 0.1

function gameLoop(delta) {

    updateBullets()
    for (let i = 0; i < bullets.length; i++) {
        if (detectCollision(bullets[i], red)) {
            console.log('collision');
            killSound.play();
        }
    }

}



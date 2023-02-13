import * as PIXI from 'pixi.js'

class App {
    async init() {
        const canvas = document.getElementById('main')

        const app = new PIXI.Application({
            resizeTo: window,
            view: canvas,
            antialias: true,
            background: '#1099bb'
        })

        console.log('asd');
    }
}

window.onload = () => new App().init();
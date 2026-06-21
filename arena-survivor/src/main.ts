import { Application } from 'pixi.js'
import { ARENA } from './config'
import { Game } from './core/Game'
import { initAudio } from './core/Audio'

async function boot() {
  const app = new Application()
  await app.init({
    width: ARENA.width,
    height: ARENA.height,
    background: ARENA.background,
    antialias: true,
  })

  const mount = document.getElementById('app')!
  mount.appendChild(app.canvas)

  initAudio()
  new Game(app)
}

boot()

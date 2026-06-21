import { Container, Graphics, Text } from 'pixi.js'
import { ARENA } from '../config'

// dimmed overlay shown on death. restart wiring lives in Game.
export class GameOverScreen {
  readonly view = new Container()
  private scoreText: Text

  constructor() {
    const dim = new Graphics()
      .rect(0, 0, ARENA.width, ARENA.height)
      .fill({ color: 0x000000, alpha: 0.6 })
    this.view.addChild(dim)

    const title = new Text({
      text: 'GAME OVER',
      style: { fill: 0xff5252, fontSize: 56, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    title.anchor.set(0.5)
    title.x = ARENA.width / 2
    title.y = ARENA.height / 2 - 50
    this.view.addChild(title)

    this.scoreText = new Text({
      text: 'Score 0',
      style: { fill: 0xffffff, fontSize: 26, fontFamily: 'monospace' },
    })
    this.scoreText.anchor.set(0.5)
    this.scoreText.x = ARENA.width / 2
    this.scoreText.y = ARENA.height / 2 + 12
    this.view.addChild(this.scoreText)

    const hint = new Text({
      text: 'press R or click to restart',
      style: { fill: 0xaaaaaa, fontSize: 18, fontFamily: 'monospace' },
    })
    hint.anchor.set(0.5)
    hint.x = ARENA.width / 2
    hint.y = ARENA.height / 2 + 58
    this.view.addChild(hint)

    this.view.visible = false
  }

  show(score: number) {
    this.scoreText.text = `Score ${score}`
    this.view.visible = true
  }

  hide() {
    this.view.visible = false
  }
}

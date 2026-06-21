import { Container, FederatedPointerEvent, Graphics, Text } from 'pixi.js'
import { ARENA } from '../config'
import type { Upgrade } from '../data/upgrades'

const CARD_W = 240
const CARD_H = 300
const GAP = 32

// modal upgrade picker shown on level-up. pick with 1/2/3 or a click.
// owns its own input while visible so it doesn't fight the play-state handlers.
export class LevelUpScreen {
  readonly view = new Container()
  private cardLayer = new Container()
  private options: Upgrade[] = []
  private onPick: ((u: Upgrade) => void) | null = null

  constructor() {
    const dim = new Graphics()
      .rect(0, 0, ARENA.width, ARENA.height)
      .fill({ color: 0x000000, alpha: 0.65 })
    this.view.addChild(dim)

    const title = new Text({
      text: 'LEVEL UP',
      style: { fill: 0xffe066, fontSize: 44, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    title.anchor.set(0.5)
    title.x = ARENA.width / 2
    title.y = ARENA.height / 2 - CARD_H / 2 - 56
    this.view.addChild(title)

    this.view.addChild(this.cardLayer)
    this.view.visible = false
    window.addEventListener('keydown', this.onKeyDown)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.view.visible) return
    const map: Record<string, number> = { Digit1: 0, Digit2: 1, Digit3: 2 }
    const i = map[e.code]
    if (i !== undefined && i < this.options.length) this.choose(i)
  }

  // show the dimmed backdrop + title with no cards yet (the reveal delay beat)
  showBackdrop() {
    this.cardLayer.removeChildren()
    this.options = []
    this.onPick = null
    this.view.visible = true
  }

  show(options: Upgrade[], onPick: (u: Upgrade) => void) {
    this.options = options
    this.onPick = onPick
    this.cardLayer.removeChildren()

    const totalW = options.length * CARD_W + (options.length - 1) * GAP
    const startX = (ARENA.width - totalW) / 2
    const y = (ARENA.height - CARD_H) / 2

    options.forEach((upgrade, i) => {
      const card = this.buildCard(upgrade, i)
      card.x = startX + i * (CARD_W + GAP)
      card.y = y
      this.cardLayer.addChild(card)
    })

    this.view.visible = true
  }

  private buildCard(upgrade: Upgrade, index: number): Container {
    const card = new Container()
    card.eventMode = 'static'
    card.cursor = 'pointer'

    const bg = new Graphics()
      .roundRect(0, 0, CARD_W, CARD_H, 12)
      .fill({ color: 0x232838 })
      .stroke({ width: 2, color: 0x4a5478 })
    card.addChild(bg)

    const hotkey = new Text({
      text: `${index + 1}`,
      style: { fill: 0x8892b0, fontSize: 20, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    hotkey.x = 14
    hotkey.y = 12
    card.addChild(hotkey)

    const name = new Text({
      text: upgrade.name,
      style: {
        fill: 0xffffff,
        fontSize: 24,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        wordWrap: true,
        wordWrapWidth: CARD_W - 32,
      },
    })
    name.anchor.set(0.5, 0)
    name.x = CARD_W / 2
    name.y = 80
    card.addChild(name)

    const desc = new Text({
      text: upgrade.description,
      style: {
        fill: 0xb8c0e0,
        fontSize: 17,
        fontFamily: 'monospace',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: CARD_W - 36,
      },
    })
    desc.anchor.set(0.5, 0)
    desc.x = CARD_W / 2
    desc.y = 150
    card.addChild(desc)

    // hover highlight + click to pick
    card.on('pointerover', () => bg.tint = 0xc9d4ff)
    card.on('pointerout', () => (bg.tint = 0xffffff))
    card.on('pointerdown', (e: FederatedPointerEvent) => {
      e.stopPropagation()
      this.choose(index)
    })
    return card
  }

  private choose(index: number) {
    const pick = this.options[index]
    const cb = this.onPick
    this.view.visible = false
    this.onPick = null
    if (pick && cb) cb(pick)
  }
}

import { Container, Graphics, Text } from 'pixi.js'
import { ARENA, PLAYER } from '../config'

export interface HudState {
  hp: number
  maxHp: number
  score: number
  wave: number
  level: number
  xp: number
  xpToNext: number
}

// hud: hp bar (top-left), xp bar (under it), wave (top-center), score (top-right).
export class Hud {
  readonly view = new Container()
  private hpFill = new Graphics()
  private hpFrame = new Graphics()
  private xpFill = new Graphics()
  private xpFrame = new Graphics()
  private scoreText: Text
  private waveText: Text
  private levelText: Text
  private banner: Text
  private bannerLife = 0
  private shownWave = 1
  private readonly bannerDuration = 1.4
  private readonly barWidth = 220
  private readonly hpHeight = 18
  private readonly xpHeight = 8

  constructor() {
    const x = ARENA.padding
    const y = ARENA.padding

    this.hpFrame
      .rect(x, y, this.barWidth, this.hpHeight)
      .stroke({ width: 2, color: 0x000000, alpha: 0.5 })
    this.xpFrame
      .rect(x, y + this.hpHeight + 4, this.barWidth, this.xpHeight)
      .stroke({ width: 1, color: 0x000000, alpha: 0.5 })
    this.view.addChild(this.hpFill, this.xpFill, this.hpFrame, this.xpFrame)

    this.levelText = new Text({
      text: 'Lv 1',
      style: { fill: 0xffe066, fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    this.levelText.x = x + this.barWidth + 8
    this.levelText.y = y + this.hpHeight - 4
    this.view.addChild(this.levelText)

    this.scoreText = makeText('Score 0')
    this.scoreText.anchor.set(1, 0)
    this.scoreText.x = ARENA.width - ARENA.padding
    this.scoreText.y = ARENA.padding
    this.view.addChild(this.scoreText)

    this.waveText = makeText('Wave 1')
    this.waveText.anchor.set(0.5, 0)
    this.waveText.x = ARENA.width / 2
    this.waveText.y = ARENA.padding
    this.view.addChild(this.waveText)

    this.banner = new Text({
      text: '',
      style: { fill: 0xffd54a, fontSize: 52, fontFamily: 'monospace', fontWeight: 'bold' },
    })
    this.banner.anchor.set(0.5)
    this.banner.x = ARENA.width / 2
    this.banner.y = ARENA.height / 2 - 120
    this.banner.alpha = 0
    this.view.addChild(this.banner)

    this.update({ hp: PLAYER.maxHp, maxHp: PLAYER.maxHp, score: 0, wave: 1, level: 1, xp: 0, xpToNext: 9 })
  }

  // animate the wave banner; called every frame with delta time
  tick(dtSeconds: number) {
    if (this.bannerLife <= 0) return
    this.bannerLife -= dtSeconds
    const k = Math.max(0, this.bannerLife / this.bannerDuration)
    this.banner.alpha = Math.min(1, k * 2) // quick fade-in feel via the *2, slow fade-out
    this.banner.scale.set(1.3 - 0.3 * k)
  }

  update(s: HudState) {
    const x = ARENA.padding
    const y = ARENA.padding

    // announce a freshly reached wave (but never wave 1 / restart)
    if (s.wave !== this.shownWave) {
      if (s.wave > this.shownWave) {
        this.banner.text = `WAVE ${s.wave}`
        this.bannerLife = this.bannerDuration
      }
      this.shownWave = s.wave
    }

    const hpRatio = Math.max(0, s.hp / s.maxHp)
    const color = hpRatio > 0.5 ? 0x4caf50 : hpRatio > 0.25 ? 0xffb300 : 0xe53935
    this.hpFill
      .clear()
      .rect(x, y, this.barWidth * hpRatio, this.hpHeight)
      .fill({ color })

    const xpRatio = s.xpToNext > 0 ? Math.max(0, Math.min(1, s.xp / s.xpToNext)) : 0
    this.xpFill
      .clear()
      .rect(x, y + this.hpHeight + 4, this.barWidth * xpRatio, this.xpHeight)
      .fill({ color: 0x42a5f5 })

    this.levelText.text = `Lv ${s.level}`
    this.scoreText.text = `Score ${s.score}`
    this.waveText.text = `Wave ${s.wave}`
  }
}

function makeText(text: string): Text {
  return new Text({
    text,
    style: { fill: 0xffffff, fontSize: 18, fontFamily: 'monospace', fontWeight: 'bold' },
  })
}

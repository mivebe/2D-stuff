import { Container, Graphics } from 'pixi.js'
import { ARENA, PLAYER } from '../config'
import type { Stats } from '../core/Stats'
import type { InputFrame, Vec2 } from '../input/Input'
import { drawShape } from './shapes'

// player avatar: a colored disc + an aim reticle showing facing.
// movement speed and max hp come from the runtime stats so upgrades take effect.
export class Player {
  readonly view = new Container()
  private body = new Graphics()
  private reticle = new Graphics()
  private stats: Stats
  aim: Vec2 = { x: 1, y: 0 }
  hp: number
  radius = PLAYER.radius
  private invuln = 0 // seconds of remaining i-frames

  get x() {
    return this.view.x
  }
  get y() {
    return this.view.y
  }

  constructor(stats: Stats) {
    this.stats = stats
    this.hp = stats.maxHp

    drawShape(this.body, 'circle', PLAYER.radius, PLAYER.color)
    this.drawReticle()

    this.view.addChild(this.reticle)
    this.view.addChild(this.body)
    this.view.x = ARENA.width / 2
    this.view.y = ARENA.height / 2
  }

  private drawReticle() {
    this.reticle
      .moveTo(0, 0)
      .lineTo(34, 0)
      .stroke({ width: 2, color: 0x66ccff, alpha: 0.8 })
    this.reticle.circle(34, 0, 4).fill({ color: 0x66ccff, alpha: 0.9 })
  }

  get invulnerable() {
    return this.invuln > 0
  }

  // returns true if the hit landed (not in i-frames)
  takeDamage(amount: number): boolean {
    if (this.invuln > 0) return false
    this.hp = Math.max(0, this.hp - amount)
    this.invuln = PLAYER.invulnSeconds
    return true
  }

  heal(amount: number) {
    this.hp = Math.min(this.stats.maxHp, this.hp + amount)
  }

  reset() {
    this.hp = this.stats.maxHp
    this.invuln = 0
    this.view.x = ARENA.width / 2
    this.view.y = ARENA.height / 2
    this.body.alpha = 1
  }

  update(frame: InputFrame, dtSeconds: number) {
    // move within the padded arena bounds
    this.view.x += frame.move.x * this.stats.moveSpeed * dtSeconds
    this.view.y += frame.move.y * this.stats.moveSpeed * dtSeconds
    const minX = ARENA.padding + PLAYER.radius
    const maxX = ARENA.width - ARENA.padding - PLAYER.radius
    const minY = ARENA.padding + PLAYER.radius
    const maxY = ARENA.height - ARENA.padding - PLAYER.radius
    this.view.x = Math.max(minX, Math.min(maxX, this.view.x))
    this.view.y = Math.max(minY, Math.min(maxY, this.view.y))

    // aim drives the reticle rotation
    this.aim = frame.aim
    this.reticle.rotation = Math.atan2(frame.aim.y, frame.aim.x)

    // blink while invulnerable
    if (this.invuln > 0) {
      this.invuln -= dtSeconds
      this.body.alpha = Math.floor(this.invuln * 12) % 2 === 0 ? 0.35 : 1
      if (this.invuln <= 0) this.body.alpha = 1
    }
  }
}

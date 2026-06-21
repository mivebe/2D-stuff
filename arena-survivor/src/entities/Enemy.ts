import { Container, Graphics } from 'pixi.js'
import type { Archetype } from '../data/archetypes'
import { drawShape } from './shapes'
import { Bullet } from './Bullet'

let nextId = 1

// base enemy driven entirely by its archetype. chase types beeline the player;
// ranged types hold a preferred distance and fire projectiles on a timer.
export class Enemy {
  readonly id = nextId++
  readonly view = new Container()
  readonly archetype: Archetype
  alive = true
  hp: number
  radius: number
  contactDamage: number
  private flash: Graphics // white overlay, alpha pulsed on hit
  private fireTimer: number

  constructor(archetype: Archetype, x: number, y: number) {
    this.archetype = archetype
    this.hp = archetype.hp
    this.radius = archetype.radius
    this.contactDamage = archetype.contactDamage
    // stagger first shot so a pack of ranged doesn't volley in unison
    this.fireTimer = (archetype.fireIntervalSeconds ?? 0) * Math.random()

    const body = new Graphics()
    drawShape(body, archetype.shape, archetype.radius, archetype.color)
    this.flash = new Graphics()
    drawShape(this.flash, archetype.shape, archetype.radius, 0xffffff)
    this.flash.alpha = 0

    this.view.addChild(body, this.flash)
    this.view.x = x
    this.view.y = y
  }

  get x() {
    return this.view.x
  }
  get y() {
    return this.view.y
  }

  takeDamage(amount: number) {
    this.hp -= amount
    this.flash.alpha = 0.85
    if (this.hp <= 0) this.alive = false
  }

  // returns any projectiles fired this frame (ranged only)
  update(dtSeconds: number, targetX: number, targetY: number): Bullet[] {
    const dx = targetX - this.view.x
    const dy = targetY - this.view.y
    const dist = Math.hypot(dx, dy) || 1
    const nx = dx / dist
    const ny = dy / dist

    let shots: Bullet[] = []
    if (this.archetype.behavior === 'ranged') {
      shots = this.updateRanged(dtSeconds, dist, nx, ny)
    } else {
      // chase straight in
      this.view.x += nx * this.archetype.speed * dtSeconds
      this.view.y += ny * this.archetype.speed * dtSeconds
    }

    if (this.flash.alpha > 0) this.flash.alpha = Math.max(0, this.flash.alpha - dtSeconds * 8)
    return shots
  }

  private updateRanged(dtSeconds: number, dist: number, nx: number, ny: number): Bullet[] {
    const preferred = this.archetype.preferredRange ?? 240
    const margin = 40
    // approach when too far, retreat when too close, hold in the band
    let dir = 0
    if (dist > preferred + margin) dir = 1
    else if (dist < preferred - margin) dir = -1
    this.view.x += nx * dir * this.archetype.speed * dtSeconds
    this.view.y += ny * dir * this.archetype.speed * dtSeconds

    this.fireTimer -= dtSeconds
    const spec = this.archetype.projectile
    if (this.fireTimer <= 0 && spec) {
      this.fireTimer = this.archetype.fireIntervalSeconds ?? 1.5
      return [new Bullet(this.view.x, this.view.y, { x: nx, y: ny }, spec)]
    }
    return []
  }
}

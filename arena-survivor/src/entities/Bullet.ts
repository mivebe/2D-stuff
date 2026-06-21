import { Graphics } from 'pixi.js'
import { ARENA, BULLET } from '../config'
import type { Vec2 } from '../input/Input'

export type Team = 'player' | 'enemy'

// per-projectile tuning. player bullets and enemy shots share Bullet, differ by spec.
export interface BulletSpec {
  speed: number
  damage: number
  radius: number
  maxRangeSeconds: number
  color: number
  team: Team
  pierce: number // extra enemies the bullet passes through after the first hit
}

export const PLAYER_BULLET: BulletSpec = {
  speed: BULLET.speed,
  damage: BULLET.damage,
  radius: BULLET.radius,
  maxRangeSeconds: BULLET.maxRangeSeconds,
  color: 0x9dff5c, // bright green
  team: 'player',
  pierce: 0,
}

// projectile that flies along a fixed direction until it hits a wall or a target.
export class Bullet {
  readonly view: Graphics
  alive = true
  radius: number
  damage: number
  team: Team
  pierce: number
  // enemy ids already hit, so a piercing bullet never double-taps the same body
  readonly hits = new Set<number>()
  private vx: number
  private vy: number
  private age = 0
  private maxRange: number

  constructor(x: number, y: number, dir: Vec2, spec: BulletSpec) {
    this.radius = spec.radius
    this.damage = spec.damage
    this.team = spec.team
    this.pierce = spec.pierce
    this.maxRange = spec.maxRangeSeconds

    this.view = new Graphics()
    this.view.circle(0, 0, spec.radius).fill({ color: spec.color })
    this.view.x = x
    this.view.y = y
    this.vx = dir.x * spec.speed
    this.vy = dir.y * spec.speed
  }

  get x() {
    return this.view.x
  }
  get y() {
    return this.view.y
  }

  update(dtSeconds: number) {
    this.view.x += this.vx * dtSeconds
    this.view.y += this.vy * dtSeconds
    this.age += dtSeconds

    const out =
      this.view.x < 0 ||
      this.view.x > ARENA.width ||
      this.view.y < 0 ||
      this.view.y > ARENA.height
    if (out || this.age > this.maxRange) this.alive = false
  }
}

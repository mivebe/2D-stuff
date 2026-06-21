import { Container, Graphics } from 'pixi.js'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: number
}

// lightweight particle layer: all particles are redrawn into a single Graphics
// each frame, so a burst costs no new display objects.
export class Particles {
  readonly view = new Container()
  private gfx = new Graphics()
  private items: Particle[] = []

  constructor() {
    this.view.addChild(this.gfx)
  }

  burst(x: number, y: number, color: number, count: number, speed = 160, life = 0.45, size = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const spd = speed * (0.4 + Math.random() * 0.6)
      const maxLife = life * (0.6 + Math.random() * 0.8)
      this.items.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: maxLife,
        maxLife,
        size: size * (0.6 + Math.random() * 0.8),
        color,
      })
    }
  }

  clear() {
    this.items.length = 0
    this.gfx.clear()
  }

  update(dtSeconds: number) {
    this.gfx.clear()
    const survivors: Particle[] = []
    for (const p of this.items) {
      p.life -= dtSeconds
      if (p.life <= 0) continue
      p.x += p.vx * dtSeconds
      p.y += p.vy * dtSeconds
      p.vx *= 0.9 // drag so the burst settles
      p.vy *= 0.9
      const alpha = p.life / p.maxLife
      this.gfx.circle(p.x, p.y, p.size).fill({ color: p.color, alpha })
      survivors.push(p)
    }
    this.items = survivors
  }
}

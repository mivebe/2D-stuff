import { Container } from 'pixi.js'

// trauma-style screen shake: jitter the world container for a short, decaying burst.
export class ScreenShake {
  private duration = 0
  private elapsed = 0
  private magnitude = 0

  // keep the strongest active shake rather than letting a weak one cut a strong one
  shake(magnitude: number, duration: number) {
    if (magnitude < this.remainingStrength()) return
    this.magnitude = magnitude
    this.duration = duration
    this.elapsed = 0
  }

  private remainingStrength() {
    if (this.elapsed >= this.duration) return 0
    return this.magnitude * (1 - this.elapsed / this.duration)
  }

  update(dtSeconds: number, target: Container) {
    if (this.elapsed >= this.duration) {
      target.position.set(0, 0)
      return
    }
    this.elapsed += dtSeconds
    const falloff = Math.max(0, 1 - this.elapsed / this.duration)
    const m = this.magnitude * falloff * falloff
    target.x = (Math.random() * 2 - 1) * m
    target.y = (Math.random() * 2 - 1) * m
  }
}

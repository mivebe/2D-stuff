import { Graphics } from 'pixi.js'
import { MELEE } from '../config'

// purely cosmetic: sweeps a drawn blade through the swing arc.
// the actual damage is applied instantly by Game on the swing frame.
export class Sword {
  readonly view = new Graphics()
  private active = false
  private t = 0
  private startAngle = 0
  private endAngle = 0

  constructor() {
    this.view.visible = false
  }

  // centerAngle is the aim direction (radians, 0 = +x)
  trigger(centerAngle: number, range: number) {
    const half = MELEE.arcRadians / 2
    this.startAngle = centerAngle - half
    this.endAngle = centerAngle + half
    this.t = 0
    this.active = true
    this.view.visible = true

    // blade points up from the hilt at the origin, length scaled to reach
    this.view.clear()
    this.view
      .poly([-4, 0, 4, 0, 3, -range * 0.82, 0, -range, -3, -range * 0.82])
      .fill({ color: 0xe8ecff })
      .stroke({ width: 1.5, color: 0x99a0c0 })
  }

  update(dtSeconds: number, px: number, py: number) {
    if (!this.active) return
    this.t += dtSeconds / MELEE.swingSeconds
    if (this.t >= 1) {
      this.active = false
      this.view.visible = false
      return
    }
    const angle = this.startAngle + (this.endAngle - this.startAngle) * this.t
    this.view.x = px
    this.view.y = py
    // blade points up by default, so offset by 90deg to align with the aim
    this.view.rotation = angle + Math.PI / 2
  }
}

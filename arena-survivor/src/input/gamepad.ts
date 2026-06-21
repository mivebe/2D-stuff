import { INPUT } from '../config'

// reads the first connected gamepad each frame. standard layout:
// axes 0/1 = left stick (move), axes 2/3 = right stick (aim),
// button 7 = right trigger (fire), button 5 = right bumper (melee).

export class Gamepad {
  private prevMelee = false

  private pad(): globalThis.Gamepad | null {
    const pads = navigator.getGamepads?.() ?? []
    for (const p of pads) {
      if (p) return p
    }
    return null
  }

  private deadzone(v: number) {
    return Math.abs(v) < INPUT.gamepadDeadzone ? 0 : v
  }

  connected() {
    return this.pad() !== null
  }

  moveVector() {
    const p = this.pad()
    if (!p) return { x: 0, y: 0 }
    return { x: this.deadzone(p.axes[0] ?? 0), y: this.deadzone(p.axes[1] ?? 0) }
  }

  aimVector() {
    const p = this.pad()
    if (!p) return { x: 0, y: 0 }
    return { x: this.deadzone(p.axes[2] ?? 0), y: this.deadzone(p.axes[3] ?? 0) }
  }

  firing() {
    const p = this.pad()
    if (!p) return false
    return (p.buttons[7]?.pressed ?? false) || (p.buttons[0]?.pressed ?? false)
  }

  // melee edge-triggered off the right bumper
  consumeMelee() {
    const p = this.pad()
    const down = p?.buttons[5]?.pressed ?? false
    const fired = down && !this.prevMelee
    this.prevMelee = down
    return fired
  }
}

import { KeyboardMouse } from './keyboardMouse'
import { Gamepad } from './gamepad'

export interface Vec2 {
  x: number
  y: number
}

// per-frame normalized intent the rest of the game consumes
export interface InputFrame {
  move: Vec2 // normalized, magnitude 0..1
  aim: Vec2 // unit direction the player is aiming
  firing: boolean
  melee: boolean // edge-triggered this frame
}

function normalize(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.y)
  if (len === 0) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}

// clamp magnitude to 1 but keep analog sensitivity below that
function clampMagnitude(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.y)
  if (len <= 1) return v
  return { x: v.x / len, y: v.y / len }
}

export class Input {
  readonly keyboardMouse = new KeyboardMouse()
  readonly gamepad = new Gamepad()
  // remembered so aim holds steady when the stick/mouse is idle
  private lastAim: Vec2 = { x: 1, y: 0 }

  // resolve a frame of intent relative to the player's current position
  sample(playerX: number, playerY: number): InputFrame {
    const padMove = this.gamepad.moveVector()
    const padAim = this.gamepad.aimVector()
    const kbMove = this.keyboardMouse.moveVector()

    // move: gamepad stick wins when pushed, else keyboard
    const move =
      padMove.x !== 0 || padMove.y !== 0 ? clampMagnitude(padMove) : normalize(kbMove)

    // aim: right stick if pushed, else mouse direction from the player
    let aim: Vec2
    if (padAim.x !== 0 || padAim.y !== 0) {
      aim = normalize(padAim)
    } else if (this.keyboardMouse.pointerActive) {
      aim = normalize({
        x: this.keyboardMouse.pointer.x - playerX,
        y: this.keyboardMouse.pointer.y - playerY,
      })
    } else {
      aim = this.lastAim
    }
    if (aim.x !== 0 || aim.y !== 0) this.lastAim = aim

    const firing = this.keyboardMouse.firing || this.gamepad.firing()
    const melee = this.keyboardMouse.consumeMelee() || this.gamepad.consumeMelee()

    return { move, aim, firing, melee }
  }
}

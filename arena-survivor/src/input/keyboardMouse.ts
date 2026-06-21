// raw keyboard + mouse state. owns the dom listeners, exposes plain state.
// pointer is kept in canvas-local pixels (set by Game from pixi pointer events).

export class KeyboardMouse {
  private keys = new Set<string>()
  pointer = { x: 0, y: 0 }
  pointerActive = false // true once the mouse has moved over the canvas
  firing = false // left button held
  meleePressed = false // edge: right button down since last consume

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    // block the context menu so right-click can drive melee later
    window.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  private onKeyDown = (e: KeyboardEvent) => {
    // space melee is edge-triggered: only the fresh press counts, not key-repeat
    if (e.code === 'Space' && !this.keys.has('Space')) this.meleePressed = true
    this.keys.add(e.code)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
  }

  setPointer(x: number, y: number) {
    this.pointer.x = x
    this.pointer.y = y
    this.pointerActive = true
  }

  setButton(button: number, down: boolean) {
    if (button === 0) this.firing = down
    if (button === 2 && down) this.meleePressed = true
  }

  // wasd or arrows -> raw (unnormalized) move vector
  moveVector() {
    let x = 0
    let y = 0
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y -= 1
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y += 1
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1
    return { x, y }
  }

  // melee is edge-triggered, read-and-clear
  consumeMelee() {
    const v = this.meleePressed
    this.meleePressed = false
    return v
  }
}

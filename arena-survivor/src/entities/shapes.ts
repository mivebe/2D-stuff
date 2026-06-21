import { Graphics } from 'pixi.js'

export type Shape = 'circle' | 'triangle' | 'square' | 'diamond'

// draw a filled shape centered on the graphics origin, sized to `radius`,
// with a soft dark outline for definition. caller clears beforehand.
export function drawShape(g: Graphics, shape: Shape, radius: number, color: number) {
  switch (shape) {
    case 'circle':
      g.circle(0, 0, radius)
      break
    case 'square':
      g.rect(-radius, -radius, radius * 2, radius * 2)
      break
    case 'triangle':
      g.poly([0, -radius, radius * 0.87, radius * 0.6, -radius * 0.87, radius * 0.6])
      break
    case 'diamond':
      g.poly([0, -radius, radius, 0, 0, radius, -radius, 0])
      break
  }
  g.fill({ color }).stroke({ width: 2, color: 0x000000, alpha: 0.35 })
}

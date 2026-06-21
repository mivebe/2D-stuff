import { ARENA, SPAWN, WAVE } from '../config'
import { ARCHETYPES, Archetype, SWARMER } from '../data/archetypes'
import { Enemy } from '../entities/Enemy'

// step 4: time drives the wave number; the wave number drives every spawn knob.
// interval shrinks, batch grows, the alive cap rises, and the mix gets nastier.
export class SpawnDirector {
  private elapsed = 0
  private timer = 0
  wave = 1

  reset() {
    this.elapsed = 0
    this.timer = 0
    this.wave = 1
  }

  private interval() {
    const raw = WAVE.intervalBase * Math.pow(WAVE.intervalDecayPerWave, this.wave - 1)
    return Math.max(WAVE.intervalMin, raw)
  }

  private maxAlive() {
    return Math.min(WAVE.maxAliveCap, WAVE.maxAliveBase + (this.wave - 1) * WAVE.maxAlivePerWave)
  }

  // enemies released per spawn tick; ramps slowly so it stays readable
  private batch() {
    return 1 + Math.floor((this.wave - 1) / 4)
  }

  update(dtSeconds: number, aliveCount: number): Enemy[] {
    this.elapsed += dtSeconds
    this.wave = 1 + Math.floor(this.elapsed / WAVE.durationSeconds)

    this.timer -= dtSeconds
    if (this.timer > 0 || aliveCount >= this.maxAlive()) return []
    this.timer = this.interval()

    const spawned: Enemy[] = []
    for (let i = 0; i < this.batch(); i++) {
      const archetype = this.pick()
      if (archetype.key === SWARMER.key) {
        spawned.push(...this.spawnPack(archetype, 3 + Math.floor(Math.random() * 2)))
      } else {
        spawned.push(this.makeEnemy(archetype, this.edgePoint()))
      }
    }
    return spawned
  }

  // mix shifts with the wave: chasers/swarmers from the start, ranged enters
  // wave 2, tanks wave 3, both growing heavier over time.
  private pick(): Archetype {
    const weights: Array<{ key: string; weight: number }> = [
      { key: 'chaser', weight: 5 },
      { key: 'swarmer', weight: 3 },
      { key: 'ranged', weight: Math.max(0, this.wave - 1) * 1.5 },
      { key: 'tank', weight: Math.max(0, this.wave - 2) * 1.0 },
    ]
    const total = weights.reduce((sum, p) => sum + p.weight, 0)
    let roll = Math.random() * total
    for (const p of weights) {
      roll -= p.weight
      if (roll <= 0) return ARCHETYPES[p.key]
    }
    return ARCHETYPES.chaser
  }

  // cluster a pack around one edge point so they read as a group
  private spawnPack(archetype: Archetype, size: number): Enemy[] {
    const origin = this.edgePoint()
    const pack: Enemy[] = []
    for (let i = 0; i < size; i++) {
      pack.push(
        this.makeEnemy(archetype, {
          x: origin.x + (Math.random() - 0.5) * 70,
          y: origin.y + (Math.random() - 0.5) * 70,
        })
      )
    }
    return pack
  }

  private makeEnemy(archetype: Archetype, at: { x: number; y: number }): Enemy {
    return new Enemy(archetype, at.x, at.y)
  }

  // random point just outside one of the four arena edges
  private edgePoint() {
    const m = SPAWN.edgeMargin
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        return { x: Math.random() * ARENA.width, y: -m }
      case 1:
        return { x: Math.random() * ARENA.width, y: ARENA.height + m }
      case 2:
        return { x: -m, y: Math.random() * ARENA.height }
      default:
        return { x: ARENA.width + m, y: Math.random() * ARENA.height }
    }
  }
}

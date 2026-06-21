import type { BulletSpec } from '../entities/Bullet'
import type { Shape } from '../entities/shapes'

// enemy archetype stats. step 3 ships the full roster: chaser, swarmer, tank, ranged.
// each type has a distinct shape + color so it reads at a glance.

export type Behavior = 'chase' | 'ranged'

export interface Archetype {
  key: string
  behavior: Behavior
  shape: Shape
  color: number
  hp: number
  speed: number // px/sec
  radius: number
  contactDamage: number
  xp: number
  // ranged-only behavior params
  preferredRange?: number
  fireIntervalSeconds?: number
  projectile?: BulletSpec
}

export const CHASER: Archetype = {
  key: 'chaser',
  behavior: 'chase',
  shape: 'circle',
  color: 0xff4444,
  hp: 50,
  speed: 95,
  radius: 14,
  contactDamage: 12,
  xp: 1,
}

// fast, fragile, arrives in packs
export const SWARMER: Archetype = {
  key: 'swarmer',
  behavior: 'chase',
  shape: 'triangle',
  color: 0xffd54a,
  hp: 18,
  speed: 165,
  radius: 11,
  contactDamage: 7,
  xp: 1,
}

// slow, heavy, hits hard
export const TANK: Archetype = {
  key: 'tank',
  behavior: 'chase',
  shape: 'square',
  color: 0xb86bff,
  hp: 220,
  speed: 52,
  radius: 24,
  contactDamage: 24,
  xp: 4,
}

// keeps its distance and lobs projectiles at the player
export const RANGED: Archetype = {
  key: 'ranged',
  behavior: 'ranged',
  shape: 'diamond',
  color: 0x4aa3ff,
  hp: 40,
  speed: 70,
  radius: 14,
  contactDamage: 8,
  xp: 3,
  preferredRange: 280,
  fireIntervalSeconds: 1.6,
  projectile: {
    speed: 260,
    damage: 10,
    radius: 8,
    maxRangeSeconds: 4,
    color: 0xff33cc, // hot magenta, a color used nowhere else on screen
    team: 'enemy',
    pierce: 0,
  },
}

export const ARCHETYPES: Record<string, Archetype> = {
  chaser: CHASER,
  swarmer: SWARMER,
  tank: TANK,
  ranged: RANGED,
}

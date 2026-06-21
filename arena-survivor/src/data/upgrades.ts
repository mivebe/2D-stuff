import type { Stats } from '../core/Stats'
import type { Player } from '../entities/Player'

export interface UpgradeContext {
  stats: Stats
  player: Player
}

export interface Upgrade {
  id: string
  name: string
  description: string
  // relative roll weight; lower = rarer. multishot/fire-rate are kept scarce
  // because they scale damage multiplicatively and break balance if stacked.
  weight: number
  apply: (ctx: UpgradeContext) => void
}

// the pool offered at level-up
export const UPGRADES: Upgrade[] = [
  {
    id: 'fireRate',
    name: 'Rapid Fire',
    description: '-15% time between shots',
    weight: 1,
    apply: ({ stats }) => {
      stats.fireInterval = Math.max(0.05, stats.fireInterval * 0.85)
    },
  },
  {
    id: 'multishot',
    name: 'Multishot',
    description: '+1 projectile per shot',
    weight: 1,
    apply: ({ stats }) => {
      stats.multishot += 1
    },
  },
  {
    id: 'pierce',
    name: 'Piercing Rounds',
    description: 'bullets pass through +1 enemy',
    weight: 0.8,
    apply: ({ stats }) => {
      stats.pierce += 1
    },
  },
  {
    id: 'damage',
    name: 'Hollow Points',
    description: '+10 bullet damage',
    weight: 1,
    apply: ({ stats }) => {
      stats.bulletDamage += 10
    },
  },
  {
    id: 'moveSpeed',
    name: 'Fleet Footed',
    description: '+12% move speed',
    weight: 1,
    apply: ({ stats }) => {
      stats.moveSpeed *= 1.12
    },
  },
  {
    id: 'maxHp',
    name: 'Vitality',
    description: '+25 max HP and heal',
    weight: 1,
    apply: ({ stats, player }) => {
      stats.maxHp += 25
      player.heal(25)
    },
  },
  {
    id: 'meleeDamage',
    name: 'Sharpened Edge',
    description: '+30 sword damage',
    weight: 1,
    apply: ({ stats }) => {
      stats.meleeDamage += 30
    },
  },
  {
    id: 'meleeRange',
    name: 'Long Reach',
    description: '+25 sword range',
    weight: 1,
    apply: ({ stats }) => {
      stats.meleeRange += 25
    },
  },
]

// pick `count` distinct upgrades, weighted so scarce ones show up less
export function rollUpgrades(count: number): Upgrade[] {
  const pool = [...UPGRADES]
  const picks: Upgrade[] = []
  while (picks.length < count && pool.length > 0) {
    const total = pool.reduce((sum, u) => sum + u.weight, 0)
    let roll = Math.random() * total
    let chosen = pool.length - 1
    for (let i = 0; i < pool.length; i++) {
      roll -= pool[i].weight
      if (roll <= 0) {
        chosen = i
        break
      }
    }
    picks.push(pool.splice(chosen, 1)[0])
  }
  return picks
}

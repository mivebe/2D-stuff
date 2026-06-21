import { BULLET, PLAYER, WEAPON } from '../config'

// runtime loadout. starts from config, then upgrades mutate it in place.
// every system reads its tuning from here instead of the config constants
// so level-up choices actually change the game.
export interface Stats {
  moveSpeed: number
  maxHp: number
  fireInterval: number // seconds between shots
  bulletDamage: number
  multishot: number // projectiles per shot
  pierce: number // extra enemies each bullet passes through
  meleeDamage: number // used from step 6
  meleeRange: number
}

export function createDefaultStats(): Stats {
  return {
    moveSpeed: PLAYER.speed,
    maxHp: PLAYER.maxHp,
    fireInterval: WEAPON.fireIntervalSeconds,
    bulletDamage: BULLET.damage,
    multishot: 1,
    pierce: 0,
    meleeDamage: 60,
    meleeRange: 92,
  }
}

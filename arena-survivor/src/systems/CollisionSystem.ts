import { Bullet } from '../entities/Bullet'
import { Enemy } from '../entities/Enemy'
import { Player } from '../entities/Player'

export interface CollisionResult {
  kills: number
  xp: number
  playerHit: boolean
}

function overlap(
  ax: number,
  ay: number,
  ar: number,
  bx: number,
  by: number,
  br: number
): boolean {
  const r = ar + br
  const dx = ax - bx
  const dy = ay - by
  return dx * dx + dy * dy <= r * r
}

// brute-force circle checks. fine through step 2; swap to a spatial grid
// in CollisionSystem if enemy/bullet counts start to hurt.
export class CollisionSystem {
  update(bullets: Bullet[], enemies: Enemy[], player: Player): CollisionResult {
    let kills = 0
    let xp = 0
    let playerHit = false

    for (const bullet of bullets) {
      if (!bullet.alive) continue

      if (bullet.team === 'player') {
        // player bullets vs enemies; pierce lets one bullet hit several bodies
        for (const enemy of enemies) {
          if (!enemy.alive || bullet.hits.has(enemy.id)) continue
          if (overlap(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
            enemy.takeDamage(bullet.damage)
            bullet.hits.add(enemy.id)
            if (!enemy.alive) {
              kills++
              xp += enemy.archetype.xp
            }
            if (bullet.pierce > 0) {
              bullet.pierce--
            } else {
              bullet.alive = false
              break // bullet is spent
            }
          }
        }
      } else {
        // enemy projectiles vs player
        if (overlap(bullet.x, bullet.y, bullet.radius, player.x, player.y, player.radius)) {
          bullet.alive = false
          if (player.takeDamage(bullet.damage)) playerHit = true
        }
      }
    }

    // enemy bodies vs player (respects i-frames inside takeDamage)
    for (const enemy of enemies) {
      if (!enemy.alive) continue
      if (overlap(enemy.x, enemy.y, enemy.radius, player.x, player.y, player.radius)) {
        if (player.takeDamage(enemy.contactDamage)) playerHit = true
      }
    }

    return { kills, xp, playerHit }
  }
}

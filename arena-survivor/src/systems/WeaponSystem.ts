import { MELEE } from '../config'
import { Bullet, PLAYER_BULLET } from '../entities/Bullet'
import { Player } from '../entities/Player'
import type { Stats } from '../core/Stats'
import type { InputFrame } from '../input/Input'
import { playSound } from '../core/Audio'

// gun fire-rate gate. fire interval, multishot spread, damage and pierce all
// come from the live stats, so upgrades change shooting immediately.
// sword swing is added in step 6.
const SPREAD_RADIANS = 0.14 // angular gap between multishot pellets

export class WeaponSystem {
  private cooldown = 0
  private meleeCooldown = 0

  constructor(private stats: Stats) {}

  reset() {
    this.cooldown = 0
    this.meleeCooldown = 0
  }

  // gate the sword on its own cooldown; returns true if a swing fired this frame.
  // Game applies the arc damage and plays the cosmetic sweep.
  tryMelee(dtSeconds: number, frame: InputFrame): boolean {
    if (this.meleeCooldown > 0) this.meleeCooldown -= dtSeconds
    if (!frame.melee || this.meleeCooldown > 0) return false
    this.meleeCooldown = MELEE.cooldownSeconds
    playSound('swordSwing')
    return true
  }

  // returns any bullets spawned this frame (Game owns the array + display list)
  update(dtSeconds: number, frame: InputFrame, player: Player): Bullet[] {
    if (this.cooldown > 0) this.cooldown -= dtSeconds
    if (!frame.firing || this.cooldown > 0) return []

    this.cooldown = this.stats.fireInterval
    playSound('pew')

    const spec = {
      ...PLAYER_BULLET,
      damage: this.stats.bulletDamage,
      pierce: this.stats.pierce,
    }
    const baseAngle = Math.atan2(player.aim.y, player.aim.x)
    const count = this.stats.multishot
    const spawnX = player.x + player.aim.x * (player.radius + 6)
    const spawnY = player.y + player.aim.y * (player.radius + 6)

    const bullets: Bullet[] = []
    for (let i = 0; i < count; i++) {
      // fan the pellets symmetrically around the aim direction
      const angle = baseAngle + (i - (count - 1) / 2) * SPREAD_RADIANS
      const dir = { x: Math.cos(angle), y: Math.sin(angle) }
      bullets.push(new Bullet(spawnX, spawnY, dir, spec))
    }
    return bullets
  }
}

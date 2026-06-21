import { Application, Container, FederatedPointerEvent, Graphics } from 'pixi.js'
import { ARENA } from '../config'
import { GameState } from './GameState'
import { playSound } from './Audio'
import { Input } from '../input/Input'
import { LEVEL_UP, MELEE } from '../config'
import { Player } from '../entities/Player'
import { Bullet } from '../entities/Bullet'
import { Enemy } from '../entities/Enemy'
import { Sword } from '../entities/Sword'
import { WeaponSystem } from '../systems/WeaponSystem'
import { SpawnDirector } from '../systems/SpawnDirector'
import { CollisionSystem } from '../systems/CollisionSystem'
import { XPSystem } from '../systems/XPSystem'
import { Particles } from '../systems/Particles'
import { ScreenShake } from './ScreenShake'
import { Hud } from '../ui/Hud'
import { GameOverScreen } from '../ui/GameOverScreen'
import { LevelUpScreen } from '../ui/LevelUpScreen'
import { createDefaultStats } from './Stats'
import { rollUpgrades, Upgrade } from '../data/upgrades'

export class Game {
  readonly app: Application
  readonly world = new Container()
  readonly entityLayer = new Container()
  readonly input = new Input()
  state = GameState.PLAYING

  private stats = createDefaultStats()
  private player: Player
  private sword: Sword
  private bullets: Bullet[] = []
  private enemies: Enemy[] = []
  private score = 0

  private weapons: WeaponSystem
  private spawner: SpawnDirector
  private collisions = new CollisionSystem()
  private xpSystem = new XPSystem()
  private particles = new Particles()
  private screenShake = new ScreenShake()
  private damageFlash = new Graphics()
  private flashAlpha = 0
  private hud = new Hud()
  private gameOver = new GameOverScreen()
  private levelUp = new LevelUpScreen()
  private levelUpDelay = 0
  private pendingOptions: Upgrade[] = []

  constructor(app: Application) {
    this.app = app
    this.app.stage.addChild(this.world)
    this.world.addChild(this.entityLayer)
    this.entityLayer.addChild(this.particles.view) // drawn over enemies/bullets
    this.buildDamageFlash()
    this.app.stage.addChild(this.damageFlash) // full-screen, above world
    this.app.stage.addChild(this.hud.view)
    this.app.stage.addChild(this.gameOver.view)
    this.app.stage.addChild(this.levelUp.view)

    this.buildArena()
    this.player = new Player(this.stats)
    this.entityLayer.addChild(this.player.view)
    this.sword = new Sword()
    this.entityLayer.addChild(this.sword.view)

    this.weapons = new WeaponSystem(this.stats)
    this.spawner = new SpawnDirector()

    this.bindInput()
    this.refreshHud()
    this.app.ticker.add(() => this.tick())
  }

  private buildArena() {
    const floor = new Graphics()
      .rect(0, 0, ARENA.width, ARENA.height)
      .fill({ color: ARENA.background })
      .rect(
        ARENA.padding,
        ARENA.padding,
        ARENA.width - ARENA.padding * 2,
        ARENA.height - ARENA.padding * 2
      )
      .stroke({ width: 2, color: 0x3a4060 })
    this.world.addChildAt(floor, 0)
  }

  private buildDamageFlash() {
    this.damageFlash
      .rect(0, 0, ARENA.width, ARENA.height)
      .fill({ color: 0xff2222 })
    this.damageFlash.alpha = 0
  }

  private bindInput() {
    const stage = this.app.stage
    stage.eventMode = 'static'
    stage.hitArea = this.app.screen
    stage.on('pointermove', (e: FederatedPointerEvent) => {
      this.input.keyboardMouse.setPointer(e.global.x, e.global.y)
    })
    stage.on('pointerdown', (e: FederatedPointerEvent) => {
      if (this.state === GameState.GAME_OVER) {
        this.restart()
        return
      }
      // ignore fire input while paused on the level-up screen
      if (this.state === GameState.PLAYING) this.input.keyboardMouse.setButton(e.button, true)
    })
    stage.on('pointerup', (e: FederatedPointerEvent) => {
      this.input.keyboardMouse.setButton(e.button, false)
    })
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'KeyR' && this.state === GameState.GAME_OVER) this.restart()
    })
  }

  private tick() {
    const dtSeconds = this.app.ticker.deltaMS / 1000

    // juice keeps animating regardless of state, so death fx and shake finish
    this.screenShake.update(dtSeconds, this.world)
    this.particles.update(dtSeconds)
    this.hud.tick(dtSeconds)
    if (this.flashAlpha > 0) {
      this.flashAlpha = Math.max(0, this.flashAlpha - dtSeconds * 2)
      this.damageFlash.alpha = this.flashAlpha
    }

    // reveal the upgrade cards a beat after the level-up pause lands
    if (this.state === GameState.LEVEL_UP && this.levelUpDelay > 0) {
      this.levelUpDelay -= dtSeconds
      if (this.levelUpDelay <= 0) {
        this.levelUp.show(this.pendingOptions, (upgrade) => this.applyUpgrade(upgrade))
      }
    }

    if (this.state !== GameState.PLAYING) return
    const frame = this.input.sample(this.player.x, this.player.y)

    this.player.update(frame, dtSeconds)

    // fire
    const spawned = this.weapons.update(dtSeconds, frame, this.player)
    for (const bullet of spawned) {
      this.bullets.push(bullet)
      this.entityLayer.addChild(bullet.view)
    }

    // melee swing (instant arc damage + cosmetic sweep)
    if (this.weapons.tryMelee(dtSeconds, frame)) this.performSwing()
    this.sword.update(dtSeconds, this.player.x, this.player.y)

    // spawn enemies
    const newEnemies = this.spawner.update(dtSeconds, this.enemies.length)
    for (const enemy of newEnemies) {
      this.enemies.push(enemy)
      this.entityLayer.addChildAt(enemy.view, 0) // under bullets/player
    }

    for (const bullet of this.bullets) bullet.update(dtSeconds)
    for (const enemy of this.enemies) {
      const shots = enemy.update(dtSeconds, this.player.x, this.player.y)
      for (const shot of shots) {
        this.bullets.push(shot)
        this.entityLayer.addChild(shot.view)
      }
    }

    const result = this.collisions.update(this.bullets, this.enemies, this.player)
    if (result.kills > 0) {
      this.score += result.kills
      this.xpSystem.add(result.xp)
      playSound('kill')
    }
    if (result.playerHit) {
      this.flashAlpha = 0.4
      this.screenShake.shake(9, 0.28)
    }

    // burst every enemy that died this frame before it gets swept
    for (const enemy of this.enemies) {
      if (!enemy.alive) this.particles.burst(enemy.x, enemy.y, enemy.archetype.color, 10)
    }

    this.sweepDead()
    this.refreshHud()

    if (this.player.hp <= 0) {
      this.die()
      return
    }
    // a kill may have banked one or more levels: pause and offer upgrades
    if (this.xpSystem.pendingLevelUps > 0) this.openLevelUp()
  }

  // damage every enemy inside the swing arc in front of the player, instantly
  private performSwing() {
    const aimAngle = Math.atan2(this.player.aim.y, this.player.aim.x)
    const halfArc = MELEE.arcRadians / 2
    const range = this.stats.meleeRange
    this.sword.trigger(aimAngle, range)
    this.screenShake.shake(4, 0.12)

    let kills = 0
    let xp = 0
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue
      const dx = enemy.x - this.player.x
      const dy = enemy.y - this.player.y
      if (Math.hypot(dx, dy) > range + enemy.radius) continue
      // shortest signed angle between the aim and this enemy
      let diff = Math.atan2(dy, dx) - aimAngle
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      if (Math.abs(diff) > halfArc) continue
      enemy.takeDamage(this.stats.meleeDamage)
      if (!enemy.alive) {
        kills++
        xp += enemy.archetype.xp
      }
    }

    if (kills > 0) {
      this.score += kills
      this.xpSystem.add(xp)
      playSound('kill')
    }
  }

  private refreshHud() {
    this.hud.update({
      hp: this.player.hp,
      maxHp: this.stats.maxHp,
      score: this.score,
      wave: this.spawner.wave,
      level: this.xpSystem.level,
      xp: this.xpSystem.xp,
      xpToNext: this.xpSystem.xpToNext,
    })
  }

  private openLevelUp() {
    this.state = GameState.LEVEL_UP
    // show the backdrop now, roll + reveal the cards after the delay beat
    this.levelUp.showBackdrop()
    this.pendingOptions = rollUpgrades(3)
    this.levelUpDelay = LEVEL_UP.revealDelaySeconds
  }

  private applyUpgrade(upgrade: Upgrade) {
    upgrade.apply({ stats: this.stats, player: this.player })
    this.xpSystem.pendingLevelUps--
    this.refreshHud()
    // chain into the next screen if more levels are still banked, else resume
    if (this.xpSystem.pendingLevelUps > 0) this.openLevelUp()
    else this.state = GameState.PLAYING
  }

  // drop dead bullets/enemies from arrays and the display list
  private sweepDead() {
    this.bullets = this.bullets.filter((b) => {
      if (b.alive) return true
      b.view.destroy()
      return false
    })
    this.enemies = this.enemies.filter((e) => {
      if (e.alive) return true
      e.view.destroy()
      return false
    })
  }

  private die() {
    this.state = GameState.GAME_OVER
    // a big death pop + heavy shake before the overlay
    this.particles.burst(this.player.x, this.player.y, 0xff5252, 28, 240, 0.7, 4)
    this.screenShake.shake(18, 0.6)
    this.flashAlpha = 0.5
    this.gameOver.show(this.score)
  }

  private restart() {
    for (const b of this.bullets) b.view.destroy()
    for (const e of this.enemies) e.view.destroy()
    this.bullets = []
    this.enemies = []
    this.score = 0
    this.particles.clear()
    this.flashAlpha = 0
    this.damageFlash.alpha = 0
    this.levelUpDelay = 0
    this.pendingOptions = []
    // mutate stats in place so Player/WeaponSystem keep their reference
    Object.assign(this.stats, createDefaultStats())
    this.xpSystem.reset()
    this.player.reset()
    this.weapons.reset()
    this.spawner.reset()
    this.gameOver.hide()
    this.refreshHud()
    this.state = GameState.PLAYING
  }
}

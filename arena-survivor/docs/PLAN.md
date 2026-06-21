# arena-survivor — implementation plan

A top-down arena survivor (Vampire Survivors / Brotato lineage). Built fresh; `pixi-test`
is left untouched and serves only as an asset donor.

## Stack

- **Pixi.js 8** — rendering
- **Vite** — dev server + build (replaces pixi-test's webpack)
- **TypeScript** — typed entities, weapons, upgrades, enemy archetypes
- Assets copied from `../pixi-test`: `r1`–`r6` walk frames, `blue/red/green/sword` sprites,
  and the `pew / swordSwing / drawSword / kill` sounds.

## Locked design decisions

| Area | Decision |
|------|----------|
| Genre | Top-down arena survivor, bounded play-field |
| Movement | WASD (keyboard) + gamepad left stick |
| Aim | Mouse direction + gamepad right stick |
| Gun | Hold-to-fire, fire-rate capped, bullets travel toward aim |
| Sword | Manual heavy melee (key / right-click / trigger), high-damage arc |
| Health | HP on both sides; enemy contact damages player with brief invuln |
| Death | Game-over screen + score, restart |
| Enemies | Chaser, Swarmer, Tank, Ranged (all four) |
| Progression | Kill XP -> level-up -> pick 1 of 3 upgrades; waves escalate |

## Target architecture

```
arena-survivor/
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  docs/PLAN.md
  public/
    images/   (copied sprites + r1-r6)
    sounds/   (copied sfx)
  src/
    main.ts                 # bootstrap: Pixi app, asset load, scene start
    config.ts               # tunable constants (speeds, HP, fire rates, spawn curve)
    core/
      Game.ts               # owns stage, ticker, world, game-state machine
      GameState.ts          # MENU | PLAYING | LEVEL_UP | GAME_OVER
      Pool.ts               # object pool for bullets/enemies
    input/
      Input.ts              # normalizes to { move, aim, firing, melee }
      keyboardMouse.ts
      gamepad.ts
    entities/
      Player.ts
      Enemy.ts              # base + archetype configs
      Bullet.ts             # player + enemy projectiles
    systems/
      MovementSystem.ts
      WeaponSystem.ts       # gun fire-rate + sword swing
      CollisionSystem.ts    # bullet<->enemy, enemy<->player (spatial-grid if needed)
      SpawnDirector.ts      # wave escalation
      XPSystem.ts           # xp drops, level curve, upgrade offers
      DamageSystem.ts       # hp, invuln, death
    ui/
      Hud.ts                # hp / xp / wave / score
      LevelUpScreen.ts      # 3-choice upgrade picker
      GameOverScreen.ts
    data/
      archetypes.ts         # chaser/swarmer/tank/ranged stats
      upgrades.ts           # upgrade pool + apply fns
```

Entities are plain classes holding a Pixi sprite + state; systems iterate them each tick.
Lightweight on purpose — not a full ECS, just enough structure to keep it sane.

## Build sequence (staged, playable early)

**Step 1 — Scaffold + controllable player**
Vite/TS/Pixi 8 project, copy assets, render arena + player. Input layer working for both
keyboard+mouse and gamepad. Player moves; aim vector computed. Camera/world bounds.

**Step 2 — Vertical slice (first "is it fun?" checkpoint)**
Gun hold-to-fire toward aim. One Chaser archetype with HP. Bullet<->enemy and
enemy<->player collisions. Player HP + invuln, death -> game-over -> restart. HUD with HP.
=> Playable. Stop here, tune feel before fanning out.

**Step 3 — Full roster**
Add Swarmer (fast/fragile, pack spawns), Tank (slow/tanky), Ranged (enemy projectiles).
Archetype stats in `data/archetypes.ts`.

**Step 4 — Wave director**
`SpawnDirector` escalates spawn rate/count/mix over time. Wave counter in HUD.

**Step 5 — XP + upgrades**
Kills drop XP, level curve, level-up pauses game and offers 3 upgrades
(fire rate, multishot, pierce, move speed, max HP, melee dmg/range). `data/upgrades.ts`.

**Step 6 — Manual sword melee**
High-damage arc on key/right-click/trigger, cooldown, reuse swing sound + animation.

**Step 7 — Juice**
Hit flashes, particles, screen shake, death fx, full HUD (hp/xp/wave/score), audio pass.

## Open tuning questions (resolve during play, not now)

- Object pooling needed from day one, or add when bullet/enemy counts hurt? (lean: add at step 3/4)
- Spatial grid for collisions, or brute force until it matters? (lean: brute force through step 2)
- Arena: fixed single screen, or scrolling world with camera follow? (lean: fixed screen first)

## Scope note

Steps 1–7 are a multi-session effort, not a one-shot. Recommended checkpoint: build through
**Step 2** (genuinely playable), play it, tune, then continue.

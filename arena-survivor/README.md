# Arena Survivor

A top-down arena survivor (Vampire Survivors / Brotato lineage) built on Pixi.js 8,
TypeScript, and Vite. Survive escalating waves in a bounded arena: hold-to-fire your
gun, swing a heavy melee arc, collect XP, and pick upgrades on level-up.

## Quick start

```bash
npm install
npm run dev      # vite dev server with hot reload
```

Then open the printed local URL.

Other scripts:

```bash
npm run build    # type-check (tsc --noEmit) then vite build into dist/
npm run preview  # serve the production build locally
```

## Controls

| Action | Keyboard + mouse | Gamepad |
|--------|------------------|---------|
| Move   | WASD or arrow keys | left stick |
| Aim    | mouse direction | right stick |
| Fire   | hold left mouse button | (right stick aim auto-fires) |
| Melee  | space or right-click | trigger |

Movement, aim, firing, and melee are normalized through a single input layer, so
keyboard+mouse and gamepad behave the same.

## Gameplay

- Gun is hold-to-fire with a capped fire rate; bullets travel toward your aim.
- Melee is a manual high-damage arc on a cooldown, centered on your aim direction.
- Player has HP with brief invulnerability frames after taking a hit. Death ends the
  run with a game-over screen and score; restart from there.
- Kills drop XP. Leveling up pauses the game and offers a choice of 3 upgrades.
- Waves escalate spawn rate, count, and enemy mix over time.

### Enemies

Four archetypes, each with a distinct shape and color so they read at a glance:

- **Chaser** - baseline pursuer.
- **Swarmer** - fast and fragile, spawns in packs.
- **Tank** - slow and tanky.
- **Ranged** - keeps distance and fires projectiles at you.

### Upgrades

Drawn from a shared pool on each level-up:

- Rapid Fire (fire rate)
- Multishot
- Piercing Rounds
- Hollow Points (bullet damage)
- Fleet Footed (move speed)
- Vitality (max HP)
- Sharpened Edge (melee damage)
- Long Reach (melee range)

## Project layout

```
arena-survivor/
  index.html              # mounts the Pixi canvas
  vite.config.ts
  tsconfig.json
  docs/PLAN.md            # design decisions and build plan
  public/
    images/               # sprites + r1-r6 walk frames
    sounds/               # pew / swordSwing / drawSword / kill
  src/
    main.ts               # bootstrap: Pixi app, asset load, scene start
    config.ts             # tunable constants (speeds, HP, fire rates, spawn curve)
    core/                 # Game loop, GameState, Audio, ScreenShake, Stats
    input/                # Input (normalizer), keyboardMouse, gamepad
    entities/             # Player, Enemy, Bullet, Sword, shapes
    systems/              # Weapon, Collision, SpawnDirector, XP, Particles
    ui/                   # Hud, LevelUpScreen, GameOverScreen
    data/                 # archetypes (enemy stats), upgrades (pool + apply fns)
```

Entities are plain classes holding a Pixi sprite plus state; systems iterate them each
tick. Lightweight by design, not a full ECS.

## Tuning

Balance lives in [src/config.ts](src/config.ts): arena size, player/bullet/melee stats,
fire rate, level-up pacing, and the wave escalation curve. Enemy stats live in
[src/data/archetypes.ts](src/data/archetypes.ts) and the upgrade pool in
[src/data/upgrades.ts](src/data/upgrades.ts).

Assets are donated from the sibling `pixi-test` project (sprites and sound effects).

## License

MIT

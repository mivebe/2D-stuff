// tunable constants. systems read from here so balance lives in one place.

export const ARENA = {
  width: 960,
  height: 640,
  background: 0x1a1d29,
  // inset border the player can't cross, keeps sprites off the edge
  padding: 24,
}

export const PLAYER = {
  speed: 240, // px/sec
  radius: 14,
  spriteScale: 1,
  maxHp: 100,
  invulnSeconds: 0.7, // i-frames after taking a hit
  color: 0x5dffa0, // mint green so the hero stands apart from the red enemies
}

export const WEAPON = {
  // hold-to-fire cap. min seconds between shots
  fireIntervalSeconds: 0.16,
}

export const BULLET = {
  speed: 620, // px/sec
  radius: 5,
  damage: 25,
  spriteScale: 0.4, // green.png is 32px, scale to ~13px
  maxRangeSeconds: 2, // despawn if it somehow never hits a wall
}

export const LEVEL_UP = {
  // beat between the pause landing and the upgrade cards appearing
  revealDelaySeconds: 0.5,
}

export const MELEE = {
  cooldownSeconds: 0.55,
  arcRadians: (Math.PI * 2) / 3, // 120 degree swing centered on aim
  swingSeconds: 0.18, // cosmetic sweep duration
}

export const SPAWN = {
  // keep spawns this far off-screen so they slide in, not pop in
  edgeMargin: 28,
}

// wave escalation curve. all spawn pressure derives from the current wave.
export const WAVE = {
  durationSeconds: 18, // real time before the wave counter ticks up
  intervalBase: 1.5, // seconds between spawn ticks on wave 1
  intervalDecayPerWave: 0.9, // multiplies the interval each wave (faster)
  intervalMin: 0.45, // floor so it never machine-guns
  maxAliveBase: 22,
  maxAlivePerWave: 4,
  maxAliveCap: 80,
}

export const INPUT = {
  // dead zone for analog sticks so resting drift doesn't register
  gamepadDeadzone: 0.2,
}

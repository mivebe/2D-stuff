// tiny sfx helper. preloads one element per sound, clones it to allow overlap.
type SoundName = 'pew' | 'kill' | 'swordSwing' | 'drawSword'

const FILES: Record<SoundName, string> = {
  pew: 'sounds/pew.mp3',
  kill: 'sounds/kill.mp3',
  swordSwing: 'sounds/swordSwing.mp3',
  drawSword: 'sounds/drawSword.mp3',
}

const VOLUME: Record<SoundName, number> = {
  pew: 0.25,
  kill: 0.2,
  swordSwing: 0.3,
  drawSword: 0.4,
}

const bank: Partial<Record<SoundName, HTMLAudioElement>> = {}

export function initAudio() {
  for (const name of Object.keys(FILES) as SoundName[]) {
    const el = new Audio(FILES[name])
    el.volume = VOLUME[name]
    bank[name] = el
  }
}

export function playSound(name: SoundName) {
  const base = bank[name]
  if (!base) return
  // clone so rapid repeats (bullets, kills) don't cut each other off
  const node = base.cloneNode() as HTMLAudioElement
  node.volume = VOLUME[name]
  void node.play().catch(() => {})
}

// tracks xp toward the next level. one big xp gain can bank several level-ups,
// which Game drains one upgrade screen at a time.
export class XPSystem {
  level = 1
  xp = 0
  xpToNext = curve(1)
  pendingLevelUps = 0

  reset() {
    this.level = 1
    this.xp = 0
    this.xpToNext = curve(1)
    this.pendingLevelUps = 0
  }

  add(amount: number) {
    this.xp += amount
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext
      this.level++
      this.pendingLevelUps++
      this.xpToNext = curve(this.level)
    }
  }
}

// rising curve: 9 xp for level 2, growing ~28% each level so leveling stays earned
function curve(level: number): number {
  return Math.floor(9 * Math.pow(1.28, level - 1))
}

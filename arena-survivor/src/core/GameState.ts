// top-level state machine. step 1 only ever sits in PLAYING;
// the rest are wired up in later steps.
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  LEVEL_UP = 'LEVEL_UP',
  GAME_OVER = 'GAME_OVER',
}

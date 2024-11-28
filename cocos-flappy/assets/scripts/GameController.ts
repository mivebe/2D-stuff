import {
  _decorator,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  director,
  EventKeyboard,
  Input,
  input,
  KeyCode,
  Node,
  IPhysics2DContact,
} from 'cc';
import { Ground } from './Ground';
import { Results } from './Results';
import { Character } from './Character';
import { PipePool } from './PipePool';
import { CharacterAudio } from './CharacterAudio';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
  @property({ type: Ground, tooltip: 'This is a ground' })
  public ground: Ground;

  @property({ type: Results, tooltip: 'Results here' })
  public result: Results;

  @property({ type: Character, tooltip: 'Character here' })
  public character: Character;

  @property({ type: CharacterAudio, tooltip: 'CharacterAudio here' })
  public characterAudio: CharacterAudio;

  @property({ type: PipePool, tooltip: 'Pipes Pool here' })
  public pipePool: PipePool;

  @property({ type: CCInteger })
  public speed: number = 300;

  @property({ type: CCInteger })
  public pipeSpeed: number = 200;

  public isOver: boolean;

  onLoad() {
    this.initListener();
    this.result.resetScore();
    this.isOver = true;
    director.pause();
  }

  initListener() {
    // input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    this.node.on(Node.EventType.TOUCH_START, () => {
      if (this.isOver) {
        this.resetGame();
        this.character.resetBird();
        this.startGame();
      }

      if (!this.isOver) {
        this.character.fly();
        this.characterAudio.onAudioQueue(0);
      }
    });
  }

  startGame() {
    this.result.hideResults();
    director.resume();
  }

  // onKeyDown(event: EventKeyboard) {
  //   switch (event.keyCode) {
  //     case KeyCode.KEY_A:
  //       this.gameOver();
  //       break;

  //     case KeyCode.KEY_P:
  //       this.result.addScore();
  //       break;

  //     case KeyCode.KEY_Q:
  //       this.resetGame();
  //       break;

  //     default:
  //       break;
  //   }
  // }

  gameOver() {
    this.result.showResults();
    this.isOver = true;
    this.characterAudio.onAudioQueue(3);
    director.pause();
  }

  resetGame() {
    this.result.resetScore();
    this.pipePool.reset();
    this.startGame();
    this.isOver = false;
    this.character.resetBird();
  }

  passPipe() {
    this.result.addScore();
    this.characterAudio.onAudioQueue(1);
  }

  createPipe() {
    this.pipePool.addPool();
  }

  contactBottomPipe() {
    const collider = this.character.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    this.character.hitSomething = true;
    this.characterAudio.onAudioQueue(2);
  }

  birdStruck() {
    this.contactBottomPipe();
    if (this.character.hitSomething) {
      this.gameOver();
    }
  }

  protected update(dt: number): void {
    if (!this.isOver) {
      this.birdStruck();
    }
  }
}

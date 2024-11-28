import { _decorator, Component, find, log, Node, screen, UITransform, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;
const random = (min: number, max: number) => Math.random() * (max - min) + min;

@ccclass('Pipes')
export class Pipes extends Component {
  @property({ type: Node, tooltip: 'Top Pipe' })
  public topPipe: Node;

  @property({ type: Node, tooltip: 'Bottom Pipe' })
  public bottomPipe: Node;

  public tempStartLocationUp: Vec3 = new Vec3(0, 0, 0);
  public tempStartLocationDown: Vec3 = new Vec3(0, 0, 0);
  public scene = screen.windowSize;

  public game: GameController;
  public pipeSpeed: number;
  public tempSpeed: number;

  isPass: boolean;

  protected onLoad(): void {
    this.game = find('GameController').getComponent('GameController') as GameController;
    this.pipeSpeed = this.game.pipeSpeed;
    this.initPos();
    this.isPass = false;
  }

  initPos() {
    this.tempStartLocationUp.x = this.topPipe.getComponent(UITransform).width + this.scene.width;
    this.tempStartLocationDown.x = this.topPipe.getComponent(UITransform).width + this.scene.width;

    const gap = random(450, 600);
    const topHeight = random(250, 450);

    this.tempStartLocationUp.y = topHeight;
    this.tempStartLocationDown.y = topHeight - gap;

    this.topPipe.setPosition(this.tempStartLocationUp);
    this.bottomPipe.setPosition(this.tempStartLocationDown);

    console.log('GAP', gap);
    console.log('TOP', this.topPipe.position);
    console.log('BOT', this.bottomPipe.position);
  }

  protected update(deltaTime: number): void {
    this.tempSpeed = this.pipeSpeed * deltaTime;

    this.tempStartLocationUp = this.topPipe.position;
    this.tempStartLocationDown = this.bottomPipe.position;

    this.tempStartLocationUp.x -= this.tempSpeed;
    this.tempStartLocationDown.x -= this.tempSpeed;

    this.topPipe.setPosition(this.tempStartLocationUp);
    this.bottomPipe.setPosition(this.tempStartLocationDown);

    if (this.isPass === false && this.topPipe.position.x <= 0) {
      this.isPass = true;
      this.game.passPipe();
    }

    if (this.topPipe.position.x < -this.scene.width) {
      this.game.createPipe();
      this.destroy();
    }
  }
}

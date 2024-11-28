import { _decorator, Animation, CCFloat, Component, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {
  @property({ type: CCFloat })
  public jumpHeight: number;

  @property({ type: CCFloat })
  public jumpDuration: number;

  public birdAnimation: Animation;
  public birdLocation: Vec3;
  public hitSomething: boolean;

  onLoad() {
    this.resetBird();

    this.birdAnimation = this.getComponent(Animation);
  }

  resetBird() {
    this.birdLocation = new Vec3(0, 0, 0);
    this.node.setPosition(this.birdLocation);
    this.hitSomething = false;
  }

  fly() {
    this.birdAnimation.stop();

    tween(this.node.position)
      .to(this.jumpDuration, new Vec3(this.node.position.x, this.node.position.y + this.jumpHeight), {
        easing: 'smooth',
        onUpdate: (target: Vec3) => {
          this.node.position = target;
        },
      })
      .start();

    this.birdAnimation.play();
  }
}

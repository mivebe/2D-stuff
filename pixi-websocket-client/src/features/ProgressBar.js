import { Container, Graphics } from "pixi.js";
import { mergeDeep } from "../utils";
import gsap from 'gsap';

const DEFAULT_CONFIG = {
  min: 0,
  max: 100,
  default: 0,
  showNumber: true,
  measureSymbol: '%',
  someObj: {
    a: 1,
    b: ['b', 'h', 'u'],
  }
};

export default class ProgressBar extends Container {
  constructor(config = {}) {
    super();

    this._config = mergeDeep(DEFAULT_CONFIG, config);
    this._progress = this._config.default;

    this._init();
  }

  _init() {
    const graphic = new Graphics()
      .rect(0, 0, 200, 300)
      .fill({ color: 0x3D105C });

    graphic.pivot.set(graphic.width / 2, graphic.height / 2);
    graphic.position.set(300, 300);

    this.addChild(graphic);

    gsap.to(graphic, { duration: 2, angle: 360, repeat: -1, ease: 'none' });
  }
}
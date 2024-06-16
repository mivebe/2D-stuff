import { Container, DEG_TO_RAD, Graphics } from 'pixi.js';
import { clamp, mergeDeep } from '../utils';
import gsap from 'gsap/all';

const DEFAULT_CONFIG = {
  bgColor: 0x3D105C,
  bgAlpha: 0.7,
  lineWidth: 20,
  fillColor: 0x0096FF,
  fillAlpha: 1,
  startAngle: 0,
  radius: 50,
  cap: 'round', // "square" | "butt" | "round"
  min: 0,
  max: 100,
  default: 0,
};

export default class CircularProgressBar extends Container {
  constructor({ current, config = {}, ...rest } = {}) {
    super();

    const {
      container = window.getStage(),
      position = [window.innerWidth / 2, window.innerHeight / 2],
      autoStart,
    } = rest;

    this._config = mergeDeep(DEFAULT_CONFIG, config);
    this._timelines = [];

    this._progress = null;
    this._bgCircle = this._createBackground();
    this._fillCircle = this._createFill(current || this._config.default);

    this.addChild(this._bgCircle, this._fillCircle);
    container.addChild(this);
    this.position.set(...position);

    autoStart && this.show();
  }

  get progress() {
    return this._progress;
  }

  onResize() {
    console.log('resize');
    this.parent.label === 'Stage' && this.position.set(window.innerWidth / 2, window.innerHeight / 2);
  }

  async show(label = 'show') {
    const spinTl = gsap.to(this._fillCircle, { duration: 1, angle: 360, repeat: -1, ease: 'none' });
    const showTl = gsap.to(this, { alpha: 1, duration: 0.7 });

    this._timelines.push(spinTl, showTl);
    await showTl.then();
  }

  async hide({ label = 'hide', removeAfter = false } = {}) {
    const hideTl = gsap.to(this, { alpha: 0, duration: 1 });

    this._timelines.push(hideTl);
    await hideTl.then();

    removeAfter && this.remove();
  }

  update(value) {
    const { fillAlpha, max, min } = this._config;
    const nextProgress = clamp(min, value, max);

    this._progress = nextProgress;

    if (nextProgress === 0 && fillAlpha === 0) {
      this._fillCircle.clear();

      return;
    }

    this._createFill(nextProgress);
  }

  remove() {
    delete window.getApp().features.progressBar;
    this.parent.removeChild(this);
    this.destroy({ children: true, context: true });
  }

  _createBackground() {
    const { bgColor, lineWidth, radius, bgAlpha, } = this._config;
    const alpha = bgColor === undefined ? 0.000001 : clamp(0, bgAlpha, 1);

    const bgCircle = new Graphics();
    bgCircle.label = 'CP_bg';
    bgCircle
      .circle(0, 0, radius)
      .stroke({
        width: lineWidth,
        color: bgColor,
        alpha
      });

    return bgCircle;
  }

  _createFill(nextProgress) {
    const { startAngle, lineWidth, radius, fillColor, fillAlpha, cap, max, } = this._config;
    const isFillCircleDefined = !!this._fillCircle;

    const endAngle = 360 / 100 * nextProgress || max;
    const offset = -90;
    const arcStartRads = (startAngle + offset) * DEG_TO_RAD;
    const arcEndRads = (startAngle + endAngle + offset) * DEG_TO_RAD;

    const fillCircle = isFillCircleDefined ? this._fillCircle : new Graphics();
    !isFillCircleDefined && (fillCircle.label = 'CP_fill');
    fillCircle
      .clear()
      .arc(0, 0, radius, arcStartRads, arcEndRads)
      .stroke({
        width: lineWidth,
        color: fillColor,
        cap,
        alpha: fillAlpha,
      });

    return fillCircle;
  }
}
import { Assets, Sprite, TilingSprite } from "pixi.js";

const TYPES = {
  TILED: 'tiled',
  SINGLE: 'single',
  // TODO maybe add 9 sliced approach later
  // TODO add animated option
};

/**
 * @description - Creates the bg Sprite or Tiled Sprite and adds it to the stage.
 */
export default class Background {
  constructor(type = TYPES.TILED, container = window.getStage()) {
    this.type = type;
    this._sprite = this._createBg();

    container.addChild(this._sprite);
    this.onResize();
  }

  /**
   * @returns {TYPES}
   */
  static get TYPES() {
    return TYPES;
  }

  onResize() {
    const { innerWidth: iW, innerHeight: iH, outerWidth: oW, outerHeight: oH } = window;
    const { width, height } = this._sprite;

    if (this.type === TYPES.SINGLE) {
      this._sprite.position.set(iW / 2, iH / 2);

      const widthDiff = iW - width;
      const heightDiff = iH - height;
      const bothPositive = widthDiff > 0 && heightDiff > 0;
      const bothNegative = widthDiff < 0 && heightDiff < 0;

      if (bothPositive || bothNegative) {
        widthDiff > heightDiff ? this._rescaleByWidth() : this._rescaleByHeight();
      } else if (widthDiff > 0) {
        this._rescaleByWidth();
      } else if (heightDiff > 0) {
        this._rescaleByHeight();
      }
    }

    if (this.type === TYPES.TILED) {
      this._sprite.width = oW;
      this._sprite.height = oH;
    }
  }

  _createBg() {
    let bgSprite

    if (this.type === TYPES.TILED) {
      const textureAsset = Assets.get('bgTile');
      bgSprite = new TilingSprite({
        texture: textureAsset,
        width: window.outerWidth,
        height: window.outerHeight,
        tileScale: { x: 0.2, y: 0.2 }
      });
    } else if (this.type === TYPES.SINGLE) {
      const textureAsset = Assets.get('bgSingle');
      bgSprite = new Sprite(textureAsset);
      bgSprite.anchor.set(0.5);
    } else {
      throw new TypeError('Background type is not valid!');
    }

    bgSprite.label = 'Background';
    return bgSprite;
  }

  _rescaleByWidth() {
    this._sprite.width = window.innerWidth;
    this._sprite.scale.y = this._sprite.scale.x;
  }

  _rescaleByHeight() {
    this._sprite.height = window.innerHeight;
    this._sprite.scale.x = this._sprite.scale.y;
  }
}
import { Assets, Sprite, TilingSprite } from "pixi.js";

const TYPES = {
  TILED: 'tiled',
  SINGLE: 'single',
  // TODO maybe add 9 sliced approach later
};

/**
 * @description - Creates the bg Sprite or Tiled Sprite and adds it to the stage.
 */
export default class Background {
  constructor(type = TYPES.TILED, container = window.getStage()) {
    this.type = type;
    this._sprite = this._createBg();

    container.addChild(this._sprite);
  }

  /**
   * @returns {TYPES}
   */
  static get TYPES() {
    return TYPES;
  }

  onResize() {
    if (this.type === TYPES.SINGLE) {
      this._sprite.position.set(window.innerWidth / 2, window.innerHeight / 2)
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
      bgSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      throw new TypeError('Background type is not valid!');
    }

    bgSprite.label = 'Background';
    return bgSprite;
  }
}
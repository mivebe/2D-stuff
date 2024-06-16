import { Assets, Container } from "pixi.js";

export default class LoadingScreen extends Container {
  constructor() {
    super();
  }

  _init() {

  }

  update(value) {
    console.log(value);
  }
}
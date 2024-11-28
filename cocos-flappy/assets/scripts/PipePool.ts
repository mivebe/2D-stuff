import { _decorator, Component, instantiate, Node, NodePool, Pool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PipePool')
export class PipePool extends Component {
  @property({ type: Prefab })
  public prefabPipes = null;

  @property({ type: Node })
  public pipePoolHome: Node;

  public pool = new NodePool();
  public createdPipe: Node;

  initPool() {
    const initCount = 3;
    for (let i = 0; i < initCount; i++) {
      this.createdPipe = instantiate(this.prefabPipes);

      if (i === 0) {
        this.pipePoolHome.addChild(this.createdPipe);
      } else {
        this.pool.put(this.createdPipe);
      }
    }
  }

  addPool() {
    if (this.pool.size()) {
      this.createdPipe = this.pool.get();
    } else {
      this.createdPipe = instantiate(this.prefabPipes);
    }

    this.pipePoolHome.addChild(this.createdPipe);
  }

  reset() {
    this.pipePoolHome.removeAllChildren();
    this.pool.clear();
    this.initPool();
  }
}

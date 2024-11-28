import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

const DEFAULT_VOLUMES = [0.1, 0.3, 0.3, 0.3];

@ccclass('CharacterAudio')
export class CharacterAudio extends Component {
  @property({ type: [AudioClip] })
  public clips: AudioClip[] = [];

  @property({ type: AudioSource })
  public audioSource: AudioSource = null;

  onAudioQueue(index: number) {
    const clip: AudioClip = this.clips[index];
    const volume = DEFAULT_VOLUMES[index];
    
    this.audioSource.playOneShot(clip, volume);
  }
}

interface sound {
  parent: any;
  sounds: Array<any>;
  muted: boolean;
}
class Sound implements sound {
  public sounds: Array<any> = [];
  public muted: boolean;
  constructor(public parent: any) {
    this.parent = parent;
  }

  create(src, id, loop = false) {
    let audio = document.createElement("audio");
    audio.src = src;
    audio.id = id;
    audio.muted = true;
    this.sounds.push(audio);
    this.parent.append(audio);

    if (loop) {
      audio.setAttribute("loop", "")
    }

    return audio;
  }

  soundSetting() {
    let soundItems = document.querySelectorAll(".sound_wrap");
    for (let soundItem of soundItems) {
      soundItem.addEventListener("click", (e) => {
        this.muteToggle();
      });
    }
  }

  muteToggle() {
    if (!this.muted) {
      for (let sound of this.sounds) {
        sound.muted = true;
      }
      document.querySelector("#sound_speaker").innerHTML = "\u{1F507}";
      document.querySelector("#sound_description").innerHTML = "off";
      this.muted = true;
    } else {
      for (let sound of this.sounds) {
        sound.muted = false;
      }
      document.querySelector("#sound_speaker").innerHTML = "\u{1F509}";
      document.querySelector("#sound_description").innerHTML = "on";
      this.muted = false;
    }
  }

  pause() {
    for (let sound of this.sounds) {
      sound.pause();
    }
  }

  play() {
    for (let sound of this.sounds) {
      sound.play();
    }
  }
}

export default Sound;
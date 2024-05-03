import Player from "./Player.js";
import Speech from "./Speech.js";
import Queue from "./Queue.js";
import MapObjects from "./MapObjects.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    console.log("preload");
    MapObjects.preload(this);
    Player.preload(this);
    Speech.preload(this);
  }

  create() {
    console.log("create");

    // Map Elements
    this.mapObjects = new MapObjects();
    this.mapObjects.create(this);

    // Player
    this.player = new Player({ scene: this, x: 8, y: 5, texture: 'player_lily', frame: 'cat_sleep_1' })
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }, false, false);

    // Speech
    this.speechQueue = new Queue();
    this.speech = new Speech();
    this.speech.inputKeys = this.input.keyboard.addKeys({
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
    this.speech.create(this);

    // Welcome
    this.speechQueue.enqueue("Meow! Tap 'Enter' if you can hear me?")
    this.speechQueue.enqueue("Help me move! If you tap 'S', I go down");
    this.speechQueue.enqueue("Meo-awesome! 'WASD' for movement");
    this.speechQueue.enqueue("We did it! You now know meow-movement");

    // Player Interactions with objects
    this.onMeetMapObject(this.player.playerSensor);
  }

  update() {
    console.log("update");
    if (!this.speech.isShowing() && !this.speechQueue.isEmpty) {
      this.speech.show(this.speechQueue.dequeue());
    }
    this.player.update(this);
    this.speech.update(this);
  }

  onMeetMapObject(playerCollider) {
    this.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: other => {
        let otherObjectLabel= other.bodyB.label;
        if (otherObjectLabel.startsWith("map_object")) {
          console.log("START COLLISION" + other.bodyB.label);
          if(otherObjectLabel== "map_object_fish_bowl"){
            let otherObject = this.mapObjects.getObjectMap().get("map_object_fish_bowl");
            console.log(otherObject);
            otherObject.setPosition(180, 220);
          }
        }
      },
      context: this,
    });
  }

}


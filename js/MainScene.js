import Player from "./Player.js";
import Speech from "./Speech.js";
import TheEnd from "./TheEnd.js";
import Queue from "./Queue.js";
import MapObjects from "./MapObjects.js";

const STAGE_BEG = 1
const STAGE_END = 5

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.stage = STAGE_BEG;
  }


  preload() {
    console.log("preload");
    MapObjects.preload(this);
    Player.preload(this);
    Speech.preload(this);
    TheEnd.preload(this);
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

    // The End
    this.theEnd = new TheEnd();
    this.theEnd.create(this);

    // Player Interactions with objects
    this.onMeetMapObject(this.player.playerSensor);

    // Welcome
    // this.stage1_beginning()
    this.stage5_victory()
  }

  update() {
    console.log("update");
    if (this.stage == STAGE_END) {
      return;
    }

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
        let otherObjectLabel = other.bodyB.label;
        if (otherObjectLabel.startsWith("map_object")) {
          console.log("START COLLISION" + other.bodyB.label);

          // TODO: 
          if (otherObjectLabel == "map_object_fish_bowl") {
            let otherObject = this.mapObjects.getObjectMap().get("map_object_fish_bowl");
            console.log(otherObject);
            otherObject.setPosition(180, 220);
          }
        }
      },
      context: this,
    });
  }

  stage1_beginning() {
    this.speechQueue.enqueue("Meow! Tap 'Enter' if you can hear me?")
    this.speechQueue.enqueue("Help me move! If you tap 'S', I go down");
    this.speechQueue.enqueue("Meo-awesome! 'WASD' for movement");
    this.speechQueue.enqueue("We did it! You now know meow-movement");

  }

  stage2_enterHouse() {

  }

  stage3_goldFishFirstInteraction() {

  }

  stage4_itemHunt() {

  }

  stage5_victory() {
    this.stage = STAGE_END;
    this.theEnd.show();
  }

  // TODO: Easter eggs

}


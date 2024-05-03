import Player from "./Player.js";
import Speech from "./Speech.js";
import TheEnd from "./TheEnd.js";
import Queue from "./Queue.js";
import MapObjects from "./MapObjects.js";

const STAGE_BEG = 1;
const STAGE_FISHY = 2;
const STAGE_ITEM_HUNT = 3;
const STAGE_END = 5;

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
    this.stage = STAGE_BEG;
    // this.stage_beginning() // TODO


    // TODO - fast forward
    this.stage = STAGE_END;
    this.stage_ending();

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
    this.mapObjects.update(this);
  }

  onMeetMapObject(playerCollider) {
    this.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: other => {
        let otherObjectLabel = other.bodyB.label;
        if (otherObjectLabel.startsWith("map_object")) {
          console.log("START COLLISION" + other.bodyB.label);


          if (this.stage == STAGE_BEG) { // STAGE 1

            if (otherObjectLabel == "map_object_bone") {
              this.stage = STAGE_FISHY;
              this.speechQueue.enqueue("Something smells fishy...");
            }

          } else if (this.stage == STAGE_FISHY) { // STAGE 2

            if (otherObjectLabel == "map_object_fish_bowl") {
              this.speechQueue.enqueue("The fish are scared. You need to get that goose out of here!");
              this.stage = STAGE_ITEM_HUNT;
            } else if (otherObjectLabel == "map_object_goose") {
              this.speechQueue.enqueue("That goose is scary!")
            }

          } else if (this.stage == STAGE_ITEM_HUNT) { // STAGE 3

            if (otherObjectLabel == "map_object_fish_bowl") {
              this.speechQueue.enqueue("\"Hurry!\", says the fish.");
            } else if (otherObjectLabel == "map_object_goose") {
              this.speechQueue.enqueue("Hmmm... Maybe there's something at home to scare it away!");
            } else if (otherObjectLabel == "map_object_coffee_cup") {
              this.stage_ending();
            } else if (otherObjectLabel == "map_object_fridge") {
              this.speechQueue.enqueue("Someone left the fridge door open. Everything stinks. There's nothing here");
            } else if (otherObjectLabel == "map_object_bone") {
              this.speechQueue.enqueue("The bone just made it angry.");
              this.moveItemOnHunt("map_object_bone")
            }

          } else if (this.stage == STAGE_END) {
            this.stage_ending();
          }
        }
      },
      context: this,
    });
  }

  stage_beginning() {
    this.speechQueue.enqueue("Meow! Tap 'Enter' if you can hear me?")
    this.speechQueue.enqueue("Help me move! If you tap 'S', I go down");
    this.speechQueue.enqueue("Meo-awesome! 'WASD' for movement.");
    this.speechQueue.enqueue("You now know meow-movement");
  }

  stage_ending() {
    this.stage = STAGE_END;
    this.hideGoose()
    this.speech.hide();
    this.theEnd.show();
  }

  moveItemOnHunt(objectKey) {
    let otherObject = this.mapObjects.getObjectMap().get(objectKey);
    otherObject.setPosition(168, 45);
  }

  hideGoose() {
    let coffeeObject= this.mapObjects.getObjectMap().get("map_object_coffee_cup");
    coffeeObject.setPosition(168, 33);

    let gooseObject = this.mapObjects.getObjectMap().get("map_object_goose");
    gooseObject.setPosition(-100, -100);
  }
  // TODO: Easter eggs

}


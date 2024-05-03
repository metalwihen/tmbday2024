import Player from "./Player.js";
import Speech from "./Speech.js";
import Queue from "./Queue.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    console.log("preload");
    Player.preload(this);
    Speech.preload(this);
    this.load.image('tiles', 'assets/images/map/TopDownHouse_FloorsAndWalls.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map/cat-dimension.json');
    this.load.atlas('objects', 'assets/images/objects/objects.png', 'assets/images/objects/objects_atlas.json');

  }

  create() {
    console.log("create");

    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'tiles', 16, 16, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
    layer1.setCollisionByProperty({ collide: true });
    this.matter.world.convertTilemapLayer(layer1);

    // Bathroom
    this.addObjectToMap({ x: 110, y: 90, collide: true, objectKey: "bath_tub" });
    this.addObjectToMap({ x: 105, y: 110, collide: true, objectKey: "toilet_side" });
    this.addObjectToMap({ x: 145, y: 90, collide: true, objectKey: "sink" });
    this.addObjectToMap({ x: 115, y: 85, collide: true, objectKey: "duck" });

    // Kitchen
    this.addObjectToMap({ x: 200, y: 150, collide: true, objectKey: "kitchen_counter" });
    this.addObjectToMap({ x: 105, y: 160, collide: true, objectKey: "fridge" });
    this.addObjectToMap({ x: 170, y: 210, collide: false, objectKey: "rug" });

    // Drawing
    this.addObjectToMap({ x: 80, y: 26, collide: true, objectKey: "book_shelves" });
    this.addObjectToMap({ x: 170, y: 45, collide: true, objectKey: "sofa_big" });
    this.addObjectToMap({ x: 200, y: 58, collide: true, objectKey: "sofa_s_back" })
    this.addObjectToMap({ x: 240, y: 18, collide: true, objectKey: "sofa_s_front" })
    this.addObjectToMap({ x: 210, y: 18, collide: true, objectKey: "coffee_table" })
    this.addObjectToMap({ x: 209, y: 15, collide: true, objectKey: "fish_bowl" })

    // Bathroom Hallway
    this.addObjectToMap({ x: 240, y: 110, collide: true, objectKey: "iron_table" });
    this.addObjectToMap({ x: 200, y: 85, collide: true, objectKey: "shelf" });

    // Dining
    this.addObjectToMap({ x: 50, y: 200, collide: true, objectKey: "table" });
    this.addObjectToMap({ x: 40, y: 165, collide: true, objectKey: "chair_front" });
    this.addObjectToMap({ x: 60, y: 165, collide: true, objectKey: "chair_front" });
    this.addObjectToMap({ x: 40, y: 220, collide: true, objectKey: "chair_back" });
    this.addObjectToMap({ x: 60, y: 220, collide: true, objectKey: "chair_back" });

    // Dining Hallway
    this.addObjectToMap({ x: 60, y: 100, collide: true, objectKey: "record_player" });

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
  }

  update() {
    console.log("update");
    if (!this.speech.isShowing() && !this.speechQueue.isEmpty) {
      this.speech.show(this.speechQueue.dequeue());
    }
    this.player.update(this);
    this.speech.update(this);
  }

  addObjectToMap(info) {
    let { x, y, collide, objectKey} = info
    let object = new Phaser.Physics.Matter.Sprite(this.matter.world, x, y, 'objects', objectKey);
    object.setStatic(true);
    this.add.existing(object);
    if (!collide) {
      object.setCollisionCategory(null);
    }
  }
}


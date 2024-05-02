import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    console.log("preload");
    Player.preload(this);
    this.load.image('tiles', 'assets/images/map/TopDownHouse_FloorsAndWalls.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map/cat-dimension.json');
    this.load.atlas('objects', 'assets/images/objects/objects.png', 'assets/images/objects/objects_atlas.json');
  }

  create() {
    console.log("create");

    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'tiles', 16, 16, 0, 0);
    const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    layer1.setCollisionByProperty({ collide: true });
    this.matter.world.convertTilemapLayer(layer1);

    this.player = new Player({ scene: this, x: 5, y: 5, texture: 'player_lily', frame: 'cat_sleep_1' })
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    // Bathroom
    this.addObjectToMap({x: 110, y: 90, objectKey: "bath_tub"});
    this.addObjectToMap({x: 105, y: 110, objectKey: "toilet_side"});
    this.addObjectToMap({x: 145, y: 90, objectKey: "sink"});
    this.addObjectToMap({x: 115, y: 85, objectKey: "duck"});

    // Kitchen
    this.addObjectToMap({x: 200, y: 150, objectKey: "kitchen_counter"});
    this.addObjectToMap({x: 105, y: 160, objectKey: "fridge"});
    this.addObjectToMap({x: 170, y: 210, objectKey: "rug"});

    // Drawing
    this.addObjectToMap({x: 80, y: 26, objectKey: "book_shelves"});
    this.addObjectToMap({x: 170, y: 45, objectKey: "sofa_big"});
    this.addObjectToMap({x: 200, y: 58, objectKey: "sofa_s_back"})
    this.addObjectToMap({x: 240, y: 18, objectKey: "sofa_s_front"})
    this.addObjectToMap({x: 210, y: 18, objectKey: "coffee_table"})
    this.addObjectToMap({x: 209, y: 15, objectKey: "fish_bowl"})

    // Bathroom Hallway
    this.addObjectToMap({x: 240, y: 110, objectKey: "iron_table"});
    this.addObjectToMap({x: 200, y: 85, objectKey: "shelf"});

    // Dining
    this.addObjectToMap({x: 50, y: 200, objectKey: "table"});
    this.addObjectToMap({x: 40, y: 165, objectKey: "chair_front"});
    this.addObjectToMap({x: 60, y: 165, objectKey: "chair_front"});
    this.addObjectToMap({x: 40, y: 220, objectKey: "chair_back"});
    this.addObjectToMap({x: 60, y: 220, objectKey: "chair_back"});

    // Dining Hallway
   this.addObjectToMap({x: 60, y: 100, objectKey: "record_player"});
  }

  update() {
    console.log("update");
    this.player.update()
  }

  addObjectToMap(info){
    let {x, y, objectKey} = info
    let object = new Phaser.Physics.Matter.Sprite(this.matter.world, x, y, 'objects', objectKey);
    object.setStatic(true);
    this.add.existing(object);
  }
}
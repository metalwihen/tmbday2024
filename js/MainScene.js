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
  }

  create() {
    console.log("create");
    
    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'tiles', 16, 16, 0, 0);
    const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    layer1.setCollisionByProperty({collide: true});
    this.matter.world.convertTilemapLayer(layer1);
    
    this.player = new Player({ scene: this, x: 240, y: 180, texture: 'player_lily', frame: 'cat_sleep_1' })
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })
  }

  update() {
    console.log("update");
    this.player.update()
  }
}
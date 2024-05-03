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

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

    this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    this.load.bitmapFont('gothic', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.xml');
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
    this.addObjectToMap({ x: 110, y: 90, objectKey: "bath_tub" });
    this.addObjectToMap({ x: 105, y: 110, objectKey: "toilet_side" });
    this.addObjectToMap({ x: 145, y: 90, objectKey: "sink" });
    this.addObjectToMap({ x: 115, y: 85, objectKey: "duck" });

    // Kitchen
    this.addObjectToMap({ x: 200, y: 150, objectKey: "kitchen_counter" });
    this.addObjectToMap({ x: 105, y: 160, objectKey: "fridge" });
    this.addObjectToMap({ x: 170, y: 210, objectKey: "rug" });

    // Drawing
    this.addObjectToMap({ x: 80, y: 26, objectKey: "book_shelves" });
    this.addObjectToMap({ x: 170, y: 45, objectKey: "sofa_big" });
    this.addObjectToMap({ x: 200, y: 58, objectKey: "sofa_s_back" })
    this.addObjectToMap({ x: 240, y: 18, objectKey: "sofa_s_front" })
    this.addObjectToMap({ x: 210, y: 18, objectKey: "coffee_table" })
    this.addObjectToMap({ x: 209, y: 15, objectKey: "fish_bowl" })

    // Bathroom Hallway
    this.addObjectToMap({ x: 240, y: 110, objectKey: "iron_table" });
    this.addObjectToMap({ x: 200, y: 85, objectKey: "shelf" });

    // Dining
    this.addObjectToMap({ x: 50, y: 200, objectKey: "table" });
    this.addObjectToMap({ x: 40, y: 165, objectKey: "chair_front" });
    this.addObjectToMap({ x: 60, y: 165, objectKey: "chair_front" });
    this.addObjectToMap({ x: 40, y: 220, objectKey: "chair_back" });
    this.addObjectToMap({ x: 60, y: 220, objectKey: "chair_back" });

    // Dining Hallway
    this.addObjectToMap({ x: 60, y: 100, objectKey: "record_player" });

    // Player
    this.player = new Player({ scene: this, x: 5, y: 5, texture: 'player_lily', frame: 'cat_sleep_1' })
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    })


        createTextBox(this, 10, 10, { wrapWidth: 100,})
            .start("Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.", 50);
  }

  update() {
    console.log("update");
    this.player.update(this)
  }

  addObjectToMap(info) {
    let { x, y, objectKey } = info
    let object = new Phaser.Physics.Matter.Sprite(this.matter.world, x, y, 'objects', objectKey);
    object.setStatic(true);
    this.add.existing(object);
  }
}

const COLOR_PRIMARY = 0x6B8799;
const COLOR_LIGHT = 0xA5BBC7;

var createTextBox = function (scene) {
    var x = 10;
    var y = 210;
    var wrapWidth = 200;
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: null, // scene.add.image(0, 0, 'fish_bowl').setTint(COLOR_LIGHT).setVisible(true),

            text: scene.add.bitmapText(0, 0, 'gothic').setFontSize(12).setMaxWidth(wrapWidth),

            action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 4,
                right: 4,
                top: 2,
                bottom: 2,
                icon: 5,
                text: 5,
            },
      
            page: {
                maxLines: 2
            }
        })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}
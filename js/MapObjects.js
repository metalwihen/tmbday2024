
export default class MapObjects {

    constructor() {
    }

    static preload(scene) {
        scene.load.image('tiles', 'assets/images/map/TopDownHouse_FloorsAndWalls.png');
        scene.load.tilemapTiledJSON('map', 'assets/images/map/cat-dimension.json');
        scene.load.atlas('objects', 'assets/images/objects/objects.png', 'assets/images/objects/objects_atlas.json');
    }

    create(scene) {
        // Map Tiles
        const map = scene.make.tilemap({ key: 'map' });
        scene.map = map;

        const tileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'tiles', 16, 16, 0, 0);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        layer1.setCollisionByProperty({ collide: true });
        scene.matter.world.convertTilemapLayer(layer1);

        // Bathroom
        this.addObjectToMap(scene,{ x: 110, y: 90, collide: true, objectKey: "bath_tub" });
        this.addObjectToMap(scene,{ x: 105, y: 110, collide: true, objectKey: "toilet_side" });
        this.addObjectToMap(scene,{ x: 145, y: 90, collide: true, objectKey: "sink" });
        this.addObjectToMap(scene,{ x: 115, y: 85, collide: true, objectKey: "duck" });

        // Kitchen
        this.addObjectToMap(scene,{ x: 200, y: 150, collide: true, objectKey: "kitchen_counter" });
        this.addObjectToMap(scene,{ x: 105, y: 160, collide: true, objectKey: "fridge" });
        this.addObjectToMap(scene,{ x: 170, y: 210, collide: false, objectKey: "rug" });

        // Drawing
        this.addObjectToMap(scene,{ x: 80, y: 26, collide: true, objectKey: "book_shelves" });
        this.addObjectToMap(scene,{ x: 170, y: 45, collide: true, objectKey: "sofa_big" });
        this.addObjectToMap(scene,{ x: 200, y: 58, collide: true, objectKey: "sofa_s_back" })
        this.addObjectToMap(scene,{ x: 240, y: 18, collide: true, objectKey: "sofa_s_front" })
        this.addObjectToMap(scene,{ x: 210, y: 18, collide: true, objectKey: "coffee_table" })
        this.addObjectToMap(scene,{ x: 209, y: 15, collide: true, objectKey: "fish_bowl" })

        // Bathroom Hallway
        this.addObjectToMap(scene,{ x: 240, y: 110, collide: true, objectKey: "iron_table" });
        this.addObjectToMap(scene,{ x: 200, y: 85, collide: true, objectKey: "shelf" });

        // Dining
        this.addObjectToMap(scene,{ x: 50, y: 200, collide: true, objectKey: "table" });
        this.addObjectToMap(scene,{ x: 40, y: 165, collide: true, objectKey: "chair_front" });
        this.addObjectToMap(scene,{ x: 60, y: 165, collide: true, objectKey: "chair_front" });
        this.addObjectToMap(scene,{ x: 40, y: 220, collide: true, objectKey: "chair_back" });
        this.addObjectToMap(scene,{ x: 60, y: 220, collide: true, objectKey: "chair_back" });

        // Dining Hallway
        this.addObjectToMap(scene,{ x: 60, y: 100, collide: true, objectKey: "record_player" });
    }

    update(scene) {

    }

    addObjectToMap(scene, info) {
        let { x, y, collide, objectKey } = info
        let object = new Phaser.Physics.Matter.Sprite(scene.matter.world, x, y, 'objects', objectKey);
        object.setStatic(true);
        scene.add.existing(object);
        if (!collide) {
            object.setCollisionCategory(null);
        }
    }

}
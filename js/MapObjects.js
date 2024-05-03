
// Ref: https://penzilla.itch.io/top-down-retro-interior
// Ref: https://shubibubi.itch.io/cozy-interior
// Ref: https://rascarcapack.itch.io/pixel-geese-anim-spritesheet

export default class MapObjects {

    constructor() {
        this.objectMap = new Map();
    }

    static preload(scene) {
        scene.load.image('tiles', 'assets/images/map/TopDownHouse_FloorsAndWalls.png');
        scene.load.tilemapTiledJSON('map', 'assets/images/map/cat-dimension.json');
        scene.load.atlas('objects', 'assets/images/objects/objects.png', 'assets/images/objects/objects_atlas.json');

        // Goose 
        scene.load.atlas('goose', 'assets/images/objects/goose.png', 'assets/images/objects/goose_atlas.json');
        scene.load.animation('goose_anim', 'assets/images/objects/goose_anim.json');
    }

    getObjectMap() {
        return this.objectMap;
    }

    create(scene) {
        // Map Tiles
        const map = scene.make.tilemap({ key: 'map' });
        scene.map = map;

        const tileset = map.addTilesetImage('TopDownHouse_FloorsAndWalls', 'tiles', 16, 16, 0, 0);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        layer1.setCollisionByProperty({ collide: true });
        this.layer1 = layer1;
        scene.matter.world.convertTilemapLayer(layer1);
        
        // Bathroom
        this.addObjectToMap(scene, { x: 110, y: 90, collide: true, objectKey: "bath_tub" });
        this.addObjectToMap(scene, { x: 105, y: 110, collide: true, objectKey: "toilet_side" });
        this.addObjectToMap(scene, { x: 145, y: 90, collide: true, objectKey: "sink" });

        // Kitchen
        this.addObjectToMap(scene, { x: 200, y: 150, collide: true, objectKey: "kitchen_counter" });
        this.addObjectToMap(scene, { x: 105, y: 160, collide: true, objectKey: "fridge" });
        this.addObjectToMap(scene, { x: 170, y: 210, collide: false, objectKey: "rug" });

        // Drawing
        this.addObjectToMap(scene, { x: 80, y: 26, collide: true, objectKey: "book_shelves" });
        this.addObjectToMap(scene, { x: 170, y: 45, collide: true, objectKey: "sofa_big" });
        this.addObjectToMap(scene, { x: 200, y: 58, collide: true, objectKey: "sofa_s_back" })
        this.addObjectToMap(scene, { x: 240, y: 18, collide: true, objectKey: "sofa_s_front" })
        this.addObjectToMap(scene, { x: 210, y: 18, collide: true, objectKey: "coffee_table" })
        this.addObjectToMap(scene, { x: 209, y: 18, collide: true, objectKey: "fish_bowl" })

        // Bathroom Hallway
        this.addObjectToMap(scene, { x: 240, y: 110, collide: true, objectKey: "iron_table" });
        this.addObjectToMap(scene, { x: 200, y: 85, collide: true, objectKey: "shelf" });

        // Dining
        this.addObjectToMap(scene, { x: 50, y: 200, collide: true, objectKey: "table" });
        this.addObjectToMap(scene, { x: 40, y: 165, collide: true, objectKey: "chair_front" });
        this.addObjectToMap(scene, { x: 60, y: 165, collide: true, objectKey: "chair_front" });
        this.addObjectToMap(scene, { x: 40, y: 220, collide: true, objectKey: "chair_back" });
        this.addObjectToMap(scene, { x: 60, y: 220, collide: true, objectKey: "chair_back" });

        // Dining Hallway
        this.addObjectToMap(scene, { x: 60, y: 100, collide: true, objectKey: "record_player" });

        // Items
        this.addObjectToMap(scene, { x: 230, y: 205, collide: true, objectKey: "bone" });
        this.addObjectToMap(scene, { x: 115, y: 85, collide: true, objectKey: "rubber_duck" });
        this.addObjectToMap(scene, { x: 30, y: 192, collide: true, objectKey: "coffee_cup" });

        // Goose 
        let gooseObject = new Phaser.Physics.Matter.Sprite(scene.matter.world, 170, 25, 'goose','2');
        let gooseKey = 'map_object_goose';
        gooseObject.body.label = gooseKey;
        this.objectMap.set(gooseKey, gooseObject);
        gooseObject.setStatic(true);
        scene.add.existing(gooseObject);
        gooseObject.anims.play('goose_idle', true);
        console.log(this.objectMap);
    }

    update(scene){
    }

    getTileLayer() {
        return this.layer1;
    }

    addObjectToMap(scene, info) {
        let { x, y, collide, objectKey, detectPlayerCollision } = info
        let object = new Phaser.Physics.Matter.Sprite(scene.matter.world, x, y, 'objects', objectKey);
        if (!collide) {
            object.setCollisionCategory(null);
        } else {
            // const { Bodies } = Phaser.Physics.Matter.Matter;
            // var collider = Bodies.circle(x, y, 16, { isSensor: true, label: objectKey });
            // object.setExistingBody(collider);
            let key = 'map_object_' + objectKey;
            object.body.label = key;
            this.objectMap.set(key, object);
        }
        object.setStatic(true);
        scene.add.existing(object);
    }
}
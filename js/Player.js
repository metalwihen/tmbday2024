export default class Player extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y,3, {isSensor: false, label: "playerCollider"});
        var playerSensor = Bodies.circle(this.x, this.y, 12, {isSensor: true, label: "playerSensor"});
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        })
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.atlas('player_lily', 'assets/images/player/player_lily.png', 'assets/images/player/player_lily_atlas.json');
        scene.load.animation('player_lily_anim', 'assets/images/player/player_lily_anim.json');
    }

    update(scene) {
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        let playerAnimation = "idle"
        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
            playerAnimation = "walk_left";
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
            playerAnimation = "walk_right";
        } else if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
            playerAnimation = "walk_up";
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
            playerAnimation = "walk_down";
        } else if(this.inputKeys.enter.isDown){
            playerVelocity.y = 0;
            playerAnimation = "walk_up";
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);

        this.anims.play(playerAnimation, true);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
}
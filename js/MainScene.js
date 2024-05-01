export default class MainScene extends Phaser.Scene {
  constructor(){
    super("MainScene");
  }

  preload() {
    console.log("preload");
    this.load.atlas('player_lily','assets/images/player/player_lily.png','assets/images/player/player_lily_atlas.json');
    this.load.animation('player_lily_anim','assets/images/player/player_lily_anim.json');
  }

  create(){
    console.log("create");
    
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    this.player = new Phaser.Physics.Matter.Sprite(this.matter.world,100,100,'player_lily','cat_sleep_1');
    this.add.existing(this.player);
  }

  update(){
    console.log("update");
    
    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    if(this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
      this.player.anims.play("walk_left",true);
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      this.player.anims.play("walk_right",true);
    } else if(this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
      this.player.anims.play("walk_up",true);
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
      this.player.anims.play("walk_down",true);
    } else {
      this.player.anims.play("idle",true);
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.player.setVelocity(playerVelocity.x,playerVelocity.y);
  }
}
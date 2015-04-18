var wKey;
var aKey;
var sKey;
var dKey;


var Player = function(game) {
  this.game = game;
  this.ninja = null;

  this.edgeTimer = 0;
  this.jumpSpeed = 350;
  this.jumpTimer = 0;
  this.moveSpeed = 150;
  this.facing = 'right';
  this.wasStanding = false;

  // this.game.load.spritesheet('ninja', 'assets/images/ninja2.png', 18, 18, 25);
  this.ninja = this.game.add.sprite(32,32, 'ninja');
  this.game.physics.arcade.enable(this.ninja);
  
  this.ninja.anchor.setTo(0.5, 0.5);
  this.ninja.animations.add('right', [2, 3], 15, true);
  this.ninja.animations.add('left', [4, 5], 15, true);

  this.ninja.body.collideWorldBounds = true;
  this.ninja.body.gravity.y = 750;
  this.game.camera.follow(this.ninja, Phaser.Camera.FOLLOW_PLATFORMER);

  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


};

Player.prototype = {
  movements: function(layer) {

    this.game.physics.arcade.collide(this.ninja, layer);

    var standing = this.ninja.body.blocked.down || this.ninja.body.touching.down;

    this.ninja.body.velocity.x = 0;

    if (aKey.isDown) {
      this.ninja.body.velocity.x = -this.moveSpeed;
      if (this.facing !== 'left') {
        // this.ninja.animations.play('left');
        this.ninja.play('left');
        this.facing = 'left';
      }
      if (this.ninja.body.blocked.down === false) {
        this.ninja.frame = 7;
      }
    }else if (dKey.isDown) {
      this.ninja.body.velocity.x = this.moveSpeed;
      if (this.facing !== 'right') {
        // this.ninja.animations.play('right');
        this.ninja.play('right');
        this.facing = 'right';
      }
      if (this.ninja.body.blocked.down === false) {
        this.ninja.frame = 6;
      }
    }else {
      if (this.facing !== 'idle') {
        this.ninja.animations.stop();
        if(this.facing === 'left') {
          this.ninja.frame = 1;
        }else {
          this.ninja.frame = 0;
        }
        facing = 'idle';
      }
    }


    //Show Attack Frame
    if (spaceKey.isDown) {
      if (this.facing === 'left') {
        if (this.ninja.body.blocked.down === false) {
          this.ninja.frame = 11;
        }else {
          this.ninja.frame = 9;
        }
      }else {
        if (this.ninja.body.blocked.down === false) {
          this.ninja.frame = 10;
        }else {
          this.ninja.frame = 8;
        }
      }
    }

    if (!standing && this.wasStanding) {
      this.edgeTimer = this.game.time.now + 250;
    }

    if ((standing || this.game.time.now <= this.edgeTimer) && wKey.isDown && this.game.time.now > this.jumpTimer) {
      this.ninja.body.velocity.y = -this.jumpSpeed;
      this.jumpTimer = this.game.time.now + 750;
    }
    this.wasStanding = standing;

    //Lower Jump Height if released early
    wKey.onUp.add(function() {
      if (this.ninja.body.velocity.y < -150) {
        this.ninja.body.velocity.y = -100;
      }
    }, this);



  }
};

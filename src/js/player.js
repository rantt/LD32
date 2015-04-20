var wKey;
var aKey;
var sKey;
var dKey;


var Player = function(game,x, y) {
  this.game = game;
  this.ninja = null;

  this.jumpSnd = this.game.add.sound('jump');
  this.jumpSnd.volume = 0.5;


  this.slashSnd = this.game.add.sound('slash');
  this.slashSnd.volume = 0.2;

  this.edgeTimer = 0;
  this.jumpSpeed = 350;
  this.jumpTimer = 0;
  this.moveSpeed = 150;
  this.facing = 'right';
  this.wasStanding = false;
  this.isAttacking = false;
  this.currentWeaponName = 'celery';
  this.currentWeapon = null;
  this.standing = false;

  // this.game.load.spritesheet('ninja', 'assets/images/ninja2.png', 18, 18, 25);
  this.ninja = this.game.add.sprite(x,y, 'ninja');
  this.ninja.health = 100;
  this.game.physics.arcade.enable(this.ninja);
  this.ninja.anchor.setTo(0.5, 0.5);
  this.ninja.body.setSize(10, 18);
  this.ninja.animations.add('right', [2, 3], 10, true);
  this.ninja.animations.add('left', [4, 5], 10, true);

  this.ninja.body.collideWorldBounds = true;
  // this.ninja.checkWorldBounds = true;
  // this.ninja.outOfBoundsKill = true;
  this.ninja.body.gravity.y = 750;
  this.game.camera.follow(this.ninja, Phaser.Camera.FOLLOW_PLATFORMER);


  //Weapons
  this.celery = this.game.add.sprite(0,0, 'celery');
  this.game.physics.arcade.enable(this.celery);
  this.celery.anchor.setTo(0.5, 0.5);
  this.celery.alive = false;
  this.celery.body.immovable = true; 
  this.celery.animations.add('swing', [0,1,2,3,4,5,6], 30, false);





  //Setup WASD and extra keys
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

  spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = this.game.input.keyboard.createCursorKeys();


};

Player.prototype = {
  movements: function() {

    this.standing = this.ninja.body.blocked.down || this.ninja.body.touching.down;

    this.ninja.body.velocity.x = 0;

    if (aKey.isDown || this.cursors.left.isDown) {
      this.ninja.body.velocity.x = -this.moveSpeed;
      this.ninja.body.setSize(10, 18, 2, 0);
        this.ninja.play('left');
      if (this.facing !== 'left') {
        // this.ninja.animations.play('left');
        this.facing = 'left';
      }
      // if (this.ninja.body.blocked.down === false) {
      if (this.standing === false) {
        this.ninja.frame = 7;
      }
    }else if (dKey.isDown || this.cursors.right.isDown) {
      this.ninja.body.velocity.x = this.moveSpeed;
      this.ninja.body.setSize(10, 18, -2, 0);
        this.ninja.play('right');
      if (this.facing !== 'right') {
        // this.ninja.animations.play('right');
        // this.ninja.play('right');
        this.facing = 'right';
      }
      // if (this.ninja.body.blocked.down === false) {
      if (this.standing === false) {
        this.ninja.frame = 6;
      }
    }else {
      // if (this.facing !== 'idle') {
        this.ninja.animations.stop();
        
        this.ninja.body.setSize(10, 18, 0, 0);
        if(this.facing === 'left') {
          this.ninja.frame = 1;
        }else {
          this.ninja.frame = 0;
        }
        // this.facing = 'idle';
      // }
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
      this.attack();
    }

    if (!this.standing && this.wasStanding) {
      this.edgeTimer = this.game.time.now + 250;
    }

    if ((this.standing || this.game.time.now <= this.edgeTimer) && (wKey.isDown || this.cursors.up.isDown) && this.game.time.now > this.jumpTimer) {

      this.jumpSnd.play();
      this.ninja.body.velocity.y = -this.jumpSpeed;
      this.jumpTimer = this.game.time.now + 750;
    }
    this.wasStanding = this.standing;

    //Lower Jump Height if released early
    wKey.onUp.add(function() {
      if (this.ninja.body.velocity.y < -150) {
        this.ninja.body.velocity.y = -100;
      }
    }, this);

    this.cursors.up.onUp.add(function() {
      if (this.ninja.body.velocity.y < -150) {
        this.ninja.body.velocity.y = -100;
      }
    }, this);

  },
  attack: function() {

    // if (this.facing === 'right' || this.ninja.frame === 0 || this.ninja.frame === 8 || this.ninja.frame === 10) {
    if (this.facing === 'right') {
      this.celery.x = this.ninja.x + 18;
    }else {
      this.celery.x = this.ninja.x - 18;
    }

    this.celery.y = this.ninja.y;

    if (this.currentWeaponName === 'celery') {
      this.currentWeapon = this.celery;
      if (spaceKey.isDown && this.isAttacking === false) {
          this.slashSnd.play();
        // if (this.facing === 'right' || this.ninja.frame === 0 || this.ninja.frame === 8 || this.ninja.frame === 10) {
        if (this.facing === 'right') {
          this.celery.scale.x = 1;
        }else {
          this.celery.scale.x = -1;
        }
        this.celery.reset(this.ninja.x, this.ninja.y);
        this.celery.play('swing');
        this.isAttacking = true;

        this.celery.events.onAnimationComplete.add(function() {
          this.celery.kill();
        }, this);
      }
    }

    spaceKey.onUp.add(function() {
      this.isAttacking = false;
      this.currentWeapon = null;
    }, this);


  },
};

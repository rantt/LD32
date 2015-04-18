var wKey;
var aKey;
var sKey;
var dKey;


var Player = function(game) {
  this.game = game;
  this.ninja = null;
  this.shadow = null;
  this.ninjaSpeed = 75;
  this.shadowSpeed = 150;
  this.meditating = false;
  this.ninja = this.game.add.sprite(0, 0, 'player');
  this.game.physics.arcade.enable(this.ninja);
  this.ninja.body.collideWorldBounds = true;

  this.shadow = this.game.add.sprite(0, 0, 'shadow');
  this.shadow.alpha = 0;  
  this.game.physics.arcade.enable(this.shadow);
  this.shadow.body.collideWorldBounds = true;

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
    this.game.physics.arcade.collide(this.shadow, layer);

    this.ninja.body.velocity.x = 0;
    this.ninja.body.velocity.y = 0;

    this.shadow.body.velocity.x = 0;
    this.shadow.body.velocity.y = 0;

    if (spaceKey.isDown && this.switching === false) {
      this.meditating = !this.meditating;
      this.switching = true;
    }
    spaceKey.onUp.add(function() {
      this.switching = false;
      if (this.meditating) {
        this.shadow.alpha = 1;
        this.shadow.x = this.ninja.x;
        this.shadow.y = this.ninja.y;
      }else {
        this.shadow.alpha = 0;
      }
    },this);


    if (this.meditating) {
      if (wKey.isDown) {
        this.shadow.body.velocity.y = -this.shadowSpeed;
      }else if (sKey.isDown) {
        this.shadow.body.velocity.y = this.shadowSpeed;
      }else if (aKey.isDown) {
        this.shadow.body.velocity.x = -this.shadowSpeed;
      }else if (dKey.isDown) {
        this.shadow.body.velocity.x = this.shadowSpeed;
      }
    }else {
       if (wKey.isDown) {
        this.ninja.body.velocity.y = -this.ninjaSpeed;
      }else if (sKey.isDown) {
        this.ninja.body.velocity.y = this.ninjaSpeed;
      }else if (aKey.isDown) {
        this.ninja.body.velocity.x = -this.ninjaSpeed;
      }else if (dKey.isDown) {
        this.ninja.body.velocity.x = this.ninjaSpeed;
      }     
    }    


  }
};

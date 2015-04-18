/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = this.game.add.sprite(Game.w/2, Game.h/2, 'player')
    this.game.physics.arcade.enable(this.player)

    this.shadow = this.game.add.sprite(Game.w/2+64, Game.h/2, 'shadow')
    this.game.physics.arcade.enable(this.shadow)

    this.playerSpeed = 50;
    this.shadowSpeed = 150;
    this.meditating = false;


    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },

  update: function() {

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    this.shadow.body.velocity.x = 0;
    this.shadow.body.velocity.y = 0;
    // spaceKey.onDown.add(function() {
    //   this.meditating = !this.meditating;
    // }, this);

    if (spaceKey.isDown && this.switching === false) {
      this.meditating = !this.meditating;
      this.switching = true;
    }
    spaceKey.onUp.add(function() {
      this.switching = false;
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
        this.player.body.velocity.y = -this.playerSpeed;
      }else if (sKey.isDown) {
        this.player.body.velocity.y = this.playerSpeed;
      }else if (aKey.isDown) {
        this.player.body.velocity.x = -this.playerSpeed;
      }else if (dKey.isDown) {
        this.player.body.velocity.x = this.playerSpeed;
      }     
    }    



    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   this.game.debug.text('Meditating: ' + this.meditating, 32, 96);
  // }

};

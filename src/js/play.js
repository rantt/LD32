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

    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles', 'tiles');
    this.map.setCollision(2);
    
    this.layer = this.map.createLayer('layer1') 

    this.layer.resizeWorld();

    console.log(this.map.getObjectIndex('start'))
    console.log(this.map.getObjectIndex('end'))

    // this.map.createFromObjects('objects', 4, 'player', 0, true, false);

    this.player = this.game.add.sprite(0, 0, 'player')
    this.game.physics.arcade.enable(this.player)
    this.player.body.collideWorldBounds = true;

    this.shadow = this.game.add.sprite(0, 0, 'shadow')
    this.shadow.alpha = 0;  
    this.game.physics.arcade.enable(this.shadow)
    this.shadow.body.collideWorldBounds = true;

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
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.shadow, this.layer);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

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
        this.shadow.x = this.player.x;
        this.shadow.y = this.player.y;
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

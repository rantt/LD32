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

    this.player = new Player(this.game);


    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);


  },

  update: function() {

    this.player.movements(this.layer);

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
  render: function() {
    this.game.debug.body(this.player.ninja);
  //   this.game.debug.text('Meditating: ' + this.meditating, 32, 96);
  }

};

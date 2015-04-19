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


Game.Day = function(game) {
  this.game = game;
};

Game.Day.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.game.add.tileSprite(0, 0, 1920, 200, 'background_day');

    // this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    // this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);



    this.map = this.game.add.tilemap('map_day');



    this.map.addTilesetImage('tiles', 'tiles');
    // this.map.setCollision(1);
    this.map.setCollision(2);
    this.map.setCollision(3);
    this.map.setCollision(4);
    this.map.setCollision(5);
    this.map.setCollision(6);
    // this.map.createFromObjects('objects', 8, 'crate', 0, true, false, this.crates); 
    
    this.layer = this.map.createLayer('layer1'); 
    this.layer.resizeWorld();

    this.crates = this.game.add.group();
    this.crates.enableBody = true;
    // this.crates.immovable = true;

    this.map.createFromObjects('objects', 8, 'tiles', 7, true, false, this.crates); 

    this.crates.forEach(function(crate) {
      crate.body.immovable = true;
      // this.game.debug.body(crate);  
      // console.log(crate);
    },this);

    this.player = new Player(this.game);

    this.crate_emitter = this.game.add.emitter(0, 0, 100);
    this.crate_emitter.makeParticles('crate_debris');
    this.crate_emitter.gravity = 500;
    this.crate_emitter.minParticleSpeed.setTo(-100, -100);
    this.crate_emitter.maxParticleSpeed.setTo(100, 100);

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

  },

  update: function() {
    // this.game.physics.arcade.collide(this.player.ninja, this.crates);
    
    // this.game.physics.arcade.overlap(this.player.ninja, this.crates, function() {
    // },null, this);
    
    this.game.physics.arcade.collide(this.player.ninja, this.layer);
    this.game.physics.arcade.collide(this.player.ninja, this.crates);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.crates, this.breakCrate, null, this);
    this.player.movements(this.layer);

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  breakCrate: function(player, crate) {
    this.crate_emitter.x = crate.x;
    this.crate_emitter.y = crate.y;
    this.crate_emitter.start(true, 500, null, 32);
    crate.kill();
    console.log('shit happened');

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
    // this.game.debug.body(this.player.ninja);
    // this.game.debug.text('Standing: ' + this.player.standing, 32, this.game.height - 96);
    // this.game.debug.text('facing: ' + this.player.facing, 32, this.game.height - 64);
  }

};

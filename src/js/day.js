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

    // this.game.add.tileSprite(0, 0, 1920, 200, 'background_day');

    // this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    // this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('map_day');

    // this.game.add.tileSprite(0, 0, 1920, 200, 'background_day');
    this.game.add.tileSprite(0, 0, this.map.tileWidth*this.map.width, this.map.tileWidth*this.map.height, 'background_day');
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
    //
    this.mobs = this.game.add.group();
    this.mobs.enableBody = true;
    this.mobSpeed = 70;

    this.map.createFromObjects('objects', 8, 'tiles', 7, true, false, this.crates); 
    this.map.createFromObjects('objects', 9, 'ninja_mob', 0, true, false, this.mobs); 

    this.crates.forEach(function(crate) {
      crate.body.immovable = true;
      crate.anchor.setTo(0.5, 0.5);
      crate.x = crate.x + this.map.tileWidth/2;
      crate.y = crate.y + this.map.tileWidth/2;
      // this.game.debug.body(crate);  
      // console.log(crate);
    },this);

    this.mobs.forEach(function(mob) {
      console.log('ima mob');
      mob.body.immovable = true;
      // mob.body.gravity.y = 750;
      mob.initialx = mob.x;
      // mob.initialy = mob.y;
      mob.minX = mob.x - this.map.tileWidth*mob.patrol;
      mob.maxX = mob.x + this.map.tileWidth*mob.patrol;
      mob.tint = 0xfff392;
      mob.body.velocity.x = -this.mobSpeed;
      mob.direction = -1;
      mob.animations.add('right', [2, 3], 10, true);
      mob.animations.add('left', [4, 5], 10, true);
      mob.play('left');


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
    this.game.physics.arcade.collide(this.player.ninja, this.mobs);
    
    this.game.physics.arcade.collide(this.mobs, this.layer);
    this.game.physics.arcade.overlap(this.mobs, this.layer, this.mobBounce, null, this);
    this.game.physics.arcade.overlap(this.mobs, this.crates, this.mobBounce, null, this);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.mobs, this.killMobs, null, this);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.crates, this.breakCrate, null, this);

    this.mobs.forEach(function(mob) {
      if (mob.patrol) {
        if (mob.x < mob.minX) {
          mob.body.velocity.x = this.mobSpeed;
          mob.play('right');
        }else if (mob.x > mob.maxX) {
          mob.body.velocity.x = -this.mobSpeed;
          mob.play('left');
        }
      }
      // mob.direction *= -1;

      // if (mob.direction < 0) {
      //   mob.body.velocity.x = this.mobSpeed;
      //   mob.play('right');
      // }else {
      //   mob.body.velocity.x = -this.mobSpeed;
      //   mob.play('left');
      // }
      // if (mob.body.blocked.left || mob.body.blocked.right) {
      //   mob.direction *= -1;
      // }


      // var standing = mob.body.blocked.down || mob.body.touching.down;
      // if (!standing) {
      //   this.mobBounce(mob, this.layer);
      // }
    },this);

    this.player.movements(this.layer);

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  breakCrate: function(weapon, crate) {
    this.crate_emitter.x = crate.x;
    this.crate_emitter.y = crate.y;
    this.crate_emitter.start(true, 500, null, 32);
    crate.kill();
  },
  mobBounce: function(mob, layer) {
    console.log('gotta bounce homie'+ mob.body.velocity.x);
    if (mob.direction < 0) {
      mob.body.velocity.x = this.mobSpeed;
      mob.play('right');
    }else {
      mob.body.velocity.x = -this.mobSpeed;
      mob.play('left');
    }
    mob.direction *= -1;
    // mob.body.velocity.x *= -1;
  },
  killMobs: function(weapon, mob) {
   var t = this.game.add.tween(mob).to({tint: 0xff0000},10).to({tint: 0xfff392}, 10).start(); 

   t.onComplete.add(function() {
    mob.kill();
   }, this);
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
    // this.game.debug.body(this.player.celery);
    // this.game.debug.text('Standing: ' + this.player.standing, 32, this.game.height - 96);
    // this.game.debug.text('facing: ' + this.player.facing, 32, this.game.height - 64);
  }

};

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

    this.hitSnd = this.game.add.sound('player_hit');
    this.hitSnd.volume = 0.5;

    this.mobSnd = this.game.add.sound('mob_hit');
    this.mobSnd.volume = 0.5;

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

    //Carrot Bricks
    this.map.setCollision(11);
    this.map.setCollision(12);
    // this.map.createFromObjects('objects', 8, 'crate', 0, true, false, this.crates); 
    
    this.layer = this.map.createLayer('layer1'); 
    this.layer.resizeWorld();

    this.crates = this.game.add.group();
    this.crates.enableBody = true;

    this.exits = this.game.add.group();
    this.exits.enableBody = true;
    // this.crates.immovable = true;
    //
    this.mobs = this.game.add.group();
    this.mobs.enableBody = true;
    this.mobSpeed = 70;

    this.map.createFromObjects('objects', 8, 'tiles', 7, true, false, this.crates); 
    this.map.createFromObjects('objects', 9, 'ninja_mob', 0, true, false, this.mobs); 
    this.map.createFromObjects('objects', 10, 'tiles', 9, true, false, this.exits); 

    this.crates.forEach(function(crate) {
      crate.body.immovable = true;
      crate.anchor.setTo(0.5, 0.5);
      crate.x = crate.x + this.map.tileWidth/2;
      crate.y = crate.y + this.map.tileWidth/2;
      // this.game.debug.body(crate);  
      // console.log(crate);
    },this);

    this.mobs.forEach(function(mob) {
      mob.x = mob.x + mob.width/2;
      mob.y = mob.y + mob.height/2;
      mob.body.immovable = true;
      mob.anchor.setTo(0.5, 0.5);
      mob.body.setSize(10,18);
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

    this.startX = 32;
    this.startY = 180;
    this.player = new Player(this.game, this.startX, this.startY);


    // this.playerHealthText = this.game.add.bitmapText(32, 32, 'minecraftia', 'Health', 12);
    this.playerHealthBar = this.game.add.sprite(8, 8, this.drawRect(64, 4, '#33ff00'));
    this.playerHealthBar.fixedToCamera = true;

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
  drawRect:  function(width, height, color) {
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  },
  update: function() {
    // this.game.physics.arcade.collide(this.player.ninja, this.crates);
    
    // this.game.physics.arcade.overlap(this.player.ninja, this.crates, function() {
    // },null, this);

    if (this.player.ninja.y >= this.map.tileWidth*this.map.height-this.player.ninja.height) {
      //player fell down a pit
      this.playerDead();
    }
    
    this.playerHealthBar.scale.x = this.player.ninja.health/100;
    
    this.game.physics.arcade.collide(this.player.ninja, this.layer);
    this.game.physics.arcade.collide(this.player.ninja, this.crates);
    // this.game.physics.arcade.collide(this.player.ninja, this.mobs);
    this.game.physics.arcade.overlap(this.player.ninja, this.mobs, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player.ninja, this.exits, this.nextLevel, null, this);
    
    this.game.physics.arcade.collide(this.mobs, this.layer);
    // this.game.physics.arcade.overlap(this.mobs, this.layer, this.mobBounce, null, this);
    // this.game.physics.arcade.overlap(this.mobs, this.crates, this.mobBounce, null, this);
    
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.mobs, this.killMobs, null, this);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.crates, this.breakCrate, null, this);
    // this.game.debug.body(this.player.ninja);


    this.mobs.forEach(function(mob) {
      // this.game.debug.body(mob);
      if (mob.patrol) {
        if (mob.x < mob.minX) {
          mob.body.velocity.x = this.mobSpeed;
          mob.play('right');
        }else if (mob.x > mob.maxX) {
          mob.body.velocity.x = -this.mobSpeed;
          mob.play('left');
        }
      }
    },this);

    this.player.movements(this.layer);

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  nextLevel: function(ninja, exit) {
      this.game.state.start(exit.destination);
  },
  playerHit:  function(ninja, mob) {
    if (this.takingDmg) {return;}
    this.takingDmg = true;
    this.hitSnd.play();

    if (mob.alive === true) {
      ninja.health -= 10;
    }

    // this.game.add.tween(ninja).to({x: ninja.x + 20},10).start();
    var t = this.game.add.tween(ninja).to({alpha: 0},200).to({alpha: 1}, 200).start();
    t.onComplete.add(function() {
      this.takingDmg = false;
      if (ninja.health <= 0) {
        this.playerDead();
      }
    },this);
  },
  playerDead: function() {
    this.player.ninja.reset(this.startX, this.startY);
    this.player.ninja.health = 100;
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
   this.mobSnd.play();
   mob.alive = false;
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

    // this.game.debug.text('playerx: ' + this.player.ninja.y, 32, this.game.height - 96);
    // this.game.debug.text('map limit ' + this.map.tileWidth*this.map.height, 32, this.game.height - 64);
  }

};

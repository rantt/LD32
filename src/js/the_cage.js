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


Game.Cage = function(game) {
  this.game = game;
};

Game.Cage.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    this.killCount = 0;
    this.attackTimer = this.game.time.now + 1500;

    // this.game.add.tileSprite(0, 0, 1920, 200, 'background_day');

    // this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    // this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.directionLock = false;

    this.map = this.game.add.tilemap('map_cage');

    // this.score = this.game.add.bitmapText(Game.w/2, 40, 'minecraftia', 'Kills:', 12);

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
    
    this.reflectors = this.game.add.group();
    this.reflectors.enableBody = true;
    this.map.createFromObjects('objects',1,'tiles',0,true, false,this.reflectors);
    
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

    this.mobSpeed = 70;
    this.mobs = this.game.add.group();
    this.mobs.enableBody = true;
    this.mobs.physicsBodyType = Phaser.Physics.ARCADE;
    this.mobs.createMultiple(30, 'ninja_mob', 0, false);
    this.mobs.setAll('body.gravity.y', 350); 
    this.mobs.setAll('anchor.x', 0.5); 
    this.mobs.setAll('anchor.y', 0.5); 
    this.mobs.callAll('animations.add', 'animations', 'right', [2, 3], 10, true, true); 
    this.mobs.callAll('animations.add', 'animations', 'left', [4, 5], 10, true, true); 

    // this.mobs.setAll('direction',1);
    this.mobs.forEach(function(mob) {
      mob.direction = 1;
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

    this.score = this.game.add.bitmapText(Game.w/2+50, 10, 'minecraftia', 'Kills:', 12);
    this.winner = this.game.add.bitmapText(Game.w/2-40, Game.h/2, 'minecraftia', 'You WIN!', 12);
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
    this.score.setText('Kills: ' + this.killCount);

    this.mobs.forEach(function(mob) {
      mob.body.velocity.x = mob.direction*this.mobSpeed;
      if (mob.direction < 0) {
        mob.play('left');
      }else {
        mob.play('right');
      }
    },this);

    if (this.game.time.now > this.attackTimer) {
      var m = this.mobs.getFirstDead();
      m.body.velocity.x = this.mobSpeed;
      m.reset(Game.w/2, 40);
      this.attackTimer = this.game.time.now + 2000;
    }


    if (this.player.ninja.y >= this.map.tileWidth*this.map.height-this.player.ninja.height) {
      //player fell down a pit
      this.playerDead();
    }
    
    this.playerHealthBar.scale.x = this.player.ninja.health/100;

    this.game.physics.arcade.overlap(this.mobs, this.reflectors, this.mobBounce, null, this);    
    this.game.physics.arcade.collide(this.player.ninja, this.layer);
    this.game.physics.arcade.collide(this.player.ninja, this.crates);
    // this.game.physics.arcade.collide(this.player.ninja, this.mobs);
    this.game.physics.arcade.overlap(this.player.ninja, this.mobs, this.playerHit, null, this);
    
    this.game.physics.arcade.collide(this.mobs, this.layer);
    // this.game.physics.arcade.overlap(this.mobs, this.layer, this.mobBounce, null, this);
    // this.game.physics.arcade.overlap(this.mobs, this.crates, this.mobBounce, null, this);
    
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.mobs, this.killMobs, null, this);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.crates, this.breakCrate, null, this);
    // this.game.debug.body(this.player.ninja);

    
    // this.mobs.forEach(function(mob) {
      // console.log('x',mob.x);
      // console.log('dirlock',this.directionLock);
      // if (mob.x > 200 && this.directionLock == false) {
      //   mob.direction *= -1;
      //   this.directionLock = true;
      // } 
      // if (mob.x < 200 && mob.x > 20) {
      //   this.directionLock = false;
      // }
      // mob.body.velocity.x = mob.direction*this.mobSpeed;
      // console.log(mob.body.x);
      // },this);

    this.player.movements(this.layer);

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  hitReflector: function(mob, reflector) {
    console.log('that happened');
  },
  playerHit:  function(ninja, mob) {
    if (this.takingDmg) {return;}
    this.takingDmg = true;
    
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
    this.killCount = 0;
    this.mobs.callAll('kill');
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
   mob.alive = false;
   mob.kill();
   this.killCount += 1;
   // var t = this.game.add.tween(mob).to({tint: 0xff0000},10).to({tint: 0xfff392}, 10).start(); 
   //
   // t.onComplete.add(function() {
   //  mob.kill();
   //  this.killCount += 1;
   // }, this);
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
    this.game.debug.body(this.reflectors);
    // this.game.debug.body(this.player.celery);
    // this.game.debug.text('Standing: ' + this.player.standing, 32, this.game.height - 96);
    // this.game.debug.text('facing: ' + this.player.facing, 32, this.game.height - 64);

    // this.game.debug.text('playerx: ' + this.player.ninja.y, 32, this.game.height - 96);
    // this.game.debug.text('map limit ' + this.map.tileWidth*this.map.height, 32, this.game.height - 64);
  }

};

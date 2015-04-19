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


Game.Carrot = function(game) {
  this.game = game;
};

Game.Carrot.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.attackTimer = this.game.time.now;
    this.attackAnimTimer = 0;

    this.map = this.game.add.tilemap('map_carrot');

    // this.game.add.tileSprite(0, 0, 1920, 200, 'background_day');
    this.game.add.tileSprite(0, 0, this.map.tileWidth*this.map.width, this.map.tileWidth*this.map.height, 'background_day');
    this.map.addTilesetImage('tiles', 'tiles');

    this.map.setCollision(10);
    this.map.setCollision(11);
    // this.map.createFromObjects('objects', 8, 'crate', 0, true, false, this.crates); 
    
    this.layer = this.map.createLayer('layer1'); 
    this.layer.resizeWorld();

    this.crates = this.game.add.group();
    this.crates.enableBody = true;

    this.map.createFromObjects('objects', 8, 'tiles', 7, true, false, this.crates); 
    // this.map.createFromObjects('objects', 9, 'ninja_mob', 0, true, false, this.mobs); 
    
    this.reflectors = this.game.add.group();
    this.reflectors.enableBody = true;
    this.map.createFromObjects('objects',1,'tiles',0,true, false,this.reflectors);

    this.crates.forEach(function(crate) {
      crate.body.immovable = true;
      crate.anchor.setTo(0.5, 0.5);
      crate.x = crate.x + this.map.tileWidth/2;
      crate.y = crate.y + this.map.tileWidth/2;
      // console.log(crate);
    },this);


    this.carrotKing = this.game.add.sprite(170, 700, 'carrot_king');
    this.game.physics.arcade.enable(this.carrotKing);
    this.carrotKing.frame = 0;
    this.carrotKing.health = 100;
    this.carrotKing.anchor.setTo(0.5, 0.5);
    this.carrotKing.body.setSize(28, 18,-28,-48);
    this.carrotKing.animations.add('idle',[0, 1], 1, true);
    this.carrotKing.animations.add('attack',[2,3], 10, true);
    
    this.carrotKing.play('idle');
    // this.carrotKing.play('attack');

    this.carrots = this.game.add.group();
    this.carrots.enableBody = true;
    this.carrots.physicsBodyType = Phaser.Physics.ARCADE;
    this.carrots.createMultiple(30, 'carrot', 0, false);
    this.carrots.setAll('body.gravity.y', 350); 
    this.carrots.setAll('anchor.x', 0.5); 
    this.carrots.setAll('anchor.y', 0.5); 
    // this.carrots.setAll('outOfBoundsKill', true); 
    // this.carrots.setAll('checkWorldBounds', true); 


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
      mob.direction = -1;
    },this);
    

    // this.m = this.mobs.getFirstDead();
    // this.m.body.velocity.x = this.mobSpeed;
    // this.m.reset(70,180);
    // m.animations.play('right');

      // var carrot = this.carrots.getFirstDead();
    // this.mobs.setAll('outOfBoundsKill', true); 
    // this.mobs.setAll('checkWorldBounds', true); 


    this.startX = 50;
    this.startY = 180;
    this.player = new Player(this.game, this.startX, this.startY);
    this.player.direction = 1;

    // this.playerHealthText = this.game.add.bitmapText(32, 32, 'minecraftia', 'Health', 12);
    this.playerHealthBar = this.game.add.sprite(8, 8, this.drawRect(64, 4, '#33ff00'));
    this.enemyHealthBar = this.game.add.sprite(160, 8, this.drawRect(64, 4, '#ff0000'));

    this.playerHealthBar.fixedToCamera = true;
    this.enemyHealthBar.fixedToCamera = true;

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
  drawRect:  function(width, height, color) {
    var bmd = this.game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  },
  update: function() {

    this.mobs.forEach(function(mob) {
      mob.body.velocity.x = mob.direction*this.mobSpeed;
      if (mob.direction < 0) {
        mob.play('left');
      }else {
        mob.play('right');
      }
    },this);


    // console.log(this.player.ninja.x);
    // console.log(this.player.direction);

    // if (this.player.ninja.x < 30) {
    //   this.player.direction = -1;
    // }else if(this.player.ninja.x > 210) {
    //   this.player.direction = 1;
    // }
    
    
    if (this.game.time.now > this.attackTimer + 5000){
      this.attackAnimTimer = this.game.time.now + 2000;
      this.carrotAttack();
      console.log(this.carrotKing.animations.currentAnim.name);
    }
    if (this.attackAnimTimer < this.game.time.now) {
      if (this.carrotKing.animations.currentAnim.name !== 'idle') {
        this.carrotKing.play('idle');

        var m = this.mobs.getFirstDead();
        m.body.velocity.x = this.mobSpeed;
        m.reset(160,760);

      }
    }


    
    this.playerHealthBar.scale.x = this.player.ninja.health/100;
    this.enemyHealthBar.scale.x = this.carrotKing.health/100;

    this.game.physics.arcade.overlap(this.player.ninja, this.carrots, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player.ninja, this.mobs, this.playerHit, null, this);

    this.game.physics.arcade.overlap(this.player.currentWeapon, this.carrotKing, this.kingHit, null, this);
    this.game.physics.arcade.overlap(this.mobs, this.reflectors, this.mobBounce, null, this);    
    this.game.physics.arcade.collide(this.mobs, this.layer);
    this.game.physics.arcade.overlap(this.carrots, this.layer, this.carrotKill, null, this); 
    this.game.physics.arcade.collide(this.player.ninja, this.layer);
    this.game.physics.arcade.collide(this.player.ninja, this.crates);
    this.game.physics.arcade.overlap(this.player.currentWeapon, this.crates, this.breakCrate, null, this);

    this.game.physics.arcade.overlap(this.player.currentWeapon, this.mobs, this.killMobs, null, this);

    this.player.movements(this.layer);

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  kingHit: function(weapon, carrotKing) {
    if (this.kingTakingDmg) {return;}
    this.kingTakingDmg = true;
    
    // if (enemy.alive === true) {
      carrotKing.health -= 2;
    // }

    // this.game.add.tween(carrotKing).to({x: carrotKing.x + 20},10).start();
    var t = this.game.add.tween(carrotKing).to({alpha: 0},100).to({alpha: 1}, 100).start();
    t.onComplete.add(function() {
      this.kingTakingDmg = false;
      if (carrotKing.health <= 0) {
        // this.playerDead();
        carrotKing.kill();
      }
    },this);

  },
  killMobs: function(weapon, mob) {
   mob.alive = false;
   var t = this.game.add.tween(mob).to({tint: 0xff0000},10).to({tint: 0xfff392}, 10).start(); 

   t.onComplete.add(function() {
    mob.kill();
   }, this);
  },

  carrotKill: function(carrot, layer) {
    carrot.kill();  
  },
  carrotAttack: function() {
    this.carrotKing.animations.stop();
    this.carrotKing.play('attack');
    this.attackTimer = this.game.time.now + 4000;
    
    // this.m = this.mobs.getFirstDead();
    // this.m.body.velocity.x = this.mobSpeed;
    // this.m.reset(160,760);


    // for(var i = 0; i < this.game.rnd.between(0,6);i++) {
    for(var i = 0; i < 10;i++) {
      var carrot = this.carrots.getFirstDead();
      carrot.reset(i*24+40, 420);
    }

  },
  playerHit:  function(ninja, enemy) {
    if (this.takingDmg) {return;}
    this.takingDmg = true;
    
    if (enemy.alive === true) {
      if (enemy.key === 'carrot') {
        ninja.health -= 20;
      }else {
        ninja.health -= 10;
      }
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
    this.mobs.callAll('kill');
    this.carrots.callAll('kill');
  },
  breakCrate: function(weapon, crate) {
    this.crate_emitter.x = crate.x;
    this.crate_emitter.y = crate.y;
    this.crate_emitter.start(true, 500, null, 32);
    crate.kill();
  },
  // render: function() {
    // this.game.debug.body(this.carrotKing);
    // this.game.debug.text('Current Animation: ' + this.carrotKing.animations.currentAnim ,32, this.game.height - 96);
    // this.game.debug.text('Standing: ' + this.player.standing, 32, this.game.height - 96);
    // this.game.debug.text('facing: ' + this.player.facing, 32, this.game.height - 64);

    // this.game.debug.text('playerx: ' + this.player.ninja.y, 32, this.game.height - 96);
    // this.game.debug.text('map limit ' + this.map.tileWidth*this.map.height, 32, this.game.height - 64);
  // }

};

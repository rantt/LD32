// var tileSize = 64,
var tileSize = 20,
rows = 10,
cols = 12;

var Game = {
  w: tileSize * cols,
  h: tileSize * rows
};

// var w = 800;
// var h = 600;

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
    // console.log('blah'+Game.w);
		this.game.stage.backgroundColor = '#ececec';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');

    // this.game.renderer.renderSession.roundPixels = true;

    //Automatically Scale
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.maxHeight = window.innerHeight;
    this.game.scale.maxWidth = window.innerHeight*(Game.w/Game.h);

    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVertically = true;
    this.game.scale.setScreenSize(true);


  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  init: function() {
    // this.game.renderer.renderSession.round.Pixels = true;
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 750;

  },
  preload: function() {
    
    //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);

    // this.game.load.image('background', 'assets/images/background.png');
    this.game.load.image('background_day', 'assets/images/day.png');
    // this.game.load.image('background', 'assets/images/background3.png');

    this.game.load.spritesheet('tiles', 'assets/images/tiles.png', 20, 20, 8);
    // this.game.load.image('player', 'assets/images/player.png');
    // this.game.load.image('shadow', 'assets/images/shadow.png');
    // this.game.load.image('crate', 'assets/images/crate.png', 20, 20);
    // this.game.load.spritesheet('crate', 'assets/images/crate.png', 20, 20,1);
    this.game.load.spritesheet('crate_debris', 'assets/images/crate.png', 4, 4,5);
    this.game.load.tilemap('level1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('level2', 'assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('map_day', 'assets/maps/day.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.spritesheet('ninja', 'assets/images/Ninja2.png',18, 18, 25);
    this.game.load.spritesheet('celery', 'assets/images/celery.png',18, 18, 7);
    // this.game.load.spritesheet('shadow', 'assets/images/shadow.png',16, 18, 25)


    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};

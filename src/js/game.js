/*global Game*/

var game = new Phaser.Game(Game.w, Game.h, Phaser.AUTO, 'game');


game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Day', Game.Day);
game.state.add('Carrot', Game.Carrot);
game.state.add('Cage', Game.Cage);
game.state.add('Play', Game.Play);

game.state.start('Boot');

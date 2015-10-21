//initializes and maintains phaser game instance

angular.module('app.game', [])

.controller('GameController', ['$scope', '$state', 'requestNotificationChannel', 'Panel', 'Puzzle',
  function($scope, $state, requestNotificationChannel, Panel, Puzzle) {

    $scope.rotate = true;
    // Initializes game

    var game = new Phaser.Game(
      800, 533,
      Phaser.AUTO,
      'game_canvas');

    // Main game state, container for game
    var Main = function(){
      this.game = game;
      this.puzzle = Puzzle;
      this.panel = Panel;
      this.requestNotificationChannel = requestNotificationChannel;
    };

    Main.prototype = {

      // Preload scripts, mandatory, ASYNC
      preload: function() {
        game.load.image('stars',    'assets/images/stars.jpg');
        game.load.image('loading',  'assets/images/loading.png');
        game.load.image('brand',    'assets/images/logo.png');
        game.load.script('utils',   'utils/utils.js');
        game.load.script('style',    'utils/style.js');
        game.load.script('splash',  'gamestates/splash.js');
      },

      // Route to Splash state
      create: function(){
        game.state.add('Splash', Splash);
        game.state.start('Splash');
      }

    };

    game.state.add('Main', Main);
    game.state.start('Main');
  }
]);

    // var puzzle1 = Puzzle.generateBinaryLever();

    // requestNotificationChannel.loadManual(puzzle1.manual);
    // Panel.init(this.game, [puzzle1.puzzle]);

    // panelKey.onDown.add(function(key) {
    //   requestNotificationChannel.loadPuzzle(0);
    //   Panel.toggle();
    // }, this);

// // Phaser.state for level select screen
// mygame.LevelSelect = function(game){
//     this.game = game; // keep reference to main game object
//     this._selectedLevel = 0;
// };
// mygame.LevelSelect.prototype = {
//     create: function(){
//     //etc.
//     onLevelSelected: function() {
//         // pass variables to 'MainGame' state
//         this.game.state.states['MainGame']._currentLevel = this._selectedLevel;
//         this.game.state.states['MainGame']._showTutorial = (this._selectedLevel == 1); // only show tutorial on level 1
//     },
//     //etc.
// };

// // Phaser.state for main game loop
// mygame.MainGame = function(game){
//     this.game = game; // keep reference to main game object
//     this._showTutorial = false;
//     this._currentLevel = 0;
// };
// mygame.MainGame.prototype = {
//     create: function(){
//     //etc.
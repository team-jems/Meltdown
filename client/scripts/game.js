//initializes and maintains phaser game instance

angular.module('app.game', [])

.controller('GameController',
  ['$scope', '$state', 'requestNotificationChannel', 'Panel', 'Players', 'Strike', 'LevelUp',
  function($scope, $state, requestNotificationChannel, Panel, Players, Strike, LevelUp) {

    // Initializes game
    var game = new Phaser.Game(
      800, 533,
      Phaser.AUTO,
      'game_canvas');

    // Main game state, container to pass angular modules between states
    var Main = function(){
      this.game = game;
      this.panel = Panel;
      this.requestNotificationChannel = requestNotificationChannel;
      this.players = Players;
      this.strike = Strike;
      this.levelUp = LevelUp;
      this.$scope = $scope;
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

    // Starts up main state as the first state
    game.state.add('Main', Main);
    game.state.start('Main');

  }
]);

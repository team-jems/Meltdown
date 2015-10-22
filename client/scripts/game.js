//initializes and maintains phaser game instance

angular.module('app.game', [])

.controller('GameController', ['$scope', '$state', 'requestNotificationChannel', 'Panel', 'Puzzle',
  function($scope, $state, requestNotificationChannel, Panel, Puzzle) {

    // Initializes game
    var game = new Phaser.Game(
      800, 533,
      Phaser.AUTO,
      'game_canvas');

    // Main game state, container to pass angular modules between states
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

    // Starts up main state as the first state
    game.state.add('Main', Main);
    game.state.start('Main');

      function objCollisionHandler (player, panel) { 
        // if(!panel.hasCollided){
          requestNotificationChannel.loadPuzzle(0);
          // Panel.on();
          Panel.toggle();
          // panel.hasCollided = true;
        // }
        //use esc key, panel show and off, not toggle
        // if(panelKey.isDown) { //checkout mikes work which has changed this
        //   Panel.off();
        // }       
        player.position.x =  panel.position.x + 5;
        player.position.y = panel.position.y + 5;
        //debug functionality issue with panel on and off from panel file 
      }

      if($scope.rotate) {
        rotator.angle += 1;
      }

    }
  
]);

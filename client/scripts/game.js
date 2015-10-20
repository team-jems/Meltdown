angular.module('app.game', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('game', {
        url: '/game',
        templateUrl: 'templates/game.html',
        controller: 'GameController'
      });
  }
])

.controller('GameController', ['$scope', '$state', 'requestNotificationChannel', 'Panel', 'Puzzle',
  function($scope, $state, requestNotificationChannel, Panel, Puzzle) {

    var game = new Phaser.Game(
      800, 600,
      Phaser.AUTO,
      'game_canvas');

    var Main = function(){};

    Main.prototype = {

      preload: function() {
        game.load.image('stars',    'assets/images/stars.jpg');
        game.load.image('loading',  'assets/images/loading.png');
        game.load.image('brand',    'assets/images/logo.png');
        game.load.script('utils',   'utils/utils.js');
        game.load.script('style',    'utils/style.js');
        game.load.script('splash',  'gamestates/splash.js');
      },

      create: function(){
        game.state.add('Splash', Splash);
        game.state.start('Splash');        

      }
    };

    game.state.add('Main', Main);
    game.state.start('Main');
  }
]);

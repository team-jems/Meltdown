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

.controller('GameController', ['$scope',
  function($scope) {

    var game = new Phaser.Game(
      800, 600,
      Phaser.AUTO,
      'game_canvas',
      { preload: preload, create: create, update: update });

    function preload() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    }

    var platforms;

    function create() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = platforms.create(400, 400, 'ground');

        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;

    }

    function update() {
    }
  }
]);

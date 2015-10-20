angular.module('app.rotator', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('rotator', {
        url: '/rotator',
        templateUrl: 'templates/game.html',
        controller: 'RotatorController'
      });
  }
])

.controller('RotatorController', ['$scope',
  function($scope) {

    $scope.rotate = true;

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

        game.load.image('arrow', 'assets/arrow.png');
        game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);

    }

    var player;
    var platforms;

    var rotator;
    var button;

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
        var ledge = platforms.create(400, 400, 'ground');  // ledge 1
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');  // ledge 2
        ledge.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

        rotator = game.add.sprite(400, 50, 'arrow');
        rotator.anchor.setTo(0.5, 0.5);
        rotator.inputEnabled = true;
        rotator.events.onInputDown.add(toggleRotate, this);

        button = game.add.button(360, 100, 'button', actionOnClick, this, 2, 1, 0);
        button.scale.setTo(0.5, 0.5);

    }

    function toggleRotate() {
      console.log('angle: ', rotator.angle);
      console.log('rotation: ', rotator.rotation);
      $scope.rotate = !$scope.rotate;
    }

    function actionOnClick() {
      if (rotator.angle > 0 && rotator.angle < 90) {
        console.log('You saved the reactor!');
      } else {
        console.log('Boom!');
      }
    }

    function update() {

      //  Collide the player and the stars with the platforms
      game.physics.arcade.collide(player, platforms);

      //  Reset the players velocity (movement)
      player.body.velocity.x = 0;

      if (cursors.left.isDown)
      {
          //  Move to the left
          player.body.velocity.x = -150;

          player.animations.play('left');
      }
      else if (cursors.right.isDown)
      {
          //  Move to the right
          player.body.velocity.x = 150;

          player.animations.play('right');
      }
      else
      {
          //  Stand still
          player.animations.stop();

          player.frame = 4;
      }

      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown && player.body.touching.down)
      {
          player.body.velocity.y = -350;
      }

      if($scope.rotate) {
        rotator.angle += 1;
      }
    }
  }
]);

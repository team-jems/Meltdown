
angular.module('app.game2', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('game2', {
        url: '/game2',
        templateUrl: 'templates/game2.html',
        controller: 'Game2Controller'
      });
  }
])

.controller('Game2Controller', ['$scope', '$state',
  function($scope, $state) {

  var game = new Phaser.Game(
      800, 533,
      Phaser.AUTO,
      'game_canvas2',
      { preload: preload, create: create, update: update });

  function preload() {
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('room', 'assets/rooms/greenRoom.jpg')
        game.load.image('arrow', 'assets/cutouts/arrowCorner.png');
        game.load.image('panel', 'assets/cutouts/controlPanelRight.png');
        game.load.image('holes', 'assets/cutouts/holeCorner.png');
        game.load.image('spiral', 'assets/cutouts/spiralCorner.png');
        game.load.image('square', 'assets/cutouts/squareCorner.png');
        game.load.image('circle', 'assets/cutouts/grate.png');
        // game.load.image('star', 'assets/star.png');
    }

    var player;
    var stars;
    var inviswall;

    function create() {

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        game.add.sprite(0, 0, 'room');

/********* STAR GROUP *****************************************/
        // stars = game.add.group();
        // stars.enableBody = true;
        // var star = stars.create(50, 50, 'star');
        // star.body.collideWorldBounds = true;
        // star.body.immovable = true;
        // // star.body.setSize(400, 50, 0, 20);
        // // star.body.gravity.y = 500; 
        // game.physics.enable(star, Phaser.Physics.ARCADE);
        // game.physics.arcade.enable(star);

/********* Room Objects *****************************************/
    //LARGE PANEL
        roomObjs = game.add.group();
        roomObjs.enableBody = true;
        var panel = roomObjs.create(game.world.width, game.world.height/3.7, 'panel');
        // panel.body.setSize(100, 50, 0, 0);
        panel.body.collideWorldBounds = true;
        game.physics.enable(panel, Phaser.Physics.ARCADE);
        panel.body.immovable = true;
        panel.body.checkCollision.left = true;
        panel.body.checkCollision.right = true;
        panel.body.checkCollision.down = true;
        panel.body.checkCollision.up = true;
    //SPIRAL CORNER 
        var spiral = roomObjs.create(game.world.width, game.world.height, 'spiral');
        // panel.body.setSize(100, 50, 0, 0);
        spiral.body.collideWorldBounds = true;
        game.physics.enable(spiral, Phaser.Physics.ARCADE);
        spiral.body.immovable = true;
        spiral.body.checkCollision.left = true;
        spiral.body.checkCollision.right = true;
        spiral.body.checkCollision.down = true;
        spiral.body.checkCollision.up = true;
    //ARROW CORNER
      var arrow = roomObjs.create(game.world.width, 0, 'arrow');
        // panel.body.setSize(100, 50, 0, 0);
        arrow.body.collideWorldBounds = true;
        game.physics.enable(arrow, Phaser.Physics.ARCADE);
        arrow.body.immovable = true;
        arrow.body.checkCollision.left = true;
        arrow.body.checkCollision.right = true;
        arrow.body.checkCollision.down = true;
        arrow.body.checkCollision.up = true;
    //2 HOLE CORNER
        var holes = roomObjs.create(0, 0, 'holes');
        holes.body.collideWorldBounds = true;
        game.physics.enable(holes, Phaser.Physics.ARCADE);
        holes.body.immovable = true;
        holes.body.checkCollision.left = true;
        holes.body.checkCollision.right = true;
        holes.body.checkCollision.down = true;
        holes.body.checkCollision.up = true;    
    //SQUARE CORNER
        var square = roomObjs.create(0, game.world.height, 'square');
        square.body.collideWorldBounds = true;
        game.physics.enable(square, Phaser.Physics.ARCADE);
        square.body.immovable = true;
        square.body.checkCollision.left = true;
        square.body.checkCollision.right = true;
        square.body.checkCollision.down = true;
        square.body.checkCollision.up = true;    
    //CIRCULAR CENTER
        var circle = roomObjs.create(game.world.width/3.73, game.world.height/6.5, 'circle');
        circle.body.collideWorldBounds = true;
        game.physics.enable(circle, Phaser.Physics.ARCADE);
        circle.body.immovable = true;
        circle.body.checkCollision.left = true;
        circle.body.checkCollision.right = true;
        circle.body.checkCollision.down = true;
        circle.body.checkCollision.up = true;   
        //  We will enable physics for any object that is created in this group
        // platforms.enableBody = true;

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // ground.scale.setTo(20, 0);




/***-------------  The player and its settings --------------------------------***/
        player = game.add.sprite(game.world.width/2.07, game.world.height, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        // player.body.bounce.y = 0.2;
        // player.body.gravity.y = 1;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('right', [5,6,7,8], 10, true);
        player.animations.add('left', [0,1,2,3], 10, true);
        player.animations.add('up', [4], 10, true);
        player.animations.add('down', [4], 10, true);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {

    // Collide the player with the stars
    game.physics.arcade.collide(stars, player, collisionHandler, null, this);

    game.physics.arcade.collide(roomObjs, player, objCollisionHandler, null, this);
      //  Reset the players velocity (movement)
      player.body.velocity.x = 0;

      if (cursors.left.isDown) {
          //  Move to the left
          player.body.velocity.x = -150;

          player.animations.play('left');
      } else if (cursors.right.isDown) {
          //  Move to the right
          player.body.velocity.x = 150;

          player.animations.play('right');
      } 
      if (cursors.up.isDown) {
        player.body.velocity.y -= 3;

        player.animations.play('up');

      } else if (cursors.down.isDown) {
        player.body.velocity.y += 3;

        player.animations.play('down');

      }
       else {
          //  Stand still
          player.body.velocity.y = 0;

          player.animations.stop();

          player.frame = 4;
      }

      function collisionHandler (player, stars) {
        console.log('I touched the star!!');
        // $state.go('quiz');
      }

      function objCollisionHandler (player, panel) {
        console.log('hit a room object')
      }

      //  Allow the player to jump if they are touching the ground.
      // if (cursors.up.isDown && player.body.touching.down) {
      //     player.body.velocity.y = -350;
      // }

    }
  }
]);




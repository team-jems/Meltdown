
angular.module('app.game', [])


.controller('GameController', ['$scope', 'requestNotificationChannel', 'Panel',
  'Puzzle',
  function($scope, requestNotificationChannel, Panel, Puzzle) {
    var game = new Phaser.Game(
      800, 600,
      Phaser.AUTO,
      'game_canvas',
      { preload: preload, create: create, update: update });

  function preload() {
        game.load.image('room', 'assets/rooms/orange2.jpg')
        game.load.image('smallPanel', 'assets/cutouts/smallPanel.png');
        game.load.image('tankleft', 'assets/cutouts/tank.png');
        game.load.image('panel', 'assets/cutouts/controlPanel.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('panel', 'assets/panel.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
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
        stars = game.add.group();
        stars.enableBody = true;
        var star = stars.create(50, 50, 'star');
        star.body.collideWorldBounds = true;
        star.body.immovable = true;
        // star.body.setSize(400, 50, 0, 20);
        // star.body.gravity.y = 500; 
        game.physics.enable(star, Phaser.Physics.ARCADE);

/********* Room Objects *****************************************/
    //LARGE PANEL
        roomObjs = game.add.group();
        roomObjs.enableBody = true;
        var panel = roomObjs.create(470, 0, 'panel', 3);
        // panel.body.setSize(100, 50, 0, 0);
        panel.body.collideWorldBounds = true;
        game.physics.arcade.enable(star);
        game.physics.enable(panel, Phaser.Physics.ARCADE);
        panel.body.immovable = true;
        panel.body.checkCollision.left = true;
        panel.body.checkCollision.right = true;
        panel.body.checkCollision.down = true;
        panel.body.checkCollision.up = true;
    //SMALL PANEL 
        var smallPanel = roomObjs.create(game.world.width/3.24, game.world.height/1.247, 'smallPanel', 3);
        // panel.body.setSize(100, 50, 0, 0);
        smallPanel.body.collideWorldBounds = true;
        game.physics.arcade.enable(star);
        game.physics.enable(smallPanel, Phaser.Physics.ARCADE);
        smallPanel.body.immovable = true;
        smallPanel.body.checkCollision.left = true;
        smallPanel.body.checkCollision.right = true;
        smallPanel.body.checkCollision.down = true;
        smallPanel.body.checkCollision.up = true;
    //LEFT TANK
      var tankleft = roomObjs.create(game.world.width/5.3, game.world.height/4.6, 'tankleft', 3);
        // panel.body.setSize(100, 50, 0, 0);
        tankleft.body.collideWorldBounds = true;
        game.physics.arcade.enable(star);
        game.physics.enable(tankleft, Phaser.Physics.ARCADE);
        tankleft.body.immovable = true;
        tankleft.body.checkCollision.left = true;
        tankleft.body.checkCollision.right = true;
        tankleft.body.checkCollision.down = true;
        tankleft.body.checkCollision.up = true;
    //rightTank
      var tankright = roomObjs.create(game.world.width/1.52, game.world.height/4.6, 'tankleft', 3);
        // panel.body.setSize(100, 50, 0, 0);
        tankright.body.collideWorldBounds = true;
        game.physics.arcade.enable(star);
        game.physics.enable(tankright, Phaser.Physics.ARCADE);
        tankright.body.immovable = true;
        tankright.body.checkCollision.left = true;
        tankright.body.checkCollision.right = true;
        tankright.body.checkCollision.down = true;
        tankright.body.checkCollision.up = true;    


        //  We will enable physics for any object that is created in this group
        // platforms.enableBody = true;

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // ground.scale.setTo(20, 0);




/***-------------  The player and its settings --------------------------------***/
        player = game.add.sprite(game.world.width/2, game.world.height/2, 'dude');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        // player.body.bounce.y = 0.2;
        // player.body.gravity.y = 1;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0,1,2,3], 10, true);
        player.animations.add('right', [5,6,7,8], 10, true);
        player.animations.add('up');
        player.animations.add('down');

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        var panelKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        var puzzle1 = Puzzle.generateBinaryLever();

        requestNotificationChannel.loadManual(puzzle1.manual);
        Panel.init(game, [puzzle1.puzzle]);

        panelKey.onDown.add(function(key) {
          requestNotificationChannel.loadPuzzle(0);
          Panel.toggle();
        }, this);
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




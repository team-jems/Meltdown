// Room 2

var Game2 = function(game){
  this.player;
  this.stars;
  this.inviswall;
  this.cursors;
};

Game2.prototype = {

  preload: function(){
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('room', 'assets/rooms/greenRoom.jpg')
    this.game.load.image('arrow', 'assets/cutouts/arrowCorner.png');
    this.game.load.image('panel', 'assets/cutouts/controlPanelRight.png');
    this.game.load.image('holes', 'assets/cutouts/holeCorner.png');
    this.game.load.image('spiral', 'assets/cutouts/spiralCorner.png');
    this.game.load.image('square', 'assets/cutouts/squareCorner.png');
    this.game.load.image('circle', 'assets/cutouts/grate.png');
  },


  create: function(){
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'room');

    //LARGE PANEL
    roomObjs = this.game.add.group();
    roomObjs.enableBody = true;
    var panel = roomObjs.create(this.game.world.width, this.game.world.height/3.7, 'panel');
    // panel.body.setSize(100, 50, 0, 0);
    panel.body.collideWorldBounds = true;
    this.game.physics.enable(panel, Phaser.Physics.ARCADE);
    panel.body.immovable = true;
    panel.body.checkCollision.left = true;
    panel.body.checkCollision.right = true;
    panel.body.checkCollision.down = true;
    panel.body.checkCollision.up = true;
    //SPIRAL CORNER 
    var spiral = roomObjs.create(this.game.world.width, this.game.world.height, 'spiral');
    // panel.body.setSize(100, 50, 0, 0);
    spiral.body.collideWorldBounds = true;
    this.game.physics.enable(spiral, Phaser.Physics.ARCADE);
    spiral.body.immovable = true;
    spiral.body.checkCollision.left = true;
    spiral.body.checkCollision.right = true;
    spiral.body.checkCollision.down = true;
    spiral.body.checkCollision.up = true;
    //ARROW CORNER
    var arrow = roomObjs.create(this.game.world.width, 0, 'arrow');
    // panel.body.setSize(100, 50, 0, 0);
    arrow.body.collideWorldBounds = true;
    this.game.physics.enable(arrow, Phaser.Physics.ARCADE);
    arrow.body.immovable = true;
    arrow.body.checkCollision.left = true;
    arrow.body.checkCollision.right = true;
    arrow.body.checkCollision.down = true;
    arrow.body.checkCollision.up = true;
    //2 HOLE CORNER
    var holes = roomObjs.create(0, 0, 'holes');
    holes.body.collideWorldBounds = true;
    this.game.physics.enable(holes, Phaser.Physics.ARCADE);
    holes.body.immovable = true;
    holes.body.checkCollision.left = true;
    holes.body.checkCollision.right = true;
    holes.body.checkCollision.down = true;
    holes.body.checkCollision.up = true;    
    //SQUARE CORNER
    var square = roomObjs.create(0, this.game.world.height, 'square');
    square.body.collideWorldBounds = true;
    this.game.physics.enable(square, Phaser.Physics.ARCADE);
    square.body.immovable = true;
    square.body.checkCollision.left = true;
    square.body.checkCollision.right = true;
    square.body.checkCollision.down = true;
    square.body.checkCollision.up = true;    
    //CIRCULAR CENTER
    var circle = roomObjs.create(this.game.world.width/3.73, this.game.world.height/6.5, 'circle');
    circle.body.collideWorldBounds = true;
    this.game.physics.enable(circle, Phaser.Physics.ARCADE);
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
    this.player = this.game.add.sprite(this.game.world.width/2.07, this.game.world.height - 96, 'dude');

     // We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    this.player.body.collideWorldBounds = true;

     // Our two animations, walking left and right.
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.animations.add('left', [0,1,2,3], 10, true);
    // this.player.animations.add('up', [4], 10, true);
    // this.player.animations.add('down', [4], 10, true);
    this.player.animations.add('up');
    this.player.animations.add('down');

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },


  update: function(){
    this.game.physics.arcade.collide(roomObjs, this.player, this.objCollisionHandler, null, this);
    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    //directional movement
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -200;
      this.player.animations.play('up');
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 200;
      this.player.animations.play('down');
    } else {
      //  Stand still
      this.player.body.velocity.y = 0;
      this.player.animations.stop();
      this.player.frame = 4;
    }

    //Room transition (might be better to do object collision instead, but refactor later)
    if (this.player.body.y === 485 && (this.player.body.x > 384 && this.player.body.x < 416)){
      var isPlaying = true;
      this.game.state.start('Game', true, false, isPlaying);
    }

  },

  objCollisionHandler: function(player, panel){
    console.log('hit a room object');
  }

};




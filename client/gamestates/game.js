// Begin Gameplay @ Room 1

var Game = function (game) {
  this.player;
  this.played = false;
  this.rotate = true;
  this.rotator;
  this.button;
  this.cursors;
  this.panelKey;
};

Game.prototype = {

  preload: function(){
    this.game.load.image('room', 'assets/rooms/orange2.jpg')
    this.game.load.image('smallPanel', 'assets/cutouts/smallPanel.png');
    this.game.load.image('tankleft', 'assets/cutouts/tank.png');
    this.game.load.image('panel', 'assets/cutouts/controlPanel.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.image('panel', 'assets/panel.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('arrow', 'assets/cutouts/doodad.png');
  },

  create: function(){
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'room');

    /********* Room Objects *****************************************/
    //LARGE PANEL
    roomObjs = this.game.add.group();
    roomObjs.enableBody = true;
    var panel = roomObjs.create(470, 0, 'panel', 3);
    this.givePhysicsTo(panel, true, true, true, true, true);

    //SMALL PANEL
    var smallPanel = roomObjs.create(this.game.world.width/3.24, this.game.world.height/1.247, 'smallPanel', 3);
    this.givePhysicsTo(smallPanel, true, true, true, true, true);

    //LEFT TANK
    var tankLeft = roomObjs.create(this.game.world.width/5.3, this.game.world.height/4.6, 'tankleft', 3);
    this.givePhysicsTo(tankLeft, true, true, true, true, true);

    //RIGHT TANK
    var tankRight = roomObjs.create(this.game.world.width/1.52, this.game.world.height/4.6, 'tankleft', 3);
    this.givePhysicsTo(tankRight, true, true, true, true, true);

    this.rotator = this.game.add.sprite(this.game.world.width/7.8, 50, 'arrow');

    this.game.physics.enable(this.rotator, Phaser.Physics.ARCADE);
    this.rotator.body.collideWorldBounds = true;
    this.rotator.body.immovable = true;
    this.rotator.anchor.setTo(0.5, 0.5);
    this.rotator.inputEnabled = true;
    this.rotator.events.onInputDown.add(this.toggleRotate, this);

    /***-------------  The player and its settings --------------------------------***/
    // if this is the start of the game, place player at room center
    if (this.played === false){
      this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'dude');
    // if the game has already started, place player at room entrance
    } else {
      this.player = this.game.add.sprite(this.game.world.width/2, 48, 'dude');
    }

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 1;
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0,1,2,3], 10, true);
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.animations.add('up');
    this.player.animations.add('down');

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.panelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // passing angular modules from game.js
    var Puzzle = this.game.state.states['Main'].puzzle;
    var Panel = this.game.state.states['Main'].panel;
    var requestNotificationChannel = this.game.state.states['Main'].requestNotificationChannel;

    var puzzle1 = Puzzle.generateBinaryLever();

    requestNotificationChannel.loadManual(puzzle1.manual);
    Panel.init(this.game, [puzzle1.puzzle]);

    this.panelKey.onDown.add(function(key) {
      requestNotificationChannel.loadPuzzle(0);
      Panel.toggle();
    }, this);
  },

  init: function(isPlaying){
    if (isPlaying){
      this.played = true;
    }
  },

  update: function(){

    // Rotate arrow
    if(this.rotate) {
      this.rotator.angle += 1;
    }

    // Collide the player with the stars
    this.game.physics.arcade.collide(roomObjs, this.player, this.objCollisionHandler, null, this);
    this.game.physics.arcade.collide(this.rotator, this.player, this.objCollisionHandler, null, this);

    // Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    // Player directional movement
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
    if (this.player.body.y === 0 && (this.player.body.x > 384 && this.player.body.x < 416)){
      this.game.state.start('Game2');
    }

  },

  givePhysicsTo: function(obj, collideWorldBounds, immovable, checkCollLeft, checkCollRight, checkCollDown, checkCollUp){
    this.game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.collideWorldBounds = collideWorldBounds;
    obj.body.immovable = immovable;
    obj.body.checkCollision.left = checkCollLeft;
    obj.body.checkCollision.right = checkCollRight;
    obj.body.checkCollision.down = checkCollDown;
    obj.body.checkCollision.up = checkCollUp;
  },


  objCollisionHandler: function(player, panel){
    console.log('hit a room object');
  },

  toggleRotate: function(){
    console.log('angle: ', this.rotator.angle);
    console.log('rotation: ', this.rotator.rotation);
    this.rotate = !this.rotate;
  },

  actionOnClick: function() {
    if (this.rotator.angle > 0 && this.rotator.angle < 90) {
      console.log('You saved the reactor!');
    } else {
      console.log('Boom!');
    }
  },

};




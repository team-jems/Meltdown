// Room 4

var Game4 = function(game){
  this.player;
  this.played = false;
  this.rotate = true;
  this.rotator;
  this.button;
  this.cursors;
  this.panelKey;
  this.roomObjs;
  this.timer;
  this.timerEvent;
  this.requestNotificationChannel;
  this.Panel;
};

Game4.prototype = {

  preload: function(){
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('room', 'assets/rooms/red.jpg')
    this.game.load.image('panel', 'assets/cutouts/controlPanelLeft.png');
    this.game.load.image('large', 'assets/cutouts/nozzleLarge.png');
    this.game.load.image('medium', 'assets/cutouts/nozzleMedium.png');
    this.game.load.image('small', 'assets/cutouts/nozzleSmall.png');
    this.game.load.image('topLeftTank', 'assets/cutouts/topLeftTank.png');
    this.game.load.image('bottomLeftTank', 'assets/cutouts/bottomLeftTank.png');
    this.game.load.image('rightHalfTank', 'assets/cutouts/rightHalfTank.png');
  },


  create: function(){
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'room');

    //LARGE PANEL
    this.roomObjs = this.game.add.group();
    this.roomObjs.enableBody = true;
    var panel = this.roomObjs.create(0, this.game.world.height/3.7, 'panel');
    // panel.body.setSize(100, 50, 0, 0);
    this.givePhysicsTo(panel, true, true, true, true, true);

    // SMALL1 NOZZLE 
    var small = this.roomObjs.create(this.game.world.width/1.8, 44, 'small');
    this.givePhysicsTo(small, true, true, true, true, true);

    // SMALL2 NOZLLE
    var small2 = this.roomObjs.create(156, this.game.world.height-48, 'small');
    this.givePhysicsTo(small2, true, true, true, true, true);


    // SMALL3 NOZLLE
    var small3 = this.roomObjs.create(this.game.world.width-248, 44, 'small');
    this.givePhysicsTo(small3, true, true, true, true, true);

    // SMALL4 NOZZLE
    var small4 = this.roomObjs.create(this.game.world.width - 186 , this.game.world.height-30, 'small');
    this.givePhysicsTo(small4, true, true, true, true, true);
    
    // Top Left Tank
    var topLeftTank = this.roomObjs.create(0, 0, 'topLeftTank');
    this.givePhysicsTo(topLeftTank, true, true, true, true, true);


    // Bottom Left Tank
    var bottomLeftTank = this.roomObjs.create(0, this.game.world.height, 'bottomLeftTank');
    this.givePhysicsTo(bottomLeftTank, true, true, true, true, true);

    // RIGHT HALF TANK
    var rightHalfTank = this.roomObjs.create(this.game.world.width, 70, 'rightHalfTank');
    this.givePhysicsTo(rightHalfTank, true, true, true, true, true);

    // //CIRCULAR CENTER
    // var circle = this.roomObjs.create(this.game.world.width/2.95, this.game.world.height/3.9, 'circle');
    // this.givePhysicsTo(circle, true, true, true, true, true);


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
    this.player.animations.add('up', [4]);
    this.player.animations.add('down' [4]);

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.panelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);

    // passing angular modules from game.js
    this.Puzzle = this.game.state.states['Main'].puzzle;
    this.Panel = this.game.state.states['Main'].panel;
    this.requestNotificationChannel = this.game.state.states['Main'].requestNotificationChannel;

    var components = this.Puzzle.generatePuzzles();
    this.Panel.init(this.game, components.puzzles);
    this.requestNotificationChannel.loadManual(components.manuals);
    
    this.panelKey.onDown.add(function(key) {
      this.requestNotificationChannel.loadPuzzle(0);
      this.Panel.toggle();
      this.roomObjs.hasCollided = false;
    }, this);

    // Game Timer
    this.timer = this.game.time.create();
    // this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 10, this.endTimer, this);
    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 3, this.endTimer, this);
    this.timer.start();  // timer display handled in render block
  },

  endTimer: function() {
    this.timer.stop();
    this.requestNotificationChannel.gameOver(true);
    this.Panel.toggle();

    var self = this;
    setTimeout(function () {
      self.Panel.toggle();
      self.game.state.start("GameMenu");
    }, 10000);
  },

  init: function(isPlaying){
    if (isPlaying){
      this.played = true;
    }
  },

  update: function(){
    this.game.physics.arcade.collide(this.roomObjs, this.player, this.objCollisionHandler, null, this);
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

  givePhysicsTo: function(obj, collideWorldBounds, immovable, checkCollLeft, checkCollRight, checkCollDown, checkCollUp){
    this.game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.collideWorldBounds = collideWorldBounds;
    obj.body.immovable = immovable;
    obj.body.checkCollision.left = checkCollLeft;
    obj.body.checkCollision.right = checkCollRight;
    obj.body.checkCollision.down = checkCollDown;
    obj.body.checkCollision.up = checkCollUp;
  },

  objCollisionHandler: function(player, roomObjs){  
    console.log('I hit a room object');
    if(!this.roomObjs.hasCollided){
      this.requestNotificationChannel.loadPuzzle(0);
      this.Panel.toggle();
      this.roomObjs.hasCollided = true;
    }
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

  render: function() {
    if (this.timer.running) {
      this.game.debug.text(this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), 2, 14, "#ff0");
    } else {
      this.game.debug.text("Boom!", 2, 14, "#0f0");
    }
  },

  formatTime: function(s) {
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  }

};




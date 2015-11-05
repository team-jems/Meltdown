// // Room 4

// Begin Gameplay @ Room 3

var Game4 = function (game) {
  //this.player;
  //this.players;
  this.played = false;
  this.rotate = true;
  //this.rotator;
  //this.button;
  //this.cursors;
  //this.panelKey;
  //this.roomObjs;
  //this.timer;
  //this.timerEvent;
  //this.strike;
  //this.requestNotificationChannel;
  //this.Panel;
  //this.playerName;
  //this.puzzled;
};

Game4.prototype = {

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
    this.game.stage.disableVisibilityChange = true;

    // Pass firebase module to this instance
    this.players = this.game.state.states['Main'].players;

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'room');

    /********* Room Objects *****************************************/
    this.roomObjs = this.game.add.group();
    this.roomObjs.enableBody = true;

    this.actionObjs = this.game.add.group();
    this.actionObjs.enableBody = true;

    //LARGE PANEL
    var panel = this.actionObjs.create(this.game.world.width, this.game.world.height/3.7, 'panel');
    this.givePhysicsTo(panel, true, true, true, true, true);
    panel.tint = 0xff2200;

    var spiral = this.roomObjs.create(this.game.world.width, this.game.world.height, 'spiral');
    // panel.body.setSize(100, 50, 0, 0);
    this.givePhysicsTo(spiral, true, true, true, true, true);
    //ARROW CORNER
    var arrow = this.roomObjs.create(this.game.world.width, 0, 'arrow');
    this.givePhysicsTo(arrow, true, true, true, true, true);
    //2 HOLE CORNER
    var holes = this.roomObjs.create(0, 0, 'holes');
    this.givePhysicsTo(holes, true, true, true, true, true);
    //SQUARE CORNER
    var square = this.roomObjs.create(0, this.game.world.height, 'square');
    this.givePhysicsTo(square, true, true, true, true, true);
    //CIRCULAR CENTER
    var circle = this.roomObjs.create(this.game.world.width/2.95, this.game.world.height/3.9, 'circle');
    this.givePhysicsTo(circle, true, true, true, true, true);

    /***-------------  The player and its settings --------------------------------***/
    this.player = this.game.add.sprite(this.game.world.width/2.07, this.game.world.height - 96, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0,1,2,3], 10, true);
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.animations.add('up', [4]);
    this.player.animations.add('down', [4]);

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.panelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);

    // passing angular modules from game.js
    this.Panel = this.game.state.states['Main'].panel;
    this.requestNotificationChannel = this.game.state.states['Main'].requestNotificationChannel;

    this.Panel.init(this.game, this.game.state.states['Main'].puzzles[3]);
    this.requestNotificationChannel.loadManual(this.game.state.states['Main'].manual[3]);

    this.panelKey.onDown.add(function(key) {
      this.requestNotificationChannel.loadPuzzle(3);
      this.Panel.toggle();
      this.actionObjs.hasCollided = false;
    }, this);

    // Game Timer
    this.timer = this.game.time.create();  // Phaser timer
    //this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 30, this.endTimer, this);
    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 10, this.endTimer, this);
    this.timer.start();  // timer display handled in render block

    //Panel color change
    this.redColor = this.game.input.keyboard.addKey(Phaser.KeyCode.R);
    this.greenColor = this.game.input.keyboard.addKey(Phaser.KeyCode.G);
    this.greenColor.onDown.add(function(key){
      panel.tint = 0x2fff18;
    });
    this.redColor.onDown.add(function(key){
      panel.tint = 0xff2200;
    });

    // Strikes
    this.strike = this.game.state.states['Main'].strike;
    this.strike.child('count').on('value', this.fbStrikeCountListener, this);

    // Debug: Strike testing, hit 'S' key to increment strikes
    // this.strikeKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
    // this.strikeKey.onDown.add(function(key) {
    //   var self = this;
    //   this.strike.child('count').once('value', function(snap) {
    //     var count = snap.val();
    //     count++;
    //     // self.strike.child('count').set(count);
    //     self.strike.update({count: 0});
    //   });
    // }, this);

    // Player on Firebase
    var self = this;
    this.playerID = this.game.state.states['Main'].userID;
    this.playerKey = this.game.state.states['Main'].keyID;
    this.playerRecord = this.players.arr.$getRecord(this.playerKey);

    // Initialize Player's levelUp flag to false in Firebase
    this.playerRecord.levelUp = false;
    this.players.arr.$save(this.playerRecord).then(function(ref) {
      // Register a Level Up Listener
      self.levelUp = self.game.state.states['Main'].levelUp;
    }).then(function(){
      self.levelUp.child('isReady').on('value', self.fbLevelUpListener, self);
    });

    // Initialize Player has not attempted puzzle
    this.puzzled = false;

    // Debug: Puzzle testing, hit 'P' key to toggle puzzled
    this.puzzledKey = this.game.input.keyboard.addKey(Phaser.KeyCode.P);
    this.puzzledKey.onDown.add(function(key) {
      this.puzzled = true;
    }, this);


    // update puzzled flag based on broadcast from panel and comm
    this.$scope = this.game.state.states['Main'].$scope;
    this.requestNotificationChannel.onPuzzleSolved(this.$scope, function(flag){
      self.puzzled = flag;
      if(flag) {
        panel.tint = 0x2fff18;
        self.Panel.toggle();
      }
      if(!flag) {
        self.strike.child('count').transaction(function(currentCount){
          return currentCount + 1;
        });
      }
      console.log('self.puzzled:', self.puzzled);
    });

  },


  fbLevelUpListener: function(snap) {
    if(snap.val()) {
      this.levelUp.child('isReady').off('value');
      this.requestNotificationChannel.clearListeners();
      alert('You win!!!!');
      this.game.state.start('GameMenu');
    }
  },

  fbStrikeCountListener: function(snap) {
    this.strikeCount = snap.val();
    if(this.strikeCount === 10) {
      this.endTimer();
    }
  },

  endTimer: function() {
    this.timer.stop();
    var self = this;

    // reset strike count
    self.strike.child('count').off('value');
    self.strike.update({count: 0});

    this.requestNotificationChannel.gameOver(true);
    if (!this.Panel.isOn()) {
      this.Panel.toggle();
    }

    setTimeout(function () {
      self.Panel.toggle();
    }, 7000);
    setTimeout(function () {
      // identiy player in firebase array
      for (var i=0;  i < self.players.arr.length; i++) {
        if (self.players.arr[i].playerID === self.playerID) {
          var player = self.players.arr[i];
        }
      }
      // remove player from firebase array
      self.players.arr.$remove(player)
        .then(function (ref) {
          // close modal if open
          if (self.Panel.isOn()) {
            self.Panel.toggle();
          }
          // update firebase that game is no longer in progress
          self.players.lobbyRef.child('inProgress').once('value', function(snapshot){
            var status = snapshot.val();
            if (status){
              self.players.lobbyRef.update({inProgress: false});
            }
          });
          // turn off game over flag
          self.requestNotificationChannel.gameOver(false);
          // navigate to menu screen
          self.game.state.start("GameMenu");
        });
    }, 7500);
  },

  init: function(isPlaying){
    if (isPlaying){
      this.played = true;
    }
  },

  update: function(){

    // Collide the player with the stars
    this.game.physics.arcade.collide(this.roomObjs, this.player, this.objCollisionHandler, null, this);
    this.game.physics.arcade.collide(this.actionObjs, this.player, this.actionCollisionHandler, null, this);

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


    // Room transition
    if (this.player.body.y === 0 && (this.player.body.x > 384 && this.player.body.x < 416)) {
      if (this.puzzled) {
        if (!this.playerRecord.levelUp) {
          this.playerRecord.levelUp = true;
          this.players.arr.$save(this.playerRecord).then(function(ref) {});
        }
      }
    } else {
      if (this.playerRecord.levelUp) {
        this.playerRecord.levelUp = false;
        this.players.arr.$save(this.playerRecord).then(function(ref) {});
      }
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
    // console.log('I hit a room object');
    if(!this.roomObjs.hasCollided){
      this.roomObjs.hasCollided = true;
    }
  },

  actionCollisionHandler: function(player, actionObjs) {
    if(!this.actionObjs.hasCollided){
      this.requestNotificationChannel.loadPuzzle(0);
      this.Panel.toggle();
      this.actionObjs.hasCollided = true;
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
    // display players
    var count = 0;
    for (var i=0;  i < this.players.arr.length; i++) {
      this.game.debug.text(this.players.arr[i].playerID, 2, 30+count, "#0f0");
      count+=15;
    }
    // display strikes
    this.game.debug.text('Strikeouts:'+this.strikeCount, 70, 14, "#0f0");
  },

  formatTime: function(s) {
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
  }
};


// var Game4 = function(game){
//   this.player;
//   this.played = false;
//   this.rotate = true;
//   this.rotator;
//   this.button;
//   this.cursors;
//   this.panelKey;
//   this.roomObjs;
//   this.timer;
//   this.timerEvent;
//   this.requestNotificationChannel;
//   this.Panel;
// };

// Game4.prototype = {

//   preload: function(){
//     this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//     this.game.load.image('room', 'assets/rooms/red.jpg')
//     this.game.load.image('panel', 'assets/cutouts/controlPanelLeft.png');
//     this.game.load.image('large', 'assets/cutouts/nozzleLarge.png');
//     this.game.load.image('medium', 'assets/cutouts/nozzleMedium.png');
//     this.game.load.image('small', 'assets/cutouts/nozzleSmall.png');
//     this.game.load.image('topLeftTank', 'assets/cutouts/topLeftTank.png');
//     this.game.load.image('bottomLeftTank', 'assets/cutouts/bottomLeftTank.png');
//     this.game.load.image('rightHalfTank', 'assets/cutouts/rightHalfTank.png');
//   },


//   create: function(){
//     //  We're going to be using physics, so enable the Arcade Physics system
//     this.game.physics.startSystem(Phaser.Physics.ARCADE);

//     //  A simple background for our game
//     this.game.add.sprite(0, 0, 'room');

//     //LARGE PANEL
//     this.roomObjs = this.game.add.group();
//     this.roomObjs.enableBody = true;
//     var panel = this.roomObjs.create(0, this.game.world.height/3.7, 'panel');
//     // panel.body.setSize(100, 50, 0, 0);
//     this.givePhysicsTo(panel, true, true, true, true, true);

//     // SMALL1 NOZZLE
//     var small = this.roomObjs.create(this.game.world.width/1.8, 44, 'small');
//     this.givePhysicsTo(small, true, true, true, true, true);

//     // SMALL2 NOZLLE
//     var small2 = this.roomObjs.create(156, this.game.world.height-48, 'small');
//     this.givePhysicsTo(small2, true, true, true, true, true);


//     // SMALL3 NOZLLE
//     var small3 = this.roomObjs.create(this.game.world.width-248, 44, 'small');
//     this.givePhysicsTo(small3, true, true, true, true, true);

//     // SMALL4 NOZZLE
//     var small4 = this.roomObjs.create(this.game.world.width - 186 , this.game.world.height-30, 'small');
//     this.givePhysicsTo(small4, true, true, true, true, true);

//     // Top Left Tank
//     var topLeftTank = this.roomObjs.create(0, 0, 'topLeftTank');
//     this.givePhysicsTo(topLeftTank, true, true, true, true, true);


//     // Bottom Left Tank
//     var bottomLeftTank = this.roomObjs.create(0, this.game.world.height, 'bottomLeftTank');
//     this.givePhysicsTo(bottomLeftTank, true, true, true, true, true);

//     // RIGHT HALF TANK
//     var rightHalfTank = this.roomObjs.create(this.game.world.width, 70, 'rightHalfTank');
//     this.givePhysicsTo(rightHalfTank, true, true, true, true, true);

//     // //CIRCULAR CENTER
//     // var circle = this.roomObjs.create(this.game.world.width/2.95, this.game.world.height/3.9, 'circle');
//     // this.givePhysicsTo(circle, true, true, true, true, true);


// /***-------------  The player and its settings --------------------------------***/
//     this.player = this.game.add.sprite(this.game.world.width/2.07, this.game.world.height - 96, 'dude');

//      // We need to enable physics on the player
//     this.game.physics.arcade.enable(this.player);

//     this.player.body.collideWorldBounds = true;

//      // Our two animations, walking left and right.
//     this.player.animations.add('right', [5,6,7,8], 10, true);
//     this.player.animations.add('left', [0,1,2,3], 10, true);
//     // this.player.animations.add('up', [4], 10, true);
//     // this.player.animations.add('down', [4], 10, true);
//     this.player.animations.add('up', [4]);
//     this.player.animations.add('down' [4]);

//     //  Our controls.
//     this.cursors = this.game.input.keyboard.createCursorKeys();
//     this.panelKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);

//     // passing angular modules from game.js
//     this.Puzzle = this.game.state.states['Main'].puzzle;
//     this.Panel = this.game.state.states['Main'].panel;
//     this.requestNotificationChannel = this.game.state.states['Main'].requestNotificationChannel;

//     var components = this.Puzzle.generatePuzzles();
//     this.Panel.init(this.game, components.puzzles);
//     this.requestNotificationChannel.loadManual(components.manuals);

//     this.panelKey.onDown.add(function(key) {
//       this.requestNotificationChannel.loadPuzzle(0);
//       this.Panel.toggle();
//       this.roomObjs.hasCollided = false;
//     }, this);

//     // Game Timer
//     this.timer = this.game.time.create();
//     // this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 10, this.endTimer, this);
//     this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 3, this.endTimer, this);
//     this.timer.start();  // timer display handled in render block
//   },

//   endTimer: function() {
//     this.timer.stop();
//     this.requestNotificationChannel.gameOver(true);
//     this.Panel.toggle();

//     var self = this;
//     setTimeout(function () {
//       self.Panel.toggle();
//       self.game.state.start("GameMenu");
//     }, 10000);
//   },

//   init: function(isPlaying){
//     if (isPlaying){
//       this.played = true;
//     }
//   },

//   update: function(){
//     this.game.physics.arcade.collide(this.roomObjs, this.player, this.objCollisionHandler, null, this);
//     //  Reset the players velocity (movement)
//     this.player.body.velocity.x = 0;

//     //directional movement
//     if (this.cursors.left.isDown) {
//       this.player.body.velocity.x = -200;
//       this.player.animations.play('left');
//     } else if (this.cursors.right.isDown) {
//       this.player.body.velocity.x = 200;
//       this.player.animations.play('right');
//     } else if (this.cursors.up.isDown) {
//       this.player.body.velocity.y = -200;
//       this.player.animations.play('up');
//     } else if (this.cursors.down.isDown) {
//       this.player.body.velocity.y = 200;
//       this.player.animations.play('down');
//     } else {
//       //  Stand still
//       this.player.body.velocity.y = 0;
//       this.player.animations.stop();
//       this.player.frame = 4;
//     }

//     //Room transition (might be better to do object collision instead, but refactor later)
//     if (this.player.body.y === 485 && (this.player.body.x > 384 && this.player.body.x < 416)){
//       var isPlaying = true;
//       this.game.state.start('Game', true, false, isPlaying);
//     }

//   },

//   givePhysicsTo: function(obj, collideWorldBounds, immovable, checkCollLeft, checkCollRight, checkCollDown, checkCollUp){
//     this.game.physics.enable(obj, Phaser.Physics.ARCADE);
//     obj.body.collideWorldBounds = collideWorldBounds;
//     obj.body.immovable = immovable;
//     obj.body.checkCollision.left = checkCollLeft;
//     obj.body.checkCollision.right = checkCollRight;
//     obj.body.checkCollision.down = checkCollDown;
//     obj.body.checkCollision.up = checkCollUp;
//   },

//   objCollisionHandler: function(player, roomObjs){
//     console.log('I hit a room object');
//     if(!this.roomObjs.hasCollided){
//       this.requestNotificationChannel.loadPuzzle(0);
//       this.Panel.toggle();
//       this.roomObjs.hasCollided = true;
//     }
//   },
//   toggleRotate: function(){
//     console.log('angle: ', this.rotator.angle);
//     console.log('rotation: ', this.rotator.rotation);
//     this.rotate = !this.rotate;
//   },

//   actionOnClick: function() {
//     if (this.rotator.angle > 0 && this.rotator.angle < 90) {
//       console.log('You saved the reactor!');
//     } else {
//       console.log('Boom!');
//     }
//   },

//   render: function() {
//     if (this.timer.running) {
//       this.game.debug.text(this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), 2, 14, "#ff0");
//     } else {
//       this.game.debug.text("Boom!", 2, 14, "#0f0");
//     }
//   },

//   formatTime: function(s) {
//     var minutes = "0" + Math.floor(s / 60);
//     var seconds = "0" + (s - minutes * 60);
//     return minutes.substr(-2) + ":" + seconds.substr(-2);
//   }

// };




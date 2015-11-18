// Begin Gameplay @ Room 1

var Game = function (game) {
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

Game.prototype = {

  preload: function(){
    this.game.load.image('room', 'assets/rooms/orange2.jpg')
    this.game.load.image('smallPanel', 'assets/cutouts/smallPanel1.png');
    this.game.load.image('tankleft', 'assets/cutouts/tank.png');
    this.game.load.image('panel', 'assets/cutouts/controlPanel.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.image('panel', 'assets/panel.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('arrow', 'assets/cutouts/doodad2.png');
  },



  create: function(){

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.disableVisibilityChange = true;

    music.pause();

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
    var panel = this.actionObjs.create(470, 0, 'panel', 3);
    this.givePhysicsTo(panel, true, true, true, true, true);
    panel.tint = 0xff2200;

    //SMALL PANEL
    var smallPanel = this.roomObjs.create(this.game.world.width/3.24, this.game.world.height/1.247, 'smallPanel', 3);
    this.givePhysicsTo(smallPanel, true, true, true, true, true);

    //LEFT TANK
    var tankLeft = this.roomObjs.create(this.game.world.width/5.3, this.game.world.height/4.6, 'tankleft', 3);
    this.givePhysicsTo(tankLeft, true, true, true, true, true);

    //RIGHT TANK
    var tankRight = this.roomObjs.create(this.game.world.width/1.52, this.game.world.height/4.6, 'tankleft', 3);
    this.givePhysicsTo(tankRight, true, true, true, true, true);

    // this.rotator = this.game.add.sprite(this.game.world.width/7.8, 70, 'arrow');
    this.rotator = this.roomObjs.create(this.game.world.width/7.6, this.game.world.height - 90, 'arrow');

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

    this.Panel.init(this.game, this.game.state.states['Main'].puzzles[0]);
    this.requestNotificationChannel.loadManual(this.game.state.states['Main'].manual[0]);

    this.panelKey.onDown.add(function(key) {
      this.requestNotificationChannel.loadPuzzle(0);
      this.Panel.toggle();
      this.actionObjs.hasCollided = false;
    }, this);

    // Game Timer
    this.timer = this.game.time.create();  // Phaser timer
    //this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 30, this.endTimer, this);
    this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 4, this.endTimer, this);
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
      this.game.state.start('Game2');
    }
  },

  fbStrikeCountListener: function(snap) {
    this.strikeCount = snap.val();
    if(this.strikeCount === 3) {
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

    // Rotate arrow
    if(this.rotate) {
      this.rotator.angle += 1;
    }

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
      if (this.players.arr[i].playerID === this.playerID) {
        this.game.debug.text(this.players.arr[i].playerID, 2, 30+count, "#ff0");
      } else {
        this.game.debug.text(this.players.arr[i].playerID, 2, 30+count, "#0f0");
      }
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

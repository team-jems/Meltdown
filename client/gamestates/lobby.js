var Lobby = function(game){
  // allPlayers and strike are firebase service
  this.allPlayers;
  this.strike;
  this.keyID;
  this.playerIndex;
  this.numPlayers;
};

Lobby.prototype = {

  preload: function(){

    while (this.userID === undefined || this.userID === ""){
      this.userID = prompt("What is your name?");
      if (this.userID === null){
        this.userID = undefined;
      }
    }
    this.game.state.states['Main'].userID = this.userID;
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('room', 'assets/rooms/lobby.jpg');
    this.game.load.image('arrow', 'assets/cutouts/enter.png');
  },

  create: function(){

    var self = this;

    // Pass firebase module to this instance
    this.allPlayers = this.game.state.states['Main'].players;

    // Pass firebase Strike to Lobby
    this.strike = this.game.state.states['Main'].strike;

    // Add player to firebase
    this.allPlayers.arr.$add({
      playerID: self.userID,
      isReady: false
    }).then(function(urldb){

      // unique key id of player
      var id = urldb.key();

      // store id
      self.keyID = id;
      self.game.state.states['Main'].keyID = id;

      // player's index in DB
      self.playerIndex = self.allPlayers.arr.$indexFor(id);

      // on disconnect, remove player from array
      self.allPlayers.playersRef.child(id).onDisconnect().remove();
    }).then(function(urldb){
      // Event listener for change to allPlayersReady on firebase, starts game
      self.allPlayers.lobbyRef.child('status').on('value', function(snapshot){
        if(snapshot.val() === 'puzzles ready'){
          self.game.state.states['Main'].puzzles = self.allPlayers.arr[self.playerIndex].puzzles;
          self.game.state.states['Main'].manual = self.allPlayers.arr[self.playerIndex].manual;

          this.playerIsReady = false;
          // grab index in case index has changed
          var index = self.allPlayers.arr.$indexFor(self.keyID);
          self.playerIndex = index;

          // change ready status on local
          self.allPlayers.arr[self.playerIndex].isReady = false;
          self.allPlayers.arr.$save(self.playerIndex).then(function(ref){
            console.log('not ready on database!');
          });

          // reset strike count before starting game
          self.strike.child('count').set(0);

          self.game.state.start('Game');
        }
      });
    }).then(function(){
      // check if game is in progress
      self.allPlayers.lobbyRef.child('inProgress').once('value', function(snapshot){
        if(snapshot.val()){
          self.status = true;
        }
        // if more than 4 players, or game in progress, deny access
        if (self.allPlayers.arr.length > 4 || self.status){
          // get index in case it has changed
          var index = self.allPlayers.arr.$indexFor(self.keyID);
          self.allPlayers.arr.$remove(self.allPlayers.arr[index]).then(function(){
            self.game.state.start('LobbyFull');
          });
        }        
      })   
    });

    // Room
    this.game.add.sprite(0, 0, 'room');

    // Player
    this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2.05, 'dude');
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.anchor.x = 0.5;
    this.player.anchor.y = 0.5;
    this.player.animations.frame = 4;

    // Ready Button
    this.rotator = this.game.add.sprite(this.game.world.width/1.22, this.game.world.height * 0.5, 'arrow');
    this.rotator.anchor.x = 0.5;
    this.rotator.anchor.y = 0.5;
    this.rotator.inputEnabled = true;

    // Title Text
    // this.titleText = this.game.make.text(this.game.world.centerX, 100, "waiting on others...", {
    //   font: 'bold 50pt TheMinion',
    //   fill: '#FDFFB5',
    //   align: 'center'
    // });
    // this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    // this.titleText.anchor.set(0.5);
    // this.optionCount = 1;
    // this.game.add.existing(this.titleText);


  },

  update: function(){

    var self = this;

    // if rotator is held down
    if (this.rotator.input.checkPointerDown(this.game.input.activePointer)){
      this.toggleRotate();

    // if rotator is not held down
    } else {

      // grab index in case index has changed
      var index = self.allPlayers.arr.$indexFor(self.keyID);
      self.playerIndex = index;

      // stop animation
      this.player.animations.stop();
      this.player.animations.frame = 4;

      // have rotator fall back and change ready status back to false
      if (this.rotator.angle > 0){
        this.rotator.angle += -2;

        if (this.playerIsReady) { // only update the ready status on change
          this.playerIsReady = false;
          // grab index in case index has changed
          index = self.allPlayers.arr.$indexFor(self.keyID);
          self.playerIndex = index;

          // change ready status on local
          self.allPlayers.arr[self.playerIndex].isReady = false;
          self.allPlayers.arr.$save(self.playerIndex).then(function(ref){
            console.log('not ready on database!');
          });
        }
      }
    }
  },

  toggleRotate: function(){

    var self = this;

    // if rotator has been held to ready status
    if(this.rotator.angle === 174){

      // play ready animation
      this.player.animations.play('right');

      if (!this.playerIsReady) {
        this.playerIsReady = true;
        // grab index in case index has changed
        var index = self.allPlayers.arr.$indexFor(self.keyID);
        self.playerIndex = index;

        // change ready status on local
        self.allPlayers.arr[self.playerIndex].isReady = true;

        // save change to ready status on database
        self.allPlayers.arr.$save(self.playerIndex).then(function(ref){
          console.log('ready on database!');
        });
      }

    // if rotator is not at ready status
    } else {
      this.rotator.angle += 6;
    }
  }
};

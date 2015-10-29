var Lobby = function(game){
  // allPlayers is the firebase service
  this.allPlayers;
  this.keyID;
  this.playerIndex;
};

Lobby.prototype = {

  preload: function(){

    this.userID = prompt("What is your name?");
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('room', 'assets/rooms/greenRoom.jpg');
    this.game.load.image('arrow', 'assets/cutouts/doodad.png');
  },

  create: function(){

    var self = this;

    // Pass firebase module to this instance
    this.allPlayers = this.game.state.states['Main'].players;

    // Add player to firebase
    this.allPlayers.arr.$add({
      playerID: self.userID,
      isReady: false
    }).then(function(urldb){

      // unique key id of player
      var id = urldb.key();

      // store id
      self.keyID = id;

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

          self.game.state.start('Game');
        };
      });
    });

    // Room
    this.game.add.sprite(0, 0, 'room');

    // Player
    this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'dude');
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.anchor.x = 0.5;
    this.player.anchor.y = 0.5;
    this.player.animations.frame = 4;

    // Ready Button
    this.rotator = this.game.add.sprite(this.game.world.width/2, this.game.world.height * 0.75, 'arrow');
    this.rotator.anchor.x = 0.5;
    this.rotator.anchor.y = 0.5;
    this.rotator.inputEnabled = true;

    // Title Text
    this.titleText = this.game.make.text(this.game.world.centerX, 100, "waiting on others...", {
      font: 'bold 50pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
    this.game.add.existing(this.titleText);


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
          var index = self.allPlayers.arr.$indexFor(self.keyID);
          self.playerIndex = index;

          // change ready status on local
          self.allPlayers.arr[self.playerIndex].isReady = false;
          self.allPlayers.arr.$save(self.playerIndex).then(function(ref){
            console.log('not ready on database!');
          });
        }
      };
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
}
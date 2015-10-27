var Lobby = function(game){
  this.playerIsReady = false;
  this.allPlayersReady = false;
  this.allPlayers;
  this.Puzzle;
  this.keyID;
  this.playerIndex;
  this.numPlayers;

};

// Room 2

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

    // **ASYNC add player to firebase
    this.allPlayers.arr.$add({
      playerID: self.userID,
      isReady: false,
    }).then(function(urldb){
      // unique key id of player
      var id = urldb.key();
      // store id
      self.keyID = id;
      // player's index in DB
      self.playerIndex = self.allPlayers.arr.$indexFor(id);

      // on disconnect, remove player from array
      self.allPlayers.playersRef.child(id).onDisconnect().remove();
    });

    // Room
    this.game.add.sprite(0, 0, 'room');

    // Player
    this.player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'dude');
    this.player.animations.add('right', [5,6,7,8], 10, true);
    this.player.anchor.x = 0.5;
    this.player.anchor.y = 0.5;
    this.player.animations.frame = 4;
    
    //Ready Button
    this.rotator = this.game.add.sprite(this.game.world.width/2, this.game.world.height * 0.75, 'arrow');
    this.rotator.anchor.x = 0.5;
    this.rotator.anchor.y = 0.5;
    this.rotator.inputEnabled = true;

  },

  update: function(){
    var self = this;

    if (this.rotator.input.checkPointerDown(this.game.input.activePointer)){
      this.toggleRotate();
    } else {

      // grab index in case index has changed
      var index = self.allPlayers.arr.$indexFor(self.keyID);
      self.playerIndex = index;

      this.player.animations.stop();
      this.player.animations.frame = 4;
      if (this.rotator.angle > 0){
        this.rotator.angle += -2;
        self.allPlayers.arr[self.playerIndex].isReady = false;
        self.allPlayers.arr.$save(self.playerIndex).then(function(ref){
          console.log('not ready on database!');
        });

    };


    }


  },

  toggleRotate: function(){
    var self = this;

    // if rotator has been held to ready status
    if(this.rotator.angle === 174){
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

      // loop through number of players
      var numPlayers = self.allPlayers.arr.length;
      console.log(self.allPlayers.arr.length);

      self.allPlayers.lobbyRef.update({numPlayers: numPlayers, allPlayersReady: false});

    }

    // twist rotator 
    if (this.rotator.angle < 174){
      this.rotator.angle += 6;
    } else {
      this.player.animations.play('right');
    }
  }
}
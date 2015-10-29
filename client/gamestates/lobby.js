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
      puzzle: 'puzzle'
    }).then(function(urldb){
      // unique key id of player
      var id = urldb.key();
      // store id
      self.keyID = id;
      // player's index in DB
      self.playerIndex = self.allPlayers.arr.$indexFor(id);

      // on disconnect, remove player from array
      self.allPlayers.playersRef.child(id).onDisconnect().remove();
      // self.allPlayers.lobbyRef.onDisconnect().set({numPlayers: self.allPlayers.arr.length, allPlayersReady: false});

    }).then(function(urldb){


      // Updates lobby on player arrival
      var numPlayers = self.allPlayers.arr.length;
      self.allPlayers.lobbyRef.update({numPlayers: numPlayers, allPlayersReady: false});
      
      // Watch for changes in player array and updates lobby on player change
      self.allPlayers.arr.$watch(function(event){
        var numPlayers = self.allPlayers.arr.length;
        self.allPlayers.lobbyRef.update({numPlayers: numPlayers});
      });

      // Event listener for change to all Players Ready

      self.allPlayers.lobbyRef.child('allPlayersReady').on('value', function(snapshot){
        if(snapshot.val()){
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

    var puzzle;
    self.allPlayers.puzzleRef.on('value', function(snapshot){
      puzzle = snapshot.val();
    });

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

      // adds puzzle to each player in the area on an individual basis
      // self.allPlayers.arr[0].puzzle = puzzle;
      // self.allPlayers.arr[1].puzzle = puzzle;

      //adds one puzzle to all players in area ('puzzle' value is set in initial addition of player (line 30) and then reset here )
      for (var i = 0; i < self.allPlayers.arr.length; i++){
        self.allPlayers.arr[i].puzzle = puzzle;
      }

      if (self.allPlayers.arr.length > 1){
        if (self.allPlayersReady){
        } else {
          // loop through all players
          var allPlayersReady = true;
          for (var i = 0; i < self.allPlayers.arr.length; i++){
            if (self.allPlayers.arr[i].isReady === false){
              allPlayersReady = false;
            }
          }
          if (allPlayersReady){
            var numPlayers = self.allPlayers.arr.length;
            self.allPlayers.lobbyRef.update({numPlayers: numPlayers, allPlayersReady: allPlayersReady});
          }
        }

      }
    }

    // twist rotator 
    if (this.rotator.angle < 174){
      this.rotator.angle += 6;
    } else {
      this.player.animations.play('right');
    }
  }
}
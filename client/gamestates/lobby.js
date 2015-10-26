var Lobby = function(game){

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

    if (this.rotator.input.checkPointerDown(this.game.input.activePointer)){
      this.toggleRotate();
    } else {
      this.player.animations.stop();
      this.player.animations.frame = 4;
      if (this.rotator.angle > 0){
        this.rotator.angle += -2;
      }
    };

  },

  toggleRotate: function(){
    if(this.rotator.angle === 174){
      console.log(this.userID);
    }
    if (this.rotator.angle < 174){
      this.rotator.angle += 6;
    } else {
      this.player.animations.play('right');
    }
  }
}
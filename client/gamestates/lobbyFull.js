var LobbyFull = function(game){

};

LobbyFull.prototype = {

  preload: function(){
  },

  create: function(){
    this.game.add.sprite(0, 0, 'gameover-bg');

    this.titleText = this.game.add.text(this.game.world.centerX, 100, "Game in Progress! \n Please Try Again Later", {
      font: 'bold 40pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);

    this.clickText = this.game.add.text(this.game.world.centerX, 450, "Click Anywhere to Continue", {
      font: 'bold 30pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.clickText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.clickText.anchor.set(0.5);

  },

  update: function(){
    if (this.game.input.activePointer.isDown)
    {
      this.game.state.start("GameMenu");
    }
  }
}
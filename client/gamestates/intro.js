var Intro = function(game){
  this.counter = 0;
};

Intro.prototype = {

  init: function(){

    this.titleText = this.game.make.text(this.game.world.centerX, 130, "A short time ago in \n a reactor close, \n close by...", {
      font: 'bold 30pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.titleText.alpha = 0;
  },

  create: function(){

    this.background = this.game.add.sprite(0, 0, 'intro-bg');
    this.game.add.existing(this.titleText);
    this.background.inputEnabled = true;
    this.updateText1();
    this.background.events.onInputDown.add(function(){
      this.game.state.start('GameMenu');
    }, this);
  },

  updateText1: function(sprite, pointer){
    this.game.add.tween(this.titleText).to({alpha: 1}, 2000, "Linear", true).onComplete.add(this.textFade1, this);
  },

  textFade1: function(sprite, pointer){
    this.game.add.tween(this.titleText).to({alpha: 0}, 2000, "Linear", true).onComplete.add(this.updateText2, this);
  },

  updateText2: function(sprite, pointer){
    this.titleText.setText('...problems');
    this.game.add.tween(this.titleText).to({alpha: 1}, 2000, "Linear", true).onComplete.add(this.textFade2, this);
  },

  textFade2: function(sprite, pointer){
    this.game.add.tween(this.titleText).to({alpha: 0}, 2000, "Linear", true).onComplete.add(this.updateText3, this);
  },

  updateText3: function(sprite, pointer){
    var self = this;
    this.titleText.setText('Now only you \n and your team \n can save the world!');
    this.game.add.tween(this.titleText).to({alpha: 1}, 2000, "Linear", true).onComplete.add(this.textFade3, this);
  },

  textFade3: function(sprite, pointer){
    this.game.add.tween(this.titleText).to({alpha: 0}, 2000, "Linear", true).onComplete.add(this.updateText4, this);
  },

  updateText4: function(sprite, pointer){
    this.titleText.destroy();
    this.titleText = this.game.make.text(this.game.world.centerX, 250, "Each player will have their own problems \n to solve but some other player will \n have the pieces of information they need! \n  Pester your team to fill in the blanks \n or the world is doomed!!! \n Good luck! \n \n Use the arrow keys, mouse, and escape to play \n \n Click to continue!", {
      font: 'bold 20pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.titleText.alpha = 0;
    this.game.add.existing(this.titleText);
    this.game.add.tween(this.titleText).to({alpha: 1}, 2000, "Linear", true);
  }

};
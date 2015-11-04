// Game Menu

var GameMenu = function(game) {};

GameMenu.prototype = {

  // Add an option to menu
  // addMenuOption: function(text, callback) {
  //   var txt = this.game.add.text(30, (this.optionCount * 80) + 150, text, style.navitem.default);
  //   txt.inputEnabled = true;
  //   txt.events.onInputUp.add(callback);
  //   txt.events.onInputOver.add(function (target) {
  //     target.setStyle(style.navitem.hover);
  //   });
  //   txt.events.onInputOut.add(function (target) {
  //     target.setStyle(style.navitem.default);
  //   });
  //   this.optionCount ++;
  // },

  // Initialize and set title
  init: function () {
    this.titleText = this.game.make.text(this.game.world.centerX, 100, "meltdown", {
      font: 'bold 50pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {
    var self = this;

    // set true to prevent game from pausing
    this.game.stage.disableVisibilityChange = false;

    var menu = this.game.add.sprite(0, 0, 'menu-bg');
    this.game.add.existing(this.titleText);

    var text = this.game.add.text(this.game.world.centerX, 400, "click to continue", style.navitem.default);
    text.anchor.set(0.5);

    text.alpha = 0;
    this.game.add.tween(text).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    menu.inputEnabled = true;
    menu.events.onInputDown.add(function(){
      this.game.state.start('Lobby');
    }, this);


    // this.addMenuOption('Start', function () {
    //   self.game.state.start('Game');
    // });
    // this.addMenuOption('Multiplayer', function(){
    //   self.game.state.start('Lobby');
    // })
    // this.addMenuOption('Options', function () {
    //   console.log('You clicked Options!');
    // });
    // this.addMenuOption('Credits', function () {
    //   console.log('You clicked Credits!');
    // });
  }
};
// Game Menu

var GameMenu = function(game) {};

GameMenu.prototype = {

  // Add an option to menu
  addMenuOption: function(text, callback) {
    var txt = this.game.add.text(30, (this.optionCount * 80) + 200, text, style.navitem.default);
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem.default);
    });
    this.optionCount ++;
  },

  // Initialize and set title
  init: function () {
    // *** second choice *** title
    // this.titleText = this.game.make.text(this.game.world.centerX, 100, "react or hack", {
    // *** first choice *** title
    this.titleText = this.game.make.text(this.game.world.centerX, 100, "hack react or cry", {
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

    this.game.add.sprite(0, 0, 'menu-bg');
    this.game.add.existing(this.titleText);

    this.addMenuOption('Start', function () {
      self.game.state.start('Game');
    });
    this.addMenuOption('Options', function () {
      console.log('You clicked Options!');
    });
    this.addMenuOption('Credits', function () {
      console.log('You clicked Credits!');
    });
  }
};
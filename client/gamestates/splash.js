var Splash = function (func) {},
    playSound = true,
    playMusic = true,
    music;

Splash.prototype = {

  loadScripts: function () {
    this.game.load.script('WebFont', 'vendor/webfontloader.js');
    this.game.load.script('gamemenu','states/gamemenu.js');
    this.game.load.script('thegame', 'states/thegame.js');
    this.game.load.script('gameover','states/gameover.js');
    this.game.load.script('credits', 'states/credits.js');
    this.game.load.script('options', 'states/options.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    this.game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    this.game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    this.game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
    this.game.load.image('options-bg', 'assets/images/options-bg.jpg');
    this.game.load.image('gameover-bg', 'assets/images/gameover-bg.jpg');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    }
  },

  init: function (game) {
    this.game = game;
    this.loadingBar = this.game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = this.game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = this.game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    this.game.add.sprite(0, 0, 'stars');
    this.game.add.existing(this.logo).scale.setTo(0.5);
    this.game.add.existing(this.loadingBar);
    this.game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    this.game.state.add("GameMenu",GameMenu);
    this.game.state.add("Game",Game);
    this.game.state.add("GameOver",GameOver);
    this.game.state.add("Credits",Credits);
    this.game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = this.game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      //game.state.start("GameMenu");
    }, 5000);
  }
};
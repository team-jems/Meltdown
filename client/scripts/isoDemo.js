angular.module('app.isoDemo', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('isoDemo', {
        url: '/isoDemo',
        templateUrl: 'templates/isoDemo.html',
        controller: 'isoDemoController'
      });
  }
])

.controller('isoDemoController', ['$scope',
  function($scope) {

    var game = new Phaser.Game(
      800, 600,
      Phaser.AUTO,
      'iso_canvas',
      { preload: preload, create: create, update: update });

    var floorGroup, player;

    function preload() {
      game.plugins.add(new Phaser.Plugin.Isometric(game));
      game.world.setBounds(0, 0, 800, 600);
      game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
      game.iso.anchor.setTo(0.5, 0.3);

      game.load.image('lot', 'assets/isoDemo/lot.png');

      game.load.image('tree', 'assets/isoDemo/treeConiferTall.png');
    }

    function create() {
      floorGroup = game.add.group();

      var lotTile;

      for (var xt = 0; xt <= 385; xt += 55) {
        for (var yt = 0; yt <= 385; yt += 55) {
          lotTile = game.add.isoSprite(xt, yt, 0, 'lot', 0, floorGroup);
          lotTile.anchor.set(0.5, 0.3);
        }
      }

      player = game.add.isoSprite(175, 175, 0, 'tree', 0);
      player.anchor.set(0.5);
      game.physics.isoArcade.enable(player);
      player.body.collideWorldBounds = true;

      this.cursors = game.input.keyboard.createCursorKeys();

      this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
      ]);
    }

    function update() {
      if (this.cursors.up.isDown) {
        player.body.velocity.y = -100;
      } else if (this.cursors.down.isDown) {
        player.body.velocity.y = 100;
      } else {
        player.body.velocity.y = 0;
      }

      if (this.cursors.left.isDown) {
        player.body.velocity.x = -100;
      } else if (this.cursors.right.isDown) {
        player.body.velocity.x = 100;
      } else {
        player.body.velocity.x = 0;
      }

      game.iso.simpleSort(floorGroup);
    }
  }
]);

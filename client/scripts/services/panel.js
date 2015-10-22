angular.module('app.panel', ['ui.slider', 'ui.knob'])

.factory('Panel', function() {
  var panels;
  var mask;

  var init = function(game, puzzles) {
    var background = new Phaser.Graphics(game, 0, 0);
    background.beginFill(0x000000, 0.4);
    background.drawRect(0, 0, 800, 600);
    background.endFill();

    mask = game.add.image(0, 0, background.generateTexture());
    mask.inputEnabled = true;
    mask.visible = false;

    panels = puzzles;
  };

  var toggle = function() {
    mask.visible = !mask.visible;
    $('.panel').toggle();
  };

  var on = function() {
    mask.visible = true;
    $('.panel').on();
  };

  var off = function() {
    mask.visible = false;
    $('.panel').off();
  };

  var load = function(index) {
    return panels[index];
  };

  return {
    init: init,
    toggle: toggle,
    load: load, 
    on: on,
    off: off
  };
})

.controller('PanelController', ['$scope', 'requestNotificationChannel', 'Panel',
  function($scope, requestNotificationChannel, Panel) {
    $scope.knobData = {
      value: 40,
      options: {
        readOnly: true,
        width: 100,
        height: 100
      }
    };

    var onLoadPuzzleHandler = function(index) {
      $scope.puzzle = Panel.load(index);
      $scope.$apply();
    };

    requestNotificationChannel.onLoadPuzzle($scope, onLoadPuzzleHandler);

    var onGameOverHandler = function(flag) {
      $scope.gameOver = flag;
      $scope.$apply();
    };

    requestNotificationChannel.onGameOver($scope, onGameOverHandler);

    $scope.checkSolution = function() {
      if ($scope.puzzle.type === 'binaryLever') {
        if ($scope.puzzle.state !== 1) {
          var answer = $scope.puzzle.state === 2;

          if (answer === $scope.puzzle.solution) {
            $scope.puzzle.solved = true;
          } else {
            $scope.puzzle.solved = false;
            console.log('BUZZ!');
          }
        }
      }
    };

    $scope.checkKnob = function() {
      console.log('Knob set at: ', $scope.knobData.value);
    };
  }
]);

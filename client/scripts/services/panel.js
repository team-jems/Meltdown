angular.module('app.panel', [])

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

  var load = function(index) {
    return panels[index];
  };

  return {
    init: init,
    toggle: toggle,
    load: load
  };
})

.controller('PanelController', ['$scope', 'requestNotificationChannel', 'Panel',
  function($scope, requestNotificationChannel, Panel) {
    var onLoadPuzzleHandler = function(index) {
      $scope.puzzle = Panel.load(index);
      $scope.$apply();
    };

    requestNotificationChannel.onLoadPuzzle($scope, onLoadPuzzleHandler);

    $scope.checkSolution = function(answer) {
      if ($scope.puzzle.type === 'binaryLever') {
        if (answer === $scope.puzzle.solution) {
          console.log('Correct!');
        } else {
          console.log('Wrong!');
        }
      }
    };
  }
]);

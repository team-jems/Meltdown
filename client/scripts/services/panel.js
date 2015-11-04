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
    console.log("panel is on")
    $('.panel').on();
  };

  var off = function() {
    mask.visible = false;
  };

  var load = function(index) {
    return panels[index];
  };

  var isOn = function() {
    return mask.visible;
  };

  return {
    init: init,
    toggle: toggle,
    load: load,
    on: on,
    off: off,
    mask: mask,
    isOn: isOn
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

    $scope.checkSolution = function(answer) {
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

      if ($scope.puzzle.type === 'buttonSeries') {
        if (answer === $scope.puzzle.fbSolution[$scope.puzzle.state]) {
          $scope.puzzle.displays[$scope.puzzle.state][1] = true;

          if ($scope.puzzle.state === 3) {
            $scope.puzzle.solved = true;
          } else {
            $scope.puzzle.state++;
          }
        } else {
          console.log('BUZZ!');
        }
      }

      if ($scope.puzzle.type === 'circuit') {
        var row = $scope.puzzle.current[0];
        var col = $scope.puzzle.current[1];
        var rowPath = row;
        var colPath = col;
        var rowTo = row;
        var colTo = col;
        var move = $scope.puzzle.controls[$scope.puzzle.previous][answer];

        if (move === 'up') {
          rowPath--;
          rowTo -= 2;
        } else if (move === 'left') {
          colPath--;
          colTo -= 2;
        } else if (move === 'down') {
          rowPath++;
          rowTo += 2;
        } else if (move === 'right') {
          colPath++;
          colTo += 2;
        }

        if (rowPath < 0 || rowPath > 4 || colPath < 0 || colPath > 4 || // node out of bound
          $scope.puzzle.state[rowPath][colPath] === 2 || // broken resistor
          $scope.puzzle.state[rowTo][colTo] === 1) {     // node already visited
          console.log('BUZZ!');
        } else {
          if ($scope.puzzle.state[rowTo][colTo] === 3) {
            $scope.puzzle.solved = true;
          }

          $scope.puzzle.state[row][col] = 1;
          $scope.puzzle.state[rowPath][colPath] = 1;
          $scope.puzzle.state[rowTo][colTo] = 2;
          $scope.puzzle.current = [rowTo, colTo];
          $scope.puzzle.previous = answer;
        }
      }
      requestNotificationChannel.puzzleSolved($scope.puzzle.solved);
    };

    $scope.reset = function() {
      var copyBoard = function(board) {
        var copy = [];

        for (var i = 0; i < 5; i++) {
          copy[i] = board[i].slice();
        }

        return copy;
      };

      if ($scope.puzzle.type === 'circuit') {
        $scope.puzzle.state = copyBoard($scope.puzzle.board);
        $scope.puzzle.current = [0, 0];
        $scope.puzzle.previous = 'r';
      }
    }

    $scope.checkKnob = function() {
      console.log('Knob set at: ', $scope.knobData.value);
    };
  }
]);

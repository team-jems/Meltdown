angular.module('app.panel', ['ui.slider', 'ui.knob', 'ngDragDrop'])

.factory('Panel', function() {
  var panels;
  var mask;

  var init = function(game, puzzles) {
    var background = new Phaser.Graphics(game, 0, 0);
    background.beginFill(0x000000, 0.4);
    background.drawRect(0, 0, 800, 533);
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
    return panels;
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
      if ($scope.puzzle.type === 'circuit') {
        $scope.state = $scope.copyBoard($scope.puzzle.board);
        $scope.colors = [
          {short: 'r', long: 'red'},
          {short: 'y', long: 'yellow'},
          {short: 'b', long: 'blue'},
          {short: 'g', long: 'green'}
        ]
        $scope.current = [0, 0];
        $scope.previous = 'r';
      } else if ($scope.puzzle.type === 'password') {
        $scope.display = $scope.puzzle.letters.join('');
        $scope.list1 = [];
        $scope.puzzle.letters.forEach(function(letter) {
          $scope.list1.push({label: letter, drag: true});
        });
        $scope.list2 = [{}, {}, {}, {}, {}];
      } else {
        $scope.state = 0;
      }
      $scope.solved = false;
      $scope.$apply();
    };

    requestNotificationChannel.onLoadPuzzle($scope, onLoadPuzzleHandler);

    var onGameOverHandler = function(flag) {
      $scope.gameOver = flag;
      $scope.$apply();
    };

    var onGameOver = requestNotificationChannel.onGameOver($scope, onGameOverHandler);

    $scope.checkSolution = function(answer) {
      if ($scope.puzzle.type === 'slider') {
        if ($scope.state === $scope.puzzle.solution) {
          requestNotificationChannel.puzzleSolved(true);
        }  else {
          requestNotificationChannel.puzzleSolved(false);
        }
      }

      if ($scope.puzzle.type === 'sequence') {
        if (answer === $scope.puzzle.solution[$scope.state]) {
          $scope.state++;
          if ($scope.state === 4) {
            requestNotificationChannel.puzzleSolved(true);
          }
        } else {
          requestNotificationChannel.puzzleSolved(false);
        }
      }

      if ($scope.puzzle.type === 'password') {
        var answer = $scope.list2.map(function(letter) {
          return letter.label;
        });

        if ($scope.puzzle.solution.join('') === answer.join('')) {
          requestNotificationChannel.puzzleSolved(true);
        } else {
          requestNotificationChannel.puzzleSolved(false);
        }
      }

      if ($scope.puzzle.type === 'circuit') {
        var row = $scope.current[0];
        var col = $scope.current[1];
        var rowPath = row;
        var colPath = col;
        var rowTo = row;
        var colTo = col;
        var move = $scope.puzzle.controls[$scope.previous][answer];

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
          $scope.state[rowPath][colPath] === 2 || // broken resistor
          $scope.state[rowTo][colTo] === 1) {     // node already visited
          requestNotificationChannel.puzzleSolved(false);
        } else {
          if ($scope.state[rowTo][colTo] === 3) {
            requestNotificationChannel.puzzleSolved(true);
          }

          $scope.state[row][col] = 1;
          $scope.state[rowPath][colPath] = 1;
          $scope.state[rowTo][colTo] = 2;
          $scope.current = [rowTo, colTo];
          $scope.previous = answer;
        }
      }
    };

    $scope.reset = function() {
      if ($scope.puzzle.type === 'circuit') {
        $scope.state = $scope.copyBoard($scope.puzzle.board);
        $scope.current = [0, 0];
        $scope.previous = 'r';
      }
    };

    $scope.copyBoard = function(board) {
      var copy = [];

      for (var i = 0; i < 5; i++) {
        copy[i] = board[i].slice();
      }

      return copy;
    };

    $scope.checkKnob = function() {
      console.log('Knob set at: ', $scope.knobData.value);
    };
  }
]);

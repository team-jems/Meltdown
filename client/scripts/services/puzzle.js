angular.module('app.puzzle', [])

.factory('Puzzle', function() {
  // Randomly chooses given number of non-repeated items from ChoiceList
  var randomChoice = function(choiceList, count) {
    count = count ? Math.min(count, choiceList.length) : 1;

    var choices = choiceList.slice();
    var chosen = [];

    for (var i = 0; i < count; i++) {
      var choice = choices.splice(Math.floor(Math.random() * choices.length), 1);
      chosen = chosen.concat(choice);
    }

    return (count === 1) ? chosen[0] : chosen;
  };

  // Turn the string into random characters starting from the first non-whitespace
  var noisify = function(line) {
    var noise = '!@#$%^&*+-/\\=~'.split('');
    var start = line[0].search(/\S/);
    var noisified = '';

    for (var i = 0, j = line[0].length; i < j; i++) {
      noisified += (i < start) ? ' ' : noise[Math.floor(Math.random() * 14)];
    }

    return [noisified, 1];
  };

  var generateBinaryLever = function() {
    var meterMin = 81;
    var meterMax = 220;
    var solution = Math.random() < 0.5;

    var booleanOp = []
    booleanOp[0] = randomChoice(['&&', '||']);
    booleanOp[1] = randomChoice(['&&', '||']);

    var possBooleanSeq = [[true, true, true], [true, true, false],
      [true, false, true], [true, false, false], [false, true, true],
      [false, true, false], [false, false, true], [false, false, false]];
    var filterFunction;

    if (booleanOp[0] === '&&' && booleanOp[1] === '&&') {
      filterFunction = function(bools) {
        return (bools[0] && bools[1] && bools[2]) === solution;
      };
    }

    if (booleanOp[0] === '&&' && booleanOp[1] === '||') {
      filterFunction = function(bools) {
        return (bools[0] && bools[1] || bools[2]) === solution;
      };
    }

    if (booleanOp[0] === '||' && booleanOp[1] === '&&') {
      filterFunction = function(bools) {
        return (bools[0] || bools[1] && bools[2]) === solution;
      };
    }

    if (booleanOp[0] === '||' && booleanOp[1] === '||') {
      filterFunction = function(bools) {
        return (bools[0] || bools[1] || bools[2]) === solution;
      };
    }

    var booleanSeq = randomChoice(possBooleanSeq.filter(filterFunction));
    var negation = [];

    for (var i = 0; i < 3; i++) {
      var negate = Math.random() < 0.5;

      if (negate) {
        booleanSeq[i] = !booleanSeq[i];
      }

      negation.push(negate);
    }

    var readings = [];
    var generateMeterReading = function() {
      return Math.floor(Math.random() * (meterMax - meterMin)) + meterMin;
    };

    for (var i = 0; i < 4; i++) {
      readings[i] = generateMeterReading();
    }

    var generateConditional = function(type, bool) {
      if (type === 0) {
        var meter = randomChoice([0, 1, 2, 3]);
        var target = readings[meter] + Math.floor(Math.random() * 41) - 20;

        if (readings[meter] < target) {
          target = Math.min(meterMax, target);
          var cond = bool ? '<' : '>';
        }

        if (readings[meter] > target) {
          target = Math.max(meterMin - 1, target);
          var cond = bool ? '>' : '<';
        }

        if (readings[meter] === target) {
          var cond = bool ? '===' : '!==';
        }

        return 'this.meter' + (meter + 1) + '.reading ' + cond + ' ' + target;
      }

      if (type === 1) {
        var meters = randomChoice([0, 1, 2, 3], 2);

        if (readings[meters[0]] < readings[meters[1]]) {
          var cond = bool ? '<' : '>';
        }

        if (readings[meters[0]] > readings[meters[1]]) {
          var cond = bool ? '>' : '<';
        }

        if (readings[meters[0]] === readings[meters[1]]) {
          var cond = bool ? '===' : '!==';
        }

        return 'this.meter' + (meters[0] + 1) + '.reading ' + cond +
          ' this.meter' + (meters[1] + 1) + '.reading';
      }

      if (type === 2) {
        var max = Math.max.apply(null, readings);
        var maxPos = [];
        var nonMaxPos = [];

        for (var i = 0; i < 4; i++) {
          if (readings[i] === max) {
            maxPos.push(i);
          } else {
            nonMaxPos.push(i);
          }
        }

        var meter = randomChoice([randomChoice(maxPos), randomChoice(nonMaxPos)]);

        if (readings[meter] === max) {
          var cond = bool ? '===' : '!==';
        } else {
          var cond = bool ? '!==' : '===';
        }

        return 'this.maxReading ' + cond +
          ' this.meter' + (meter + 1) + '.reading';
      }

      if (type === 3) {  // meter is/is not min
        var min = Math.min.apply(null, readings);
        var minPos = [];
        var nonMinPos = [];

        for (var i = 0; i < 4; i++) {
          if (readings[i] === min) {
            minPos.push(i);
          } else {
            nonMinPos.push(i);
          }
        }

        var meter = randomChoice([randomChoice(minPos), randomChoice(nonMinPos)]);

        if (readings[meter] === min) {
          var cond = bool ? '===' : '!==';
        } else {
          var cond = bool ? '!==' : '===';
        }

        return 'this.minReading ' + cond +
          ' this.meter' + (meter + 1) + '.reading';
      }
    };

    var types = randomChoice([0, 1, 2, 3], 3);
    var variables = ['a', 'b', 'c'];
    var conditions = [];
    var statement = '';

    for (var i = 0; i < 3; i++) {
      conditions.push(generateConditional(types[i], booleanSeq[i]));

      if (negation[i]) {
        statement += '!';
      }

      statement += variables[i];

      if (i < 2) {
        statement += ' ' + booleanOp[i] + ' ';
      }
    }

    for (var i = 0; i < 4; i++) {
      if (readings[i] < 100) {
        readings[i] = '0' + readings[i].toString();
      }
    }

    return {
      puzzle: {
        type: 'binaryLever',
        readings: readings,
        solution: solution,
        state: 1,
        solved: false
      },
      manual: {
        type: 'binaryLever',
        conditions: conditions,
        statement: statement,
      }
    };
  };

  var generateButtonSeries = function() {
    var labels = ['Arrange', 'Begin', 'Block', 'Change', 'Chat', 'Click', 'Close',
      'Compare', 'Connect', 'Control', 'Convert', 'Convey', 'Copy', 'Customize',
      'Cut', 'Define', 'Delete', 'Design', 'Download', 'Drag', 'Edit', 'Emit',
      'Enhance', 'Equip', 'Excel', 'Exit', 'Export', 'File', 'Fill', 'Find', 'Fit',
      'Flip', 'Format', 'Forward', 'Freeze', 'Group', 'Help', 'Hide', 'Hold',
      'Input', 'Insert', 'Listen', 'Load', 'Merge', 'Move', 'Off', 'Omit', 'On',
      'Open', 'Perform', 'Place', 'Plug-in', 'Permit', 'Prefer', 'Press', 'Print',
      'Process', 'Protect', 'Range', 'Read', 'Record', 'Refer', 'Release',
      'Reload', 'Repeat', 'Replace', 'Retrieve', 'Run', 'Save', 'Scan', 'Scroll',
      'See', 'Select', 'Send', 'Share', 'Show', 'Smell', 'Solve', 'Sort', 'Spell',
      'Split', 'Store', 'Submit', 'Talk', 'Taste', 'Transmit', 'Transfer', 'Undo',
      'Ungroup', 'Update', 'View', 'Watch', 'Write', 'Zoom'];
    var fbSolution = randomChoice([0, 1, 2, 3], 4); // 0: fizzbuzz, 1: fizz, 2: buzz, 3: none
    var divisors = randomChoice([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [5, 7]]);
    var fizzBuzz = [[], [], [], []];

    for (var i = 1; i < 1000; i++) {
      if (i % divisors[0] === 0) {
        if (i % divisors[1] === 0) {
          fizzBuzz[0].push(i);
        } else {
          fizzBuzz[1].push(i);
        }
      } else if (i % divisors[1] === 0) {
        fizzBuzz[2].push(i);
      } else {
        fizzBuzz[3].push(i);
      }
    }

    var displays = [];

    for (var i = 0; i < 4; i++) {
      var display = randomChoice(fizzBuzz[fbSolution[i]]);
      fizzBuzz[fbSolution[i]].splice(fizzBuzz[fbSolution[i]].indexOf(display), 1);
      displays.push([display, false]);
    }

    var randomLabels = randomChoice(labels, 6);
    var randomOrder = randomChoice([0, 1, 2, 3, 4, 5], 6);
    var buttons = [];
    var fbOrder = [];

    for (var i = 0; i < 6; i++) {
      buttons.push([randomLabels[i], randomOrder[i]]);
      fbOrder[randomOrder[i]] = randomLabels[i];
    }

    return {
      puzzle: {
        type: 'buttonSeries',
        displays: displays,
        buttons: buttons,
        fbSolution: fbSolution,
        state: 0,
        solved: false
      },
      manual: {
        type: 'buttonSeries',
        divisors: divisors,
        fbOrder: fbOrder
      }
    };
  };

  var generateCircuit = function() {
    var boards = [
    [[2, 2, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 2, 0], [2, 0, 2, 0, 0], [0, 0, 0, 0, 3]],
    [[2, 0, 0, 2, 0], [0, 0, 2, 0, 0], [0, 2, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 2, 3]],
    [[2, 0, 0, 0, 0], [2, 0, 2, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 2], [0, 0, 0, 0, 3]],
    [[2, 0, 0, 2, 0], [2, 0, 0, 0, 0], [0, 0, 0, 2, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 3]],
    [[2, 2, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [2, 0, 2, 0, 0], [3, 0, 0, 0, 0]],
    [[2, 0, 0, 2, 0], [2, 0, 0, 0, 0], [0, 0, 0, 0, 0], [2, 0, 2, 0, 0], [3, 0, 0, 0, 0]],
    [[2, 0, 0, 0, 0], [2, 0, 2, 0, 0], [0, 0, 0, 0, 0], [2, 0, 0, 0, 2], [3, 0, 0, 0, 0]],
    [[2, 0, 0, 0, 0], [2, 0, 2, 0, 0], [0, 0, 0, 2, 0], [0, 0, 0, 0, 0], [3, 0, 0, 0, 0]],
    [[2, 2, 0, 0, 3], [0, 0, 0, 0, 0], [0, 2, 0, 0, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]],
    [[2, 2, 0, 2, 3], [0, 0, 0, 0, 0], [0, 0, 0, 2, 0], [2, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[2, 0, 0, 2, 3], [2, 0, 0, 0, 0], [0, 0, 0, 2, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
    [[2, 2, 0, 2, 3], [0, 0, 0, 0, 0], [0, 2, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 2, 0]] ];

    var board = boards[Math.floor(Math.random() * 12)];

    var rc = []; // randomControls
    for (var i = 0; i < 4; i++) {
      rc[i] = randomChoice(['up', 'left', 'down', 'right'], 4);
    }

    var controls = {
      'r': {'r': rc[0][0], 'y': rc[0][1], 'b': rc[0][2], 'g': rc[0][3]},
      'y': {'r': rc[1][0], 'y': rc[1][1], 'b': rc[1][2], 'g': rc[1][3]},
      'b': {'r': rc[2][0], 'y': rc[2][1], 'b': rc[2][2], 'g': rc[2][3]},
      'g': {'r': rc[3][0], 'y': rc[3][1], 'b': rc[3][2], 'g': rc[3][3]}
    };

    var copyBoard = function(board) {
      var copy = [];

      for (var i = 0; i < 5; i++) {
        copy[i] = board[i].slice();
      }

      return copy;
    };

    return {
      puzzle: {
        type: 'circuit',
        board: board,
        state: copyBoard(board),
        current: [0, 0],
        controls: controls,
        previous: 'r',
        solved: false,
        check: function(input) {
          var row = this.current[0];
          var col = this.current[1];
          var rowPath = row;
          var colPath = col;
          var rowTo = row;
          var colTo = col;
          var move = this.controls[this.previous][input];

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
            this.state[rowPath][colPath] === 2 || // broken resistor
            this.state[rowTo][colTo] === 1) {     // node already visited
            console.log('BUZZ!');
          } else {
            if (this.state[rowTo][colTo] === 3) {
              this.solved = true;
            }

            this.state[row][col] = 1;
            this.state[rowPath][colPath] = 1;
            this.state[rowTo][colTo] = 2;
            this.current = [rowTo, colTo];
            this.previous = input;
          }
        },
        reset: function() {
          this.state = copyBoard(board);
          this.current = [0, 0];
          this.previous = 'r'
        }
      },
      manual: {
        type: 'circuit',
        controls: controls
      }
    };
  };

  var generateCodex = function() {
    var keys = randomChoice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 8);
    var sequence = [];

    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        sequence[0] = ['splice', Math.floor(Math.random() * 5), 3];
        var index = Math.floor(Math.random() * 3);
        sequence[1] = ['slice', index, index + 2];
      } else {
        sequence[0] = ['splice', Math.floor(Math.random() * 6), 2];
        var index = Math.floor(Math.random() * 2)
        sequence[1] = ['slice', index, index + 3];
      }
    } else {
      var choices = [];

      if (Math.random() < 0.5) {
        var index = Math.floor(Math.random() * 5);
        sequence[0] = ['slice', index, index + 3];

        if (index >= 2) {
          choices.push(Math.floor(Math.random() * (index - 2)));
        }

        if (index <= 3) {
          choices.push(6 - Math.floor(Math.random() * (3 - index)));
        }

        sequence[1] = ['splice', randomChoice(choices), 2];
      } else {
        var index = Math.floor(Math.random() * 6);
        sequence[0] = ['slice', index, index + 2];

        if (index >= 3) {
          choices.push(Math.floor(Math.random() * (index - 3)));
        }

        if (index <= 3) {
          choices.push(5 - Math.floor(Math.random() * (3 - index)));
        }

        sequence[1] = ['splice', randomChoice(choices), 3];
      }
    }

    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        sequence[2] = 'sortA';
      } else {
        sequence[2] = 'sortB';
      }

      sequence[3] = 'concat';
    } else {
      sequence[2] = 'concat';
      sequence[3] = 'sort';
    }

    var copy = keys.slice();
    var solutionParts = [];
    var solution;

    for (var i = 0; i < 4; i++) {
      if (sequence[i] === 'sortA') {
        solutionParts[0].sort();
      } else if (sequence[i] === 'sortB') {
        solutionParts[1].sort();
      } else if (sequence[i] === 'sort') {
        solution.sort();
      } else if (sequence[i] === 'concat') {
        solution = solutionParts[0].concat(solutionParts[1]);
      } else if (sequence[i][0] === 'slice') {
        solutionParts.push(copy.slice(sequence[i][1], sequence[i][2]));
      } else if (sequence[i][0] === 'splice') {
        solutionParts.push(copy.splice(sequence[i][1], sequence[i][2]));
      }
    }

    return {
      puzzle: {
        type: 'codex',
        keys: keys,
        solution: solution
      },
      manual: {
        type: 'codex',
        sequence: sequence
      }
    };
  };

  var generateManuals = function(manualInfo, playerCount) {
    var manualParts = [];
    var manualPieces = randomChoice([0, 1, 2, 3], 4); // TODO: Refactor for playerCount < 4

    for (var i = 0, j = manualPieces.length; i < j; i++) {
      var pieces;

      if (manualInfo.type === 'buttonSeries') {
        pieces = [
          ["var buttonSeries" + manualInfo.label + " = function(code) {", 0],
          ["  if (code % " + manualInfo.divisors[0] + " === 0) {", 0],
          ["    if (code % " + manualInfo.divisors[1] + " === 0) {", 0],
          ["      return '" + manualInfo.fbOrder[0] + "';", 0],
          ["    } else {", 0],
          ["      return '" + manualInfo.fbOrder[1] + "';", 0],
          ["  } else if (code % " + manualInfo.divisors[1] + " === 0) {", 0],
          ["    return '" + manualInfo.fbOrder[2] + "';", 0],
          ["  } else {", 0],
          ["    return '" + manualInfo.fbOrder[3] + "';", 0],
          ["  }", 0],
          ["};", 0],
          [" ", 0]
        ];

        if (manualPieces[i] !== 0) {
          pieces[3] = noisify(pieces[3]);
        }

        if (manualPieces[i] !== 1) {
          pieces[5] = noisify(pieces[5]);
        }

        if (manualPieces[i] !== 2) {
          pieces[7] = noisify(pieces[7]);
        }

        if (manualPieces[i] !== 3) {
          pieces[9] = noisify(pieces[9]);
        }
      }

      if (manualInfo.type === 'circuit') {
        pieces = [
          ["var circuit" + manualInfo.label + " = function(prev, current) {", 0],
          ["  if (prev === 'red' || prev === null) {", 0],
          ["    if (current === 'red') return '" + manualInfo.controls.r.r + "';", 0],
          ["    if (current === 'yellow') return '" + manualInfo.controls.r.y + "';", 0],
          ["    if (current === 'blue') return '" + manualInfo.controls.r.b + "';", 0],
          ["    if (current === 'green') return '" + manualInfo.controls.r.g + "';", 0],
          ["  }", 0],
          [" ", 0],
          ["  if (prev === 'yellow') {", 0],
          ["    if (current === 'red') return '" + manualInfo.controls.y.r + "';", 0],
          ["    if (current === 'yellow') return '" + manualInfo.controls.y.y + "';", 0],
          ["    if (current === 'blue') return '" + manualInfo.controls.y.b + "';", 0],
          ["    if (current === 'green') return '" + manualInfo.controls.y.g + "';", 0],
          ["  }", 0],
          [" ", 0],
          ["  if (prev === 'blue') {", 0],
          ["    if (current === 'red') return '" + manualInfo.controls.b.r + "';", 0],
          ["    if (current === 'yellow') return '" + manualInfo.controls.b.y + "';", 0],
          ["    if (current === 'blue') return '" + manualInfo.controls.b.b + "';", 0],
          ["    if (current === 'green') return '" + manualInfo.controls.b.g + "';", 0],
          ["  }", 0],
          [" ", 0],
          ["  if (prev === 'green') {", 0],
          ["    if (current === 'red') return '" + manualInfo.controls.g.r + "';", 0],
          ["    if (current === 'yellow') return '" + manualInfo.controls.g.y + "';", 0],
          ["    if (current === 'blue') return '" + manualInfo.controls.g.b + "';", 0],
          ["    if (current === 'green') return '" + manualInfo.controls.g.g + "';", 0],
          ["  }", 0],
          ["};", 0],
          [" ", 0]
        ];

        if (manualPieces[i] !== 0) {
          pieces[2] = noisify(pieces[2]);
          pieces[3] = noisify(pieces[3]);
          pieces[4] = noisify(pieces[4]);
          pieces[5] = noisify(pieces[5]);
        }

        if (manualPieces[i] !== 1) {
          pieces[9] = noisify(pieces[9]);
          pieces[10] = noisify(pieces[10]);
          pieces[11] = noisify(pieces[11]);
          pieces[12] = noisify(pieces[12]);
        }

        if (manualPieces[i] !== 2) {
          pieces[16] = noisify(pieces[16]);
          pieces[17] = noisify(pieces[17]);
          pieces[18] = noisify(pieces[18]);
          pieces[19] = noisify(pieces[19]);
        }

        if (manualPieces[i] !== 3) {
          pieces[23] = noisify(pieces[23]);
          pieces[24] = noisify(pieces[24]);
          pieces[25] = noisify(pieces[25]);
          pieces[26] = noisify(pieces[26]);
        }
      }
/*
var circuit0 = function(prev, current) {
  if (prev === 'red') {
    if (current === 'red') return ??;
    if (current === 'yellow') return ??;
    if (current === 'blue') return ??;
    if (current === 'green') return ??;
  }
};
*/

      manualParts.push(pieces);
    }

    return manualParts;
  };

  var generatePuzzles = function(playerCount, puzzleType) { // 4, 0 generates 4 binaryLevers
    var puzzles = [];
    var manualParts = [];

    for (var i = 0; i < playerCount; i++) {
      if (puzzleType === 0) {
        var component = generateBinaryLever();
      }

      if (puzzleType === 1) {
        var component = generateButtonSeries();
      }

      if (puzzleType === 2) {
        var component = generateCircuit();
      }

      if (puzzleType === 3) {
        var component = generateCodex();
      }

      component.puzzle.label = i; // TODO: Refactor to count within puzzle type
      component.manual.label = i;

      puzzles.push(component.puzzle);
      manualParts.push(component.manual);
    }

    manualParts.forEach(function(manualInfo, index) {
      manualParts[index] = generateManuals(manualInfo, playerCount);
    });

    var manuals = [];

    for (var i = 0; i < playerCount; i++) {
      var manualSegments = [];

      manualParts.forEach(function(manualPart) {
        manualSegments = manualSegments.concat(manualPart[i]);
      });

      manuals.push(manualSegments);
    }

    puzzles = randomChoice(puzzles, 4); // TODO: Refactor for playerCount < 4

    return {
      puzzles: puzzles,
      manuals: manuals
    };
  }

  return {
    generatePuzzles: generatePuzzles
  }
});

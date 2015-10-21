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

    return {
      puzzle: {
        type: 'binaryLever',
        readings: readings,
        solution: solution
      },
      manual: {
        type: 'binaryLever',
        conditions: conditions,
        statement: statement,
      }
    };
  };

  return {
    generateBinaryLever: generateBinaryLever
  }
});

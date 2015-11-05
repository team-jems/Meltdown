var _ = require('lodash');

module.exports = generateManuals;

function generateManuals(numPlayer, puzzleInfos) {
  var puzzleManuals = _(puzzleInfos)
    .groupBy('type')
    .forEach(addLabels)
    .values()
    .flatten()
    .sortBy('type')
    .map(_.partial(generateManual, numPlayer))
    .thru(_.spread(_.zip))
    .map(_.flatten)
    .value();

  return puzzleManuals;

  ////////////

  // Add a label to puzzle types that show up more than once for identification.
  function addLabels(puzzleInfos) {
    _.forEach(puzzleInfos, addLabel);

    ////////////

    function addLabel(puzzleInfo, index, puzzleInfos) {
      var label = (puzzleInfos.length > 1) ? index : '';

      _.assign(puzzleInfo, {label: label});
    }
  }

  function generateManual(numPlayer, puzzleInfo) {
    var manualGenerators = {
      circuit: generateCircuitManual,
      password: generatePasswordManual,
      sequence: generateSequenceManual,
      slider: generateSliderManual
    };

    var manual = manualGenerators[puzzleInfo.type](puzzleInfo).split('\n');

    manual = _(manual)
      .zip(_(manual.length)
        .range()
        .fill(0)
        .value())
      .thru(_.partial(cloneAndNoisify, numPlayer, puzzleInfo))
      .value();

    return manual;

    ////////////

    function generateCircuitManual(puzzleInfo) {
      var circuitManualTemplate = _.template(
        'function circuit<%= label %>(prev, current) {\n' +
        '  if (prev === \'red\' || prev === null) {\n' +
        '    if (current === \'red\') return \'<%= controls.r.r %>\';\n' +
        '    if (current === \'yellow\') return \'<%= controls.r.y %>\';\n' +
        '    if (current === \'blue\') return \'<%= controls.r.b %>\';\n' +
        '    if (current === \'green\') return \'<%= controls.r.g %>\';\n' +
        '  }\n' +
        ' \n' +
        '  if (prev === \'yellow\') {\n' +
        '    if (current === \'red\') return \'<%= controls.y.r %>\';\n' +
        '    if (current === \'yellow\') return \'<%= controls.y.y %>\';\n' +
        '    if (current === \'blue\') return \'<%= controls.y.b %>\';\n' +
        '    if (current === \'green\') return \'<%= controls.y.g %>\';\n' +
        '  }\n' +
        ' \n' +
        '  if (prev === \'blue\') {\n' +
        '    if (current === \'red\') return \'<%= controls.b.r %>\';\n' +
        '    if (current === \'yellow\') return \'<%= controls.b.y %>\';\n' +
        '    if (current === \'blue\') return \'<%= controls.b.b %>\';\n' +
        '    if (current === \'green\') return \'<%= controls.b.g %>\';\n' +
        '  }\n' +
        ' \n' +
        '  if (prev === \'green\') {\n' +
        '    if (current === \'red\') return \'<%= controls.g.r %>\';\n' +
        '    if (current === \'yellow\') return \'<%= controls.g.y %>\';\n' +
        '    if (current === \'blue\') return \'<%= controls.g.b %>\';\n' +
        '    if (current === \'green\') return \'<%= controls.g.g %>\';\n' +
        '  }\n' +
        '}\n' +
        ' \n'
      );

      return circuitManualTemplate(puzzleInfo);
    }

    function generatePasswordManual(puzzleInfo) {
      var passwordManualTemplate = _.template(
        'function password<%= label %>(scrambled) {\n' +
        '  var front = scrambled.<%= transformSteps[0][0] %>(' +
          '<%= transformSteps[0][1] %>, <%= transformSteps[0][2] %>);\n' +
        '  var back = scrambled.<%= transformSteps[1][0] %>(' +
          '<%= transformSteps[1][1] %>, <%= transformSteps[1][2] %>);\n' +
        '<% if (transformSteps[2] === \'sortFront\') { %>' +
        '  front.sort();\n' +
        '<% } else if (transformSteps[2] === \'sortBack\') { %>' +
        '  back.sort();\n' +
        '<% } else { %>' +
        '  var password = front.concat(back);\n<% } %>' +
        '<% if (transformSteps[3] === \'sort\') { %>' +
        '  password.sort();\n' +
        '<% } else { %>' +
        '  var password = front.concat(back);\n<% } %>' +
        ' \n' +
        '  return password;\n' +
        '}\n' +
        ' \n'
      );

      return passwordManualTemplate(puzzleInfo);
    }

    function generateSequenceManual(puzzleInfo) {
      var sequenceManualTemplate = _.template(
        'function buttonSequence<%= label %>(code) {\n' +
        '  if (code % <%= divisors[0] %> === 0) {\n' +
        '    if (code % <%= divisors[1] %> === 0) {\n' +
        '      return \'<%= fizzBuzzButtons[0] %>\';\n' +
        '    } else {\n' +
        '      return \'<%= fizzBuzzButtons[1] %>\';\n' +
        '  } else if (code % <%= divisors[1] %> === 0) {\n' +
        '    return \'<%= fizzBuzzButtons[2] %>\';\n' +
        '  } else {\n' +
        '    return \'<%= fizzBuzzButtons[3] %>\';\n' +
        '  }\n' +
        '}\n' +
        ' \n'
      );

      return sequenceManualTemplate(puzzleInfo);
    }

    function generateSliderManual(puzzleInfo) {
      var sliderManualTemplate = _.template(
        'function powerSlider<%= label %>() {\n' +
        '  var isLaserOn = [\n' +
        '    <%= conditions[0] %>,\n' +
        '    <%= conditions[1] %>,\n' +
        '    <%= conditions[2] %>;\n' +
        '  ];\n' +
        ' \n' +
        '  var powerLevel = 0;\n' +
        ' \n' +
        '  for (var i = 0; i < 3; i++) {\n' +
        '    if (<% if (!countTrueOrFalse) { %>!<% } %>isLaserOn[i]) {\n' +
        '      powerLevel++;\n' +
        '    }\n' +
        '  }\n' +
        ' \n' +
        '  return powerLevel;\n' +
        '}\n' +
        ' \n'
      );

      return sliderManualTemplate(puzzleInfo);
    }
  }

  function cloneAndNoisify(numPlayer, puzzleInfo, originalManual) {
    var noisifyRanges = generateNoisifyRanges(numPlayer, puzzleInfo.type);

    var manuals = _(numPlayer)
      .range()
      .fill(originalManual)
      .map(_.ary(_.clone, 1))
      .zip(noisifyRanges)
      .map(_.spread(noisifyLines))
      .value();

    return manuals;

    ////////////

    function generateNoisifyRanges(numPlayer, puzzleType) {
      var rangeSelectionsByType = {
        circuit: [_.range(2,6), _.range(9,13), _.range(16,20), _.range(23,27)],
        password: [[1], [2], [3], [4]],
        sequence: [[3], [5], [7], [9]],
        slider: [[2], [3], [4], _.range(10, 13)]
      };

      var rangeSelections = rangeSelectionsByType[puzzleType];

      var noisifyRanges = _(rangeSelections)
        .shuffle()
        .chunk(numPlayer)
        .unzip()
        .map(_.compact)
        .map(_.ary(_.partial(_.difference, rangeSelections), 1))
        .value();

      return noisifyRanges;
    }

    function noisifyLines(manual, lineIndices) {
      _(lineIndices)
        .flatten()
        .reduce(noisifyLine, manual);

      return manual;

      ////////////

      function noisifyLine(manual, lineIndex) {
        var line = manual[lineIndex];
        var noise = '!@#$%^&*+-/\\=~'.split('');
        var start = line[0].search(/\S/);
        var noisified = '';

        for (var i = 0, j = line[0].length; i < j; i++) {
          noisified += (i < start) ? ' ' : _.sample(noise);
        }

        manual[lineIndex] = [noisified, 1];

        return manual;
      }
    }
  }
}

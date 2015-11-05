var _ = require('lodash');

module.exports = generateSliderInfo;

/**
 * Generate info for a power level slider puzzle
 * @returns {Object} Object with 4 meter readings for game interface, 3
 *   conditional statements, and target boolean for manual generation, and the
 *   puzzle solution
 */
function generateSliderInfo() {
  var meterReadings = generateMeterReadings();
  var numTrueStatements = _.random(3);
  var truthinessList = generateTruthiness(numTrueStatements);
  var conditions = generateConditions(truthinessList, meterReadings);
  var countTrueOrFalse = _.sample([true, false]);
  var sliderSolution = countTrueOrFalse ?
    numTrueStatements : 3 - numTrueStatements;
  meterReadings = _.map(meterReadings, _.partial(_.padLeft, _, 3, '0'));

  var sliderInfo = {
    type: 'slider',
    meterReadings: meterReadings,
    conditions: conditions,
    countTrueOrFalse: countTrueOrFalse,
    solution: sliderSolution
  };

  return sliderInfo;

  ////////////

  // Generate 4 unique meter readings.
  function generateMeterReadings() {
    var meterReadings = [];

    while (meterReadings.length < 4) {
      var meterReading = _.random(81, 220);

      if (!_(meterReadings).includes(meterReading)) {
        meterReadings.push(meterReading);
      }
    }

    return meterReadings;
  }

  // Generate 3 boolean values containing the specified amount of 'true'.
  function generateTruthiness(numTrueStatements) {
    var truthinessList = _(3)
      .times(_.partial(trueOrFalse, numTrueStatements))
      .shuffle()
      .value();

    return truthinessList;

    ////////////

    function trueOrFalse(numTrueStatements, index) {
      return index < numTrueStatements;
    }
  }

  // Generate 3 boolean conditions satisfying the truthiness array.
  function generateConditions(truthinessList, meterReadings) {
    var conditionGenerators = [
      generateAbsoluteComparison,
      generateRelativeComparison,
      generateIsMaxCondition,
      generateIsMinCondition
    ];

    var conditions = _(conditionGenerators)
      .sample(3)
      .zip(truthinessList)
      .map(_.spread(_.partialRight(generateCondition, meterReadings)))
      .value();

    return conditions;

    ////////////

    function generateCondition(generator, truthiness, meterReadings) {
      return generator(truthiness, meterReadings);
    }
  }

  // Generate a condition like 'this.meter1.reading < 133'.
  function generateAbsoluteComparison(truthiness, meterReadings) {
    var meter = _.random(3);
    var reading = meterReadings[meter];
    var minReadingRange = _.max([reading - 20, 80]);
    var maxReadingRange = _.min([reading + 20, 220]);
    var target = _.random(minReadingRange, maxReadingRange);
    var conditionOperator;

    if (reading < target) {
      conditionOperator = truthiness ? '<' : '>';
    } else if (reading > target) {
      conditionOperator = truthiness ? '>' : '<';
    } else {
      conditionOperator = truthiness ? '===' : '!==';
    }

    var condition = 'this.meter' + (meter + 1) + '.reading ' +
      conditionOperator + ' ' + target;
    return condition;
  }

  // Generate a condition like 'this.meter1.reading < this.meter2.reading'.
  function generateRelativeComparison(truthiness, meterReadings) {
    var meters = _.sample(_.range(4), 2);
    var readings = [
      meterReadings[meters[0]],
      meterReadings[meters[1]]
    ];
    var conditionOperator;

    if (readings[0] < readings[1]) {
      conditionOperator = truthiness ? '<' : '>';
    } else if (readings[0] > readings[1]) {
      conditionOperator = truthiness ? '>' : '<';
    } else {
      conditionOperator = truthiness ? '===' : '!==';
    }

    var condition = 'this.meter' + (meters[0] + 1) + '.reading ' +
      conditionOperator + ' this.meter' + (meters[1] + 1) + '.reading';
    return condition;
  }

  // Generate a condition like 'this.maxReading === this.meter3.reading'.
  function generateIsMaxCondition(truthiness, meterReadings) {
    return generateMinMaxCondition(truthiness, meterReadings, 'max');
  }

  // Generate a condition like 'this.minReading !== this.meter4.reading'.
  function generateIsMinCondition(truthiness, meterReadings) {
    return generateMinMaxCondition(truthiness, meterReadings, 'min');
  }

  function generateMinMaxCondition(truthiness, meterReadings, minOrMax) {
    var targetReading = (minOrMax === 'max') ?
      _.max(meterReadings) : _.min(meterReadings);
    var targetMeter = _(meterReadings).indexOf(targetReading);

    var nonTargetMeter = _(4)
      .range()
      .without(targetMeter)
      .sample();

    var meter = _.sample([targetMeter, nonTargetMeter]);
    var conditionOperator;

    if (meter === targetMeter) {
      conditionOperator = truthiness ? '===' : '!==';
    } else {
      conditionOperator = truthiness ? '!==' : '===';
    }

    var condition = 'this.' + minOrMax + 'Reading ' + conditionOperator +
      ' this.meter' + (meter + 1) + '.reading';
    return condition;
  }
}

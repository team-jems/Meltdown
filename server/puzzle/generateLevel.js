var _ = require('lodash');

var slider = require('./generateSliderInfo');
var password = require('./generatePasswordInfo');
var sequence = require('./generateSequenceInfo');
var circuit = require('./generateCircuitInfo');

var generateManuals = require('./generateManuals');

module.exports = generateLevel;

/**
 * Generate puzzle infos and manuals based on level and player count
 * @param {number} numPlayer Number of players
 * @param {number} level Level to generate
 * @returns {Array} Array of numPlayer size, containing a tuple of puzzle info
 *   and manual at each index
 */
function generateLevel(numPlayer, level) {
  var puzzleInfos = _(numPlayer)
    .times(_.partial(pickPuzzleType, level))
    .map(generatePuzzleInfo)
    .value();

  var puzzleManuals = generateManuals(numPlayer, puzzleInfos);

  return _.zip(puzzleInfos, puzzleManuals);

  ////////////

  function pickPuzzleType(level) {
    // A mapping of level to puzzle types. For example, possible puzzle types
    // for level 0 are type 0 (lever puzzle) and type 1 (button puzzle).
    var puzzleTypeMap = [
      [0, 1],
      [0, 1, 2],
      [0, 1, 2, 3],
      [2, 3],
      [3]
    ];

    return _.sample(puzzleTypeMap[level]);
  }

  function generatePuzzleInfo(puzzleType) {
    var puzzleInfoGenerators = [slider, password, sequence, circuit];
    var puzzleInfo = puzzleInfoGenerators[puzzleType]();

    return puzzleInfo;
  }
}

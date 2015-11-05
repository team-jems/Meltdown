var _ = require('lodash');

module.exports = generatePasswordInfo;

/**
 * Generate info for a password puzzle
 * @returns {Object} Object with a list of 8 letters for game interface and 4
 *   transformation instructions of manual generation, and the puzzle solution
 */
function generatePasswordInfo() {
  var letters = _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 8);
  var transformSteps = generateTransformSteps();
  var passwordSolution =
    _.reduce(transformSteps, generatePasswordSolution, [_.clone(letters)]);

  var passwordInfo = {
    type: 'password',
    letters: letters,
    transformSteps: transformSteps,
    solution: passwordSolution
  };

  return passwordInfo;

  ////////////

  function generateTransformSteps() {
    var transformSteps = _(generateSelectors())
      .concat(_.sample([
          _.sample([['sortFront', 'concat'], ['sortBack', 'concat']]),
          ['concat', 'sort']
        ]))
      .value();

    return transformSteps;

    ////////////

    function generateSelectors() {
      var selectors = _.shuffle(['slice', 'splice']);
      var lengths = _.shuffle([2, 3]);
      var selectorIndices = [];

      selectorIndices[0] = _.random(8 - lengths[0]);

      if (selectors[0] === 'slice') {
        selectorIndices[1] = _(_.range(selectorIndices[0] - lengths[1] + 1))
          .concat(_.range(selectorIndices[0] + lengths[0], 9 - lengths[1]))
          .sample();

        lengths[0] += selectorIndices[0];
      } else {
        selectorIndices[1] = _.random(3);
        lengths[1] += selectorIndices[1];
      }

      return _.zip(selectors, selectorIndices, lengths);
    }
  }

  function generatePasswordSolution(letters, transform, index) {
    if (_.isArray(transform)) {
      if (transform[0] === 'slice') {
        letters.push(_.slice(letters[0], transform[1], transform[2]));
      } else if (transform[0] === 'splice') {
        letters.push(letters[0].splice(transform[1], transform[2]));
      }

      return letters;
    } else {
      if (transform === 'sortFront') {
        letters[1] = _.sortBy(letters[1]);
      } else if (transform === 'sortBack') {
        letters[2] = _.sortBy(letters[2]);
      } else if (transform === 'concat') {
        return letters[1].concat(letters[2]);
      } else if (transform === 'sort') {
        return _.sortBy(letters);
      }

      return letters;
    }
  }
}

var _ = require('lodash');

module.exports = generateCircuitInfo;

/**
 * Generate info for a circuit board puzzle
 * @returns {Object} Object with a 5x5 circuit board for game interface and 4
 *   sets of color-direction mappings for manual generation
 */
function generateCircuitInfo() {
  var circuitBoard = generateCircuitBoard();
  var circuitControls = generateCircuitControls();

  var circuitInfo = {
    type: 'circuit',
    board: circuitBoard,
    controls: circuitControls
  };

  return circuitInfo;

  ////////////

  function generateCircuitBoard() {
    // All board configurations can be solved with six button pushes.
    var boardList = [
      [[2,2,0,0,0], [0,0,0,0,0], [0,0,0,2,0], [2,0,2,0,0], [0,0,0,0,3]],
      [[2,0,0,2,0], [0,0,2,0,0], [0,2,0,0,0], [0,0,0,0,0], [0,0,0,2,3]],
      [[2,0,0,0,0], [2,0,2,0,0], [0,0,0,0,0], [0,0,0,0,2], [0,0,0,0,3]],
      [[2,0,0,2,0], [2,0,0,0,0], [0,0,0,2,0], [0,0,2,0,0], [0,0,0,0,3]],
      [[2,2,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [2,0,2,0,0], [3,0,0,0,0]],
      [[2,0,0,2,0], [2,0,0,0,0], [0,0,0,0,0], [2,0,2,0,0], [3,0,0,0,0]],
      [[2,0,0,0,0], [2,0,2,0,0], [0,0,0,0,0], [2,0,0,0,2], [3,0,0,0,0]],
      [[2,0,0,0,0], [2,0,2,0,0], [0,0,0,2,0], [0,0,0,0,0], [3,0,0,0,0]],
      [[2,2,0,0,3], [0,0,0,0,0], [0,2,0,0,0], [0,0,2,0,0], [0,0,0,0,0]],
      [[2,2,0,2,3], [0,0,0,0,0], [0,0,0,2,0], [2,0,0,0,0], [0,0,0,0,0]],
      [[2,0,0,2,3], [2,0,0,0,0], [0,0,0,2,0], [0,0,0,0,0], [0,0,0,0,0]],
      [[2,2,0,2,3], [0,0,0,0,0], [0,2,0,0,0], [0,0,0,0,0], [0,0,0,2,0]]
    ];

    return _.sample(boardList);
  }

  function generateCircuitControls() {
    var circuitControls = _(['r', 'y', 'b', 'g'])
      .zipObject(_.times(4, shuffleControls))
      .value();

    return circuitControls;

    ////////////

    function shuffleControls() {
      var controlSet = _(['r', 'y', 'b', 'g'])
        .zipObject(_.shuffle(['up', 'left', 'down', 'right']))
        .value();

      return controlSet;
    }
  }
}

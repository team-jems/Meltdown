var _ = require('lodash');

module.exports = generateSequenceInfo;

/**
 * Generate info for a button sequence puzzle
 * @returns {Object} Object with 4 display values and 6 button labels for game
 *   interface, 4 button labels and 2 divisors for manual generation, and the
 *   puzzle solution
 */
function generateSequenceInfo() {
  var orderedButtons = generateButtons();
  var buttons = _.shuffle(orderedButtons);
  var fizzBuzzButtons = _.take(orderedButtons, 4);
  var sequenceSolution = generateSequenceSolution(fizzBuzzButtons);
  var divisors = generateDivisors();
  var displays = generateDisplays(divisors, fizzBuzzButtons, sequenceSolution);

  var sequenceInfo = {
    type: 'sequence',
    displays: displays,
    buttons: buttons,
    fizzBuzzButtons: fizzBuzzButtons,
    divisors: divisors,
    solution: sequenceSolution
  };

  return sequenceInfo;

  ////////////

  function generateButtons() {
    var labelList = ['Arrange', 'Begin', 'Block', 'Change', 'Chat', 'Click',
      'Close', 'Compare', 'Connect', 'Control', 'Convert', 'Convey', 'Copy',
      'Customize', 'Cut', 'Define', 'Delete', 'Design', 'Download', 'Drag',
      'Edit', 'Emit', 'Enhance', 'Equip', 'Excel', 'Exit', 'Export', 'File',
      'Fill', 'Find', 'Fit', 'Flip', 'Format', 'Forward', 'Freeze', 'Group',
      'Help', 'Hide', 'Hold', 'Input', 'Insert', 'Listen', 'Load', 'Merge',
      'Move', 'Off', 'Omit', 'On', 'Open', 'Perform', 'Place', 'Plug-in',
      'Permit', 'Prefer', 'Press', 'Print', 'Process', 'Protect', 'Range',
      'Read', 'Record', 'Refer', 'Release', 'Reload', 'Repeat', 'Replace',
      'Retrieve', 'Run', 'Save', 'Scan', 'Scroll', 'See', 'Select', 'Send',
      'Share', 'Show', 'Smell', 'Solve', 'Sort', 'Spell', 'Split', 'Store',
      'Submit', 'Talk', 'Taste', 'Transmit', 'Transfer', 'Undo', 'Ungroup',
      'Update', 'View', 'Watch', 'Write', 'Zoom'];

    return _.sample(labelList, 6);
  }

  function generateSequenceSolution(fizzBuzzButtons) {
    var solution = _(4)
      .times(_.partial(_.sample, fizzBuzzButtons, 1))
      .flatten()
      .value();
    return solution;
  }

  function generateDivisors() {
    var divisors = _([2, 3, 5, 7])
      .sample(2)
      .sortBy()
      .value();

    return divisors;
  }

  // Generate 4 display values satisfying the button sequence solution.
  function generateDisplays(divisors, fizzBuzzButtons, sequenceSolution) {
    var displayCandidates = _(1)
      .range(1000)
      .groupBy(_.partial(fizzBuzz, _, divisors, fizzBuzzButtons))
      .mapValues(_.partial(_.sample, _, 4))
      .value();

    var displays =
      _.map(sequenceSolution, _.partial(pickDisplay, _, displayCandidates));
    return displays;

    ////////////

    function fizzBuzz(num, divisors, fizzBuzzButtons) {
      if (num % divisors[0] === 0) {
        if (num % divisors[1] === 0) {
          return fizzBuzzButtons[0];
        } else {
          return fizzBuzzButtons[1];
        }
      } else if (num % divisors[1] === 0) {
        return fizzBuzzButtons[2];
      } else {
        return fizzBuzzButtons[3];
      }
    }

    // To ensure unique display values, pick from different index in each
    // candidate list.
    function pickDisplay(targetButton, displayCandidates, index) {
      var display = displayCandidates[targetButton][index];
      return _.padLeft(display, 3, '0');
    }
  }
}

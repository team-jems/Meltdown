angular.module('app.panel', [])

.factory('Panel', function() {
  var panels = [];

  var create = function(game, info) {
    var panelGroup = game.add.group();
    var background = new Phaser.Graphics(game, 0, 0);
    background.beginFill(0x000000, 0.4);
    background.drawRect(0, 0, 800, 600);
    background.endFill();

    var mask = game.add.image(0, 0, background.generateTexture());
    mask.inputEnabled = true;
    var panel = game.add.image(50, 50, 'panel');
    panelGroup.add(mask);
    panelGroup.add(panel);

    if (info.type === 'binaryLever') {
      var checkSolution = function(solution) {
        if (solution === info.solution) {
          console.log('Correct!');
        } else {
          console.log('Wrong!');
        }
      };

      var text = game.add.text(100, 100, 'Meter 1: ' + info.readings[0] + '\n'
        + 'Meter 2: ' + info.readings[1] + '\n' + 'Meter 3: ' + info.readings[2] +
        '\n' + 'Meter 4: ' + info.readings[3] + '\n\n');
      var trueLabel = game.add.text(100, 280, 'true');
      var falseLabel = game.add.text(200, 280, 'false');

      trueLabel.inputEnabled = true;
      trueLabel.events.onInputDown.add(function() {
        checkSolution(true);
      }, this);

      falseLabel.inputEnabled = true;
      falseLabel.events.onInputDown.add(function() {
        checkSolution(false);
      }, this);

      panelGroup.add(text);
      panelGroup.add(trueLabel);
      panelGroup.add(falseLabel);
    }

    panelGroup.visible = false;
    panels.push(panelGroup);
  };

  var toggle = function(index) {
    panels[index].visible = !panels[index].visible;
  };

  return {
    create: create,
    toggle: toggle
  }
});

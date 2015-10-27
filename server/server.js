#!/usr/bin/env node
var express = require('express');
var path = require('path');
var createMP = require('./manualPuzzle.js');

var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 8000;

var Firebase = require('firebase'); //node module firebase
var myFirebaseRef = new Firebase("https://fiery-torch-1497.firebaseio.com/");

var manual;
var puzzle;

// overwrites nodes in the database by calling the generate function
myFirebaseRef.set({
	server: createMP.generatePuzzles()
});

/*** example of updating a specific child without overwriting other child nodes */
// var solvedRef = myFirebaseRef.child("server/puzzles/0");
// solvedRef.update({
// 	solved: "true"
// });


myFirebaseRef.child("server/manuals").on("value", function(snapshot) {
	manual = snapshot.val();
	// console.log("manual2", manual);
});

myFirebaseRef.child("server/puzzles").on("value", function(snapshot) {
	puzzle = snapshot.val();
	// console.log("puzzle2", puzzle);
});

myFirebaseRef.child("server/puzzles/0/solved").on("value", function(snapshot) {
	console.log("solved:", snapshot.val());
});


/*-------------- MANUAL variables --------------*/
var maualConditions = manual[0].conditions; // array with 3 strings (3 positions)
var manualStatement = manual[0].statement; 
var manualType = manual[0].type; //puzzle type
// console.log("conditions: ", maualConditions);
// console.log("statement: ", manualStatement);
// console.log("type: ", manualType);


var completeManual = 
	// menu page:
	['', '/*',
	  '  Slider:',
	  '    If the control panel contains four meters',
	  '    and a slider, refer to the slider() function.',
	  '*/'
	].join('\n') 

	+ '\n\n' +

	// instructions:
	['// For emergency override, take note of the meter',
	  '// readings and evaluate the boolean return value.',
	  '// If the return value is true, move the slider to',
	  '// the position marked "I", otherwise move the',
	  '// slider to the position marked "O".',
	  '',
	  '// "this" represents the control panel.',
	  '// "minReading": lowest meter reading of the panel',
	  '// "maxReading": highest meter reading of the panel'
	].join('\n') 

	+ '\n\n' +

	// functions: 
	['function slider() {',
	  '  var a = ' + manual[0].conditions[0] + ';',
	  '  var b = ' + manual[0].conditions[1] + ';',
	  '  var c = ' + manual[0].conditions[2] + ';',
	  '',
	  '  return ' + manual[0].statement +';',
	  '}'
	].join('\n');

console.log("full manual print up: ", completeManual);

/*----------------------------- PUZZLE variables ------------------------------*/
// puzzle readings
var puzzleReadings = puzzle[0].readings
var puzzleSolution = puzzle[0].solution;
var puzzleSolved = puzzle[0].solved;
var puzzleState = puzzle[0].state;
var puzzleType = puzzle[0].type;
// console.log(puzzle);
// console.log("puzzleState: ", puzzleState);
// console.log("puzzleSolved: ", puzzleSolved);
// console.log("puzzleSolution: ", puzzleSolution);
// console.log("puzzleReadings: ", puzzleReadings);
// console.log("puzzleType: ", puzzleType);

/* 
STEPS for manual and puzzle generation : 
	a. give server.js access to puzzle and manual creation 
	b. listen for change of value in fb db for node representing: 'ready for gameplay', trigger step 'c'
	c. execute a callback that calls the manual and puzzle creation functions and writes the results to the database
	d. the values will be accessed/pulled from the client side, firebase will broadcast change to clients 
*/

server.listen(port, function() {
  console.log('Running on port: ', port);
});

var staticPath = path.join(__dirname, '../client');
app.use(express.static(staticPath));

var Firebase = require('firebase');
var FirebaseRef = new Firebase("https://meltdown.firebaseio.com/");

var generatePuzzles = require('./puzzle');

// on any player change, recalculate number of players and ready status
FirebaseRef.child("lobby/players").on("value", function(snapshot) {
  var players = snapshot.val();
  var playerIDs = players ? Object.keys(players) : [];
  var allPlayersReady = true;

  if (playerIDs.length > 0) {
    for (var i = 0, j = playerIDs.length; i < j; i++) {
      if (players[playerIDs[i]].isReady === false) {
        allPlayersReady = false;
      }
    }
  } else {
    allPlayersReady = false;
    FirebaseRef.child('lobby').update({inProgress: false});
  }

  if (allPlayersReady) {
    FirebaseRef.child("lobby").update({numPlayers: playerIDs.length, status: 'all players ready'});
  } else {
    FirebaseRef.child("lobby").update({numPlayers: playerIDs.length, status: 'waiting'});
  }
});

// generate and distribute puzzles and manuals when all players are ready
FirebaseRef.child("lobby/status").on("value", function(snapshot) {
  if (snapshot.val() === 'all players ready') {
    var puzzleSet1 = generatePuzzles(4, 1);
    var puzzleSet2 = generatePuzzles(4, 2);

    FirebaseRef.child("lobby/players").once("value", function(data) {
      var newData = data.val();

      for (var key in newData) {
        newData[key].puzzles = puzzleSet1.puzzles.splice(0, 1).concat(puzzleSet2.puzzles.splice(0, 1));
        newData[key].manual = puzzleSet1.manuals.splice(0, 1).concat(puzzleSet2.manuals.splice(0, 1));
      }

      FirebaseRef.child("lobby/players").update(newData);
      FirebaseRef.child("lobby").update({status: 'puzzles ready'});
      FirebaseRef.child("lobby").update({inProgress: true});
    });
  }
});

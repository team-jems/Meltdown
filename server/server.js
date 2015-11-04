#!/usr/bin/env node
var express = require('express');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 8000;

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

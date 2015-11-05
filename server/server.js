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
var FirebaseRef = new Firebase('https://meltdown.firebaseio.com/');

var generateLevel = require('./puzzle/generateLevel');

// on any player change, recalculate number of players and ready status
FirebaseRef.child('lobby/players').on('value', function(snapshot) {
  var players = snapshot.val();
  var playerIDs = players ? Object.keys(players) : [];
  var allPlayersReady = true;
  var levelUpReady = true;

  if (playerIDs.length > 0) {
    for (var i = 0, j = playerIDs.length; i < j; i++) {
      if (players[playerIDs[i]].isReady === false) {
        allPlayersReady = false;
      }
      if (players[playerIDs[i]].levelUp === false) {
        levelUpReady = false;
      }
    }
  } else {
    allPlayersReady = false;
    levelUpReady = false;
    FirebaseRef.child('lobby').update({inProgress: false});
  }

  FirebaseRef.child('levelUp').update({isReady: levelUpReady});

  if (allPlayersReady) {
    FirebaseRef.child('lobby').update({numPlayers: playerIDs.length, status: 'all players ready'});
  } else {
    FirebaseRef.child('lobby').update({numPlayers: playerIDs.length, status: 'waiting'});
  }
});

// generate and distribute puzzles and manuals when all players are ready
FirebaseRef.child('lobby/status').on('value', function(snapshot) {
  if (snapshot.val() === 'all players ready') {
    FirebaseRef.child('lobby').once('value', function(data) {
      var newData = data.val();
      var puzzleSet = generateLevel(newData.numPlayers, 2);

      for (var key in newData.players) {
        var thisPlayer = puzzleSet.splice(0, 1)[0];
        newData.players[key].puzzles = thisPlayer[0];
        newData.players[key].manual = thisPlayer[1];
      }

      FirebaseRef.child('lobby/players').update(newData.players);
      FirebaseRef.child('lobby').update({status: 'puzzles ready', inProgress: true});
    });
  }
});

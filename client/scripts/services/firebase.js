/*
* In the controller, inject Players factory and assign it to the scope variable
* that holds list of all players. e.g.:

.controller('GameController', function($scope, Players) {
  $scope.players = Players;
  $scope.addPlayer = function(player) {
    $scope.players.$add(player);
  };
})

* Use AngularFire methods $add(), $save(), $remove()
* to manipulate the players array.
*
* DO NOT directly modify array using push() or splice()
*
* Refer below links for more on AngularFire
* https://www.firebase.com/docs/web/libraries/angular/quickstart.html
*
*/

angular.module('app.firebase', [])

.factory('Players', ['$firebaseArray',
  function($firebaseArray) {
<<<<<<< HEAD
    var lobbyRef = new Firebase('https://fiery-torch-1497.firebaseio.com/lobby');
    var playersRef = new Firebase('https://fiery-torch-1497.firebaseio.com/lobby/players');
    return {
      arr: $firebaseArray(playersRef),
      playersRef: playersRef,
      lobbyRef: lobbyRef
    }
  }
])

.factory('Timer', [
  function() {
    var timerRef = new Firebase('https://fiery-torch-1497.firebaseio.com/timer');
    return timerRef;
  }
]);


  
angular.module('app.comm', [])

.factory('requestNotificationChannel', ['$rootScope',
  function($rootScope) {
    // private notification messages
    var _LOAD_MANUAL_ = '_LOAD_MANUAL_';
    var _LOAD_PUZZLE_ = '_LOAD_PUZZLE_';
    var _GAME_OVER_ = '_GAME_OVER_';
    var _PUZZLE_SOLVED_ = '_PUZZLE_SOLVED_';

    // publish load manual notification
    var loadManual = function(manuals) {
      $rootScope.$broadcast(_LOAD_MANUAL_, manuals);
    };

    // subscribe to load manual notification
    var onLoadManual = function($scope, handler) {
      $scope.$on(_LOAD_MANUAL_, function(event, manual) {
        handler(manual);
      });
    };

    // publish notification to change modal state
    var loadPuzzle = function(index) {
      $rootScope.$broadcast(_LOAD_PUZZLE_, index);
    };

    // subscribe to load puzzle notification
    var onLoadPuzzle = function($scope, handler) {
      $scope.$on(_LOAD_PUZZLE_, function(event, index) {
        handler(index);
      });
    };

    // publish to terminate game
    var gameOver = function(flag) {
      $rootScope.$broadcast(_GAME_OVER_, flag);
    };

    // subscribe to terminate game
    var onGameOver = function($scope, handler) {
      $scope.$on(_GAME_OVER_, function(event, flag) {
        handler(flag);
      });
    };

    var puzzleSolved = function(flag) {
      $rootScope.$broadcast(_PUZZLE_SOLVED_, flag);
    };

    var onPuzzleSolved = function($scope, handler) {
      $scope.$on(_PUZZLE_SOLVED_, function(event, flag) {
        handler(flag);
      });
    };

    return {
      loadManual: loadManual,
      onLoadManual: onLoadManual,
      loadPuzzle: loadPuzzle,
      onLoadPuzzle: onLoadPuzzle,
      gameOver: gameOver,
      onGameOver: onGameOver, 
      puzzleSolved: puzzleSolved,
      onPuzzleSolved: onPuzzleSolved
    };
  }
]);

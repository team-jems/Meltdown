angular.module('app.comm', [])

.factory('requestNotificationChannel', ['$rootScope',
  function($rootScope) {
    // private notification messages
    var _LOAD_MANUAL_ = '_LOAD_MANUAL_';
    var _LOAD_PUZZLE_ = '_LOAD_PUZZLE_';

    // publish load manual notification
    var loadManual = function(manual) {
      $rootScope.$broadcast(_LOAD_MANUAL_, manual);
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

    return {
      loadManual: loadManual,
      onLoadManual: onLoadManual,
      loadPuzzle: loadPuzzle,
      onLoadPuzzle: onLoadPuzzle
    };
  }
]);
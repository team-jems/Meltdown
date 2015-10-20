angular.module('app.comm', [])

.factory('requestNotificationChannel', ['$rootScope',
  function($rootScope) {
    // private notification messages
    var _LOAD_MANUAL_ = '_LOAD_MANUAL_';

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

    return {
      loadManual: loadManual,
      onLoadManual: onLoadManual
    };
  }
]);
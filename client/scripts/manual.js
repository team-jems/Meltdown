angular.module('app.manual', [])

.controller('ManualController', ['$scope', 'requestNotificationChannel',
  function($scope, requestNotificationChannel) {
    $scope.manual = [['Loading Reactor BIOS...', 0]];

    var onLoadManualHandler = function(manual) {
      $scope.manual = manual;
      $scope.$apply();
    };

    requestNotificationChannel.onLoadManual($scope, onLoadManualHandler);
  }
]);

angular.module('app.manual', [])

.controller('ManualController', ['$scope', 'requestNotificationChannel',
  function($scope, requestNotificationChannel) {
    $scope.manual = 'A placeholder manual';

    var onLoadManualHandler = function(manual) {
      $scope.manual = manual.conditions[0] + '\n';
      $scope.manual += manual.conditions[1] + '\n';
      $scope.manual += manual.conditions[2] + '\n\n';
      $scope.manual += manual.statement;
      $scope.$apply();
    }

    requestNotificationChannel.onLoadManual($scope, onLoadManualHandler);
  }
]);

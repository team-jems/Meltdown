angular.module('app.area2', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('area2', {
        url: '/area2',
        templateUrl: 'templates/area2.html',
        controller: 'Area2Controller'
      });
  }
])

.controller('Area2Controller', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game: Area 2';
    $scope.manual = "<u><strong>Coolant:</strong></u><br>var a = 0, b = 4;<br><a>turnTo</a> = a + b;";
    $scope.showManual = false

  }
]);

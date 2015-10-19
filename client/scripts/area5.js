angular.module('app.area5', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('area5', {
        url: '/area5',
        templateUrl: 'templates/area5.html',
        controller: 'Area5Controller'
      });
  }
])

.controller('Area5Controller', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game: Area 5';
    $scope.manual = "<u><strong>Coolant:</strong></u><br>var a = 0, b = 4;<br><a>turnTo</a> = a + b;";
    $scope.showManual = false
  
  }
]);


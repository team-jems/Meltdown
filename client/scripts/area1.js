angular.module('app.area1', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('area1', {
        url: '/area1',
        templateUrl: 'templates/area1.html',
        controller: 'Area1Controller'
      });
  }
])

.controller('Area1Controller', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game: Area 1';
    // for db to come : $scope.manual = getManual()
    //in the meantime : sample data : once working, look up how to format text in this scenario (attach to DOM in specific format)
    $scope.manual = "Coolant: var a = 0, b = 4, turnTo = a + b";
  }
]);

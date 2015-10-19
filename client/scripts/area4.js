angular.module('app.area4', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('area4', {
        url: '/area4',
        templateUrl: 'templates/area4.html',
        controller: 'Area4Controller'
      });
  }
])

.controller('Area4Controller', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game: Area 4';
  }
]);



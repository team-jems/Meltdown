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
  }
]);

angular.module('app.intro', [])

.controller('IntroController', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game';
  }
]);

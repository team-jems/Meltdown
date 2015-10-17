angular.module('app.intro', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('intro', {
        url: '',
        templateUrl: 'templates/intro.html',
        controller: 'IntroController'
      });
  }
])

.controller('IntroController', ['$scope', '$location',
  function($scope, $location) {
    $scope.title = 'The Hack Reactor Game';
    $scope.loadGame = function() {
      $location.path('/game');
    };
  }
]);

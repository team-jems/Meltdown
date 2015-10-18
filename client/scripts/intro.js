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

.controller('IntroController', ['$scope', '$location', '$state',
  function($scope, $location, $state) {
    $scope.title = 'The Hack Reactor Game';
    $scope.loadGame = function() {
      $location.path('/game');
    };

    $scope.loadISO = function() {
      $state.go('isoDemo');
    };
  }
]);

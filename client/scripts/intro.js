angular.module('app.intro', [])
  
console.log('Not building lib folder ')

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
    $scope.title = 'HACK REACTOR THE GAME';
    $scope.loadGame = function() {
      $state.go('gameFrame.play');
    };
  }
]);

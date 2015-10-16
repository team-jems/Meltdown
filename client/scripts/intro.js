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

.controller('IntroController', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game';
  }
]);

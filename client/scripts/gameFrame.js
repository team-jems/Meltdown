angular.module('app.gameFrame', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('gameFrame', {
        abstract: true,
        url: '/game',
        templateUrl: 'templates/gameFrame.html'
      })
      .state('gameFrame.play', {
        url: '',
        views: {
          'game': {
            templateUrl: 'templates/game.html',
            controller: 'GameController'
          },
          'manual': {
            templateUrl: 'templates/manual.html',
            controller: 'ManualController'
          }
        }
      });
  }
]);
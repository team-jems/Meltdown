angular.module('app.gameFrame', [])

.config(['$stateProvider',
  function($stateProvider, Players) {
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
          },
          'panel': {
            templateUrl: 'templates/panel.html',
            controller: 'PanelController'
          }
        }
      });
  }
]);
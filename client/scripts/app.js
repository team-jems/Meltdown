angular.module('app', [
  'ui.router',
  'app.comm', 'app.panel', 'app.puzzle', // services
  'app.intro',
  'app.gameFrame',
  'app.game',
  'app.manual',
  'app.rotator',
  'app.quiz'
])

.config(['$urlRouterProvider',
  function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }
]);

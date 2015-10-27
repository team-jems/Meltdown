angular.module('app', [
  'firebase',
  'app.firebase',
  'ui.router',
  'app.comm',
  'app.panel',
  'app.intro',
  'app.gameFrame',
  'app.game',
  'app.manual'
])

.config(['$urlRouterProvider',
  function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }
]);


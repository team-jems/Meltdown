angular.module('app', [
  'ui.router',
  'app.intro',
  'app.game',
  'app.rotator',
  'app.quiz'
])

.config(['$urlRouterProvider',
  function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }
]);

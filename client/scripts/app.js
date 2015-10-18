angular.module('app', [
  'ui.router',
  'app.intro',
  'app.game',
  'app.isoDemo',
  'app.quiz'
])

.config(['$urlRouterProvider',
  function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }
]);

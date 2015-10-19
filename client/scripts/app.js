angular.module('app', [
  'ui.router',
  'app.comm', 'app.panel', 'app.puzzle', // services
  'app.intro',
  'app.gameFrame',
  'app.game',
  'app.manual',
  'app.rotator',
  'app.quiz', 
  'app.ctrlRoom', 
  'app.area1',
  'app.area2',
  'app.area3',
  'app.area4',
  'app.area5'
])

.config(['$urlRouterProvider',
  function($urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  }
]);

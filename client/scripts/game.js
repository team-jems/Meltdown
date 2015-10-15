angular.module('app', [
  'ui.router',
  'app.intro'
])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('intro', {
        url: '',
        templateUrl: 'templates/intro.html',
        controller: 'IntroController'
      });
  }
]);

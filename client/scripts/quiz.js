angular.module('app.quiz', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('quiz', {
        url: '/quiz',
        templateUrl: 'templates/quiz.html',
        controller: 'QuizController'
      });
  }

.controller('QuizController', ['$scope',
  function($scope) {
    $scope.title = 'I am in the quiz!';
  }
]);

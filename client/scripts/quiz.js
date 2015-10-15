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
    $scope.title = 'Quiz!';
    $scope.problem = {
      name: 'BREAK FUNCTION'
    }
    $scope.checkAnswer = function(){
      console.log('test');
    }
  }
]);

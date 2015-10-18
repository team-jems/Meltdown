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
])

.controller('QuizController', ['$scope', '$state',
  function($scope, $state) {
    $scope.title = 'Quiz!';
    $scope.problem = {
      'name': 'Break Function',
      'responses': [
        {
          'text': 'Response1',
        },
        {
          'text': 'Response2',
        },
        {
          'text': 'Response3',
        },
        {
          'text': 'Response4',
        }
      ],
      'answer': 'Response2'
    };
    $scope.checkAnswer = function(response){
      if (response.text === $scope.problem.answer){
        alert('yay');
        // $location.path('/');
        $state.go('intro');
      } else {
        alert('oh noooooo');
      }
    };
  }
]);

angular.module('app.ctrlRoom', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('ctrlRoom', {
        url: '/control',
        templateUrl: 'templates/ctrlRoom.html',
        controller: 'CtrlRoomController'
      });
  }
])

.controller('CtrlRoomController', ['$scope',
  function($scope) {
    $scope.title = 'HACK REACTOR CONTROL ROOM';

    $scope.heroImage = {
        background: 'url("images/ctrlRoomCollage.jpg")'
    };


  }
]);
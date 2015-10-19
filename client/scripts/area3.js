angular.module('app.area3', [])

.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('area3', {
        url: '/area3',
        templateUrl: 'templates/area3.html',
        controller: 'Area3Controller'
      });
  }
])

.controller('Area3Controller', ['$scope',
  function($scope) {
    $scope.title = 'The Hack Reactor Game: AREA 3';
    $scope.manual = "<u><strong>Coolant:</strong></u><br>var a = 0, b = 4;<br><a>turnTo</a> = a + b;";
    $scope.showManual = false
  }
]);


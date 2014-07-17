'use strict';

angular.module('main')
.controller('AccountCtrl', [function(){
}])
.controller('AccountLoginCtrl', ['$scope', '$rootScope', '$stateParams', 'API', function($scope, $rootScope, $stateParams, API){
    $scope.loading = false;
    $scope.loginAttempted = false;

    $scope.login = function() {
        $scope.loginAttempted = true;
        
        $scope.$broadcast('autocomplete:update');
        $scope.loginForm.loginPassword.$setValidity('unauthorized', true);
        
        if(!$scope.loginForm.$invalid) {
            $scope.loading = true;
            API.Session.login({ email: $scope.loginEmail, password: $scope.loginPassword })
            .then(function(data) {
                $rootScope.login(data.token, data._id, $scope.loginEmail, data.firstname, data.lastname);
            },
            function() {
                $scope.loginForm.loginPassword.$setValidity('unauthorized', false);
                $scope.loading = false;
            });
        }
    };
}])
;

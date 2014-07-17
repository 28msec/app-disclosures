'use strict';

angular.module('main')
.controller('DisclosuresConceptCtrl', ['$scope', '$stateParams', '$rootScope', 'concept', function($scope, $stateParams, $rootScope, concept){
    $scope.list = $stateParams.list;
    $scope.aid = $stateParams.aid;
    $scope.concept = concept;

    $scope.select = function(aid) {
        $scope.aid = aid;
    };
}])
;
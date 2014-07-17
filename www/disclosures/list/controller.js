'use strict';

angular.module('main')
.controller('DisclosuresListCtrl', ['$scope', '$stateParams', 'concepts', function($scope, $stateParams, concepts){
    $scope.list = $stateParams.list;
    $scope.concepts = concepts;
}])
;
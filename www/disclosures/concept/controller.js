'use strict';

angular.module('main')
.controller('DisclosuresConceptCtrl', ['$scope', '$stateParams', '$rootScope', 'concept', function($scope, $stateParams, $rootScope, concept){
    $scope.list = $stateParams.list;
    $scope.aid = $stateParams.aid;
    $scope.concept = concept;
    $scope.concept.Label = (concept.ReportElements && concept.ReportElements.length > 0 ? concept.ReportElements[0].Label : 'Back');

    $scope.select = function(aid) {
        $scope.aid = aid;
    };
}])
;
'use strict';

angular.module('main')
.controller('DisclosureCtrl', ['$scope', '$stateParams', function($scope, $stateParams){

}])
.controller('DisclosureConceptsCtrl', ['$scope', '$stateParams', 'concepts', function($scope, $stateParams, concepts){
    $scope.list = $stateParams.list;
    $scope.concepts = concepts;
}])
.controller('DisclosureConceptCtrl', ['$scope', '$stateParams', 'concept', function($scope, $stateParams, concept){
    $scope.list = $stateParams.list;
    $scope.concept = concept;
}])
.controller('DisclosureDetailsCtrl', ['$scope', '$stateParams', function($scope, $stateParams){
    $scope.list = $stateParams.list;
    $scope.concept = $stateParams.concept;
    $scope.aid = $stateParams.aid;
}])
;
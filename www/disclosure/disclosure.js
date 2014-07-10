'use strict';

angular.module('main')
.controller('DisclosureCtrl', ['$scope', '$rootScope', '$stateParams', function($scope, $rootScope, $stateParams){
}])
.controller('DisclosureConceptsCtrl', ['$scope', '$stateParams', 'concepts', function($scope, $stateParams, concepts){
    $scope.list = $stateParams.list;
    $scope.concepts = concepts;
}])
.controller('DisclosureConceptCtrl', ['$scope', '$stateParams', 'concept', function($scope, $stateParams, concept){
    $scope.list = $stateParams.list;
    $scope.aid = $stateParams.aid;
    $scope.concept = concept;
}])
.controller('DisclosureNotSelectedCtrl', ['$scope', '$stateParams', function($scope, $stateParams){
    $scope.list = $stateParams.list;
    $scope.concept = $stateParams.concept;
    $scope.aid = $stateParams.aid;
}])
.controller('DisclosureDetailsCtrl', ['$scope', '$stateParams', '$sce', 'fact', function($scope, $stateParams, $sce, fact){
    $scope.list = $stateParams.list;
    $scope.concept = $stateParams.concept;
    $scope.aid = $stateParams.aid;
    if (fact && fact.FactTable && fact.FactTable.length > 0)
    {
        $scope.factValue = $sce.trustAsHtml(fact.FactTable[0].Value);
        $scope.factEntity = fact.FactTable[0].EntityRegistrantName;
        $scope.factFiscalYear = fact.FactTable[0].Aspects['sec:FiscalYear'];
        $scope.factFiscalPeriod = fact.FactTable[0].Aspects['sec:FiscalPeriod'];
    }
}])
;
'use strict';

angular.module('main')
.controller('DisclosuresConceptAidCtrl', ['$scope', '$stateParams', '$sce', 'fact', function($scope, $stateParams, $sce, fact){
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

    $scope.expand = function() {
        $scope.expanded = true;
    };

    $scope.rate = Math.floor((Math.random()*4)+1);
    
    $scope.ratingStates = [
        {stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
        {stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
        {stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
        {stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
        {stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'}
    ];

    $scope.comments = 28;
}])
;
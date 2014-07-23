'use strict';

angular.module('main')
.controller('DisclosuresListCtrl', ['$scope', '$stateParams', '$state', '$http', 'reportSchema', 'API', function($scope, $stateParams, $state, $http, reportSchema, API){
    $scope.list = $stateParams.list;
    $scope.concepts = [];
    
    $scope.checkUsage = function(concept) {
        if (concept.Used)
        {
            $state.go('disclosures.concept', { list: $scope.list, concept: concept.Name });
        }
    };
    
    reportSchema.Networks.forEach(function(network) {
        if (network.LinkName === 'link:presentationLink')
        {
            var node = network.Trees['disc:DisclosuresLineItems'].To;
            Object.keys(node).forEach(function (hierarchy) {
                if (node.hasOwnProperty(hierarchy)) {
                    if ($scope.list === 'All' || 'disc:' + $scope.list + 'Hierarchy' === hierarchy) {
                        Object.keys(node[hierarchy].To).forEach(function (concept) {
                            if (node[hierarchy].To.hasOwnProperty(concept)) {
                                $scope.concepts.push(node[hierarchy].To[concept]);
                            }
                        });
                    }
                }
            });
        }
    });

    //intentional late call. Eliminates the unused concepts.
    var params = {
        cik : ($stateParams.cik ? $stateParams.cik.split(',') : []),
        tag : ($stateParams.tag ? $stateParams.tag.split(',') : []),
        fiscalYear : ($stateParams.fiscalYear ? $stateParams.fiscalYear.split(',') : []),
        fiscalPeriod : ($stateParams.fiscalPeriod ? $stateParams.fiscalPeriod.split(',') : []),
        sic : ($stateParams.sic ? $stateParams.sic.split(',') : []),
        map : 'Disclosures',
        onlyNames: true,
        token: $scope.token
    };
    var body = '';
    $scope.concepts.forEach(function(concept) {
        body += '&name=' + encodeURIComponent(concept.Name);
    });
    if (body)
    {
        body = body.substring(1);
    }

    $http({
        method: 'POST',
        url: API.API_URL + '/_queries/public/api/report-elements.jq',
        params: params,
        data: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data) {
        if(data && data.ReportElements) {
            data.ReportElements.forEach(function(item) {
                $scope.concepts.forEach(function(concept) {
                    if (concept.Name === item) {
                        concept.Used = true;
                    }
                });
            });
        }
    });
}])
;
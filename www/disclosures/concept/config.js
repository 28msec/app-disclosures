'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('disclosures.concept', {
        url: '/:list/:concept',
        templateUrl: 'disclosures/concept/concept.html',
        controller: 'DisclosuresConceptCtrl',
        resolve: {
            concept: ['$rootScope', '$stateParams', '$q', 'API', function($rootScope, $stateParams, $q, API) {
                var params = {
                    cik : ($stateParams.cik ? $stateParams.cik.split(',') : []),
                    tag : ($stateParams.tag ? $stateParams.tag.split(',') : []),
                    fiscalYear : ($stateParams.fiscalYear ? $stateParams.fiscalYear.split(',') : []),
                    fiscalPeriod : ($stateParams.fiscalPeriod ? $stateParams.fiscalPeriod.split(',') : []),
                    sic : ($stateParams.sic ? $stateParams.sic.split(',') : []),
                    map : 'Disclosures',
                    name: $stateParams.concept,
                    token: $rootScope.token
                };
                return API.Queries.listReportElements(params);
            }]
        }
    })
    .state('disclosures.concept.not-selected', {
        url: '/not-selected',
        templateUrl: 'disclosures/concept/not-selected.html',
        controller: 'DisclosuresNotSelectedCtrl'
    });
}]);
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
                var deferred = $q.defer();

                API.Disclosures.concept({ concept: $stateParams.concept, token: $rootScope.token })
                    .then(function(concept) {
                        if (concept && concept.To) {
                            var params = {
                                cik : ($stateParams.cik ? $stateParams.cik.split(',') : []),
                                tag : ($stateParams.tag ? $stateParams.tag.split(',') : []),
                                fiscalYear : ($stateParams.fiscalYear ? $stateParams.fiscalYear.split(',') : []),
                                fiscalPeriod : ($stateParams.fiscalPeriod ? $stateParams.fiscalPeriod.split(',') : []),
                                sic : ($stateParams.sic ? $stateParams.sic.split(',') : [])
                            };
                            params.name = [];
                            for (var k in concept.To) {
                                if (concept.To.hasOwnProperty(k)) {
                                    params.name.push(k);
                                }
                            }
                            params.token = $rootScope.token;
                            API.Queries.listReportElements(params)
                                .then(function(data) {
                                    concept.ReportElements = data.ReportElements;
                                    deferred.resolve(concept);
                                },
                                function(response) {
                                    deferred.reject(response);
                                });
                        } else {
                            deferred.resolve(concept);
                        }
                    },
                    function(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }]
        }
    })
    .state('disclosures.concept.not-selected', {
        url: '/not-selected',
        templateUrl: 'disclosures/concept/not-selected.html',
        controller: 'DisclosuresNotSelectedCtrl'
    })
}]);
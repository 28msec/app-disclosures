'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('disclosures', {
        url: '/disclosures',
        templateUrl: 'disclosure/disclosure.html',
        controller: 'DisclosureCtrl'
    })
    .state('disclosures.list', {
        url: '/:list',
        views: {
            'left': {
                templateUrl: 'disclosure/concepts.html',
                controller: 'DisclosureConceptsCtrl',
                resolve: {
                    concepts: ['$rootScope', '$stateParams', 'API', function($rootScope, $stateParams, API) {
                        return API.Disclosures.concepts({ list: ($stateParams.list === 'All' ? null : $stateParams.list) });
                    }]
                }
            },
            'right': {
                templateUrl: 'disclosure/not-selected.html',
                controller: 'DisclosureNotSelectedCtrl'
            }
        }
    })
    .state('disclosures.concept', {
        url: '/:list/:concept',
        views: {
            'left': {
                templateUrl: 'disclosure/concept.html',
                controller: 'DisclosureConceptCtrl',
                resolve: {
                    concept: ['$rootScope', '$stateParams', '$q', 'API', function($rootScope, $stateParams, $q, API) {
                        var deferred = $q.defer();

                        API.Disclosures.concept({ concept: $stateParams.concept })
                            .then(function(concept) {
                                if (concept && concept.To) {
                                    var params = angular.copy($rootScope.selection);
                                    params.name = [];
                                    for (var k in concept.To) {
                                        if (concept.To.hasOwnProperty(k)) {
                                            params.name.push(k);
                                        }
                                    }
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
            },
            'right': {
                templateUrl: 'disclosure/not-selected.html',
                controller: 'DisclosureNotSelectedCtrl'
            }
        }
    })
    .state('disclosures.details', {
        url: '/:list/:concept/:aid',
        views: {
            'left': {
                templateUrl: 'disclosure/concept.html',
                controller: 'DisclosureConceptCtrl',
                resolve: {
                    concept: ['$rootScope', '$stateParams', '$q', 'API', function($rootScope, $stateParams, $q, API) {
                        var deferred = $q.defer();

                        API.Disclosures.concept({ concept: $stateParams.concept })
                            .then(function(concept) {
                                if (concept && concept.To) {
                                    var params = angular.copy($rootScope.selection);
                                    params.name = [];
                                    for (var k in concept.To) {
                                        if (concept.To.hasOwnProperty(k)) {
                                            params.name.push(k);
                                        }
                                    }
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
            },
            'right': {
                templateUrl: 'disclosure/details.html',
                controller: 'DisclosureDetailsCtrl',
                resolve: {
                    fact: ['$rootScope', '$stateParams', 'API', function($rootScope, $stateParams, API) {
                        var params = {
                            map: 'Disclosures',
                            rules: 'Disclosures',
                            concept: $stateParams.concept,
                            aid: $stateParams.aid,
                            fiscalYear: $rootScope.selection.fiscalYear,
                            fiscalPeriod: $rootScope.selection.fiscalPeriod
                        };
                        return API.Queries.listFacts(params);
                    }]
                }
            }
        }
    });
}]);
'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('disclosures.concept.aid', {
        url: '/:aid',
        templateUrl: 'disclosures/concept/aid/aid.html',
        controller: 'DisclosuresConceptAidCtrl',
        resolve: {
            fact: ['$rootScope', '$stateParams', 'API', function($rootScope, $stateParams, API) {
                var params = {
                    map: 'Disclosures',
                    concept: $stateParams.concept,
                    aid: $stateParams.aid,
                    token: $rootScope.token
                };
                return API.Queries.listFacts(params);
            }]
        }
    });
}]);
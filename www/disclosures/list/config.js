'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('disclosures.list', {
        url: '/:list',
        templateUrl: 'disclosures/list/list.html',
        controller: 'DisclosuresListCtrl',
        resolve: {
            reportSchema: ['$rootScope', '$stateParams', 'API', function($rootScope, $stateParams, API) {
                return API.getReportSchema();
            }]
        }
    })
    .state('disclosures.list.not-selected', {
        url: '/not-selected',
        templateUrl: 'disclosures/list/not-selected.html',
        controller: 'DisclosuresNotSelectedCtrl'
    });
}]);
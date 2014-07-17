'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('disclosures', {
        url: '/disclosures?fiscalYear&fiscalPeriod&cik&tag&sic',
        templateUrl: 'disclosures/disclosures.html',
        controller: 'DisclosuresCtrl'
    });
}]);
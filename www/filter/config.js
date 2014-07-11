'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {
    $stateProvider
    .state('filter', {
        url: '/filter',
        templateUrl: 'filter/filter.html'
    });
}]);
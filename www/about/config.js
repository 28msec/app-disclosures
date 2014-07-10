'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {
    $stateProvider
    .state('about', {
        url: '/about',
        templateUrl: 'about/about.html'
    });
}]);
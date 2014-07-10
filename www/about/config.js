'use strict';

angular.module('main')
.config(function ($stateProvider) {
    $stateProvider
    .state('about', {
        url: '/about',
        templateUrl: 'about/about.html'
    });
});
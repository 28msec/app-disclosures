'use strict';

angular.module('main')
.config([ '$stateProvider', function ($stateProvider) {

    $stateProvider
    .state('account', {
        url: '/account',
        templateUrl: 'account/account.html',
        controller: 'AccountCtrl'
    })
    .state('account.login', {
        url: '/login',
        templateUrl: 'account/login.html',
        controller: 'AccountLoginCtrl'
    });
}])
;
'use strict';

angular.module('main', [
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'jmdobry.angular-cache',
    'ngProgressLite',
    'navbar-toggle',
    'autocomplete',
    'api',
    'constants'])

.run(['$rootScope', '$location', 'ngProgressLite', '$angularCacheFactory', 'API', function($rootScope, $location, ngProgressLite, $angularCacheFactory, API) {
  
    $rootScope.$on('$stateChangeStart', function() {
        ngProgressLite.start();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
        ngProgressLite.done();
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.error(error);
        ngProgressLite.done();
    });
    
    $rootScope.selection = {};
    $rootScope.$on('SelectionChange', function(event, selection) {
        $rootScope.selection = angular.copy(selection);
    });

    $angularCacheFactory('app-disclosures', {
        maxAge: 60 * 60 * 1000,
        recycleFreq: 60 * 1000,
        deleteOnExpire: 'aggressive',
        storageMode: 'localStorage'
    });

    var cache = $angularCacheFactory.get('app-disclosures');
    if (cache)
    {
        $rootScope.token = cache.get('token');
        $rootScope.user = cache.get('user');
    }

    $rootScope.login = function(token, id, email, firstname, lastname) {
        var user = { id: id, email: email, firstname: firstname, lastname: lastname };
        $rootScope.token = token;
        $rootScope.user = user;
        var cache = $angularCacheFactory.get('app-disclosures');
        if (cache)
        {
            cache.put('token', token);
            cache.put('user', user);
        }
        $location.url('/').replace();
    };

    $rootScope.logout = function() {
        $rootScope.token = null;
        $rootScope.user = null;
        var cache = $angularCacheFactory.get('app-disclosures');
        if (cache) {
            cache.remove('token');
            cache.remove('user');
        }
        $rootScope.selection = { cik : [], tag : [ 'DOW30' ], fiscalYear : [ '2013' ], fiscalPeriod : [ 'FY' ], sic : [] };
        $location.url('/').replace();
    };


    $rootScope.mainAppURL = 'http://app.secxbrl.info';
    API.init()
        .then(function(data) { 
            $rootScope.initialized = data.initialized;
        });
}])
.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', 
    function ($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {

    //Because angularjs default transformResponse is not based on ContentType
    $httpProvider.defaults.transformResponse = function(response, headers){
        var contentType = headers('Content-Type');
        if(/^application\/(.*\+)?json/.test(contentType)) {
            try {
                return JSON.parse(response);
            } catch(e) {
                console.error('Couldn\'t parse the following response:');
                console.error(response);
                return response;
            }
        } else {
            return response;
        }
    };

    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/disclosures/Policies');

}])
;
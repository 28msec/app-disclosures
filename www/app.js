'use strict';

angular.module('main', [
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'jmdobry.angular-cache',
    'ngProgressLite',
    'navbar-toggle',
    'api',
    'constants'])

.run(['$rootScope', 'ngProgressLite', 'API', function($rootScope, ngProgressLite, API) {
  
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
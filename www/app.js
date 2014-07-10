'use strict';

angular.module('main', [
    'ui.router',
    'ui.bootstrap',
    'jmdobry.angular-cache',
    'ngProgressLite',
    
    'queries',
    'disclosures',
    'constants'])

.factory('API', function(QueriesAPI, DisclosuresAPI, API_URL, DEBUG, HTML5) {
    return {
        DEBUG: DEBUG,
        HTML5: HTML5,
        Queries: new QueriesAPI(API_URL + '/_queries/public/api'),
        Disclosures: new DisclosuresAPI(API_URL + '/_queries/public')
    };
})

.run(['$rootScope', 'ngProgressLite', function($rootScope, ngProgressLite) {
  
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

    $rootScope.selection = { fiscalYear: [ 2013 ], fiscalPeriod: [ 'FY' ], tag: [ 'DOW30' ] };
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
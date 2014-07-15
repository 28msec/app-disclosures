'use strict';

angular.module('api', ['queries', 'disclosures'])
.factory('API', ['$q', '$http', 'QueriesAPI', 'DisclosuresAPI', 'API_URL', 'DEBUG', 'HTML5', function($q, $http, QueriesAPI, DisclosuresAPI, API_URL, DEBUG, HTML5) {
    return {
        DEBUG: DEBUG,
        HTML5: HTML5,
        Queries: new QueriesAPI(API_URL + '/_queries/public/api'),
        Disclosures: new DisclosuresAPI(API_URL + '/_queries/public'),

        data: {},

        init : function() {
            var that = this;
            var deferred = $q.defer();
            
            this.data.tag = ['ALL', 'DOW30', 'SP500', 'FORTUNE100', 'PJI'];

            this.data.year = [];
            var year = (new Date()).getFullYear();
            while (year >= 2009) { this.data.year.push('' + year); year -= 1; }
            
            this.data.period = [ 'FY', 'Q3', 'Q2', 'Q1' ];
            
            this.Queries.listEntities({})
                .then(function(data) {
                    if (data && data.Entities) {
                        that.data.entities = [];
                        that.data.sics = [];
                        var index = 0;
                        var unique = {}; 
                        data.Entities.forEach(function(e) {
                            that.data.entities[index] = { cik: e.Profiles.SEC.CIK, name: e.Profiles.SEC.CompanyName, tickers: e.Profiles.SEC.Tickers };
                            if(!unique.hasOwnProperty(e.Profiles.SEC.SIC)) {
                                that.data.sics[index] = { ID: e.Profiles.SEC.SIC, Description: e.Profiles.SEC.SICDescription, Sector: e.Profiles.SEC.Sector };
                                unique[e.Profiles.SEC.SIC] = true;
                            }
                            index++;
                        });
                    }
                    deferred.resolve({ initialized: true });
                },
                function(response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        },

        getYears : function() { return this.data.year; },

		getPeriods : function() { return this.data.period; },

        getTags: function() { return this.data.tag; },

        getEntities: function() { return this.data.entities; },

        getSics: function() { return this.data.sics; }
    };
}])

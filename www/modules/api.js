'use strict';

angular.module('api', ['queries', 'session'])
.factory('API', ['$q', '$http', 'QueriesAPI', 'SessionAPI', 'API_URL', 'DEBUG', 'HTML5', function($q, $http, QueriesAPI, SessionAPI, API_URL, DEBUG, HTML5) {
    return {
        API_URL: API_URL,
        DEBUG: DEBUG,
        HTML5: HTML5,
        Queries: new QueriesAPI(API_URL + '/_queries/public/api'),
        Session: new SessionAPI(API_URL + '/_queries/public'),
        
        data: { },
        deferred: $q.defer(),

        init : function() {
            var that = this;
            
            that.data.tag = ['ALL', 'DOW30', 'SP500', 'FORTUNE100', 'PJI'];

            that.data.year = [];
            var year = (new Date()).getFullYear();
            while (year >= 2009) { that.data.year.push('' + year); year -= 1; }
            
            that.data.period = [ 'FY', 'Q3', 'Q2', 'Q1' ];
            
            that.Queries.listEntities({})
                .then(function(data) {
                    that.Queries.listReportSchemas({ name: 'Disclosures' })
                        .then(function(data) {
                            that.data.reportSchema = data;
                            that.deferred.resolve({ initialized: true });
                        },
                        function(response) {
                            that.deferred.reject(response);
                        });

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
                },
                function(response) {
                    that.deferred.reject(response);
                });

            return that.deferred.promise;
        },

        getYears : function() { var that = this; return that.deferred.promise.then(function() { return that.data.year; }); },

		getPeriods : function() { var that = this; return that.deferred.promise.then(function() { return that.data.period; }); },

        getTags: function() { var that = this; return that.deferred.promise.then(function() { return that.data.tag; }); },

        getEntities: function() {var that = this; return that.deferred.promise.then(function() { return that.data.entities; }); },

        getSics: function() {var that = this; return that.deferred.promise.then(function() { return that.data.sics; }); },

        getReportSchema: function() { var that = this; return that.deferred.promise.then(function() { return that.data.reportSchema; }); }
    };
}])

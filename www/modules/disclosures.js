/*global angular:false */
angular.module('disclosures', [])
    .factory('DisclosuresAPI', function($q, $http, $rootScope) {
        'use strict';

        /**
         *
         * @class " || DisclosuresAPI || "
         * @param {string} domain - The project domain
         * @param {string} cache - An angularjs cache implementation
         */
        return function(domain, cache) {

            if (typeof(domain) !== 'string') {
                throw new Error('Domain parameter must be specified as a string.');
            }

            this.$on = function($scope, path, handler) {
                var url = domain + path;
                $scope.$on(url, function() {
                    handler();
                });
                return this;
            };

            this.$broadcast = function(path) {
                var url = domain + path;
                //cache.remove(url);
                $rootScope.$broadcast(url);
                return this;
            };

            /**
             * Retrieve concepts from a mapping list
             * @method
             * @name DisclosuresAPI#concepts
             * @param {{string}} list - The list name. If empty, all concepts will be returned.
             * @param {{string}} token - The token of the current session (if accessing entities beyond DOW30)
             *
             */
            this.concepts = function(parameters) {
                var deferred = $q.defer();

                var path = '/Concepts.jq';

                var body;
                var queryParameters = {};
                var headers = {};

                if (parameters['list'] !== undefined) {
                    queryParameters['list'] = parameters['list'];
                }

                if (parameters['token'] !== undefined) {
                    queryParameters['token'] = parameters['token'];
                }

                if (parameters.$queryParameters) {
                    Object.keys(parameters.$queryParameters)
                        .forEach(function(parameterName) {
                            var parameter = parameters.$queryParameters[parameterName];
                            queryParameters[parameterName] = parameter;
                        });
                }

                var url = domain + path;
                $http({
                    timeout: parameters.$timeout,
                    method: 'POST',
                    url: url,
                    params: queryParameters,
                    data: body,
                    headers: headers
                })
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                        if (parameters.$cache !== undefined) {
                            parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject({
                            status: status,
                            headers: headers,
                            config: config,
                            body: data
                        });
                    });

                return deferred.promise;
            };
            /**
             * Retrieve a concept
             * @method
             * @name DisclosuresAPI#concept
             * @param {{string}} concept - The name of the concept.
             * @param {{string}} token - The token of the current session (if accessing entities beyond DOW30)
             *
             */
            this.concept = function(parameters) {
                var deferred = $q.defer();

                var path = '/Concept.jq';

                var body;
                var queryParameters = {};
                var headers = {};

                if (parameters['concept'] === undefined) {
                    deferred.reject(new Error('Missing required query parameter: concept'));
                    return deferred.promise;
                }

                if (parameters['concept'] !== undefined) {
                    queryParameters['concept'] = parameters['concept'];
                }

                if (parameters['token'] !== undefined) {
                    queryParameters['token'] = parameters['token'];
                }

                if (parameters.$queryParameters) {
                    Object.keys(parameters.$queryParameters)
                        .forEach(function(parameterName) {
                            var parameter = parameters.$queryParameters[parameterName];
                            queryParameters[parameterName] = parameter;
                        });
                }

                var url = domain + path;
                $http({
                    timeout: parameters.$timeout,
                    method: 'POST',
                    url: url,
                    params: queryParameters,
                    data: body,
                    headers: headers
                })
                    .success(function(data, status, headers, config) {
                        deferred.resolve(data);
                        if (parameters.$cache !== undefined) {
                            parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject({
                            status: status,
                            headers: headers,
                            config: config,
                            body: data
                        });
                    });

                return deferred.promise;
            };
        };
    });
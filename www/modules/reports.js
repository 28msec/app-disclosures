/*jshint -W069 */
/*global angular:false */
angular.module('reports', [])
    .factory('ReportsAPI', ['$q', '$http', '$rootScope',
        function($q, $http, $rootScope) {
            'use strict';

            /**
             * <p>This API can be used to manage reports.</p> <p>This API is only accesible for users having granted priviliges to work with reports.</p> <p>Note, that the POST method can be simulated by using GET and adding the _method=POST parameter to the HTTP request.</p>
             * @class " || ReportsAPI || "
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
 * Retrieve a list of all Reports
 * @method
 * @name ReportsAPI#listReports
 * @param {{string}} _id - A report id (e.g. 1fueA5hrxIHxvRf7Btr_J6efDJ3qp-s9KV731wDc4OOc)
 * @param {{string}} user - A user's email address to filter reports owned by this user (i.e. all reports if user = authorized user or only public-read reports of user)
 * @param {{boolean}} publicRead - Filter listed reports to return only those that are publicly readable.
 * @param {{boolean}} private - Filter listed reports to return only those that are private.
 * @param {{string}} token - The token of the current session

 * 
 */
                this.listReports = function(parameters) {
                    var deferred = $q.defer();

                    var path = '/reports.jq';

                    var body;
                    var queryParameters = {};
                    var headers = {};

                    if (parameters['_id'] !== undefined) {
                        queryParameters['_id'] = parameters['_id'];
                    }

                    if (parameters['user'] !== undefined) {
                        queryParameters['user'] = parameters['user'];
                    }

                    if (parameters['publicRead'] !== undefined) {
                        queryParameters['public-read'] = parameters['publicRead'];
                    }

                    if (parameters['private'] !== undefined) {
                        queryParameters['private'] = parameters['private'];
                    }

                    if (parameters['token'] !== undefined) {
                        queryParameters['token'] = parameters['token'];
                    }

                    queryParameters['_method'] = 'POST';

                    if (parameters.$queryParameters) {
                        Object.keys(parameters.$queryParameters)
                            .forEach(function(parameterName) {
                                var parameter = parameters.$queryParameters[parameterName];
                                queryParameters[parameterName] = parameter;
                            });
                    }

                    var url = domain + path;
                    var cached = parameters.$cache && parameters.$cache.get(url);
                    if (cached !== undefined && parameters.$refresh !== true) {
                        deferred.resolve(cached);
                        return deferred.promise;
                    }
                    $http({
                        timeout: parameters.$timeout,
                        method: 'GET',
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
                 * Add a new, update an existing report or validates a report on the fly
                 * @method
                 * @name ReportsAPI#addOrReplaceOrValidateReport
                 * @param {{object}} report - A JSON object containing the report
                 * @param {{boolean}} publicRead - Shortcut to make a report publicly readable.
                 * @param {{boolean}} validationOnly - This parameter is either given without any value (means: on) or absent (means: off) or its value is castable to a boolean. Turns validation-only mode on or off.
                 * @param {{string}} token - The token of the current session
                 *
                 */
                this.addOrReplaceOrValidateReport = function(parameters) {
                    var deferred = $q.defer();

                    var path = '/add-report.jq';

                    var body;
                    var queryParameters = {};
                    var headers = {};

                    if (parameters['report'] === undefined) {
                        deferred.reject(new Error('Missing required body parameter: report'));
                        return deferred.promise;
                    }

                    if (parameters.report !== undefined) {
                        body = parameters['report'];
                    }

                    if (parameters['publicRead'] !== undefined) {
                        queryParameters['public-read'] = parameters['publicRead'];
                    }

                    if (parameters['validationOnly'] !== undefined) {
                        queryParameters['validation-only'] = parameters['validationOnly'];
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
                 * Delete an existing report
                 * @method
                 * @name ReportsAPI#removeReport
                 * @param {{string}} _id - A report id (e.g. FundamentalAccountingConcepts)
                 * @param {{string}} token - The token of the current session
                 *
                 */
                this.removeReport = function(parameters) {
                    var deferred = $q.defer();

                    var path = '/delete-report.jq';

                    var body;
                    var queryParameters = {};
                    var headers = {};

                    if (parameters['_id'] === undefined) {
                        deferred.reject(new Error('Missing required query parameter: _id'));
                        return deferred.promise;
                    }

                    if (parameters['_id'] !== undefined) {
                        queryParameters['_id'] = parameters['_id'];
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
                 * Retrieve a list of all Report Parameters
                 * @method
                 * @name ReportsAPI#getParameters
                 * @param {{string}} parameter - Only retrieve values for this parameter
                 *
                 */
                this.getParameters = function(parameters) {
                    var deferred = $q.defer();

                    var path = '/parameters.jq';

                    var body;
                    var queryParameters = {};
                    var headers = {};

                    if (parameters['parameter'] !== undefined) {
                        queryParameters['parameter'] = parameters['parameter'];
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
        }
    ]);
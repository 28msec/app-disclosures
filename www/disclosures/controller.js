'use strict';

angular.module('main')
.controller('DisclosuresCtrl', ['$scope', '$modal', '$location', '$stateParams', 'API', function($scope, $modal, $location, $stateParams, API){
    
    $scope.selection = {
        cik : ($stateParams.cik ? $stateParams.cik.split(',') : []),
        tag : ($stateParams.tag ? $stateParams.tag.split(',') : []),
        fiscalYear : ($stateParams.fiscalYear ? $stateParams.fiscalYear.split(',') : []),
        fiscalPeriod : ($stateParams.fiscalPeriod ? $stateParams.fiscalPeriod.split(',') : []),
        sic : ($stateParams.sic ? $stateParams.sic.split(',') : [])
    };

    if (($scope.selection.cik.length === 0 &&
        $scope.selection.sic.length === 0 &&
        $scope.selection.tag.length === 0) ||
        $scope.selection.fiscalYear.length === 0 ||
        $scope.selection.fiscalPeriod.length === 0)
    {
        $scope.selection = { cik : [], tag : [ 'DOW30' ], fiscalYear : [ '2013' ], fiscalPeriod : [ 'FY' ], sic : [] };
    }

    $scope.filter = function() {

        var modalInstance = $modal.open({
            templateUrl: 'disclosures/filter.html',
            controller: 'DisclosuresFilterCtrl',
            resolve: {
                tags: function() {
                    return API.getTags();
                },
                entities: function() {
                    return API.getEntities();
                },
                sics: function() {
                    return API.getSics();
                },
                years: function() {
                    return API.getYears();
                },
                periods: function() {
                    return API.getPeriods();
                },
                selection: function() {
                    return angular.copy($scope.selection);
                }
            }
        });

        modalInstance.result.then(function (selection) {
            $scope.selection = selection;
        });
    };

    $scope.$watch(
        function() {
            return angular.toJson($scope.selection);
        },
        function() {
            $location.search($scope.selection);
            $scope.$emit('SelectionChange', $scope.selection);
        }
    );
}])
.controller('DisclosuresFilterCtrl', ['$scope', '$rootScope', '$modalInstance', 'tags', 'entities', 'years', 'periods', 'sics', 'selection', function($scope, $rootScope, $modalInstance, tags, entities, years, periods, sics, selection) {
    $scope.tags = tags;
    $scope.entities = entities;
    $scope.years = years;
    $scope.periods = periods;
    $scope.sics = sics;
    $scope.selection = selection;

    $scope.reset = function () {
        $scope.selection = { cik : [], tag : [ 'DOW30' ], fiscalYear : [ '2013' ], fiscalPeriod : [ 'FY' ], sic : [] };
    };

    $scope.ok = function () {
        $scope.invalid = false;
        if (($scope.selection.cik.length === 0 &&
            $scope.selection.sic.length === 0 &&
            $scope.selection.tag.length === 0) ||
            $scope.selection.fiscalYear.length === 0 ||
            $scope.selection.fiscalPeriod.length === 0)
        {
            $scope.invalid = true;
        }
        else
        {
            $modalInstance.close($scope.selection);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.selectEntity = function(entity) {
        if ($scope.selection.cik)
        {
            if ($scope.selection.cik.indexOf(entity.cik) < 0) {
                $scope.selection.cik.push(entity.cik);
            }
        }
        else
        {
            $scope.selection.cik = [ entity.cik ];
        }
        $scope.name = null;
    };

    $scope.selectSic = function(sic) {
        if ($scope.selection.sic)
        {
            if ($scope.selection.sic.indexOf(sic.ID) < 0) {
                $scope.selection.sic.push(sic.ID);
            }
        }
        else
        {
            $scope.selection.sic = [ sic.ID ];
        }
        $scope.sic = null;
    };

    $scope.getEntity = function(cik) {
        var ret = null;
        $scope.entities.forEach(function(e) {
            if (e.cik === cik)
            {
                ret = e;
            }
        });
        return ret;
    };

    $scope.getSic = function(sic) {
        var ret = null;
        $scope.sics.forEach(function(s) {
            if ('' + s.ID === '' + sic)
            {
                ret = s;
            }
        });
        return ret;
    };
}])
;
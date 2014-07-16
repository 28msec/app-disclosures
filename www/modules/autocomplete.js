'use strict';

angular.module('autocomplete', [])
.directive('autocomplete', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            //prevent unbound controls
            if (!ngModel || !attrs) {
                return;
            }
            //prevent behavior for autocomplete="off"
            if (attrs.autocomplete && attrs.autocomplete === 'off') {
                return;
            }
            scope.$on('autocomplete:update', function() {
                ngModel.$setViewValue(element.val());
            });
        }
    };
});
	
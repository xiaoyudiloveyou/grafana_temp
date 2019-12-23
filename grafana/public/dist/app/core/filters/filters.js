import _ from 'lodash';
import angular from 'angular';
import coreModule from '../core_module';
import { dateTime } from '@grafana/data';
coreModule.filter('stringSort', function () {
    return function (input) {
        return input.sort();
    };
});
coreModule.filter('slice', function () {
    return function (arr, start, end) {
        if (!_.isUndefined(arr)) {
            return arr.slice(start, end);
        }
        return arr;
    };
});
coreModule.filter('stringify', function () {
    return function (arr) {
        if (_.isObject(arr) && !_.isArray(arr)) {
            return angular.toJson(arr);
        }
        else {
            return _.isNull(arr) ? null : arr.toString();
        }
    };
});
coreModule.filter('moment', function () {
    return function (date, mode) {
        switch (mode) {
            case 'ago':
                return dateTime(date).fromNow();
        }
        return dateTime(date).fromNow();
    };
});
/** @ngInject */
function interpolateTemplateVars(templateSrv) {
    var filterFunc = function (text, scope) {
        var scopedVars;
        if (scope.ctrl) {
            scopedVars = (scope.ctrl.panel || scope.ctrl.row).scopedVars;
        }
        else {
            scopedVars = scope.row.scopedVars;
        }
        return templateSrv.replaceWithText(text, scopedVars);
    };
    filterFunc.$stateful = true;
    return filterFunc;
}
coreModule.filter('interpolateTemplateVars', interpolateTemplateVars);
export default {};
//# sourceMappingURL=filters.js.map
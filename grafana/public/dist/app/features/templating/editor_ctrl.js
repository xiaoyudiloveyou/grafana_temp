import * as tslib_1 from "tslib";
import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { variableTypes } from './variable';
import appEvents from 'app/core/app_events';
var VariableEditorCtrl = /** @class */ (function () {
    /** @ngInject */
    function VariableEditorCtrl($scope, datasourceSrv, variableSrv, templateSrv) {
        var _this = this;
        $scope.variableTypes = variableTypes;
        $scope.ctrl = {};
        $scope.namePattern = /^(?!__).*$/;
        $scope._ = _;
        $scope.optionsLimit = 20;
        $scope.emptyListCta = {
            title: 'There are no variables yet',
            buttonTitle: 'Add variable',
            buttonIcon: 'gicon gicon-variable',
            infoBox: {
                __html: " <p>\n      Variables enable more interactive and dynamic dashboards. Instead of hard-coding things like server or\n      sensor names in your metric queries you can use variables in their place. Variables are shown as dropdown\n      select boxes at the top of the dashboard. These dropdowns make it easy to change the data being displayed in\n      your dashboard. Check out the\n      <a class=\"external-link\" href=\"http://docs.grafana.org/reference/templating/\" target=\"_blank\">\n        Templating documentation\n      </a>\n      for more information.\n    </p>",
                infoBoxTitle: 'What do variables do?',
            },
        };
        $scope.refreshOptions = [
            { value: 0, text: 'Never' },
            { value: 1, text: 'On Dashboard Load' },
            { value: 2, text: 'On Time Range Change' },
        ];
        $scope.sortOptions = [
            { value: 0, text: 'Disabled' },
            { value: 1, text: 'Alphabetical (asc)' },
            { value: 2, text: 'Alphabetical (desc)' },
            { value: 3, text: 'Numerical (asc)' },
            { value: 4, text: 'Numerical (desc)' },
            { value: 5, text: 'Alphabetical (case-insensitive, asc)' },
            { value: 6, text: 'Alphabetical (case-insensitive, desc)' },
        ];
        $scope.hideOptions = [{ value: 0, text: '' }, { value: 1, text: 'Label' }, { value: 2, text: 'Variable' }];
        $scope.init = function () {
            $scope.mode = 'list';
            $scope.variables = variableSrv.variables;
            $scope.reset();
            $scope.$watch('mode', function (val) {
                if (val === 'new') {
                    $scope.reset();
                }
            });
        };
        $scope.setMode = function (mode) {
            $scope.mode = mode;
        };
        $scope.setNewMode = function () {
            $scope.setMode('new');
        };
        $scope.add = function () {
            if ($scope.isValid()) {
                variableSrv.addVariable($scope.current);
                $scope.update();
            }
        };
        $scope.isValid = function () {
            if (!$scope.ctrl.form.$valid) {
                return false;
            }
            if (!$scope.current.name.match(/^\w+$/)) {
                appEvents.emit('alert-warning', ['Validation', 'Only word and digit characters are allowed in variable names']);
                return false;
            }
            var sameName = _.find($scope.variables, { name: $scope.current.name });
            if (sameName && sameName !== $scope.current) {
                appEvents.emit('alert-warning', ['Validation', 'Variable with the same name already exists']);
                return false;
            }
            if ($scope.current.type === 'query' &&
                _.isString($scope.current.query) &&
                $scope.current.query.match(new RegExp('\\$' + $scope.current.name + '(/| |$)'))) {
                appEvents.emit('alert-warning', [
                    'Validation',
                    'Query cannot contain a reference to itself. Variable: $' + $scope.current.name,
                ]);
                return false;
            }
            return true;
        };
        $scope.validate = function () {
            $scope.infoText = '';
            if ($scope.current.type === 'adhoc' && $scope.current.datasource !== null) {
                $scope.infoText = 'Adhoc filters are applied automatically to all queries that target this datasource';
                datasourceSrv.get($scope.current.datasource).then(function (ds) {
                    if (!ds.getTagKeys) {
                        $scope.infoText = 'This datasource does not support adhoc filters yet.';
                    }
                });
            }
        };
        $scope.runQuery = function () {
            $scope.optionsLimit = 20;
            return variableSrv.updateOptions($scope.current).catch(function (err) {
                if (err.data && err.data.message) {
                    err.message = err.data.message;
                }
                appEvents.emit('alert-error', ['Templating', 'Template variables could not be initialized: ' + err.message]);
            });
        };
        $scope.onQueryChange = function (query, definition) {
            $scope.current.query = query;
            $scope.current.definition = definition;
            $scope.runQuery();
        };
        $scope.edit = function (variable) {
            $scope.current = variable;
            $scope.currentIsNew = false;
            $scope.mode = 'edit';
            $scope.validate();
            datasourceSrv.get($scope.current.datasource).then(function (ds) {
                $scope.currentDatasource = ds;
            });
        };
        $scope.duplicate = function (variable) {
            var clone = _.cloneDeep(variable.getSaveModel());
            $scope.current = variableSrv.createVariableFromModel(clone);
            $scope.current.name = 'copy_of_' + variable.name;
            variableSrv.addVariable($scope.current);
        };
        $scope.update = function () {
            if ($scope.isValid()) {
                $scope.runQuery().then(function () {
                    $scope.reset();
                    $scope.mode = 'list';
                    templateSrv.updateIndex();
                });
            }
        };
        $scope.reset = function () {
            $scope.currentIsNew = true;
            $scope.current = variableSrv.createVariableFromModel({ type: 'query' });
            // this is done here in case a new data source type variable was added
            $scope.datasources = _.filter(datasourceSrv.getMetricSources(), function (ds) {
                return !ds.meta.mixed && ds.value !== null;
            });
            $scope.datasourceTypes = _($scope.datasources)
                .uniqBy('meta.id')
                .map(function (ds) {
                return { text: ds.meta.name, value: ds.meta.id };
            })
                .value();
        };
        $scope.typeChanged = function () {
            var old = $scope.current;
            $scope.current = variableSrv.createVariableFromModel({
                type: $scope.current.type,
            });
            $scope.current.name = old.name;
            $scope.current.label = old.label;
            var oldIndex = _.indexOf(this.variables, old);
            if (oldIndex !== -1) {
                this.variables[oldIndex] = $scope.current;
            }
            $scope.validate();
        };
        $scope.removeVariable = function (variable) {
            variableSrv.removeVariable(variable);
        };
        $scope.showMoreOptions = function () {
            $scope.optionsLimit += 20;
        };
        $scope.datasourceChanged = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                datasourceSrv.get($scope.current.datasource).then(function (ds) {
                    $scope.current.query = '';
                    $scope.currentDatasource = ds;
                });
                return [2 /*return*/];
            });
        }); };
    }
    return VariableEditorCtrl;
}());
export { VariableEditorCtrl };
coreModule.controller('VariableEditorCtrl', VariableEditorCtrl);
//# sourceMappingURL=editor_ctrl.js.map
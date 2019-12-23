import * as tslib_1 from "tslib";
import coreModule from 'app/core/core_module';
import { importDataSourcePlugin } from './plugin_loader';
import React from 'react';
import ReactDOM from 'react-dom';
import DefaultVariableQueryEditor from '../templating/DefaultVariableQueryEditor';
function loadComponent(meta) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var dsPlugin;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importDataSourcePlugin(meta)];
                case 1:
                    dsPlugin = _a.sent();
                    if (dsPlugin.components.VariableQueryEditor) {
                        return [2 /*return*/, dsPlugin.components.VariableQueryEditor];
                    }
                    else {
                        return [2 /*return*/, DefaultVariableQueryEditor];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/** @ngInject */
function variableQueryEditorLoader(templateSrv) {
    var _this = this;
    return {
        restrict: 'E',
        link: function (scope, elem) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var Component, props;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loadComponent(scope.currentDatasource.meta)];
                    case 1:
                        Component = _a.sent();
                        props = {
                            datasource: scope.currentDatasource,
                            query: scope.current.query,
                            onChange: scope.onQueryChange,
                            templateSrv: templateSrv,
                        };
                        ReactDOM.render(React.createElement(Component, tslib_1.__assign({}, props)), elem[0]);
                        scope.$on('$destroy', function () {
                            ReactDOM.unmountComponentAtNode(elem[0]);
                        });
                        return [2 /*return*/];
                }
            });
        }); },
    };
}
coreModule.directive('variableQueryEditorLoader', variableQueryEditorLoader);
//# sourceMappingURL=variableQueryEditorLoader.js.map
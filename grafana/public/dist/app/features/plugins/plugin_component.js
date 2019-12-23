import angular from 'angular';
import _ from 'lodash';
import config from 'app/core/config';
import coreModule from 'app/core/core_module';
import { importPanelPlugin, importDataSourcePlugin, importAppPlugin } from './plugin_loader';
/** @ngInject */
function pluginDirectiveLoader($compile, datasourceSrv, $rootScope, $q, $http, $templateCache, $timeout) {
    function getTemplate(component) {
        if (component.template) {
            return $q.when(component.template);
        }
        var cached = $templateCache.get(component.templateUrl);
        if (cached) {
            return $q.when(cached);
        }
        return $http.get(component.templateUrl).then(function (res) {
            return res.data;
        });
    }
    function relativeTemplateUrlToAbs(templateUrl, baseUrl) {
        if (!templateUrl) {
            return undefined;
        }
        if (templateUrl.indexOf('public') === 0) {
            return templateUrl;
        }
        return baseUrl + '/' + templateUrl;
    }
    function getPluginComponentDirective(options) {
        // handle relative template urls for plugin templates
        options.Component.templateUrl = relativeTemplateUrlToAbs(options.Component.templateUrl, options.baseUrl);
        return function () {
            return {
                templateUrl: options.Component.templateUrl,
                template: options.Component.template,
                restrict: 'E',
                controller: options.Component,
                controllerAs: 'ctrl',
                bindToController: true,
                scope: options.bindings,
                link: function (scope, elem, attrs, ctrl) {
                    if (ctrl.link) {
                        ctrl.link(scope, elem, attrs, ctrl);
                    }
                    if (ctrl.init) {
                        ctrl.init();
                    }
                },
            };
        };
    }
    function loadPanelComponentInfo(scope, attrs) {
        var componentInfo = {
            name: 'panel-plugin-' + scope.panel.type,
            bindings: { dashboard: '=', panel: '=', row: '=' },
            attrs: {
                dashboard: 'dashboard',
                panel: 'panel',
                class: 'panel-height-helper',
            },
        };
        var panelInfo = config.panels[scope.panel.type];
        return importPanelPlugin(panelInfo.id).then(function (panelPlugin) {
            var PanelCtrl = panelPlugin.angularPanelCtrl;
            componentInfo.Component = PanelCtrl;
            if (!PanelCtrl || PanelCtrl.registered) {
                return componentInfo;
            }
            if (PanelCtrl.templatePromise) {
                return PanelCtrl.templatePromise.then(function (res) {
                    return componentInfo;
                });
            }
            if (panelInfo) {
                PanelCtrl.templateUrl = relativeTemplateUrlToAbs(PanelCtrl.templateUrl, panelInfo.baseUrl);
            }
            PanelCtrl.templatePromise = getTemplate(PanelCtrl).then(function (template) {
                PanelCtrl.templateUrl = null;
                PanelCtrl.template = "<grafana-panel ctrl=\"ctrl\" class=\"panel-height-helper\">" + template + "</grafana-panel>";
                return componentInfo;
            });
            return PanelCtrl.templatePromise;
        });
    }
    function getModule(scope, attrs) {
        switch (attrs.type) {
            // QueryCtrl
            case 'query-ctrl': {
                var ds = scope.ctrl.datasource;
                return $q.when({
                    baseUrl: ds.meta.baseUrl,
                    name: 'query-ctrl-' + ds.meta.id,
                    bindings: { target: '=', panelCtrl: '=', datasource: '=' },
                    attrs: {
                        target: 'ctrl.target',
                        'panel-ctrl': 'ctrl',
                        datasource: 'ctrl.datasource',
                    },
                    Component: ds.components.QueryCtrl,
                });
            }
            // Annotations
            case 'annotations-query-ctrl': {
                return importDataSourcePlugin(scope.ctrl.currentDatasource.meta).then(function (dsPlugin) {
                    return {
                        baseUrl: scope.ctrl.currentDatasource.meta.baseUrl,
                        name: 'annotations-query-ctrl-' + scope.ctrl.currentDatasource.meta.id,
                        bindings: { annotation: '=', datasource: '=' },
                        attrs: {
                            annotation: 'ctrl.currentAnnotation',
                            datasource: 'ctrl.currentDatasource',
                        },
                        Component: dsPlugin.components.AnnotationsQueryCtrl,
                    };
                });
            }
            // Datasource ConfigCtrl
            case 'datasource-config-ctrl': {
                var dsMeta_1 = scope.ctrl.datasourceMeta;
                return importDataSourcePlugin(dsMeta_1).then(function (dsPlugin) {
                    scope.$watch('ctrl.current', function () {
                        scope.onModelChanged(scope.ctrl.current);
                    }, true);
                    return {
                        baseUrl: dsMeta_1.baseUrl,
                        name: 'ds-config-' + dsMeta_1.id,
                        bindings: { meta: '=', current: '=' },
                        attrs: { meta: 'ctrl.datasourceMeta', current: 'ctrl.current' },
                        Component: dsPlugin.angularConfigCtrl,
                    };
                });
            }
            // AppConfigCtrl
            case 'app-config-ctrl': {
                var model_1 = scope.ctrl.model;
                return importAppPlugin(model_1).then(function (appPlugin) {
                    return {
                        baseUrl: model_1.baseUrl,
                        name: 'app-config-' + model_1.id,
                        bindings: { appModel: '=', appEditCtrl: '=' },
                        attrs: { 'app-model': 'ctrl.model', 'app-edit-ctrl': 'ctrl' },
                        Component: appPlugin.angularConfigCtrl,
                    };
                });
            }
            // App Page
            case 'app-page': {
                var appModel_1 = scope.ctrl.appModel;
                return importAppPlugin(appModel_1).then(function (appPlugin) {
                    return {
                        baseUrl: appModel_1.baseUrl,
                        name: 'app-page-' + appModel_1.id + '-' + scope.ctrl.page.slug,
                        bindings: { appModel: '=' },
                        attrs: { 'app-model': 'ctrl.appModel' },
                        Component: appPlugin.angularPages[scope.ctrl.page.component],
                    };
                });
            }
            // Panel
            case 'panel': {
                return loadPanelComponentInfo(scope, attrs);
            }
            default: {
                return $q.reject({
                    message: 'Could not find component type: ' + attrs.type,
                });
            }
        }
    }
    function appendAndCompile(scope, elem, componentInfo) {
        var child = angular.element(document.createElement(componentInfo.name));
        _.each(componentInfo.attrs, function (value, key) {
            child.attr(key, value);
        });
        $compile(child)(scope);
        elem.empty();
        // let a binding digest cycle complete before adding to dom
        setTimeout(function () {
            scope.$applyAsync(function () {
                elem.append(child);
                setTimeout(function () {
                    scope.$applyAsync(function () {
                        scope.$broadcast('component-did-mount');
                    });
                });
            });
        });
    }
    function registerPluginComponent(scope, elem, attrs, componentInfo) {
        if (componentInfo.notFound) {
            elem.empty();
            return;
        }
        if (!componentInfo.Component) {
            throw {
                message: 'Failed to find exported plugin component for ' + componentInfo.name,
            };
        }
        if (!componentInfo.Component.registered) {
            var directiveName = attrs.$normalize(componentInfo.name);
            var directiveFn = getPluginComponentDirective(componentInfo);
            coreModule.directive(directiveName, directiveFn);
            componentInfo.Component.registered = true;
        }
        appendAndCompile(scope, elem, componentInfo);
    }
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            getModule(scope, attrs)
                .then(function (componentInfo) {
                registerPluginComponent(scope, elem, attrs, componentInfo);
            })
                .catch(function (err) {
                console.log('Plugin component error', err);
            });
        },
    };
}
coreModule.directive('pluginComponent', pluginDirectiveLoader);
//# sourceMappingURL=plugin_component.js.map
import * as tslib_1 from "tslib";
import '@babel/polyfill';
import 'file-saver';
import 'lodash';
import 'jquery';
import 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-native-dragdrop';
import 'angular-bindonce';
import 'react';
import 'react-dom';
import 'vendor/bootstrap/bootstrap';
import 'vendor/angular-other/angular-strap';
import $ from 'jquery';
import angular from 'angular';
import config from 'app/core/config';
// @ts-ignore ignoring this for now, otherwise we would have to extend _ interface with move
import _ from 'lodash';
import { addClassIfNoOverlayScrollbar } from 'app/core/utils/scrollbar';
import { importPluginModule } from 'app/features/plugins/plugin_loader';
// add move to lodash for backward compatabiltiy
// @ts-ignore
_.move = function (array, fromIndex, toIndex) {
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
};
import { coreModule, angularModules } from 'app/core/core_module';
import { registerAngularDirectives } from 'app/core/core';
import { setupAngularRoutes } from 'app/routes/routes';
import 'app/routes/GrafanaCtrl';
import 'app/features/all';
import { setLocale } from '@grafana/data';
import { setMarkdownOptions } from '@grafana/data';
// import symlinked extensions
var extensionsIndex = require.context('.', true, /extensions\/index.ts/);
extensionsIndex.keys().forEach(function (key) {
    extensionsIndex(key);
});
var GrafanaApp = /** @class */ (function () {
    function GrafanaApp() {
        addClassIfNoOverlayScrollbar('no-overlay-scrollbar');
        this.preBootModules = [];
        this.registerFunctions = {};
        this.ngModuleDependencies = [];
    }
    GrafanaApp.prototype.useModule = function (module) {
        if (this.preBootModules) {
            this.preBootModules.push(module);
        }
        else {
            _.extend(module, this.registerFunctions);
        }
        this.ngModuleDependencies.push(module.name);
        return module;
    };
    GrafanaApp.prototype.init = function () {
        var e_1, _a;
        var _this = this;
        var app = angular.module('grafana', []);
        setLocale(config.bootData.user.locale);
        setMarkdownOptions({ sanitize: !config.disableSanitizeHtml });
        app.config(function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $httpProvider, $provide) {
            // pre assing bindings before constructor calls
            $compileProvider.preAssignBindingsEnabled(true);
            if (config.buildInfo.env !== 'development') {
                $compileProvider.debugInfoEnabled(false);
            }
            $httpProvider.useApplyAsync(true);
            _this.registerFunctions.controller = $controllerProvider.register;
            _this.registerFunctions.directive = $compileProvider.directive;
            _this.registerFunctions.factory = $provide.factory;
            _this.registerFunctions.service = $provide.service;
            _this.registerFunctions.filter = $filterProvider.register;
            $provide.decorator('$http', [
                '$delegate',
                '$templateCache',
                function ($delegate, $templateCache) {
                    var get = $delegate.get;
                    $delegate.get = function (url, config) {
                        if (url.match(/\.html$/)) {
                            // some template's already exist in the cache
                            if (!$templateCache.get(url)) {
                                url += '?v=' + new Date().getTime();
                            }
                        }
                        return get(url, config);
                    };
                    return $delegate;
                },
            ]);
        });
        this.ngModuleDependencies = [
            'grafana.core',
            'ngRoute',
            'ngSanitize',
            '$strap.directives',
            'ang-drag-drop',
            'grafana',
            'pasvaz.bindonce',
            'react',
        ];
        // makes it possible to add dynamic stuff
        _.each(angularModules, function (m) {
            _this.useModule(m);
        });
        // register react angular wrappers
        coreModule.config(setupAngularRoutes);
        registerAngularDirectives();
        // disable tool tip animation
        $.fn.tooltip.defaults.animation = false;
        // bootstrap the app
        angular.bootstrap(document, this.ngModuleDependencies).invoke(function () {
            _.each(_this.preBootModules, function (module) {
                _.extend(module, _this.registerFunctions);
            });
            _this.preBootModules = null;
        });
        try {
            // Preload selected app plugins
            for (var _b = tslib_1.__values(config.pluginsToPreload), _c = _b.next(); !_c.done; _c = _b.next()) {
                var modulePath = _c.value;
                importPluginModule(modulePath);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return GrafanaApp;
}());
export { GrafanaApp };
export default new GrafanaApp();
//# sourceMappingURL=app.js.map
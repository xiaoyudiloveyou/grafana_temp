// Libraries
import _ from 'lodash';
import coreModule from 'app/core/core_module';
// Services & Utils
import config from 'app/core/config';
import { importDataSourcePlugin } from './plugin_loader';
import { getDataSourceSrv as getDataSourceService } from '@grafana/runtime';
var DatasourceSrv = /** @class */ (function () {
    /** @ngInject */
    function DatasourceSrv($q, $injector, $rootScope, templateSrv) {
        this.$q = $q;
        this.$injector = $injector;
        this.$rootScope = $rootScope;
        this.templateSrv = templateSrv;
        this.init();
    }
    DatasourceSrv.prototype.init = function () {
        this.datasources = {};
    };
    DatasourceSrv.prototype.get = function (name, scopedVars) {
        if (!name) {
            return this.get(config.defaultDatasource);
        }
        // Interpolation here is to support template variable in data source selection
        name = this.templateSrv.replace(name, scopedVars, function (value, variable) {
            if (Array.isArray(value)) {
                return value[0];
            }
            return value;
        });
        if (name === 'default') {
            return this.get(config.defaultDatasource);
        }
        if (this.datasources[name]) {
            return this.$q.when(this.datasources[name]);
        }
        return this.loadDatasource(name);
    };
    DatasourceSrv.prototype.loadDatasource = function (name) {
        var _this = this;
        var dsConfig = config.datasources[name];
        if (!dsConfig) {
            return this.$q.reject({ message: 'Datasource named ' + name + ' was not found' });
        }
        var deferred = this.$q.defer();
        importDataSourcePlugin(dsConfig.meta)
            .then(function (dsPlugin) {
            // check if its in cache now
            if (_this.datasources[name]) {
                deferred.resolve(_this.datasources[name]);
                return;
            }
            // If there is only one constructor argument it is instanceSettings
            var useAngular = dsPlugin.DataSourceClass.length !== 1;
            var instance = useAngular
                ? _this.$injector.instantiate(dsPlugin.DataSourceClass, {
                    instanceSettings: dsConfig,
                })
                : new dsPlugin.DataSourceClass(dsConfig);
            instance.components = dsPlugin.components;
            instance.meta = dsConfig.meta;
            // store in instance cache
            _this.datasources[name] = instance;
            deferred.resolve(instance);
        })
            .catch(function (err) {
            _this.$rootScope.appEvent('alert-error', [dsConfig.name + ' plugin failed', err.toString()]);
        });
        return deferred.promise;
    };
    DatasourceSrv.prototype.getAll = function () {
        var datasources = config.datasources;
        return Object.keys(datasources).map(function (name) { return datasources[name]; });
    };
    DatasourceSrv.prototype.getExternal = function () {
        var datasources = this.getAll().filter(function (ds) { return !ds.meta.builtIn; });
        return _.sortBy(datasources, ['name']);
    };
    DatasourceSrv.prototype.getAnnotationSources = function () {
        var sources = [];
        this.addDataSourceVariables(sources);
        _.each(config.datasources, function (value) {
            if (value.meta && value.meta.annotations) {
                sources.push(value);
            }
        });
        return sources;
    };
    DatasourceSrv.prototype.getMetricSources = function (options) {
        var metricSources = [];
        _.each(config.datasources, function (value, key) {
            if (value.meta && value.meta.metrics) {
                var metricSource = { value: key, name: key, meta: value.meta, sort: key };
                //Make sure grafana and mixed are sorted at the bottom
                if (value.meta.id === 'grafana') {
                    metricSource.sort = String.fromCharCode(253);
                }
                else if (value.meta.id === 'dashboard') {
                    metricSource.sort = String.fromCharCode(254);
                }
                else if (value.meta.id === 'mixed') {
                    metricSource.sort = String.fromCharCode(255);
                }
                metricSources.push(metricSource);
                if (key === config.defaultDatasource) {
                    metricSource = { value: null, name: 'default', meta: value.meta, sort: key };
                    metricSources.push(metricSource);
                }
            }
        });
        if (!options || !options.skipVariables) {
            this.addDataSourceVariables(metricSources);
        }
        metricSources.sort(function (a, b) {
            if (a.sort.toLowerCase() > b.sort.toLowerCase()) {
                return 1;
            }
            if (a.sort.toLowerCase() < b.sort.toLowerCase()) {
                return -1;
            }
            return 0;
        });
        return metricSources;
    };
    DatasourceSrv.prototype.addDataSourceVariables = function (list) {
        // look for data source variables
        for (var i = 0; i < this.templateSrv.variables.length; i++) {
            var variable = this.templateSrv.variables[i];
            if (variable.type !== 'datasource') {
                continue;
            }
            var first = variable.current.value;
            if (first === 'default') {
                first = config.defaultDatasource;
            }
            var ds = config.datasources[first];
            if (ds) {
                var key = "$" + variable.name;
                list.push({
                    name: key,
                    value: key,
                    meta: ds.meta,
                    sort: key,
                });
            }
        }
    };
    return DatasourceSrv;
}());
export { DatasourceSrv };
export function getDatasourceSrv() {
    return getDataSourceService();
}
coreModule.service('datasourceSrv', DatasourceSrv);
export default DatasourceSrv;
//# sourceMappingURL=datasource_srv.js.map
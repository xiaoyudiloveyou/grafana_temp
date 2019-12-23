import * as tslib_1 from "tslib";
import _ from 'lodash';
import AzureMonitorDatasource from './azure_monitor/azure_monitor_datasource';
import AppInsightsDatasource from './app_insights/app_insights_datasource';
import AzureLogAnalyticsDatasource from './azure_log_analytics/azure_log_analytics_datasource';
import { DataSourceApi } from '@grafana/ui';
var Datasource = /** @class */ (function (_super) {
    tslib_1.__extends(Datasource, _super);
    /** @ngInject */
    function Datasource(instanceSettings, backendSrv, templateSrv, $q) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.backendSrv = backendSrv;
        _this.templateSrv = templateSrv;
        _this.$q = $q;
        _this.azureMonitorDatasource = new AzureMonitorDatasource(instanceSettings, _this.backendSrv, _this.templateSrv);
        _this.appInsightsDatasource = new AppInsightsDatasource(instanceSettings, _this.backendSrv, _this.templateSrv, _this.$q);
        _this.azureLogAnalyticsDatasource = new AzureLogAnalyticsDatasource(instanceSettings, _this.backendSrv, _this.templateSrv);
        return _this;
    }
    Datasource.prototype.query = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises, azureMonitorOptions, appInsightsOptions, azureLogAnalyticsOptions, amPromise, aiPromise, alaPromise;
            return tslib_1.__generator(this, function (_a) {
                promises = [];
                azureMonitorOptions = _.cloneDeep(options);
                appInsightsOptions = _.cloneDeep(options);
                azureLogAnalyticsOptions = _.cloneDeep(options);
                azureMonitorOptions.targets = _.filter(azureMonitorOptions.targets, ['queryType', 'Azure Monitor']);
                appInsightsOptions.targets = _.filter(appInsightsOptions.targets, ['queryType', 'Application Insights']);
                azureLogAnalyticsOptions.targets = _.filter(azureLogAnalyticsOptions.targets, ['queryType', 'Azure Log Analytics']);
                if (azureMonitorOptions.targets.length > 0) {
                    amPromise = this.azureMonitorDatasource.query(azureMonitorOptions);
                    if (amPromise) {
                        promises.push(amPromise);
                    }
                }
                if (appInsightsOptions.targets.length > 0) {
                    aiPromise = this.appInsightsDatasource.query(appInsightsOptions);
                    if (aiPromise) {
                        promises.push(aiPromise);
                    }
                }
                if (azureLogAnalyticsOptions.targets.length > 0) {
                    alaPromise = this.azureLogAnalyticsDatasource.query(azureLogAnalyticsOptions);
                    if (alaPromise) {
                        promises.push(alaPromise);
                    }
                }
                if (promises.length === 0) {
                    return [2 /*return*/, this.$q.when({ data: [] })];
                }
                return [2 /*return*/, Promise.all(promises).then(function (results) {
                        return { data: _.flatten(results) };
                    })];
            });
        });
    };
    Datasource.prototype.annotationQuery = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.azureLogAnalyticsDatasource.annotationQuery(options)];
            });
        });
    };
    Datasource.prototype.metricFindQuery = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var aiResult, amResult, alaResult;
            return tslib_1.__generator(this, function (_a) {
                if (!query) {
                    return [2 /*return*/, Promise.resolve([])];
                }
                aiResult = this.appInsightsDatasource.metricFindQuery(query);
                if (aiResult) {
                    return [2 /*return*/, aiResult];
                }
                amResult = this.azureMonitorDatasource.metricFindQuery(query);
                if (amResult) {
                    return [2 /*return*/, amResult];
                }
                alaResult = this.azureLogAnalyticsDatasource.metricFindQuery(query);
                if (alaResult) {
                    return [2 /*return*/, alaResult];
                }
                return [2 /*return*/, Promise.resolve([])];
            });
        });
    };
    Datasource.prototype.testDatasource = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises;
            return tslib_1.__generator(this, function (_a) {
                promises = [];
                if (this.azureMonitorDatasource.isConfigured()) {
                    promises.push(this.azureMonitorDatasource.testDatasource());
                }
                if (this.appInsightsDatasource.isConfigured()) {
                    promises.push(this.appInsightsDatasource.testDatasource());
                }
                if (this.azureLogAnalyticsDatasource.isConfigured()) {
                    promises.push(this.azureLogAnalyticsDatasource.testDatasource());
                }
                if (promises.length === 0) {
                    return [2 /*return*/, {
                            status: 'error',
                            message: "Nothing configured. At least one of the API's must be configured.",
                            title: 'Error',
                        }];
                }
                return [2 /*return*/, Promise.all(promises).then(function (results) {
                        var status = 'success';
                        var message = '';
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].status !== 'success') {
                                status = results[i].status;
                            }
                            message += i + 1 + ". " + results[i].message + " ";
                        }
                        return {
                            status: status,
                            message: message,
                            title: _.upperFirst(status),
                        };
                    })];
            });
        });
    };
    /* Azure Monitor REST API methods */
    Datasource.prototype.getResourceGroups = function (subscriptionId) {
        return this.azureMonitorDatasource.getResourceGroups(subscriptionId);
    };
    Datasource.prototype.getMetricDefinitions = function (subscriptionId, resourceGroup) {
        return this.azureMonitorDatasource.getMetricDefinitions(subscriptionId, resourceGroup);
    };
    Datasource.prototype.getResourceNames = function (subscriptionId, resourceGroup, metricDefinition) {
        return this.azureMonitorDatasource.getResourceNames(subscriptionId, resourceGroup, metricDefinition);
    };
    Datasource.prototype.getMetricNames = function (subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace) {
        return this.azureMonitorDatasource.getMetricNames(subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace);
    };
    Datasource.prototype.getMetricNamespaces = function (subscriptionId, resourceGroup, metricDefinition, resourceName) {
        return this.azureMonitorDatasource.getMetricNamespaces(subscriptionId, resourceGroup, metricDefinition, resourceName);
    };
    Datasource.prototype.getMetricMetadata = function (subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, metricName) {
        return this.azureMonitorDatasource.getMetricMetadata(subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, metricName);
    };
    /* Application Insights API method */
    Datasource.prototype.getAppInsightsMetricNames = function () {
        return this.appInsightsDatasource.getMetricNames();
    };
    Datasource.prototype.getAppInsightsMetricMetadata = function (metricName) {
        return this.appInsightsDatasource.getMetricMetadata(metricName);
    };
    Datasource.prototype.getAppInsightsColumns = function (refId) {
        return this.appInsightsDatasource.logAnalyticsColumns[refId];
    };
    /*Azure Log Analytics */
    Datasource.prototype.getAzureLogAnalyticsWorkspaces = function (subscriptionId) {
        return this.azureLogAnalyticsDatasource.getWorkspaces(subscriptionId);
    };
    Datasource.prototype.getSubscriptions = function () {
        return this.azureMonitorDatasource.getSubscriptions();
    };
    return Datasource;
}(DataSourceApi));
export default Datasource;
//# sourceMappingURL=datasource.js.map
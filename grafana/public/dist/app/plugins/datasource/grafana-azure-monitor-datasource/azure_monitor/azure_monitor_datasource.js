import * as tslib_1 from "tslib";
import _ from 'lodash';
import UrlBuilder from './url_builder';
import ResponseParser from './response_parser';
import SupportedNamespaces from './supported_namespaces';
import TimegrainConverter from '../time_grain_converter';
import { toDataFrame } from '@grafana/data';
var AzureMonitorDatasource = /** @class */ (function () {
    /** @ngInject */
    function AzureMonitorDatasource(instanceSettings, backendSrv, templateSrv) {
        this.instanceSettings = instanceSettings;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;
        this.apiVersion = '2018-01-01';
        this.apiPreviewVersion = '2017-12-01-preview';
        this.defaultDropdownValue = 'select';
        this.supportedMetricNamespaces = [];
        this.id = instanceSettings.id;
        this.subscriptionId = instanceSettings.jsonData.subscriptionId;
        this.cloudName = instanceSettings.jsonData.cloudName || 'azuremonitor';
        this.baseUrl = "/" + this.cloudName + "/subscriptions";
        this.url = instanceSettings.url;
        this.supportedMetricNamespaces = new SupportedNamespaces(this.cloudName).get();
    }
    AzureMonitorDatasource.prototype.isConfigured = function () {
        return !!this.subscriptionId && this.subscriptionId.length > 0;
    };
    AzureMonitorDatasource.prototype.query = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, data, result;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queries = _.filter(options.targets, function (item) {
                            return (item.hide !== true &&
                                item.azureMonitor.resourceGroup &&
                                item.azureMonitor.resourceGroup !== _this.defaultDropdownValue &&
                                item.azureMonitor.resourceName &&
                                item.azureMonitor.resourceName !== _this.defaultDropdownValue &&
                                item.azureMonitor.metricDefinition &&
                                item.azureMonitor.metricDefinition !== _this.defaultDropdownValue &&
                                item.azureMonitor.metricName &&
                                item.azureMonitor.metricName !== _this.defaultDropdownValue);
                        }).map(function (target) {
                            var item = target.azureMonitor;
                            // fix for timeGrainUnit which is a deprecated/removed field name
                            if (item.timeGrainUnit && item.timeGrain !== 'auto') {
                                item.timeGrain = TimegrainConverter.createISO8601Duration(item.timeGrain, item.timeGrainUnit);
                            }
                            var subscriptionId = _this.templateSrv.replace(target.subscription || _this.subscriptionId, options.scopedVars);
                            var resourceGroup = _this.templateSrv.replace(item.resourceGroup, options.scopedVars);
                            var resourceName = _this.templateSrv.replace(item.resourceName, options.scopedVars);
                            var metricNamespace = _this.templateSrv.replace(item.metricNamespace, options.scopedVars);
                            var metricDefinition = _this.templateSrv.replace(item.metricDefinition, options.scopedVars);
                            var timeGrain = _this.templateSrv.replace((item.timeGrain || '').toString(), options.scopedVars);
                            var aggregation = _this.templateSrv.replace(item.aggregation, options.scopedVars);
                            return {
                                refId: target.refId,
                                intervalMs: options.intervalMs,
                                datasourceId: _this.id,
                                subscription: subscriptionId,
                                queryType: 'Azure Monitor',
                                type: 'timeSeriesQuery',
                                raw: false,
                                azureMonitor: {
                                    resourceGroup: resourceGroup,
                                    resourceName: resourceName,
                                    metricDefinition: metricDefinition,
                                    timeGrain: timeGrain,
                                    allowedTimeGrainsMs: item.allowedTimeGrainsMs,
                                    metricName: _this.templateSrv.replace(item.metricName, options.scopedVars),
                                    metricNamespace: metricNamespace && metricNamespace !== _this.defaultDropdownValue ? metricNamespace : metricDefinition,
                                    aggregation: aggregation,
                                    dimension: _this.templateSrv.replace(item.dimension, options.scopedVars),
                                    dimensionFilter: _this.templateSrv.replace(item.dimensionFilter, options.scopedVars),
                                    alias: item.alias,
                                    format: target.format,
                                },
                            };
                        });
                        if (!queries || queries.length === 0) {
                            return [2 /*return*/, Promise.resolve([])];
                        }
                        return [4 /*yield*/, this.backendSrv.datasourceRequest({
                                url: '/api/tsdb/query',
                                method: 'POST',
                                data: {
                                    from: options.range.from.valueOf().toString(),
                                    to: options.range.to.valueOf().toString(),
                                    queries: queries,
                                },
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        result = [];
                        if (data.results) {
                            Object['values'](data.results).forEach(function (queryRes) {
                                if (!queryRes.series) {
                                    return;
                                }
                                queryRes.series.forEach(function (series) {
                                    var timeSerie = {
                                        target: series.name,
                                        datapoints: series.points,
                                        refId: queryRes.refId,
                                        meta: queryRes.meta,
                                    };
                                    result.push(toDataFrame(timeSerie));
                                });
                            });
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    AzureMonitorDatasource.prototype.annotationQuery = function (options) { };
    AzureMonitorDatasource.prototype.metricFindQuery = function (query) {
        var subscriptionsQuery = query.match(/^Subscriptions\(\)/i);
        if (subscriptionsQuery) {
            return this.getSubscriptions();
        }
        var resourceGroupsQuery = query.match(/^ResourceGroups\(\)/i);
        if (resourceGroupsQuery) {
            return this.getResourceGroups(this.subscriptionId);
        }
        var resourceGroupsQueryWithSub = query.match(/^ResourceGroups\(([^\)]+?)(,\s?([^,]+?))?\)/i);
        if (resourceGroupsQueryWithSub) {
            return this.getResourceGroups(this.toVariable(resourceGroupsQueryWithSub[1]));
        }
        var metricDefinitionsQuery = query.match(/^Namespaces\(([^\)]+?)(,\s?([^,]+?))?\)/i);
        if (metricDefinitionsQuery) {
            if (!metricDefinitionsQuery[3]) {
                return this.getMetricDefinitions(this.subscriptionId, this.toVariable(metricDefinitionsQuery[1]));
            }
        }
        var metricDefinitionsQueryWithSub = query.match(/^Namespaces\(([^,]+?),\s?([^,]+?)\)/i);
        if (metricDefinitionsQueryWithSub) {
            return this.getMetricDefinitions(this.toVariable(metricDefinitionsQueryWithSub[1]), this.toVariable(metricDefinitionsQueryWithSub[2]));
        }
        var resourceNamesQuery = query.match(/^ResourceNames\(([^,]+?),\s?([^,]+?)\)/i);
        if (resourceNamesQuery) {
            var resourceGroup = this.toVariable(resourceNamesQuery[1]);
            var metricDefinition = this.toVariable(resourceNamesQuery[2]);
            return this.getResourceNames(this.subscriptionId, resourceGroup, metricDefinition);
        }
        var resourceNamesQueryWithSub = query.match(/^ResourceNames\(([^,]+?),\s?([^,]+?),\s?(.+?)\)/i);
        if (resourceNamesQueryWithSub) {
            var subscription = this.toVariable(resourceNamesQueryWithSub[1]);
            var resourceGroup = this.toVariable(resourceNamesQueryWithSub[2]);
            var metricDefinition = this.toVariable(resourceNamesQueryWithSub[3]);
            return this.getResourceNames(subscription, resourceGroup, metricDefinition);
        }
        var metricNamespaceQuery = query.match(/^MetricNamespace\(([^,]+?),\s?([^,]+?),\s?([^,]+?)\)/i);
        if (metricNamespaceQuery) {
            var resourceGroup = this.toVariable(metricNamespaceQuery[1]);
            var metricDefinition = this.toVariable(metricNamespaceQuery[2]);
            var resourceName = this.toVariable(metricNamespaceQuery[3]);
            return this.getMetricNamespaces(this.subscriptionId, resourceGroup, metricDefinition, resourceName);
        }
        var metricNamespaceQueryWithSub = query.match(/^metricnamespace\(([^,]+?),\s?([^,]+?),\s?([^,]+?),\s?([^,]+?)\)/i);
        if (metricNamespaceQueryWithSub) {
            var subscription = this.toVariable(metricNamespaceQueryWithSub[1]);
            var resourceGroup = this.toVariable(metricNamespaceQueryWithSub[2]);
            var metricDefinition = this.toVariable(metricNamespaceQueryWithSub[3]);
            var resourceName = this.toVariable(metricNamespaceQueryWithSub[4]);
            console.log(metricNamespaceQueryWithSub);
            return this.getMetricNamespaces(subscription, resourceGroup, metricDefinition, resourceName);
        }
        var metricNamesQuery = query.match(/^MetricNames\(([^,]+?),\s?([^,]+?),\s?([^,]+?),\s?([^,]+?)\)/i);
        if (metricNamesQuery) {
            if (metricNamesQuery[3].indexOf(',') === -1) {
                var resourceGroup = this.toVariable(metricNamesQuery[1]);
                var metricDefinition = this.toVariable(metricNamesQuery[2]);
                var resourceName = this.toVariable(metricNamesQuery[3]);
                var metricNamespace = this.toVariable(metricNamesQuery[4]);
                return this.getMetricNames(this.subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace);
            }
        }
        var metricNamesQueryWithSub = query.match(/^MetricNames\(([^,]+?),\s?([^,]+?),\s?([^,]+?),\s?([^,]+?),\s?(.+?)\)/i);
        if (metricNamesQueryWithSub) {
            var subscription = this.toVariable(metricNamesQueryWithSub[1]);
            var resourceGroup = this.toVariable(metricNamesQueryWithSub[2]);
            var metricDefinition = this.toVariable(metricNamesQueryWithSub[3]);
            var resourceName = this.toVariable(metricNamesQueryWithSub[4]);
            var metricNamespace = this.toVariable(metricNamesQueryWithSub[5]);
            return this.getMetricNames(subscription, resourceGroup, metricDefinition, resourceName, metricNamespace);
        }
        return undefined;
    };
    AzureMonitorDatasource.prototype.toVariable = function (metric) {
        return this.templateSrv.replace((metric || '').trim());
    };
    AzureMonitorDatasource.prototype.getSubscriptions = function (route) {
        var url = "/" + (route || this.cloudName) + "/subscriptions?api-version=2019-03-01";
        return this.doRequest(url).then(function (result) {
            return ResponseParser.parseSubscriptions(result);
        });
    };
    AzureMonitorDatasource.prototype.getResourceGroups = function (subscriptionId) {
        var url = this.baseUrl + "/" + subscriptionId + "/resourceGroups?api-version=" + this.apiVersion;
        return this.doRequest(url).then(function (result) {
            return ResponseParser.parseResponseValues(result, 'name', 'name');
        });
    };
    AzureMonitorDatasource.prototype.getMetricDefinitions = function (subscriptionId, resourceGroup) {
        var _this = this;
        var url = this.baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/resources?api-version=" + this.apiVersion;
        return this.doRequest(url)
            .then(function (result) {
            return ResponseParser.parseResponseValues(result, 'type', 'type');
        })
            .then(function (result) {
            return _.filter(result, function (t) {
                for (var i = 0; i < _this.supportedMetricNamespaces.length; i++) {
                    if (t.value.toLowerCase() === _this.supportedMetricNamespaces[i].toLowerCase()) {
                        return true;
                    }
                }
                return false;
            });
        })
            .then(function (result) {
            var shouldHardcodeBlobStorage = false;
            for (var i = 0; i < result.length; i++) {
                if (result[i].value === 'Microsoft.Storage/storageAccounts') {
                    shouldHardcodeBlobStorage = true;
                    break;
                }
            }
            if (shouldHardcodeBlobStorage) {
                result.push({
                    text: 'Microsoft.Storage/storageAccounts/blobServices',
                    value: 'Microsoft.Storage/storageAccounts/blobServices',
                });
                result.push({
                    text: 'Microsoft.Storage/storageAccounts/fileServices',
                    value: 'Microsoft.Storage/storageAccounts/fileServices',
                });
                result.push({
                    text: 'Microsoft.Storage/storageAccounts/tableServices',
                    value: 'Microsoft.Storage/storageAccounts/tableServices',
                });
                result.push({
                    text: 'Microsoft.Storage/storageAccounts/queueServices',
                    value: 'Microsoft.Storage/storageAccounts/queueServices',
                });
            }
            return result;
        });
    };
    AzureMonitorDatasource.prototype.getResourceNames = function (subscriptionId, resourceGroup, metricDefinition) {
        var url = this.baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/resources?api-version=" + this.apiVersion;
        return this.doRequest(url).then(function (result) {
            if (!_.startsWith(metricDefinition, 'Microsoft.Storage/storageAccounts/')) {
                return ResponseParser.parseResourceNames(result, metricDefinition);
            }
            var list = ResponseParser.parseResourceNames(result, 'Microsoft.Storage/storageAccounts');
            for (var i = 0; i < list.length; i++) {
                list[i].text += '/default';
                list[i].value += '/default';
            }
            return list;
        });
    };
    AzureMonitorDatasource.prototype.getMetricNamespaces = function (subscriptionId, resourceGroup, metricDefinition, resourceName) {
        var url = UrlBuilder.buildAzureMonitorGetMetricNamespacesUrl(this.baseUrl, subscriptionId, resourceGroup, metricDefinition, resourceName, this.apiPreviewVersion);
        return this.doRequest(url).then(function (result) {
            return ResponseParser.parseResponseValues(result, 'name', 'properties.metricNamespaceName');
        });
    };
    AzureMonitorDatasource.prototype.getMetricNames = function (subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace) {
        var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl(this.baseUrl, subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, this.apiVersion);
        return this.doRequest(url).then(function (result) {
            return ResponseParser.parseResponseValues(result, 'name.localizedValue', 'name.value');
        });
    };
    AzureMonitorDatasource.prototype.getMetricMetadata = function (subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, metricName) {
        var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl(this.baseUrl, subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, this.apiVersion);
        return this.doRequest(url).then(function (result) {
            return ResponseParser.parseMetadata(result, metricName);
        });
    };
    AzureMonitorDatasource.prototype.testDatasource = function () {
        if (!this.isValidConfigField(this.instanceSettings.jsonData.tenantId)) {
            return {
                status: 'error',
                message: 'The Tenant Id field is required.',
            };
        }
        if (!this.isValidConfigField(this.instanceSettings.jsonData.clientId)) {
            return {
                status: 'error',
                message: 'The Client Id field is required.',
            };
        }
        var url = "/" + this.cloudName + "/subscriptions?api-version=2019-03-01";
        return this.doRequest(url)
            .then(function (response) {
            if (response.status === 200) {
                return {
                    status: 'success',
                    message: 'Successfully queried the Azure Monitor service.',
                    title: 'Success',
                };
            }
            return {
                status: 'error',
                message: 'Returned http status code ' + response.status,
            };
        })
            .catch(function (error) {
            var message = 'Azure Monitor: ';
            message += error.statusText ? error.statusText + ': ' : '';
            if (error.data && error.data.error && error.data.error.code) {
                message += error.data.error.code + '. ' + error.data.error.message;
            }
            else if (error.data && error.data.error) {
                message += error.data.error;
            }
            else if (error.data) {
                message += error.data;
            }
            else {
                message += 'Cannot connect to Azure Monitor REST API.';
            }
            return {
                status: 'error',
                message: message,
            };
        });
    };
    AzureMonitorDatasource.prototype.isValidConfigField = function (field) {
        return field && field.length > 0;
    };
    AzureMonitorDatasource.prototype.doRequest = function (url, maxRetries) {
        var _this = this;
        if (maxRetries === void 0) { maxRetries = 1; }
        return this.backendSrv
            .datasourceRequest({
            url: this.url + url,
            method: 'GET',
        })
            .catch(function (error) {
            if (maxRetries > 0) {
                return _this.doRequest(url, maxRetries - 1);
            }
            throw error;
        });
    };
    return AzureMonitorDatasource;
}());
export default AzureMonitorDatasource;
//# sourceMappingURL=azure_monitor_datasource.js.map
import * as tslib_1 from "tslib";
import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';
// import './css/query_editor.css';
import TimegrainConverter from './time_grain_converter';
import './editor/editor_component';
import kbn from 'app/core/utils/kbn';
var AzureMonitorQueryCtrl = /** @class */ (function (_super) {
    tslib_1.__extends(AzureMonitorQueryCtrl, _super);
    /** @ngInject */
    function AzureMonitorQueryCtrl($scope, $injector, templateSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.templateSrv = templateSrv;
        _this.defaultDropdownValue = 'select';
        _this.defaults = {
            queryType: 'Azure Monitor',
            azureMonitor: {
                resourceGroup: _this.defaultDropdownValue,
                metricDefinition: _this.defaultDropdownValue,
                resourceName: _this.defaultDropdownValue,
                metricNamespace: _this.defaultDropdownValue,
                metricName: _this.defaultDropdownValue,
                dimensionFilter: '*',
                timeGrain: 'auto',
            },
            azureLogAnalytics: {
                query: [
                    '//change this example to create your own time series query',
                    '<table name>                                                              ' +
                        '//the table to query (e.g. Usage, Heartbeat, Perf)',
                    '| where $__timeFilter(TimeGenerated)                                      ' +
                        '//this is a macro used to show the full chart’s time range, choose the datetime column here',
                    '| summarize count() by <group by column>, bin(TimeGenerated, $__interval) ' +
                        '//change “group by column” to a column in your table, such as “Computer”. ' +
                        'The $__interval macro is used to auto-select the time grain. Can also use 1h, 5m etc.',
                    '| order by TimeGenerated asc',
                ].join('\n'),
                resultFormat: 'time_series',
                workspace: _this.datasource && _this.datasource.azureLogAnalyticsDatasource
                    ? _this.datasource.azureLogAnalyticsDatasource.defaultOrFirstWorkspace
                    : '',
            },
            appInsights: {
                metricName: _this.defaultDropdownValue,
                rawQuery: false,
                rawQueryString: '',
                groupBy: 'none',
                timeGrainType: 'auto',
                xaxis: 'timestamp',
                yaxis: '',
                spliton: '',
            },
        };
        /* Azure Log Analytics */
        _this.getWorkspaces = function () {
            return _this.datasource.azureLogAnalyticsDatasource
                .getWorkspaces(_this.target.subscription)
                .then(function (list) {
                _this.workspaces = list;
                if (list.length > 0 && !_this.target.azureLogAnalytics.workspace) {
                    _this.target.azureLogAnalytics.workspace = list[0].value;
                }
            })
                .catch(_this.handleQueryCtrlError.bind(_this));
        };
        _this.getAzureLogAnalyticsSchema = function () {
            return _this.getWorkspaces()
                .then(function () {
                return _this.datasource.azureLogAnalyticsDatasource.getSchema(_this.target.azureLogAnalytics.workspace);
            })
                .catch(_this.handleQueryCtrlError.bind(_this));
        };
        _this.onLogAnalyticsQueryChange = function (nextQuery) {
            _this.target.azureLogAnalytics.query = nextQuery;
        };
        _this.onLogAnalyticsQueryExecute = function () {
            _this.panelCtrl.refresh();
        };
        _this.onAppInsightsQueryChange = function (nextQuery) {
            _this.target.appInsights.rawQueryString = nextQuery;
        };
        _this.onAppInsightsQueryExecute = function () {
            return _this.refresh();
        };
        _this.getAppInsightsQuerySchema = function () {
            return _this.datasource.appInsightsDatasource.getQuerySchema().catch(_this.handleQueryCtrlError.bind(_this));
        };
        _.defaultsDeep(_this.target, _this.defaults);
        _this.migrateTimeGrains();
        _this.migrateToFromTimes();
        _this.migrateToDefaultNamespace();
        _this.panelCtrl.events.on('data-received', _this.onDataReceived.bind(_this), $scope);
        _this.panelCtrl.events.on('data-error', _this.onDataError.bind(_this), $scope);
        _this.resultFormats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];
        _this.getSubscriptions();
        if (_this.target.queryType === 'Azure Log Analytics') {
            _this.getWorkspaces();
        }
        return _this;
    }
    AzureMonitorQueryCtrl.prototype.onDataReceived = function (dataList) {
        this.lastQueryError = undefined;
        this.lastQuery = '';
        var anySeriesFromQuery = _.find(dataList, { refId: this.target.refId });
        if (anySeriesFromQuery && anySeriesFromQuery.meta) {
            this.lastQuery = anySeriesFromQuery.meta.query;
        }
    };
    AzureMonitorQueryCtrl.prototype.onDataError = function (err) {
        this.handleQueryCtrlError(err);
    };
    AzureMonitorQueryCtrl.prototype.handleQueryCtrlError = function (err) {
        if (err.query && err.query.refId && err.query.refId !== this.target.refId) {
            return;
        }
        if (err.error && err.error.data && err.error.data.error && err.error.data.error.innererror) {
            if (err.error.data.error.innererror.innererror) {
                this.lastQueryError = err.error.data.error.innererror.innererror.message;
            }
            else {
                this.lastQueryError = err.error.data.error.innererror.message;
            }
        }
        else if (err.error && err.error.data && err.error.data.error) {
            this.lastQueryError = err.error.data.error.message;
        }
        else if (err.error && err.error.data) {
            this.lastQueryError = err.error.data.message;
        }
        else if (err.data && err.data.error) {
            this.lastQueryError = err.data.error.message;
        }
        else if (err.data && err.data.message) {
            this.lastQueryError = err.data.message;
        }
        else {
            this.lastQueryError = err;
        }
    };
    AzureMonitorQueryCtrl.prototype.migrateTimeGrains = function () {
        if (this.target.azureMonitor.timeGrainUnit) {
            if (this.target.azureMonitor.timeGrain !== 'auto') {
                this.target.azureMonitor.timeGrain = TimegrainConverter.createISO8601Duration(this.target.azureMonitor.timeGrain, this.target.azureMonitor.timeGrainUnit);
            }
            delete this.target.azureMonitor.timeGrainUnit;
            this.onMetricNameChange();
        }
        if (this.target.azureMonitor.timeGrains &&
            this.target.azureMonitor.timeGrains.length > 0 &&
            (!this.target.azureMonitor.allowedTimeGrainsMs || this.target.azureMonitor.allowedTimeGrainsMs.length === 0)) {
            this.target.azureMonitor.allowedTimeGrainsMs = this.convertTimeGrainsToMs(this.target.azureMonitor.timeGrains);
        }
    };
    AzureMonitorQueryCtrl.prototype.migrateToFromTimes = function () {
        this.target.azureLogAnalytics.query = this.target.azureLogAnalytics.query.replace(/\$__from\s/gi, '$__timeFrom() ');
        this.target.azureLogAnalytics.query = this.target.azureLogAnalytics.query.replace(/\$__to\s/gi, '$__timeTo() ');
    };
    AzureMonitorQueryCtrl.prototype.migrateToDefaultNamespace = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (this.target.azureMonitor.metricNamespace &&
                    this.target.azureMonitor.metricNamespace !== this.defaultDropdownValue &&
                    this.target.azureMonitor.metricDefinition) {
                    return [2 /*return*/];
                }
                this.target.azureMonitor.metricNamespace = this.target.azureMonitor.metricDefinition;
                return [2 /*return*/];
            });
        });
    };
    AzureMonitorQueryCtrl.prototype.replace = function (variable) {
        return this.templateSrv.replace(variable, this.panelCtrl.panel.scopedVars);
    };
    AzureMonitorQueryCtrl.prototype.onQueryTypeChange = function () {
        if (this.target.queryType === 'Azure Log Analytics') {
            return this.getWorkspaces();
        }
    };
    AzureMonitorQueryCtrl.prototype.getSubscriptions = function () {
        var _this = this;
        if (!this.datasource.azureMonitorDatasource.isConfigured()) {
            return;
        }
        return this.datasource.azureMonitorDatasource.getSubscriptions().then(function (subs) {
            _this.subscriptions = subs;
            if (!_this.target.subscription && _this.target.queryType === 'Azure Monitor') {
                _this.target.subscription = _this.datasource.azureMonitorDatasource.subscriptionId;
            }
            else if (!_this.target.subscription && _this.target.queryType === 'Azure Log Analytics') {
                _this.target.subscription = _this.datasource.azureLogAnalyticsDatasource.logAnalyticsSubscriptionId;
            }
            if (!_this.target.subscription && _this.subscriptions.length > 0) {
                _this.target.subscription = _this.subscriptions[0].value;
            }
            return _this.subscriptions;
        });
    };
    AzureMonitorQueryCtrl.prototype.onSubscriptionChange = function () {
        if (this.target.queryType === 'Azure Log Analytics') {
            return this.getWorkspaces();
        }
        if (this.target.queryType === 'Azure Monitor') {
            this.target.azureMonitor.resourceGroup = this.defaultDropdownValue;
            this.target.azureMonitor.metricDefinition = this.defaultDropdownValue;
            this.target.azureMonitor.resourceName = this.defaultDropdownValue;
            this.target.azureMonitor.metricName = this.defaultDropdownValue;
            this.target.azureMonitor.aggregation = '';
            this.target.azureMonitor.timeGrains = [];
            this.target.azureMonitor.timeGrain = '';
            this.target.azureMonitor.dimensions = [];
            this.target.azureMonitor.dimension = '';
        }
    };
    /* Azure Monitor Section */
    AzureMonitorQueryCtrl.prototype.getResourceGroups = function (query) {
        if (this.target.queryType !== 'Azure Monitor' || !this.datasource.azureMonitorDatasource.isConfigured()) {
            return;
        }
        return this.datasource
            .getResourceGroups(this.replace(this.target.subscription || this.datasource.azureMonitorDatasource.subscriptionId))
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getMetricDefinitions = function (query) {
        if (this.target.queryType !== 'Azure Monitor' ||
            !this.target.azureMonitor.resourceGroup ||
            this.target.azureMonitor.resourceGroup === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getMetricDefinitions(this.replace(this.target.subscription || this.datasource.azureMonitorDatasource.subscriptionId), this.replace(this.target.azureMonitor.resourceGroup))
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getResourceNames = function (query) {
        if (this.target.queryType !== 'Azure Monitor' ||
            !this.target.azureMonitor.resourceGroup ||
            this.target.azureMonitor.resourceGroup === this.defaultDropdownValue ||
            !this.target.azureMonitor.metricDefinition ||
            this.target.azureMonitor.metricDefinition === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getResourceNames(this.replace(this.target.subscription || this.datasource.azureMonitorDatasource.subscriptionId), this.replace(this.target.azureMonitor.resourceGroup), this.replace(this.target.azureMonitor.metricDefinition))
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getMetricNamespaces = function () {
        if (this.target.queryType !== 'Azure Monitor' ||
            !this.target.azureMonitor.resourceGroup ||
            this.target.azureMonitor.resourceGroup === this.defaultDropdownValue ||
            !this.target.azureMonitor.metricDefinition ||
            this.target.azureMonitor.metricDefinition === this.defaultDropdownValue ||
            !this.target.azureMonitor.resourceName ||
            this.target.azureMonitor.resourceName === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getMetricNamespaces(this.replace(this.target.subscription || this.datasource.azureMonitorDatasource.subscriptionId), this.replace(this.target.azureMonitor.resourceGroup), this.replace(this.target.azureMonitor.metricDefinition), this.replace(this.target.azureMonitor.resourceName))
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getMetricNames = function () {
        if (this.target.queryType !== 'Azure Monitor' ||
            !this.target.azureMonitor.resourceGroup ||
            this.target.azureMonitor.resourceGroup === this.defaultDropdownValue ||
            !this.target.azureMonitor.metricDefinition ||
            this.target.azureMonitor.metricDefinition === this.defaultDropdownValue ||
            !this.target.azureMonitor.resourceName ||
            this.target.azureMonitor.resourceName === this.defaultDropdownValue ||
            !this.target.azureMonitor.metricNamespace ||
            this.target.azureMonitor.metricNamespace === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getMetricNames(this.replace(this.target.subscription || this.datasource.azureMonitorDatasource.subscriptionId), this.replace(this.target.azureMonitor.resourceGroup), this.replace(this.target.azureMonitor.metricDefinition), this.replace(this.target.azureMonitor.resourceName), this.replace(this.target.azureMonitor.metricNamespace))
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.onResourceGroupChange = function () {
        this.target.azureMonitor.metricDefinition = this.defaultDropdownValue;
        this.target.azureMonitor.resourceName = this.defaultDropdownValue;
        this.target.azureMonitor.metricNamespace = this.defaultDropdownValue;
        this.target.azureMonitor.metricName = this.defaultDropdownValue;
        this.target.azureMonitor.aggregation = '';
        this.target.azureMonitor.timeGrains = [];
        this.target.azureMonitor.timeGrain = '';
        this.target.azureMonitor.dimensions = [];
        this.target.azureMonitor.dimension = '';
        this.refresh();
    };
    AzureMonitorQueryCtrl.prototype.onMetricDefinitionChange = function () {
        this.target.azureMonitor.resourceName = this.defaultDropdownValue;
        this.target.azureMonitor.metricNamespace = this.defaultDropdownValue;
        this.target.azureMonitor.metricName = this.defaultDropdownValue;
        this.target.azureMonitor.aggregation = '';
        this.target.azureMonitor.timeGrains = [];
        this.target.azureMonitor.timeGrain = '';
        this.target.azureMonitor.dimensions = [];
        this.target.azureMonitor.dimension = '';
    };
    AzureMonitorQueryCtrl.prototype.onResourceNameChange = function () {
        this.target.azureMonitor.metricNamespace = this.defaultDropdownValue;
        this.target.azureMonitor.metricName = this.defaultDropdownValue;
        this.target.azureMonitor.aggregation = '';
        this.target.azureMonitor.timeGrains = [];
        this.target.azureMonitor.timeGrain = '';
        this.target.azureMonitor.dimensions = [];
        this.target.azureMonitor.dimension = '';
        this.refresh();
    };
    AzureMonitorQueryCtrl.prototype.onMetricNamespacesChange = function () {
        this.target.azureMonitor.metricName = this.defaultDropdownValue;
        this.target.azureMonitor.dimensions = [];
        this.target.azureMonitor.dimension = '';
    };
    AzureMonitorQueryCtrl.prototype.onMetricNameChange = function () {
        var _this = this;
        if (!this.target.azureMonitor.metricName || this.target.azureMonitor.metricName === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getMetricMetadata(this.replace(this.target.subscription), this.replace(this.target.azureMonitor.resourceGroup), this.replace(this.target.azureMonitor.metricDefinition), this.replace(this.target.azureMonitor.resourceName), this.replace(this.target.azureMonitor.metricNamespace), this.replace(this.target.azureMonitor.metricName))
            .then(function (metadata) {
            _this.target.azureMonitor.aggOptions = metadata.supportedAggTypes || [metadata.primaryAggType];
            _this.target.azureMonitor.aggregation = metadata.primaryAggType;
            _this.target.azureMonitor.timeGrains = [{ text: 'auto', value: 'auto' }].concat(metadata.supportedTimeGrains);
            _this.target.azureMonitor.timeGrain = 'auto';
            _this.target.azureMonitor.allowedTimeGrainsMs = _this.convertTimeGrainsToMs(metadata.supportedTimeGrains || []);
            _this.target.azureMonitor.dimensions = metadata.dimensions;
            if (metadata.dimensions.length > 0) {
                _this.target.azureMonitor.dimension = metadata.dimensions[0].value;
            }
            return _this.refresh();
        })
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.convertTimeGrainsToMs = function (timeGrains) {
        var allowedTimeGrainsMs = [];
        timeGrains.forEach(function (tg) {
            if (tg.value !== 'auto') {
                allowedTimeGrainsMs.push(kbn.interval_to_ms(TimegrainConverter.createKbnUnitFromISO8601Duration(tg.value)));
            }
        });
        return allowedTimeGrainsMs;
    };
    AzureMonitorQueryCtrl.prototype.getAutoInterval = function () {
        if (this.target.azureMonitor.timeGrain === 'auto') {
            return TimegrainConverter.findClosestTimeGrain(this.templateSrv.getBuiltInIntervalValue(), _.map(this.target.azureMonitor.timeGrains, function (o) {
                return TimegrainConverter.createKbnUnitFromISO8601Duration(o.value);
            }) || ['1m', '5m', '15m', '30m', '1h', '6h', '12h', '1d']);
        }
        return '';
    };
    Object.defineProperty(AzureMonitorQueryCtrl.prototype, "templateVariables", {
        get: function () {
            return this.templateSrv.variables.map(function (t) { return '$' + t.name; });
        },
        enumerable: true,
        configurable: true
    });
    /* Application Insights Section */
    AzureMonitorQueryCtrl.prototype.getAppInsightsAutoInterval = function () {
        var interval = this.templateSrv.getBuiltInIntervalValue();
        if (interval[interval.length - 1] === 's') {
            return '1m';
        }
        return interval;
    };
    AzureMonitorQueryCtrl.prototype.getAppInsightsMetricNames = function () {
        if (!this.datasource.appInsightsDatasource.isConfigured()) {
            return;
        }
        return this.datasource.getAppInsightsMetricNames().catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getAppInsightsColumns = function () {
        return this.datasource.getAppInsightsColumns(this.target.refId);
    };
    AzureMonitorQueryCtrl.prototype.onAppInsightsColumnChange = function () {
        return this.refresh();
    };
    AzureMonitorQueryCtrl.prototype.onAppInsightsMetricNameChange = function () {
        var _this = this;
        if (!this.target.appInsights.metricName || this.target.appInsights.metricName === this.defaultDropdownValue) {
            return;
        }
        return this.datasource
            .getAppInsightsMetricMetadata(this.replace(this.target.appInsights.metricName))
            .then(function (aggData) {
            _this.target.appInsights.aggOptions = aggData.supportedAggTypes;
            _this.target.appInsights.groupByOptions = aggData.supportedGroupBy;
            _this.target.appInsights.aggregation = aggData.primaryAggType;
            return _this.refresh();
        })
            .catch(this.handleQueryCtrlError.bind(this));
    };
    AzureMonitorQueryCtrl.prototype.getAppInsightsGroupBySegments = function (query) {
        return _.map(this.target.appInsights.groupByOptions, function (option) {
            return { text: option, value: option };
        });
    };
    AzureMonitorQueryCtrl.prototype.resetAppInsightsGroupBy = function () {
        this.target.appInsights.groupBy = 'none';
        this.refresh();
    };
    AzureMonitorQueryCtrl.prototype.updateTimeGrainType = function () {
        if (this.target.appInsights.timeGrainType === 'specific') {
            this.target.appInsights.timeGrain = '1';
            this.target.appInsights.timeGrainUnit = 'minute';
        }
        else {
            this.target.appInsights.timeGrain = '';
        }
        this.refresh();
    };
    AzureMonitorQueryCtrl.prototype.toggleEditorMode = function () {
        this.target.appInsights.rawQuery = !this.target.appInsights.rawQuery;
    };
    AzureMonitorQueryCtrl.templateUrl = 'partials/query.editor.html';
    return AzureMonitorQueryCtrl;
}(QueryCtrl));
export { AzureMonitorQueryCtrl };
//# sourceMappingURL=query_ctrl.js.map
import { __awaiter, __extends, __generator } from "tslib";
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import { PanelCtrl } from 'app/features/panel/panel_ctrl';
import { getExploreUrl } from 'app/core/utils/explore';
import { applyPanelTimeOverrides, getResolution } from 'app/features/dashboard/utils/panel';
import { toLegacyResponseData, LoadingState, toDataFrameDTO } from '@grafana/data';
var MetricsPanelCtrl = /** @class */ (function (_super) {
    __extends(MetricsPanelCtrl, _super);
    function MetricsPanelCtrl($scope, $injector) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.useDataFrames = false;
        // Updates the response with information from the stream
        _this.panelDataObserver = {
            next: function (data) {
                if (data.state === LoadingState.Error) {
                    _this.loading = false;
                    _this.processDataError(data.error);
                    return;
                }
                // Ignore data in loading state
                if (data.state === LoadingState.Loading) {
                    _this.loading = true;
                    return;
                }
                if (data.request) {
                    var timeInfo = data.request.timeInfo;
                    if (timeInfo) {
                        _this.timeInfo = timeInfo;
                    }
                }
                if (data.timeRange) {
                    _this.range = data.timeRange;
                }
                if (_this.useDataFrames) {
                    _this.handleDataFrames(data.series);
                }
                else {
                    // Make the results look as if they came directly from a <6.2 datasource request
                    var legacy = data.series.map(function (v) { return toLegacyResponseData(v); });
                    _this.handleQueryResult({ data: legacy });
                }
            },
        };
        _this.$q = $injector.get('$q');
        _this.contextSrv = $injector.get('contextSrv');
        _this.datasourceSrv = $injector.get('datasourceSrv');
        _this.timeSrv = $injector.get('timeSrv');
        _this.templateSrv = $injector.get('templateSrv');
        _this.scope = $scope;
        _this.panel.datasource = _this.panel.datasource || null;
        _this.events.on('refresh', _this.onMetricsPanelRefresh.bind(_this));
        _this.events.on('panel-teardown', _this.onPanelTearDown.bind(_this));
        return _this;
    }
    MetricsPanelCtrl.prototype.onPanelTearDown = function () {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
            this.querySubscription = null;
        }
    };
    MetricsPanelCtrl.prototype.onMetricsPanelRefresh = function () {
        var _this = this;
        // ignore fetching data if another panel is in fullscreen
        if (this.otherPanelInFullscreenMode()) {
            return;
        }
        // if we have snapshot data use that
        if (this.panel.snapshotData) {
            this.updateTimeRange();
            var data_1 = this.panel.snapshotData;
            // backward compatibility
            if (!_.isArray(data_1)) {
                data_1 = data_1.data;
            }
            // Defer panel rendering till the next digest cycle.
            // For some reason snapshot panels don't init at this time, so this helps to avoid rendering issues.
            return this.$timeout(function () {
                _this.events.emit('data-snapshot-load', data_1);
            });
        }
        // clear loading/error state
        delete this.error;
        this.loading = true;
        // load datasource service
        return this.datasourceSrv
            .get(this.panel.datasource, this.panel.scopedVars)
            .then(this.updateTimeRange.bind(this))
            .then(this.issueQueries.bind(this))
            .catch(function (err) {
            _this.processDataError(err);
        });
    };
    MetricsPanelCtrl.prototype.processDataError = function (err) {
        var _this = this;
        // if canceled  keep loading set to true
        if (err.cancelled) {
            console.log('Panel request cancelled', err);
            return;
        }
        this.loading = false;
        this.error = err.message || 'Request Error';
        this.inspector = { error: err };
        if (err.data) {
            if (err.data.message) {
                this.error = err.data.message;
            }
            if (err.data.error) {
                this.error = err.data.error;
            }
        }
        console.log('Panel data error:', err);
        return this.$timeout(function () {
            _this.events.emit('data-error', err);
        });
    };
    MetricsPanelCtrl.prototype.updateTimeRange = function (datasource) {
        this.datasource = datasource || this.datasource;
        this.range = this.timeSrv.timeRange();
        this.resolution = getResolution(this.panel);
        var newTimeData = applyPanelTimeOverrides(this.panel, this.range);
        this.timeInfo = newTimeData.timeInfo;
        this.range = newTimeData.timeRange;
        this.calculateInterval();
        return this.datasource;
    };
    MetricsPanelCtrl.prototype.calculateInterval = function () {
        var intervalOverride = this.panel.interval;
        // if no panel interval check datasource
        if (intervalOverride) {
            intervalOverride = this.templateSrv.replace(intervalOverride, this.panel.scopedVars);
        }
        else if (this.datasource && this.datasource.interval) {
            intervalOverride = this.datasource.interval;
        }
        var res = kbn.calculateInterval(this.range, this.resolution, intervalOverride);
        this.interval = res.interval;
        this.intervalMs = res.intervalMs;
    };
    MetricsPanelCtrl.prototype.issueQueries = function (datasource) {
        this.datasource = datasource;
        var panel = this.panel;
        var queryRunner = panel.getQueryRunner();
        if (!this.querySubscription) {
            this.querySubscription = queryRunner.getData().subscribe(this.panelDataObserver);
        }
        return queryRunner.run({
            datasource: panel.datasource,
            queries: panel.targets,
            panelId: panel.id,
            dashboardId: this.dashboard.id,
            timezone: this.dashboard.timezone,
            timeRange: this.range,
            widthPixels: this.resolution,
            maxDataPoints: panel.maxDataPoints,
            minInterval: panel.interval,
            scopedVars: panel.scopedVars,
            cacheTimeout: panel.cacheTimeout,
            transformations: panel.transformations,
        });
    };
    MetricsPanelCtrl.prototype.handleDataFrames = function (data) {
        this.loading = false;
        if (this.dashboard && this.dashboard.snapshot) {
            this.panel.snapshotData = data.map(function (frame) { return toDataFrameDTO(frame); });
        }
        try {
            this.events.emit('data-frames-received', data);
        }
        catch (err) {
            this.processDataError(err);
        }
    };
    MetricsPanelCtrl.prototype.handleQueryResult = function (result) {
        this.loading = false;
        if (this.dashboard.snapshot) {
            this.panel.snapshotData = result.data;
        }
        if (!result || !result.data) {
            console.log('Data source query result invalid, missing data field:', result);
            result = { data: [] };
        }
        try {
            this.events.emit('data-received', result.data);
        }
        catch (err) {
            this.processDataError(err);
        }
    };
    MetricsPanelCtrl.prototype.getAdditionalMenuItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        items = [];
                        if (!(this.contextSrv.hasAccessToExplore() && this.datasource)) return [3 /*break*/, 2];
                        _b = (_a = items).push;
                        _c = {
                            text: 'Explore',
                            icon: 'gicon gicon-explore',
                            shortcut: 'x'
                        };
                        return [4 /*yield*/, getExploreUrl(this.panel, this.panel.targets, this.datasource, this.datasourceSrv, this.timeSrv)];
                    case 1:
                        _b.apply(_a, [(_c.href = _d.sent(),
                                _c)]);
                        _d.label = 2;
                    case 2: return [2 /*return*/, items];
                }
            });
        });
    };
    return MetricsPanelCtrl;
}(PanelCtrl));
export { MetricsPanelCtrl };
//# sourceMappingURL=metrics_panel_ctrl.js.map
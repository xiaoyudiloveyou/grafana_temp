import { __assign, __awaiter, __generator } from "tslib";
// Libraries
import { cloneDeep } from 'lodash';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
// Services & Utils
import { config } from 'app/core/config';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import kbn from 'app/core/utils/kbn';
import templateSrv from 'app/features/templating/template_srv';
import { runRequest, preProcessPanelData } from './runRequest';
import { runSharedRequest, isSharedDashboardQuery } from '../../../plugins/datasource/dashboard';
import { transformDataFrame } from '@grafana/data';
var counter = 100;
function getNextRequestId() {
    return 'Q' + counter++;
}
var PanelQueryRunner = /** @class */ (function () {
    function PanelQueryRunner() {
        this.subject = new ReplaySubject(1);
    }
    /**
     * Returns an observable that subscribes to the shared multi-cast subject (that reply last result).
     */
    PanelQueryRunner.prototype.getData = function (transform) {
        var _this = this;
        if (transform === void 0) { transform = true; }
        if (transform) {
            return this.subject.pipe(map(function (data) {
                if (_this.hasTransformations()) {
                    var newSeries = transformDataFrame(_this.transformations, data.series);
                    return __assign(__assign({}, data), { series: newSeries });
                }
                return data;
            }));
        }
        // Just pass it directly
        return this.subject.pipe();
    };
    PanelQueryRunner.prototype.hasTransformations = function () {
        return config.featureToggles.transformations && this.transformations && this.transformations.length > 0;
    };
    PanelQueryRunner.prototype.run = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var queries, timezone, datasource, panelId, dashboardId, timeRange, timeInfo, cacheTimeout, widthPixels, maxDataPoints, scopedVars, minInterval, request, ds_1, lowerIntervalLimit, norm, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queries = options.queries, timezone = options.timezone, datasource = options.datasource, panelId = options.panelId, dashboardId = options.dashboardId, timeRange = options.timeRange, timeInfo = options.timeInfo, cacheTimeout = options.cacheTimeout, widthPixels = options.widthPixels, maxDataPoints = options.maxDataPoints, scopedVars = options.scopedVars, minInterval = options.minInterval;
                        if (isSharedDashboardQuery(datasource)) {
                            this.pipeToSubject(runSharedRequest(options));
                            return [2 /*return*/];
                        }
                        request = {
                            requestId: getNextRequestId(),
                            timezone: timezone,
                            panelId: panelId,
                            dashboardId: dashboardId,
                            range: timeRange,
                            timeInfo: timeInfo,
                            interval: '',
                            intervalMs: 0,
                            targets: cloneDeep(queries),
                            maxDataPoints: maxDataPoints || widthPixels,
                            scopedVars: scopedVars || {},
                            cacheTimeout: cacheTimeout,
                            startTime: Date.now(),
                        };
                        // Add deprecated property
                        request.rangeRaw = timeRange.raw;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getDataSource(datasource, request.scopedVars)];
                    case 2:
                        ds_1 = _a.sent();
                        if (ds_1.meta && !ds_1.meta.hiddenQueries) {
                            request.targets = request.targets.filter(function (q) { return !q.hide; });
                        }
                        // Attach the datasource name to each query
                        request.targets = request.targets.map(function (query) {
                            if (!query.datasource) {
                                query.datasource = ds_1.name;
                            }
                            return query;
                        });
                        lowerIntervalLimit = minInterval ? templateSrv.replace(minInterval, request.scopedVars) : ds_1.interval;
                        norm = kbn.calculateInterval(timeRange, widthPixels, lowerIntervalLimit);
                        // make shallow copy of scoped vars,
                        // and add built in variables interval and interval_ms
                        request.scopedVars = Object.assign({}, request.scopedVars, {
                            __interval: { text: norm.interval, value: norm.interval },
                            __interval_ms: { text: norm.intervalMs.toString(), value: norm.intervalMs },
                        });
                        request.interval = norm.interval;
                        request.intervalMs = norm.intervalMs;
                        this.pipeToSubject(runRequest(ds_1, request));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log('PanelQueryRunner Error', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PanelQueryRunner.prototype.pipeToSubject = function (observable) {
        var _this = this;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = observable.subscribe({
            next: function (data) {
                _this.lastResult = preProcessPanelData(data, _this.lastResult);
                _this.subject.next(_this.lastResult);
            },
        });
    };
    PanelQueryRunner.prototype.setTransformations = function (transformations) {
        this.transformations = transformations;
    };
    /**
     * Called when the panel is closed
     */
    PanelQueryRunner.prototype.destroy = function () {
        // Tell anyone listening that we are done
        if (this.subject) {
            this.subject.complete();
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return PanelQueryRunner;
}());
export { PanelQueryRunner };
function getDataSource(datasource, scopedVars) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (datasource && datasource.query) {
                        return [2 /*return*/, datasource];
                    }
                    return [4 /*yield*/, getDatasourceSrv().get(datasource, scopedVars)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=PanelQueryRunner.js.map
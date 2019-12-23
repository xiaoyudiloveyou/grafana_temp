import { __assign, __awaiter, __extends, __generator, __read, __spread, __values } from "tslib";
// Libraries
import _ from 'lodash';
// Services & Utils
import { dateMath, DataFrameView, LoadingState, } from '@grafana/data';
import { addLabelToSelector } from 'app/plugins/datasource/prometheus/add_label_to_query';
import LanguageProvider from './language_provider';
import { logStreamToDataFrame } from './result_transformer';
import { formatQuery, parseQuery, getHighlighterExpressionsFromQuery } from './query_utils';
// Types
import { DataSourceApi, } from '@grafana/ui';
import { safeStringifyValue, convertToWebSocketUrl } from 'app/core/utils/explore';
import { LiveStreams } from './live_streams';
import { from, merge } from 'rxjs';
import { map, filter } from 'rxjs/operators';
export var DEFAULT_MAX_LINES = 1000;
var DEFAULT_QUERY_PARAMS = {
    direction: 'BACKWARD',
    limit: DEFAULT_MAX_LINES,
    regexp: '',
    query: '',
};
function serializeParams(data) {
    return Object.keys(data)
        .map(function (k) {
        var v = data[k];
        return encodeURIComponent(k) + '=' + encodeURIComponent(v);
    })
        .join('&');
}
var LokiDatasource = /** @class */ (function (_super) {
    __extends(LokiDatasource, _super);
    /** @ngInject */
    function LokiDatasource(instanceSettings, backendSrv, templateSrv) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.instanceSettings = instanceSettings;
        _this.backendSrv = backendSrv;
        _this.templateSrv = templateSrv;
        _this.streams = new LiveStreams();
        _this.processError = function (err, target) {
            var error = {
                message: 'Unknown error during query transaction. Please check JS console logs.',
                refId: target.refId,
            };
            if (err.data) {
                if (typeof err.data === 'string') {
                    error.message = err.data;
                }
                else if (err.data.error) {
                    error.message = safeStringifyValue(err.data.error);
                }
            }
            else if (err.message) {
                error.message = err.message;
            }
            else if (typeof err === 'string') {
                error.message = err;
            }
            error.status = err.status;
            error.statusText = err.statusText;
            return error;
        };
        _this.processResult = function (data, target) {
            var e_1, _a;
            var series = [];
            if (Object.keys(data).length === 0) {
                return series;
            }
            if (!data.streams) {
                return [logStreamToDataFrame(data, false, target.refId)];
            }
            data = data;
            try {
                for (var _b = __values(data.streams || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var stream = _c.value;
                    var dataFrame = logStreamToDataFrame(stream);
                    dataFrame.refId = target.refId;
                    dataFrame.meta = {
                        searchWords: getHighlighterExpressionsFromQuery(formatQuery(target.query, target.regexp)),
                        limit: _this.maxLines,
                    };
                    series.push(dataFrame);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return series;
        };
        _this.runLiveQuery = function (options, target) {
            var liveTarget = _this.prepareLiveTarget(target, options);
            var stream = _this.streams.getStream(liveTarget);
            return stream.pipe(map(function (data) {
                return {
                    data: data,
                    key: "loki-" + liveTarget.refId,
                    state: LoadingState.Streaming,
                };
            }));
        };
        _this.runQuery = function (options, target) {
            var query = _this.prepareQueryTarget(target, options);
            return from(_this._request('/api/prom/query', query).catch(function (err) {
                if (err.cancelled) {
                    return err;
                }
                var error = _this.processError(err, query);
                throw error;
            })).pipe(filter(function (response) { return (response.cancelled ? false : true); }), map(function (response) {
                var data = _this.processResult(response.data, query);
                return { data: data, key: query.refId };
            }));
        };
        _this.prepareLogRowContextQueryTarget = function (row, limit, direction) {
            var query = Object.keys(row.labels)
                .map(function (label) {
                return label + "=\"" + row.labels[label] + "\"";
            })
                .join(',');
            var contextTimeBuffer = 2 * 60 * 60 * 1000 * 1e6; // 2h buffer
            var timeEpochNs = row.timeEpochMs * 1e6;
            var commontTargetOptons = {
                limit: limit,
                query: "{" + query + "}",
                direction: direction,
            };
            if (direction === 'BACKWARD') {
                return __assign(__assign({}, commontTargetOptons), { start: timeEpochNs - contextTimeBuffer, end: row.timestamp, // using RFC3339Nano format to avoid precision loss
                    direction: direction });
            }
            else {
                return __assign(__assign({}, commontTargetOptons), { start: row.timestamp, end: timeEpochNs + contextTimeBuffer });
            }
        };
        _this.getLogRowContext = function (row, options) { return __awaiter(_this, void 0, void 0, function () {
            var target, series, reverse, result, _a, _b, stream, e_2, error;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        target = this.prepareLogRowContextQueryTarget(row, (options && options.limit) || 10, (options && options.direction) || 'BACKWARD');
                        series = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        reverse = options && options.direction === 'FORWARD';
                        return [4 /*yield*/, this._request('/api/prom/query', target)];
                    case 2:
                        result = _d.sent();
                        if (result.data) {
                            try {
                                for (_a = __values(result.data.streams || []), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    stream = _b.value;
                                    series.push(logStreamToDataFrame(stream, reverse));
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                        return [2 /*return*/, {
                                data: series,
                            }];
                    case 3:
                        e_2 = _d.sent();
                        error = {
                            message: 'Error during context query. Please check JS console logs.',
                            status: e_2.status,
                            statusText: e_2.statusText,
                        };
                        throw error;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.languageProvider = new LanguageProvider(_this);
        var settingsData = instanceSettings.jsonData || {};
        _this.maxLines = parseInt(settingsData.maxLines, 10) || DEFAULT_MAX_LINES;
        return _this;
    }
    LokiDatasource.prototype._request = function (apiUrl, data, options) {
        var baseUrl = this.instanceSettings.url;
        var params = data ? serializeParams(data) : '';
        var url = "" + baseUrl + apiUrl + "?" + params;
        var req = __assign(__assign({}, options), { url: url });
        return this.backendSrv.datasourceRequest(req);
    };
    LokiDatasource.prototype.prepareLiveTarget = function (target, options) {
        var interpolated = this.templateSrv.replace(target.expr);
        var _a = parseQuery(interpolated), query = _a.query, regexp = _a.regexp;
        var refId = target.refId;
        var baseUrl = this.instanceSettings.url;
        var params = serializeParams({ query: query, regexp: regexp });
        var url = convertToWebSocketUrl(baseUrl + "/api/prom/tail?" + params);
        return {
            query: query,
            regexp: regexp,
            url: url,
            refId: refId,
            size: Math.min(options.maxDataPoints || Infinity, this.maxLines),
        };
    };
    LokiDatasource.prototype.prepareQueryTarget = function (target, options) {
        var interpolated = this.templateSrv.replace(target.expr);
        var _a = parseQuery(interpolated), query = _a.query, regexp = _a.regexp;
        var start = this.getTime(options.range.from, false);
        var end = this.getTime(options.range.to, true);
        var refId = target.refId;
        return __assign(__assign({}, DEFAULT_QUERY_PARAMS), { query: query,
            regexp: regexp,
            start: start,
            end: end, limit: Math.min(options.maxDataPoints || Infinity, this.maxLines), refId: refId });
    };
    LokiDatasource.prototype.query = function (options) {
        var _this = this;
        var subQueries = options.targets
            .filter(function (target) { return target.expr && !target.hide; })
            .map(function (target) {
            if (target.liveStreaming) {
                return _this.runLiveQuery(options, target);
            }
            return _this.runQuery(options, target);
        });
        return merge.apply(void 0, __spread(subQueries));
    };
    LokiDatasource.prototype.importQueries = function (queries, originMeta) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.languageProvider.importQueries(queries, originMeta.id)];
            });
        });
    };
    LokiDatasource.prototype.metadataRequest = function (url, params) {
        // HACK to get label values for {job=|}, will be replaced when implementing LokiQueryField
        var apiUrl = url.replace('v1', 'prom');
        return this._request(apiUrl, params, { silent: true }).then(function (res) {
            var data = { data: { data: res.data.values || [] } };
            return data;
        });
    };
    LokiDatasource.prototype.modifyQuery = function (query, action) {
        var parsed = parseQuery(query.expr || '');
        var selector = parsed.query;
        switch (action.type) {
            case 'ADD_FILTER': {
                selector = addLabelToSelector(selector, action.key, action.value);
                break;
            }
            default:
                break;
        }
        var expression = formatQuery(selector, parsed.regexp);
        return __assign(__assign({}, query), { expr: expression });
    };
    LokiDatasource.prototype.getHighlighterExpression = function (query) {
        return getHighlighterExpressionsFromQuery(query.expr);
    };
    LokiDatasource.prototype.getTime = function (date, roundUp) {
        if (_.isString(date)) {
            date = dateMath.parse(date, roundUp);
        }
        return Math.ceil(date.valueOf() * 1e6);
    };
    LokiDatasource.prototype.testDatasource = function () {
        // Consider only last 10 minutes otherwise request takes too long
        var startMs = Date.now() - 10 * 60 * 1000;
        var start = startMs + "000000"; // API expects nanoseconds
        return this._request('/api/prom/label', { start: start })
            .then(function (res) {
            if (res && res.data && res.data.values && res.data.values.length > 0) {
                return { status: 'success', message: 'Data source connected and labels found.' };
            }
            return {
                status: 'error',
                message: 'Data source connected, but no labels received. Verify that Loki and Promtail is configured properly.',
            };
        })
            .catch(function (err) {
            var message = 'Loki: ';
            if (err.statusText) {
                message += err.statusText;
            }
            else {
                message += 'Cannot connect to Loki';
            }
            if (err.status) {
                message += ". " + err.status;
            }
            if (err.data && err.data.message) {
                message += ". " + err.data.message;
            }
            else if (err.data) {
                message += ". " + err.data;
            }
            return { status: 'error', message: message };
        });
    };
    LokiDatasource.prototype.annotationQuery = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var request, data, annotations, _loop_1, data_1, data_1_1, frame;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!options.annotation.expr) {
                            return [2 /*return*/, []];
                        }
                        request = queryRequestFromAnnotationOptions(options);
                        return [4 /*yield*/, this.runQuery(request, request.targets[0]).toPromise()];
                    case 1:
                        data = (_b.sent()).data;
                        annotations = [];
                        _loop_1 = function (frame) {
                            var tags = Object.values(frame.labels);
                            var view = new DataFrameView(frame);
                            view.forEachRow(function (row) {
                                annotations.push({
                                    time: new Date(row.ts).valueOf(),
                                    text: row.line,
                                    tags: tags,
                                });
                            });
                        };
                        try {
                            for (data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                                frame = data_1_1.value;
                                _loop_1(frame);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        return [2 /*return*/, annotations];
                }
            });
        });
    };
    return LokiDatasource;
}(DataSourceApi));
export { LokiDatasource };
function queryRequestFromAnnotationOptions(options) {
    var refId = "annotation-" + options.annotation.name;
    var target = { refId: refId, expr: options.annotation.expr };
    return {
        requestId: refId,
        range: options.range,
        targets: [target],
        dashboardId: options.dashboard.id,
        scopedVars: null,
        startTime: Date.now(),
        // This should mean the default defined on datasource is used.
        maxDataPoints: 0,
        // Dummy values, are required in type but not used here.
        timezone: 'utc',
        panelId: 0,
        interval: '',
        intervalMs: 0,
    };
}
export default LokiDatasource;
//# sourceMappingURL=datasource.js.map
import { __assign, __awaiter, __generator, __read, __rest, __spread, __values } from "tslib";
// Libraries
import _ from 'lodash';
import { isLive } from '@grafana/ui/src/components/RefreshPicker/RefreshPicker';
// Services & Utils
import { dateMath, toUtc, LogsDedupStrategy, DefaultTimeZone, } from '@grafana/data';
import { renderUrl } from 'app/core/utils/url';
import store from 'app/core/store';
import kbn from 'app/core/utils/kbn';
import { getNextRefIdChar } from './query';
import { ExploreMode } from 'app/types/explore';
import { config } from '../config';
export var DEFAULT_RANGE = {
    from: 'now-1h',
    to: 'now',
};
export var DEFAULT_UI_STATE = {
    showingTable: true,
    showingGraph: true,
    showingLogs: true,
    dedupStrategy: LogsDedupStrategy.none,
};
var MAX_HISTORY_ITEMS = 100;
export var LAST_USED_DATASOURCE_KEY = 'grafana.explore.datasource';
export var lastUsedDatasourceKeyForOrgId = function (orgId) { return LAST_USED_DATASOURCE_KEY + "." + orgId; };
/**
 * Returns an Explore-URL that contains a panel's queries and the dashboard time range.
 *
 * @param panelTargets The origin panel's query targets
 * @param panelDatasource The origin panel's datasource
 * @param datasourceSrv Datasource service to query other datasources in case the panel datasource is mixed
 * @param timeSrv Time service to get the current dashboard range from
 */
export function getExploreUrl(panel, panelTargets, panelDatasource, datasourceSrv, timeSrv) {
    return __awaiter(this, void 0, void 0, function () {
        var exploreDatasource, exploreTargets, url, _loop_1, exploreTargets_1, exploreTargets_1_1, t, state_1, e_1_1, range, state, exploreState, finalUrl;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exploreDatasource = panelDatasource;
                    exploreTargets = panelTargets;
                    if (!(panelDatasource.meta.id === 'mixed' && exploreTargets)) return [3 /*break*/, 8];
                    _loop_1 = function (t) {
                        var datasource;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, datasourceSrv.get(t.datasource)];
                                case 1:
                                    datasource = _a.sent();
                                    if (datasource) {
                                        exploreDatasource = datasource;
                                        exploreTargets = panelTargets.filter(function (t) { return t.datasource === datasource.name; });
                                        return [2 /*return*/, "break"];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    exploreTargets_1 = __values(exploreTargets), exploreTargets_1_1 = exploreTargets_1.next();
                    _b.label = 2;
                case 2:
                    if (!!exploreTargets_1_1.done) return [3 /*break*/, 5];
                    t = exploreTargets_1_1.value;
                    return [5 /*yield**/, _loop_1(t)];
                case 3:
                    state_1 = _b.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 5];
                    _b.label = 4;
                case 4:
                    exploreTargets_1_1 = exploreTargets_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (exploreTargets_1_1 && !exploreTargets_1_1.done && (_a = exploreTargets_1.return)) _a.call(exploreTargets_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8:
                    if (exploreDatasource) {
                        range = timeSrv.timeRangeForUrl();
                        state = { range: range };
                        if (exploreDatasource.getExploreState) {
                            state = __assign(__assign({}, state), exploreDatasource.getExploreState(exploreTargets));
                        }
                        else {
                            state = __assign(__assign({}, state), { datasource: exploreDatasource.name, queries: exploreTargets.map(function (t) { return (__assign(__assign({}, t), { datasource: exploreDatasource.name })); }) });
                        }
                        exploreState = JSON.stringify(__assign(__assign({}, state), { originPanelId: panel.id }));
                        url = renderUrl('/explore', { left: exploreState });
                    }
                    finalUrl = config.appSubUrl + url;
                    return [2 /*return*/, finalUrl];
            }
        });
    });
}
export function buildQueryTransaction(queries, queryOptions, range, scanning) {
    var configuredQueries = queries.map(function (query) { return (__assign(__assign({}, query), queryOptions)); });
    var key = queries.reduce(function (combinedKey, query) {
        combinedKey += query.key;
        return combinedKey;
    }, '');
    var _a = getIntervals(range, queryOptions.minInterval, queryOptions.maxDataPoints), interval = _a.interval, intervalMs = _a.intervalMs;
    // Most datasource is using `panelId + query.refId` for cancellation logic.
    // Using `format` here because it relates to the view panel that the request is for.
    // However, some datasources don't use `panelId + query.refId`, but only `panelId`.
    // Therefore panel id has to be unique.
    var panelId = "" + key;
    var request = {
        dashboardId: 0,
        // TODO probably should be taken from preferences but does not seem to be used anyway.
        timezone: DefaultTimeZone,
        startTime: Date.now(),
        interval: interval,
        intervalMs: intervalMs,
        // TODO: the query request expects number and we are using string here. Seems like it works so far but can create
        // issues down the road.
        panelId: panelId,
        targets: configuredQueries,
        range: range,
        requestId: 'explore',
        rangeRaw: range.raw,
        scopedVars: {
            __interval: { text: interval, value: interval },
            __interval_ms: { text: intervalMs, value: intervalMs },
        },
        maxDataPoints: queryOptions.maxDataPoints,
    };
    return {
        queries: queries,
        request: request,
        scanning: scanning,
        id: generateKey(),
        done: false,
        latency: 0,
    };
}
export var clearQueryKeys = function (_a) {
    var key = _a.key, refId = _a.refId, rest = __rest(_a, ["key", "refId"]);
    return rest;
};
var isSegment = function (segment) {
    var props = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        props[_i - 1] = arguments[_i];
    }
    return props.some(function (prop) { return segment.hasOwnProperty(prop); });
};
var ParseUrlStateIndex;
(function (ParseUrlStateIndex) {
    ParseUrlStateIndex[ParseUrlStateIndex["RangeFrom"] = 0] = "RangeFrom";
    ParseUrlStateIndex[ParseUrlStateIndex["RangeTo"] = 1] = "RangeTo";
    ParseUrlStateIndex[ParseUrlStateIndex["Datasource"] = 2] = "Datasource";
    ParseUrlStateIndex[ParseUrlStateIndex["SegmentsStart"] = 3] = "SegmentsStart";
})(ParseUrlStateIndex || (ParseUrlStateIndex = {}));
var ParseUiStateIndex;
(function (ParseUiStateIndex) {
    ParseUiStateIndex[ParseUiStateIndex["Graph"] = 0] = "Graph";
    ParseUiStateIndex[ParseUiStateIndex["Logs"] = 1] = "Logs";
    ParseUiStateIndex[ParseUiStateIndex["Table"] = 2] = "Table";
    ParseUiStateIndex[ParseUiStateIndex["Strategy"] = 3] = "Strategy";
})(ParseUiStateIndex || (ParseUiStateIndex = {}));
export var safeParseJson = function (text) {
    if (!text) {
        return;
    }
    try {
        return JSON.parse(decodeURI(text));
    }
    catch (error) {
        console.error(error);
    }
};
export var safeStringifyValue = function (value, space) {
    if (!value) {
        return '';
    }
    try {
        return JSON.stringify(value, null, space);
    }
    catch (error) {
        console.error(error);
    }
    return '';
};
export function parseUrlState(initial) {
    var parsed = safeParseJson(initial);
    var errorResult = {
        datasource: null,
        queries: [],
        range: DEFAULT_RANGE,
        ui: DEFAULT_UI_STATE,
        mode: null,
        originPanelId: null,
    };
    if (!parsed) {
        return errorResult;
    }
    if (!Array.isArray(parsed)) {
        return parsed;
    }
    if (parsed.length <= ParseUrlStateIndex.SegmentsStart) {
        console.error('Error parsing compact URL state for Explore.');
        return errorResult;
    }
    var range = {
        from: parsed[ParseUrlStateIndex.RangeFrom],
        to: parsed[ParseUrlStateIndex.RangeTo],
    };
    var datasource = parsed[ParseUrlStateIndex.Datasource];
    var parsedSegments = parsed.slice(ParseUrlStateIndex.SegmentsStart);
    var metricProperties = ['expr', 'target', 'datasource', 'query'];
    var queries = parsedSegments.filter(function (segment) { return isSegment.apply(void 0, __spread([segment], metricProperties)); });
    var modeObj = parsedSegments.filter(function (segment) { return isSegment(segment, 'mode'); })[0];
    var mode = modeObj ? modeObj.mode : ExploreMode.Metrics;
    var uiState = parsedSegments.filter(function (segment) { return isSegment(segment, 'ui'); })[0];
    var ui = uiState
        ? {
            showingGraph: uiState.ui[ParseUiStateIndex.Graph],
            showingLogs: uiState.ui[ParseUiStateIndex.Logs],
            showingTable: uiState.ui[ParseUiStateIndex.Table],
            dedupStrategy: uiState.ui[ParseUiStateIndex.Strategy],
        }
        : DEFAULT_UI_STATE;
    var originPanelId = parsedSegments.filter(function (segment) { return isSegment(segment, 'originPanelId'); })[0];
    return { datasource: datasource, queries: queries, range: range, ui: ui, mode: mode, originPanelId: originPanelId };
}
export function serializeStateToUrlParam(urlState, compact) {
    if (compact) {
        return JSON.stringify(__spread([
            urlState.range.from,
            urlState.range.to,
            urlState.datasource
        ], urlState.queries, [
            { mode: urlState.mode },
            {
                ui: [
                    !!urlState.ui.showingGraph,
                    !!urlState.ui.showingLogs,
                    !!urlState.ui.showingTable,
                    urlState.ui.dedupStrategy,
                ],
            },
        ]));
    }
    return JSON.stringify(urlState);
}
export function generateKey(index) {
    if (index === void 0) { index = 0; }
    return "Q-" + Date.now() + "-" + Math.random() + "-" + index;
}
export function generateEmptyQuery(queries, index) {
    if (index === void 0) { index = 0; }
    return { refId: getNextRefIdChar(queries), key: generateKey(index) };
}
export var generateNewKeyAndAddRefIdIfMissing = function (target, queries, index) {
    if (index === void 0) { index = 0; }
    var key = generateKey(index);
    var refId = target.refId || getNextRefIdChar(queries);
    return __assign(__assign({}, target), { refId: refId, key: key });
};
/**
 * Ensure at least one target exists and that targets have the necessary keys
 */
export function ensureQueries(queries) {
    if (queries && typeof queries === 'object' && queries.length > 0) {
        var allQueries = [];
        for (var index = 0; index < queries.length; index++) {
            var query = queries[index];
            var key = generateKey(index);
            var refId = query.refId;
            if (!refId) {
                refId = getNextRefIdChar(allQueries);
            }
            allQueries.push(__assign(__assign({}, query), { refId: refId,
                key: key }));
        }
        return allQueries;
    }
    return [__assign({}, generateEmptyQuery(queries))];
}
/**
 * A target is non-empty when it has keys (with non-empty values) other than refId, key and context.
 */
var validKeys = ['refId', 'key', 'context'];
export function hasNonEmptyQuery(queries) {
    return (queries &&
        queries.some(function (query) {
            var keys = Object.keys(query)
                .filter(function (key) { return validKeys.indexOf(key) === -1; })
                .map(function (k) { return query[k]; })
                .filter(function (v) { return v; });
            return keys.length > 0;
        }));
}
/**
 * Update the query history. Side-effect: store history in local storage
 */
export function updateHistory(history, datasourceId, queries) {
    var ts = Date.now();
    queries.forEach(function (query) {
        history = __spread([{ query: query, ts: ts }], history);
    });
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    // Combine all queries of a datasource type into one history
    var historyKey = "grafana.explore.history." + datasourceId;
    store.setObject(historyKey, history);
    return history;
}
export function clearHistory(datasourceId) {
    var historyKey = "grafana.explore.history." + datasourceId;
    store.delete(historyKey);
}
export var getQueryKeys = function (queries, datasourceInstance) {
    var queryKeys = queries.reduce(function (newQueryKeys, query, index) {
        var primaryKey = datasourceInstance && datasourceInstance.name ? datasourceInstance.name : query.key;
        return newQueryKeys.concat(primaryKey + "-" + index);
    }, []);
    return queryKeys;
};
export var getTimeRange = function (timeZone, rawRange) {
    return {
        from: dateMath.parse(rawRange.from, false, timeZone),
        to: dateMath.parse(rawRange.to, true, timeZone),
        raw: rawRange,
    };
};
var parseRawTime = function (value) {
    if (value === null) {
        return null;
    }
    if (value.indexOf('now') !== -1) {
        return value;
    }
    if (value.length === 8) {
        return toUtc(value, 'YYYYMMDD');
    }
    if (value.length === 15) {
        return toUtc(value, 'YYYYMMDDTHHmmss');
    }
    // Backward compatibility
    if (value.length === 19) {
        return toUtc(value, 'YYYY-MM-DD HH:mm:ss');
    }
    if (!isNaN(value)) {
        var epoch = parseInt(value, 10);
        return toUtc(epoch);
    }
    return null;
};
export var getTimeRangeFromUrl = function (range, timeZone) {
    var raw = {
        from: parseRawTime(range.from),
        to: parseRawTime(range.to),
    };
    return {
        from: dateMath.parse(raw.from, false, timeZone),
        to: dateMath.parse(raw.to, true, timeZone),
        raw: raw,
    };
};
export var getValueWithRefId = function (value) {
    if (!value) {
        return null;
    }
    if (typeof value !== 'object') {
        return null;
    }
    if (value.refId) {
        return value;
    }
    var keys = Object.keys(value);
    for (var index = 0; index < keys.length; index++) {
        var key = keys[index];
        var refId = getValueWithRefId(value[key]);
        if (refId) {
            return refId;
        }
    }
    return null;
};
export var getFirstQueryErrorWithoutRefId = function (errors) {
    if (!errors) {
        return null;
    }
    return errors.filter(function (error) { return (error && error.refId ? false : true); })[0];
};
export var getRefIds = function (value) {
    if (!value) {
        return [];
    }
    if (typeof value !== 'object') {
        return [];
    }
    var keys = Object.keys(value);
    var refIds = [];
    for (var index = 0; index < keys.length; index++) {
        var key = keys[index];
        if (key === 'refId') {
            refIds.push(value[key]);
            continue;
        }
        refIds.push(getRefIds(value[key]));
    }
    return _.uniq(_.flatten(refIds));
};
export var sortInAscendingOrder = function (a, b) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    if (a.timestamp > b.timestamp) {
        return 1;
    }
    return 0;
};
var sortInDescendingOrder = function (a, b) {
    if (a.timestamp > b.timestamp) {
        return -1;
    }
    if (a.timestamp < b.timestamp) {
        return 1;
    }
    return 0;
};
export var SortOrder;
(function (SortOrder) {
    SortOrder["Descending"] = "Descending";
    SortOrder["Ascending"] = "Ascending";
})(SortOrder || (SortOrder = {}));
export var refreshIntervalToSortOrder = function (refreshInterval) {
    return isLive(refreshInterval) ? SortOrder.Ascending : SortOrder.Descending;
};
export var sortLogsResult = function (logsResult, sortOrder) {
    var rows = logsResult ? logsResult.rows : [];
    sortOrder === SortOrder.Ascending ? rows.sort(sortInAscendingOrder) : rows.sort(sortInDescendingOrder);
    var result = logsResult ? __assign(__assign({}, logsResult), { rows: rows }) : { hasUniqueLabels: false, rows: rows };
    return result;
};
export var convertToWebSocketUrl = function (url) {
    var protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    var backend = "" + protocol + window.location.host + config.appSubUrl;
    if (backend.endsWith('/')) {
        backend = backend.slice(0, backend.length - 1);
    }
    return "" + backend + url;
};
export var stopQueryState = function (querySubscription) {
    if (querySubscription) {
        querySubscription.unsubscribe();
    }
};
export function getIntervals(range, lowLimit, resolution) {
    if (!resolution) {
        return { interval: '1s', intervalMs: 1000 };
    }
    return kbn.calculateInterval(range, resolution, lowLimit);
}
//# sourceMappingURL=explore.js.map
import * as tslib_1 from "tslib";
import _ from 'lodash';
import { ensureQueries, getQueryKeys, parseUrlState, DEFAULT_UI_STATE, generateNewKeyAndAddRefIdIfMissing, sortLogsResult, stopQueryState, refreshIntervalToSortOrder, } from 'app/core/utils/explore';
import { ExploreId, ExploreMode } from 'app/types/explore';
import { LoadingState, toLegacyResponseData, DefaultTimeRange } from '@grafana/data';
import { ActionTypes, testDataSourcePendingAction, testDataSourceSuccessAction, testDataSourceFailureAction, splitCloseAction, loadExploreDatasources, historyUpdatedAction, changeModeAction, setUrlReplacedAction, scanStopAction, queryStartAction, changeRangeAction, clearOriginAction, addQueryRowAction, changeQueryAction, changeSizeAction, changeRefreshIntervalAction, clearQueriesAction, highlightLogsExpressionAction, initializeExploreAction, updateDatasourceInstanceAction, loadDatasourceMissingAction, loadDatasourcePendingAction, loadDatasourceReadyAction, modifyQueriesAction, removeQueryRowAction, scanStartAction, setQueriesAction, toggleTableAction, queriesImportedAction, updateUIStateAction, toggleLogLevelAction, changeLoadingStateAction, resetExploreAction, queryStreamUpdatedAction, queryStoreSubscriptionAction, setPausedStateAction, toggleGraphAction, } from './actionTypes';
import { reducerFactory } from 'app/core/redux';
import { updateLocation } from 'app/core/actions/location';
import TableModel from 'app/core/table_model';
import { isLive } from '@grafana/ui/src/components/RefreshPicker/RefreshPicker';
import { ResultProcessor } from '../utils/ResultProcessor';
export var DEFAULT_RANGE = {
    from: 'now-6h',
    to: 'now',
};
export var makeInitialUpdateState = function () { return ({
    datasource: false,
    queries: false,
    range: false,
    mode: false,
    ui: false,
}); };
/**
 * Returns a fresh Explore area state
 */
export var makeExploreItemState = function () { return ({
    StartPage: undefined,
    containerWidth: 0,
    datasourceInstance: null,
    requestedDatasourceName: null,
    datasourceError: null,
    datasourceLoading: null,
    datasourceMissing: false,
    exploreDatasources: [],
    history: [],
    queries: [],
    initialized: false,
    range: {
        from: null,
        to: null,
        raw: DEFAULT_RANGE,
    },
    absoluteRange: {
        from: null,
        to: null,
    },
    scanning: false,
    scanRange: null,
    showingGraph: true,
    showingTable: true,
    loading: false,
    queryKeys: [],
    urlState: null,
    update: makeInitialUpdateState(),
    latency: 0,
    supportedModes: [],
    mode: null,
    isLive: false,
    isPaused: false,
    urlReplaced: false,
    queryResponse: createEmptyQueryResponse(),
}); };
export var createEmptyQueryResponse = function () { return ({
    state: LoadingState.NotStarted,
    request: {},
    series: [],
    error: null,
    timeRange: DefaultTimeRange,
}); };
/**
 * Global Explore state that handles multiple Explore areas and the split state
 */
export var initialExploreItemState = makeExploreItemState();
export var initialExploreState = {
    split: null,
    left: initialExploreItemState,
    right: initialExploreItemState,
};
/**
 * Reducer for an Explore area, to be used by the global Explore reducer.
 */
export var itemReducer = reducerFactory({})
    .addMapper({
    filter: addQueryRowAction,
    mapper: function (state, action) {
        var queries = state.queries;
        var _a = action.payload, index = _a.index, query = _a.query;
        // Add to queries, which will cause a new row to be rendered
        var nextQueries = tslib_1.__spread(queries.slice(0, index + 1), [tslib_1.__assign({}, query)], queries.slice(index + 1));
        return tslib_1.__assign({}, state, { queries: nextQueries, logsHighlighterExpressions: undefined, queryKeys: getQueryKeys(nextQueries, state.datasourceInstance) });
    },
})
    .addMapper({
    filter: changeQueryAction,
    mapper: function (state, action) {
        var queries = state.queries;
        var _a = action.payload, query = _a.query, index = _a.index;
        // Override path: queries are completely reset
        var nextQuery = generateNewKeyAndAddRefIdIfMissing(query, queries, index);
        var nextQueries = tslib_1.__spread(queries);
        nextQueries[index] = nextQuery;
        return tslib_1.__assign({}, state, { queries: nextQueries, queryKeys: getQueryKeys(nextQueries, state.datasourceInstance) });
    },
})
    .addMapper({
    filter: changeSizeAction,
    mapper: function (state, action) {
        var containerWidth = action.payload.width;
        return tslib_1.__assign({}, state, { containerWidth: containerWidth });
    },
})
    .addMapper({
    filter: changeModeAction,
    mapper: function (state, action) {
        var mode = action.payload.mode;
        return tslib_1.__assign({}, state, { mode: mode });
    },
})
    .addMapper({
    filter: changeRefreshIntervalAction,
    mapper: function (state, action) {
        var refreshInterval = action.payload.refreshInterval;
        var live = isLive(refreshInterval);
        var sortOrder = refreshIntervalToSortOrder(refreshInterval);
        var logsResult = sortLogsResult(state.logsResult, sortOrder);
        if (isLive(state.refreshInterval) && !live) {
            stopQueryState(state.querySubscription);
        }
        return tslib_1.__assign({}, state, { refreshInterval: refreshInterval, queryResponse: tslib_1.__assign({}, state.queryResponse, { state: live ? LoadingState.Streaming : LoadingState.NotStarted }), isLive: live, isPaused: live ? false : state.isPaused, loading: live, logsResult: logsResult });
    },
})
    .addMapper({
    filter: clearQueriesAction,
    mapper: function (state) {
        var queries = ensureQueries();
        stopQueryState(state.querySubscription);
        return tslib_1.__assign({}, state, { queries: queries.slice(), graphResult: null, tableResult: null, logsResult: null, showingStartPage: Boolean(state.StartPage), queryKeys: getQueryKeys(queries, state.datasourceInstance), queryResponse: createEmptyQueryResponse(), loading: false });
    },
})
    .addMapper({
    filter: clearOriginAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { originPanelId: undefined });
    },
})
    .addMapper({
    filter: highlightLogsExpressionAction,
    mapper: function (state, action) {
        var expressions = action.payload.expressions;
        return tslib_1.__assign({}, state, { logsHighlighterExpressions: expressions });
    },
})
    .addMapper({
    filter: initializeExploreAction,
    mapper: function (state, action) {
        var _a = action.payload, containerWidth = _a.containerWidth, eventBridge = _a.eventBridge, queries = _a.queries, range = _a.range, mode = _a.mode, ui = _a.ui, originPanelId = _a.originPanelId;
        return tslib_1.__assign({}, state, { containerWidth: containerWidth,
            eventBridge: eventBridge,
            range: range,
            mode: mode,
            queries: queries, initialized: true, queryKeys: getQueryKeys(queries, state.datasourceInstance) }, ui, { originPanelId: originPanelId, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: updateDatasourceInstanceAction,
    mapper: function (state, action) {
        var datasourceInstance = action.payload.datasourceInstance;
        var _a = tslib_1.__read(getModesForDatasource(datasourceInstance, state.mode), 2), supportedModes = _a[0], mode = _a[1];
        var originPanelId = state.urlState && state.urlState.originPanelId;
        // Custom components
        var StartPage = datasourceInstance.components.ExploreStartPage;
        stopQueryState(state.querySubscription);
        return tslib_1.__assign({}, state, { datasourceInstance: datasourceInstance, graphResult: null, tableResult: null, logsResult: null, latency: 0, queryResponse: createEmptyQueryResponse(), loading: false, StartPage: StartPage, showingStartPage: Boolean(StartPage), queryKeys: [], supportedModes: supportedModes,
            mode: mode,
            originPanelId: originPanelId });
    },
})
    .addMapper({
    filter: loadDatasourceMissingAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { datasourceMissing: true, datasourceLoading: false, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: loadDatasourcePendingAction,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, { datasourceLoading: true, requestedDatasourceName: action.payload.requestedDatasourceName });
    },
})
    .addMapper({
    filter: loadDatasourceReadyAction,
    mapper: function (state, action) {
        var history = action.payload.history;
        return tslib_1.__assign({}, state, { history: history, datasourceLoading: false, datasourceMissing: false, logsHighlighterExpressions: undefined, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: modifyQueriesAction,
    mapper: function (state, action) {
        var queries = state.queries;
        var _a = action.payload, modification = _a.modification, index = _a.index, modifier = _a.modifier;
        var nextQueries;
        if (index === undefined) {
            // Modify all queries
            nextQueries = queries.map(function (query, i) {
                var nextQuery = modifier(tslib_1.__assign({}, query), modification);
                return generateNewKeyAndAddRefIdIfMissing(nextQuery, queries, i);
            });
        }
        else {
            // Modify query only at index
            nextQueries = queries.map(function (query, i) {
                if (i === index) {
                    var nextQuery = modifier(tslib_1.__assign({}, query), modification);
                    return generateNewKeyAndAddRefIdIfMissing(nextQuery, queries, i);
                }
                return query;
            });
        }
        return tslib_1.__assign({}, state, { queries: nextQueries, queryKeys: getQueryKeys(nextQueries, state.datasourceInstance) });
    },
})
    .addMapper({
    filter: queryStartAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { latency: 0, queryResponse: tslib_1.__assign({}, state.queryResponse, { state: LoadingState.Loading, error: null }), loading: true, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: removeQueryRowAction,
    mapper: function (state, action) {
        var queries = state.queries, queryKeys = state.queryKeys;
        var index = action.payload.index;
        if (queries.length <= 1) {
            return state;
        }
        var nextQueries = tslib_1.__spread(queries.slice(0, index), queries.slice(index + 1));
        var nextQueryKeys = tslib_1.__spread(queryKeys.slice(0, index), queryKeys.slice(index + 1));
        return tslib_1.__assign({}, state, { queries: nextQueries, logsHighlighterExpressions: undefined, queryKeys: nextQueryKeys });
    },
})
    .addMapper({
    filter: scanStartAction,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, { scanning: true });
    },
})
    .addMapper({
    filter: scanStopAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { scanning: false, scanRange: undefined, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: setQueriesAction,
    mapper: function (state, action) {
        var queries = action.payload.queries;
        return tslib_1.__assign({}, state, { queries: queries.slice(), queryKeys: getQueryKeys(queries, state.datasourceInstance) });
    },
})
    .addMapper({
    filter: updateUIStateAction,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, action.payload);
    },
})
    .addMapper({
    filter: toggleGraphAction,
    mapper: function (state) {
        var showingGraph = !state.showingGraph;
        if (showingGraph) {
            return tslib_1.__assign({}, state, { showingGraph: showingGraph });
        }
        return tslib_1.__assign({}, state, { showingGraph: showingGraph, graphResult: null });
    },
})
    .addMapper({
    filter: toggleTableAction,
    mapper: function (state) {
        var showingTable = !state.showingTable;
        if (showingTable) {
            return tslib_1.__assign({}, state, { showingTable: showingTable });
        }
        return tslib_1.__assign({}, state, { showingTable: showingTable, tableResult: new TableModel() });
    },
})
    .addMapper({
    filter: queriesImportedAction,
    mapper: function (state, action) {
        var queries = action.payload.queries;
        return tslib_1.__assign({}, state, { queries: queries, queryKeys: getQueryKeys(queries, state.datasourceInstance) });
    },
})
    .addMapper({
    filter: toggleLogLevelAction,
    mapper: function (state, action) {
        var hiddenLogLevels = action.payload.hiddenLogLevels;
        return tslib_1.__assign({}, state, { hiddenLogLevels: Array.from(hiddenLogLevels) });
    },
})
    .addMapper({
    filter: testDataSourcePendingAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { datasourceError: null });
    },
})
    .addMapper({
    filter: testDataSourceSuccessAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { datasourceError: null });
    },
})
    .addMapper({
    filter: testDataSourceFailureAction,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, { datasourceError: action.payload.error, graphResult: undefined, tableResult: undefined, logsResult: undefined, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: loadExploreDatasources,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, { exploreDatasources: action.payload.exploreDatasources });
    },
})
    .addMapper({
    filter: historyUpdatedAction,
    mapper: function (state, action) {
        return tslib_1.__assign({}, state, { history: action.payload.history });
    },
})
    .addMapper({
    filter: setUrlReplacedAction,
    mapper: function (state) {
        return tslib_1.__assign({}, state, { urlReplaced: true });
    },
})
    .addMapper({
    filter: changeRangeAction,
    mapper: function (state, action) {
        var _a = action.payload, range = _a.range, absoluteRange = _a.absoluteRange;
        return tslib_1.__assign({}, state, { range: range,
            absoluteRange: absoluteRange, update: makeInitialUpdateState() });
    },
})
    .addMapper({
    filter: changeLoadingStateAction,
    mapper: function (state, action) {
        var loadingState = action.payload.loadingState;
        return tslib_1.__assign({}, state, { queryResponse: tslib_1.__assign({}, state.queryResponse, { state: loadingState }), loading: loadingState === LoadingState.Loading || loadingState === LoadingState.Streaming });
    },
})
    .addMapper({
    filter: setPausedStateAction,
    mapper: function (state, action) {
        var isPaused = action.payload.isPaused;
        return tslib_1.__assign({}, state, { isPaused: isPaused });
    },
})
    .addMapper({
    filter: queryStoreSubscriptionAction,
    mapper: function (state, action) {
        var querySubscription = action.payload.querySubscription;
        return tslib_1.__assign({}, state, { querySubscription: querySubscription });
    },
})
    .addMapper({
    filter: queryStreamUpdatedAction,
    mapper: function (state, action) {
        return processQueryResponse(state, action);
    },
})
    .create();
export var processQueryResponse = function (state, action) {
    var response = action.payload.response;
    var request = response.request, loadingState = response.state, series = response.series, error = response.error;
    if (error) {
        if (error.cancelled) {
            return state;
        }
        // For Angular editors
        state.eventBridge.emit('data-error', error);
        return tslib_1.__assign({}, state, { loading: false, queryResponse: response, graphResult: null, tableResult: null, logsResult: null, showingStartPage: false, update: makeInitialUpdateState() });
    }
    var latency = request.endTime ? request.endTime - request.startTime : 0;
    var processor = new ResultProcessor(state, series, request.intervalMs);
    var graphResult = processor.getGraphResult();
    var tableResult = processor.getTableResult();
    var logsResult = processor.getLogsResult();
    // Send legacy data to Angular editors
    if (state.datasourceInstance.components.QueryCtrl) {
        var legacy = series.map(function (v) { return toLegacyResponseData(v); });
        state.eventBridge.emit('data-received', legacy);
    }
    return tslib_1.__assign({}, state, { latency: latency, queryResponse: response, graphResult: graphResult,
        tableResult: tableResult,
        logsResult: logsResult, loading: loadingState === LoadingState.Loading || loadingState === LoadingState.Streaming, showingStartPage: false, update: makeInitialUpdateState() });
};
export var updateChildRefreshState = function (state, payload, exploreId) {
    var path = payload.path || '';
    var queryState = payload.query[exploreId];
    if (!queryState) {
        return state;
    }
    var urlState = parseUrlState(queryState);
    if (!state.urlState || path !== '/explore') {
        // we only want to refresh when browser back/forward
        return tslib_1.__assign({}, state, { urlState: urlState, update: { datasource: false, queries: false, range: false, mode: false, ui: false } });
    }
    var datasource = _.isEqual(urlState ? urlState.datasource : '', state.urlState.datasource) === false;
    var queries = _.isEqual(urlState ? urlState.queries : [], state.urlState.queries) === false;
    var range = _.isEqual(urlState ? urlState.range : DEFAULT_RANGE, state.urlState.range) === false;
    var mode = _.isEqual(urlState ? urlState.mode : ExploreMode.Metrics, state.urlState.mode) === false;
    var ui = _.isEqual(urlState ? urlState.ui : DEFAULT_UI_STATE, state.urlState.ui) === false;
    return tslib_1.__assign({}, state, { urlState: urlState, update: tslib_1.__assign({}, state.update, { datasource: datasource,
            queries: queries,
            range: range,
            mode: mode,
            ui: ui }) });
};
var getModesForDatasource = function (dataSource, currentMode) {
    // Temporary hack here. We want Loki to work in dashboards for which it needs to have metrics = true which is weird
    // for Explore.
    // TODO: need to figure out a better way to handle this situation
    var supportsGraph = dataSource.meta.name === 'Loki' ? false : dataSource.meta.metrics;
    var supportsLogs = dataSource.meta.logs;
    var mode = currentMode || ExploreMode.Metrics;
    var supportedModes = [];
    if (supportsGraph) {
        supportedModes.push(ExploreMode.Metrics);
    }
    if (supportsLogs) {
        supportedModes.push(ExploreMode.Logs);
    }
    if (supportedModes.length === 1) {
        mode = supportedModes[0];
    }
    return [supportedModes, mode];
};
/**
 * Global Explore reducer that handles multiple Explore areas (left and right).
 * Actions that have an `exploreId` get routed to the ExploreItemReducer.
 */
export var exploreReducer = function (state, action) {
    var _a, _b, _c;
    if (state === void 0) { state = initialExploreState; }
    switch (action.type) {
        case splitCloseAction.type: {
            var itemId = action.payload.itemId;
            var targetSplit = {
                left: itemId === ExploreId.left ? state.right : state.left,
                right: initialExploreState.right,
            };
            return tslib_1.__assign({}, state, targetSplit, { split: false });
        }
        case ActionTypes.SplitOpen: {
            return tslib_1.__assign({}, state, { split: true, right: tslib_1.__assign({}, action.payload.itemState) });
        }
        case ActionTypes.ResetExplore: {
            if (action.payload.force || !Number.isInteger(state.left.originPanelId)) {
                return initialExploreState;
            }
            return tslib_1.__assign({}, initialExploreState, { left: tslib_1.__assign({}, initialExploreItemState, { queries: state.left.queries, originPanelId: state.left.originPanelId }) });
        }
        case updateLocation.type: {
            var query = action.payload.query;
            if (!query || !query[ExploreId.left]) {
                return state;
            }
            var split = query[ExploreId.right] ? true : false;
            var leftState = state[ExploreId.left];
            var rightState = state[ExploreId.right];
            return tslib_1.__assign({}, state, (_a = { split: split }, _a[ExploreId.left] = updateChildRefreshState(leftState, action.payload, ExploreId.left), _a[ExploreId.right] = updateChildRefreshState(rightState, action.payload, ExploreId.right), _a));
        }
        case resetExploreAction.type: {
            var leftState = state[ExploreId.left];
            var rightState = state[ExploreId.right];
            stopQueryState(leftState.querySubscription);
            stopQueryState(rightState.querySubscription);
            return tslib_1.__assign({}, state, (_b = {}, _b[ExploreId.left] = updateChildRefreshState(leftState, action.payload, ExploreId.left), _b[ExploreId.right] = updateChildRefreshState(rightState, action.payload, ExploreId.right), _b));
        }
    }
    if (action.payload) {
        var exploreId = action.payload.exploreId;
        if (exploreId !== undefined) {
            // @ts-ignore
            var exploreItemState = state[exploreId];
            return tslib_1.__assign({}, state, (_c = {}, _c[exploreId] = itemReducer(exploreItemState, action), _c));
        }
    }
    return state;
};
export default {
    explore: exploreReducer,
};
//# sourceMappingURL=reducers.js.map
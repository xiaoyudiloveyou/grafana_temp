var _this = this;
import * as tslib_1 from "tslib";
// Libraries
import { map, throttleTime } from 'rxjs/operators';
import { identity } from 'rxjs';
// Services & Utils
import store from 'app/core/store';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { ensureQueries, generateEmptyQuery, parseUrlState, getTimeRange, getTimeRangeFromUrl, generateNewKeyAndAddRefIdIfMissing, lastUsedDatasourceKeyForOrgId, hasNonEmptyQuery, buildQueryTransaction, clearQueryKeys, serializeStateToUrlParam, stopQueryState, updateHistory, } from 'app/core/utils/explore';
import { LoadingState, isDateTime, dateTimeForTimeZone, } from '@grafana/data';
import { ExploreId, ExploreMode } from 'app/types/explore';
import { updateDatasourceInstanceAction, changeQueryAction, changeRefreshIntervalAction, changeSizeAction, clearQueriesAction, initializeExploreAction, loadDatasourceMissingAction, loadDatasourcePendingAction, queriesImportedAction, loadDatasourceReadyAction, modifyQueriesAction, scanStartAction, setQueriesAction, splitCloseAction, splitOpenAction, addQueryRowAction, toggleGraphAction, toggleTableAction, updateUIStateAction, testDataSourcePendingAction, testDataSourceSuccessAction, testDataSourceFailureAction, loadExploreDatasources, changeModeAction, scanStopAction, setUrlReplacedAction, changeRangeAction, historyUpdatedAction, queryStreamUpdatedAction, queryStoreSubscriptionAction, clearOriginAction, } from './actionTypes';
import { getTimeZone } from 'app/features/profile/state/selectors';
import { offOption } from '@grafana/ui/src/components/RefreshPicker/RefreshPicker';
import { getShiftedTimeRange } from 'app/core/utils/timePicker';
import { updateLocation } from '../../../core/actions';
import { getTimeSrv } from '../../dashboard/services/TimeSrv';
import { runRequest, preProcessPanelData } from '../../dashboard/state/runRequest';
/**
 * Updates UI state and save it to the URL
 */
var updateExploreUIState = function (exploreId, uiStateFragment) {
    return function (dispatch) {
        dispatch(updateUIStateAction(tslib_1.__assign({ exploreId: exploreId }, uiStateFragment)));
        dispatch(stateSave());
    };
};
/**
 * Adds a query row after the row with the given index.
 */
export function addQueryRow(exploreId, index) {
    return function (dispatch, getState) {
        var queries = getState().explore[exploreId].queries;
        var query = generateEmptyQuery(queries, index);
        dispatch(addQueryRowAction({ exploreId: exploreId, index: index, query: query }));
    };
}
/**
 * Loads a new datasource identified by the given name.
 */
export function changeDatasource(exploreId, datasource) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var newDataSourceInstance, currentDataSourceInstance, queries, orgId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newDataSourceInstance = null;
                    if (!!datasource) return [3 /*break*/, 2];
                    return [4 /*yield*/, getDatasourceSrv().get()];
                case 1:
                    newDataSourceInstance = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getDatasourceSrv().get(datasource)];
                case 3:
                    newDataSourceInstance = _a.sent();
                    _a.label = 4;
                case 4:
                    currentDataSourceInstance = getState().explore[exploreId].datasourceInstance;
                    queries = getState().explore[exploreId].queries;
                    orgId = getState().user.orgId;
                    dispatch(updateDatasourceInstanceAction({ exploreId: exploreId, datasourceInstance: newDataSourceInstance }));
                    return [4 /*yield*/, dispatch(importQueries(exploreId, queries, currentDataSourceInstance, newDataSourceInstance))];
                case 5:
                    _a.sent();
                    if (getState().explore[exploreId].isLive) {
                        dispatch(changeRefreshInterval(exploreId, offOption.value));
                    }
                    return [4 /*yield*/, dispatch(loadDatasource(exploreId, newDataSourceInstance, orgId))];
                case 6:
                    _a.sent();
                    dispatch(runQueries(exploreId));
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Change the display mode in Explore.
 */
export function changeMode(exploreId, mode) {
    return function (dispatch) {
        dispatch(clearQueriesAction({ exploreId: exploreId }));
        dispatch(changeModeAction({ exploreId: exploreId, mode: mode }));
    };
}
/**
 * Query change handler for the query row with the given index.
 * If `override` is reset the query modifications and run the queries. Use this to set queries via a link.
 */
export function changeQuery(exploreId, query, index, override) {
    return function (dispatch, getState) {
        // Null query means reset
        if (query === null) {
            var queries = getState().explore[exploreId].queries;
            var _a = queries[index], refId = _a.refId, key = _a.key;
            query = generateNewKeyAndAddRefIdIfMissing({ refId: refId, key: key }, queries, index);
        }
        dispatch(changeQueryAction({ exploreId: exploreId, query: query, index: index, override: override }));
        if (override) {
            dispatch(runQueries(exploreId));
        }
    };
}
/**
 * Keep track of the Explore container size, in particular the width.
 * The width will be used to calculate graph intervals (number of datapoints).
 */
export function changeSize(exploreId, _a) {
    var height = _a.height, width = _a.width;
    return changeSizeAction({ exploreId: exploreId, height: height, width: width });
}
export var updateTimeRange = function (options) {
    return function (dispatch) {
        dispatch(updateTime(tslib_1.__assign({}, options)));
        dispatch(runQueries(options.exploreId));
    };
};
/**
 * Change the refresh interval of Explore. Called from the Refresh picker.
 */
export function changeRefreshInterval(exploreId, refreshInterval) {
    return changeRefreshIntervalAction({ exploreId: exploreId, refreshInterval: refreshInterval });
}
/**
 * Clear all queries and results.
 */
export function clearQueries(exploreId) {
    return function (dispatch) {
        dispatch(scanStopAction({ exploreId: exploreId }));
        dispatch(clearQueriesAction({ exploreId: exploreId }));
        dispatch(stateSave());
    };
}
export function clearOrigin() {
    return function (dispatch) {
        dispatch(clearOriginAction({ exploreId: ExploreId.left }));
    };
}
/**
 * Loads all explore data sources and sets the chosen datasource.
 * If there are no datasources a missing datasource action is dispatched.
 */
export function loadExploreDatasourcesAndSetDatasource(exploreId, datasourceName) {
    return function (dispatch) {
        var exploreDatasources = getDatasourceSrv()
            .getExternal()
            .map(function (ds) {
            return ({
                value: ds.name,
                name: ds.name,
                meta: ds.meta,
            });
        });
        dispatch(loadExploreDatasources({ exploreId: exploreId, exploreDatasources: exploreDatasources }));
        if (exploreDatasources.length >= 1) {
            dispatch(changeDatasource(exploreId, datasourceName));
        }
        else {
            dispatch(loadDatasourceMissingAction({ exploreId: exploreId }));
        }
    };
}
/**
 * Initialize Explore state with state from the URL and the React component.
 * Call this only on components for with the Explore state has not been initialized.
 */
export function initializeExplore(exploreId, datasourceName, queries, rawRange, mode, containerWidth, eventBridge, ui, originPanelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var timeZone, range;
        return tslib_1.__generator(this, function (_a) {
            timeZone = getTimeZone(getState().user);
            range = getTimeRange(timeZone, rawRange);
            dispatch(loadExploreDatasourcesAndSetDatasource(exploreId, datasourceName));
            dispatch(initializeExploreAction({
                exploreId: exploreId,
                containerWidth: containerWidth,
                eventBridge: eventBridge,
                queries: queries,
                range: range,
                mode: mode,
                ui: ui,
                originPanelId: originPanelId,
            }));
            dispatch(updateTime({ exploreId: exploreId }));
            return [2 /*return*/];
        });
    }); };
}
/**
 * Datasource loading was successfully completed.
 */
export var loadDatasourceReady = function (exploreId, instance, orgId) {
    var historyKey = "grafana.explore.history." + instance.meta.id;
    var history = store.getObject(historyKey, []);
    // Save last-used datasource
    store.set(lastUsedDatasourceKeyForOrgId(orgId), instance.name);
    return loadDatasourceReadyAction({
        exploreId: exploreId,
        history: history,
    });
};
export function importQueries(exploreId, queries, sourceDataSource, targetDataSource) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var importedQueries, nextQueries;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sourceDataSource) {
                        // explore not initialized
                        dispatch(queriesImportedAction({ exploreId: exploreId, queries: queries }));
                        return [2 /*return*/];
                    }
                    importedQueries = queries;
                    if (!(sourceDataSource.meta.id === targetDataSource.meta.id)) return [3 /*break*/, 1];
                    // Keep same queries if same type of datasource
                    importedQueries = tslib_1.__spread(queries);
                    return [3 /*break*/, 4];
                case 1:
                    if (!targetDataSource.importQueries) return [3 /*break*/, 3];
                    return [4 /*yield*/, targetDataSource.importQueries(queries, sourceDataSource.meta)];
                case 2:
                    // Datasource-specific importers
                    importedQueries = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    // Default is blank queries
                    importedQueries = ensureQueries();
                    _a.label = 4;
                case 4:
                    nextQueries = ensureQueries(importedQueries);
                    dispatch(queriesImportedAction({ exploreId: exploreId, queries: nextQueries }));
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Tests datasource.
 */
export var testDatasource = function (exploreId, instance) {
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var datasourceError, testResult, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    datasourceError = null;
                    dispatch(testDataSourcePendingAction({ exploreId: exploreId }));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, instance.testDatasource()];
                case 2:
                    testResult = _a.sent();
                    datasourceError = testResult.status === 'success' ? null : testResult.message;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    datasourceError = (error_1 && error_1.statusText) || 'Network error';
                    return [3 /*break*/, 4];
                case 4:
                    if (datasourceError) {
                        dispatch(testDataSourceFailureAction({ exploreId: exploreId, error: datasourceError }));
                        return [2 /*return*/];
                    }
                    dispatch(testDataSourceSuccessAction({ exploreId: exploreId }));
                    return [2 /*return*/];
            }
        });
    }); };
};
/**
 * Reconnects datasource when there is a connection failure.
 */
export var reconnectDatasource = function (exploreId) {
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var instance;
        return tslib_1.__generator(this, function (_a) {
            instance = getState().explore[exploreId].datasourceInstance;
            dispatch(changeDatasource(exploreId, instance.name));
            return [2 /*return*/];
        });
    }); };
};
/**
 * Main action to asynchronously load a datasource. Dispatches lots of smaller actions for feedback.
 */
export function loadDatasource(exploreId, instance, orgId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var datasourceName;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    datasourceName = instance.name;
                    // Keep ID to track selection
                    dispatch(loadDatasourcePendingAction({ exploreId: exploreId, requestedDatasourceName: datasourceName }));
                    return [4 /*yield*/, dispatch(testDatasource(exploreId, instance))];
                case 1:
                    _a.sent();
                    if (datasourceName !== getState().explore[exploreId].requestedDatasourceName) {
                        // User already changed datasource again, discard results
                        return [2 /*return*/];
                    }
                    if (instance.init) {
                        try {
                            instance.init();
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    if (datasourceName !== getState().explore[exploreId].requestedDatasourceName) {
                        // User already changed datasource again, discard results
                        return [2 /*return*/];
                    }
                    dispatch(loadDatasourceReady(exploreId, instance, orgId));
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Action to modify a query given a datasource-specific modifier action.
 * @param exploreId Explore area
 * @param modification Action object with a type, e.g., ADD_FILTER
 * @param index Optional query row index. If omitted, the modification is applied to all query rows.
 * @param modifier Function that executes the modification, typically `datasourceInstance.modifyQueries`.
 */
export function modifyQueries(exploreId, modification, index, modifier) {
    return function (dispatch) {
        dispatch(modifyQueriesAction({ exploreId: exploreId, modification: modification, index: index, modifier: modifier }));
        if (!modification.preventSubmit) {
            dispatch(runQueries(exploreId));
        }
    };
}
/**
 * Main action to run queries and dispatches sub-actions based on which result viewers are active
 */
export function runQueries(exploreId) {
    return function (dispatch, getState) {
        dispatch(updateTime({ exploreId: exploreId }));
        var exploreItemState = getState().explore[exploreId];
        var datasourceInstance = exploreItemState.datasourceInstance, queries = exploreItemState.queries, datasourceError = exploreItemState.datasourceError, containerWidth = exploreItemState.containerWidth, live = exploreItemState.isLive, range = exploreItemState.range, scanning = exploreItemState.scanning, queryResponse = exploreItemState.queryResponse, querySubscription = exploreItemState.querySubscription, history = exploreItemState.history, mode = exploreItemState.mode, showingGraph = exploreItemState.showingGraph, showingTable = exploreItemState.showingTable;
        if (datasourceError) {
            // let's not run any queries if data source is in a faulty state
            return;
        }
        if (!hasNonEmptyQuery(queries)) {
            dispatch(clearQueriesAction({ exploreId: exploreId }));
            dispatch(stateSave()); // Remember to save to state and update location
            return;
        }
        // Some datasource's query builders allow per-query interval limits,
        // but we're using the datasource interval limit for now
        var minInterval = datasourceInstance.interval;
        stopQueryState(querySubscription);
        var queryOptions = {
            minInterval: minInterval,
            // This is used for logs streaming for buffer size, with undefined it falls back to datasource config if it
            // supports that.
            maxDataPoints: mode === ExploreMode.Logs ? undefined : containerWidth,
            liveStreaming: live,
            showingGraph: showingGraph,
            showingTable: showingTable,
        };
        var datasourceId = datasourceInstance.meta.id;
        var transaction = buildQueryTransaction(queries, queryOptions, range, scanning);
        var firstResponse = true;
        var newQuerySub = runRequest(datasourceInstance, transaction.request)
            .pipe(
        // Simple throttle for live tailing, in case of > 1000 rows per interval we spend about 200ms on processing and
        // rendering. In case this is optimized this can be tweaked, but also it should be only as fast as user
        // actually can see what is happening.
        live ? throttleTime(500) : identity, map(function (data) { return preProcessPanelData(data, queryResponse); }))
            .subscribe(function (data) {
            if (!data.error && firstResponse) {
                // Side-effect: Saving history in localstorage
                var nextHistory = updateHistory(history, datasourceId, queries);
                dispatch(historyUpdatedAction({ exploreId: exploreId, history: nextHistory }));
                dispatch(stateSave());
            }
            firstResponse = false;
            dispatch(queryStreamUpdatedAction({ exploreId: exploreId, response: data }));
            // Keep scanning for results if this was the last scanning transaction
            if (getState().explore[exploreId].scanning) {
                if (data.state === LoadingState.Done && data.series.length === 0) {
                    var range_1 = getShiftedTimeRange(-1, getState().explore[exploreId].range);
                    dispatch(updateTime({ exploreId: exploreId, absoluteRange: range_1 }));
                    dispatch(runQueries(exploreId));
                }
                else {
                    // We can stop scanning if we have a result
                    dispatch(scanStopAction({ exploreId: exploreId }));
                }
            }
        });
        dispatch(queryStoreSubscriptionAction({ exploreId: exploreId, querySubscription: newQuerySub }));
    };
}
var toRawTimeRange = function (range) {
    var from = range.raw.from;
    if (isDateTime(from)) {
        from = from.valueOf().toString(10);
    }
    var to = range.raw.to;
    if (isDateTime(to)) {
        to = to.valueOf().toString(10);
    }
    return {
        from: from,
        to: to,
    };
};
export var stateSave = function () {
    return function (dispatch, getState) {
        var _a = getState().explore, left = _a.left, right = _a.right, split = _a.split;
        var orgId = getState().user.orgId.toString();
        var replace = left && left.urlReplaced === false;
        var urlStates = { orgId: orgId };
        var leftUrlState = {
            datasource: left.datasourceInstance.name,
            queries: left.queries.map(clearQueryKeys),
            range: toRawTimeRange(left.range),
            mode: left.mode,
            ui: {
                showingGraph: left.showingGraph,
                showingLogs: true,
                showingTable: left.showingTable,
                dedupStrategy: left.dedupStrategy,
            },
        };
        urlStates.left = serializeStateToUrlParam(leftUrlState, true);
        if (split) {
            var rightUrlState = {
                datasource: right.datasourceInstance.name,
                queries: right.queries.map(clearQueryKeys),
                range: toRawTimeRange(right.range),
                mode: right.mode,
                ui: {
                    showingGraph: right.showingGraph,
                    showingLogs: true,
                    showingTable: right.showingTable,
                    dedupStrategy: right.dedupStrategy,
                },
            };
            urlStates.right = serializeStateToUrlParam(rightUrlState, true);
        }
        dispatch(updateLocation({ query: urlStates, replace: replace }));
        if (replace) {
            dispatch(setUrlReplacedAction({ exploreId: ExploreId.left }));
        }
    };
};
export var updateTime = function (config) {
    return function (dispatch, getState) {
        var exploreId = config.exploreId, absRange = config.absoluteRange, actionRange = config.rawRange;
        var itemState = getState().explore[exploreId];
        var timeZone = getTimeZone(getState().user);
        var rangeInState = itemState.range;
        var rawRange = rangeInState.raw;
        if (absRange) {
            rawRange = {
                from: dateTimeForTimeZone(timeZone, absRange.from),
                to: dateTimeForTimeZone(timeZone, absRange.to),
            };
        }
        if (actionRange) {
            rawRange = actionRange;
        }
        var range = getTimeRange(timeZone, rawRange);
        var absoluteRange = { from: range.from.valueOf(), to: range.to.valueOf() };
        getTimeSrv().init({
            time: range.raw,
            refresh: false,
            getTimezone: function () { return timeZone; },
            timeRangeUpdated: function () { return undefined; },
        });
        dispatch(changeRangeAction({ exploreId: exploreId, range: range, absoluteRange: absoluteRange }));
    };
};
/**
 * Start a scan for more results using the given scanner.
 * @param exploreId Explore area
 * @param scanner Function that a) returns a new time range and b) triggers a query run for the new range
 */
export function scanStart(exploreId) {
    return function (dispatch, getState) {
        // Register the scanner
        dispatch(scanStartAction({ exploreId: exploreId }));
        // Scanning must trigger query run, and return the new range
        var range = getShiftedTimeRange(-1, getState().explore[exploreId].range);
        // Set the new range to be displayed
        dispatch(updateTime({ exploreId: exploreId, absoluteRange: range }));
        dispatch(runQueries(exploreId));
    };
}
/**
 * Reset queries to the given queries. Any modifications will be discarded.
 * Use this action for clicks on query examples. Triggers a query run.
 */
export function setQueries(exploreId, rawQueries) {
    return function (dispatch, getState) {
        // Inject react keys into query objects
        var queries = getState().explore[exploreId].queries;
        var nextQueries = rawQueries.map(function (query, index) { return generateNewKeyAndAddRefIdIfMissing(query, queries, index); });
        dispatch(setQueriesAction({ exploreId: exploreId, queries: nextQueries }));
        dispatch(runQueries(exploreId));
    };
}
/**
 * Close the split view and save URL state.
 */
export function splitClose(itemId) {
    return function (dispatch) {
        dispatch(splitCloseAction({ itemId: itemId }));
        dispatch(stateSave());
    };
}
/**
 * Open the split view and copy the left state to be the right state.
 * The right state is automatically initialized.
 * The copy keeps all query modifications but wipes the query results.
 */
export function splitOpen() {
    return function (dispatch, getState) {
        // Clone left state to become the right state
        var leftState = getState().explore[ExploreId.left];
        var queryState = getState().location.query[ExploreId.left];
        var urlState = parseUrlState(queryState);
        var itemState = tslib_1.__assign({}, leftState, { queries: leftState.queries.slice(), urlState: urlState });
        dispatch(splitOpenAction({ itemState: itemState }));
        dispatch(stateSave());
    };
}
/**
 * Creates action to collapse graph/logs/table panel. When panel is collapsed,
 * queries won't be run
 */
var togglePanelActionCreator = function (actionCreator) { return function (exploreId, isPanelVisible) {
    return function (dispatch) {
        var uiFragmentStateUpdate;
        var shouldRunQueries = !isPanelVisible;
        switch (actionCreator.type) {
            case toggleGraphAction.type:
                uiFragmentStateUpdate = { showingGraph: !isPanelVisible };
                break;
            case toggleTableAction.type:
                uiFragmentStateUpdate = { showingTable: !isPanelVisible };
                break;
        }
        dispatch(actionCreator({ exploreId: exploreId }));
        dispatch(updateExploreUIState(exploreId, uiFragmentStateUpdate));
        if (shouldRunQueries) {
            dispatch(runQueries(exploreId));
        }
    };
}; };
/**
 * Expand/collapse the graph result viewer. When collapsed, graph queries won't be run.
 */
export var toggleGraph = togglePanelActionCreator(toggleGraphAction);
/**
 * Expand/collapse the table result viewer. When collapsed, table queries won't be run.
 */
export var toggleTable = togglePanelActionCreator(toggleTableAction);
/**
 * Change logs deduplication strategy and update URL.
 */
export var changeDedupStrategy = function (exploreId, dedupStrategy) {
    return function (dispatch) {
        dispatch(updateExploreUIState(exploreId, { dedupStrategy: dedupStrategy }));
    };
};
export function refreshExplore(exploreId) {
    return function (dispatch, getState) {
        var itemState = getState().explore[exploreId];
        if (!itemState.initialized) {
            return;
        }
        var urlState = itemState.urlState, update = itemState.update, containerWidth = itemState.containerWidth, eventBridge = itemState.eventBridge;
        var datasource = urlState.datasource, queries = urlState.queries, urlRange = urlState.range, mode = urlState.mode, ui = urlState.ui, originPanelId = urlState.originPanelId;
        var refreshQueries = [];
        for (var index = 0; index < queries.length; index++) {
            var query = queries[index];
            refreshQueries.push(generateNewKeyAndAddRefIdIfMissing(query, refreshQueries, index));
        }
        var timeZone = getTimeZone(getState().user);
        var range = getTimeRangeFromUrl(urlRange, timeZone);
        // need to refresh datasource
        if (update.datasource) {
            var initialQueries = ensureQueries(queries);
            dispatch(initializeExplore(exploreId, datasource, initialQueries, range, mode, containerWidth, eventBridge, ui, originPanelId));
            return;
        }
        if (update.range) {
            dispatch(updateTime({ exploreId: exploreId, rawRange: range.raw }));
        }
        // need to refresh ui state
        if (update.ui) {
            dispatch(updateUIStateAction(tslib_1.__assign({}, ui, { exploreId: exploreId })));
        }
        // need to refresh queries
        if (update.queries) {
            dispatch(setQueriesAction({ exploreId: exploreId, queries: refreshQueries }));
        }
        // need to refresh mode
        if (update.mode) {
            dispatch(changeModeAction({ exploreId: exploreId, mode: mode }));
        }
        // always run queries when refresh is needed
        if (update.queries || update.ui || update.range) {
            dispatch(runQueries(exploreId));
        }
    };
}
//# sourceMappingURL=actions.js.map
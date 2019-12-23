import { actionCreatorFactory } from 'app/core/redux/actionCreatorFactory';
/**  Higher order actions
 *
 */
export var ActionTypes;
(function (ActionTypes) {
    ActionTypes["SplitOpen"] = "explore/SPLIT_OPEN";
    ActionTypes["ResetExplore"] = "explore/RESET_EXPLORE";
})(ActionTypes || (ActionTypes = {}));
/**
 * Adds a query row after the row with the given index.
 */
export var addQueryRowAction = actionCreatorFactory('explore/ADD_QUERY_ROW').create();
/**
 * Change the mode of Explore.
 */
export var changeModeAction = actionCreatorFactory('explore/CHANGE_MODE').create();
/**
 * Query change handler for the query row with the given index.
 * If `override` is reset the query modifications and run the queries. Use this to set queries via a link.
 */
export var changeQueryAction = actionCreatorFactory('explore/CHANGE_QUERY').create();
/**
 * Keep track of the Explore container size, in particular the width.
 * The width will be used to calculate graph intervals (number of datapoints).
 */
export var changeSizeAction = actionCreatorFactory('explore/CHANGE_SIZE').create();
/**
 * Change the time range of Explore. Usually called from the Timepicker or a graph interaction.
 */
export var changeRefreshIntervalAction = actionCreatorFactory('explore/CHANGE_REFRESH_INTERVAL').create();
/**
 * Clear all queries and results.
 */
export var clearQueriesAction = actionCreatorFactory('explore/CLEAR_QUERIES').create();
/**
 * Clear origin panel id.
 */
export var clearOriginAction = actionCreatorFactory('explore/CLEAR_ORIGIN').create();
/**
 * Highlight expressions in the log results
 */
export var highlightLogsExpressionAction = actionCreatorFactory('explore/HIGHLIGHT_LOGS_EXPRESSION').create();
/**
 * Initialize Explore state with state from the URL and the React component.
 * Call this only on components for with the Explore state has not been initialized.
 */
export var initializeExploreAction = actionCreatorFactory('explore/INITIALIZE_EXPLORE').create();
/**
 * Display an error when no datasources have been configured
 */
export var loadDatasourceMissingAction = actionCreatorFactory('explore/LOAD_DATASOURCE_MISSING').create();
/**
 * Start the async process of loading a datasource to display a loading indicator
 */
export var loadDatasourcePendingAction = actionCreatorFactory('explore/LOAD_DATASOURCE_PENDING').create();
/**
 * Datasource loading was completed.
 */
export var loadDatasourceReadyAction = actionCreatorFactory('explore/LOAD_DATASOURCE_READY').create();
/**
 * Action to modify a query given a datasource-specific modifier action.
 * @param exploreId Explore area
 * @param modification Action object with a type, e.g., ADD_FILTER
 * @param index Optional query row index. If omitted, the modification is applied to all query rows.
 * @param modifier Function that executes the modification, typically `datasourceInstance.modifyQueries`.
 */
export var modifyQueriesAction = actionCreatorFactory('explore/MODIFY_QUERIES').create();
export var queryStartAction = actionCreatorFactory('explore/QUERY_START').create();
export var queryEndedAction = actionCreatorFactory('explore/QUERY_ENDED').create();
export var queryStreamUpdatedAction = actionCreatorFactory('explore/QUERY_STREAM_UPDATED').create();
export var queryStoreSubscriptionAction = actionCreatorFactory('explore/QUERY_STORE_SUBSCRIPTION').create();
/**
 * Remove query row of the given index, as well as associated query results.
 */
export var removeQueryRowAction = actionCreatorFactory('explore/REMOVE_QUERY_ROW').create();
/**
 * Start a scan for more results using the given scanner.
 * @param exploreId Explore area
 * @param scanner Function that a) returns a new time range and b) triggers a query run for the new range
 */
export var scanStartAction = actionCreatorFactory('explore/SCAN_START').create();
/**
 * Stop any scanning for more results.
 */
export var scanStopAction = actionCreatorFactory('explore/SCAN_STOP').create();
/**
 * Reset queries to the given queries. Any modifications will be discarded.
 * Use this action for clicks on query examples. Triggers a query run.
 */
export var setQueriesAction = actionCreatorFactory('explore/SET_QUERIES').create();
/**
 * Close the split view and save URL state.
 */
export var splitCloseAction = actionCreatorFactory('explore/SPLIT_CLOSE').create();
/**
 * Open the split view and copy the left state to be the right state.
 * The right state is automatically initialized.
 * The copy keeps all query modifications but wipes the query results.
 */
export var splitOpenAction = actionCreatorFactory('explore/SPLIT_OPEN').create();
/**
 * Update state of Explores UI elements (panels visiblity and deduplication  strategy)
 */
export var updateUIStateAction = actionCreatorFactory('explore/UPDATE_UI_STATE').create();
/**
 * Expand/collapse the table result viewer. When collapsed, table queries won't be run.
 */
export var toggleTableAction = actionCreatorFactory('explore/TOGGLE_TABLE').create();
/**
 * Expand/collapse the graph result viewer. When collapsed, graph queries won't be run.
 */
export var toggleGraphAction = actionCreatorFactory('explore/TOGGLE_GRAPH').create();
/**
 * Updates datasource instance before datasouce loading has started
 */
export var updateDatasourceInstanceAction = actionCreatorFactory('explore/UPDATE_DATASOURCE_INSTANCE').create();
export var toggleLogLevelAction = actionCreatorFactory('explore/TOGGLE_LOG_LEVEL').create();
/**
 * Resets state for explore.
 */
export var resetExploreAction = actionCreatorFactory('explore/RESET_EXPLORE').create();
export var queriesImportedAction = actionCreatorFactory('explore/QueriesImported').create();
export var testDataSourcePendingAction = actionCreatorFactory('explore/TEST_DATASOURCE_PENDING').create();
export var testDataSourceSuccessAction = actionCreatorFactory('explore/TEST_DATASOURCE_SUCCESS').create();
export var testDataSourceFailureAction = actionCreatorFactory('explore/TEST_DATASOURCE_FAILURE').create();
export var loadExploreDatasources = actionCreatorFactory('explore/LOAD_EXPLORE_DATASOURCES').create();
export var historyUpdatedAction = actionCreatorFactory('explore/HISTORY_UPDATED').create();
export var setUrlReplacedAction = actionCreatorFactory('explore/SET_URL_REPLACED').create();
export var changeRangeAction = actionCreatorFactory('explore/CHANGE_RANGE').create();
export var changeLoadingStateAction = actionCreatorFactory('changeLoadingStateAction').create();
export var setPausedStateAction = actionCreatorFactory('explore/SET_PAUSED_STATE').create();
//# sourceMappingURL=actionTypes.js.map
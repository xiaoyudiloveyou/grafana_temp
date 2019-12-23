import * as tslib_1 from "tslib";
// Libraries
import React from 'react';
import { hot } from 'react-hot-loader';
import { css } from 'emotion';
// @ts-ignore
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import memoizeOne from 'memoize-one';
// Services & Utils
import store from 'app/core/store';
// Components
import { Alert, ErrorBoundaryAlert } from '@grafana/ui';
import LogsContainer from './LogsContainer';
import QueryRows from './QueryRows';
import TableContainer from './TableContainer';
// Actions
import { changeSize, initializeExplore, modifyQueries, scanStart, setQueries, refreshExplore, reconnectDatasource, updateTimeRange, toggleGraph, } from './state/actions';
import { ExploreMode, } from 'app/types/explore';
import { ensureQueries, DEFAULT_RANGE, DEFAULT_UI_STATE, getTimeRangeFromUrl, lastUsedDatasourceKeyForOrgId, } from 'app/core/utils/explore';
import { Emitter } from 'app/core/utils/emitter';
import { ExploreToolbar } from './ExploreToolbar';
import { NoDataSourceCallToAction } from './NoDataSourceCallToAction';
import { FadeIn } from 'app/core/components/Animations/FadeIn';
import { getTimeZone } from '../profile/state/selectors';
import { ErrorContainer } from './ErrorContainer';
import { scanStopAction } from './state/actionTypes';
import { ExploreGraphPanel } from './ExploreGraphPanel';
var getStyles = memoizeOne(function () {
    return {
        logsMain: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n      label: logsMain;\n      // Is needed for some transition animations to work.\n      position: relative;\n    "], ["\n      label: logsMain;\n      // Is needed for some transition animations to work.\n      position: relative;\n    "]))),
    };
});
/**
 * Explore provides an area for quick query iteration for a given datasource.
 * Once a datasource is selected it populates the query section at the top.
 * When queries are run, their results are being displayed in the main section.
 * The datasource determines what kind of query editor it brings, and what kind
 * of results viewers it supports. The state is managed entirely in Redux.
 *
 * SPLIT VIEW
 *
 * Explore can have two Explore areas side-by-side. This is handled in `Wrapper.tsx`.
 * Since there can be multiple Explores (e.g., left and right) each action needs
 * the `exploreId` as first parameter so that the reducer knows which Explore state
 * is affected.
 *
 * DATASOURCE REQUESTS
 *
 * A click on Run Query creates transactions for all DataQueries for all expanded
 * result viewers. New runs are discarding previous runs. Upon completion a transaction
 * saves the result. The result viewers construct their data from the currently existing
 * transactions.
 *
 * The result viewers determine some of the query options sent to the datasource, e.g.,
 * `format`, to indicate eventual transformations by the datasources' result transformers.
 */
var Explore = /** @class */ (function (_super) {
    tslib_1.__extends(Explore, _super);
    function Explore(props) {
        var _this = _super.call(this, props) || this;
        _this.getRef = function (el) {
            _this.el = el;
        };
        _this.onChangeTime = function (rawRange) {
            var _a = _this.props, updateTimeRange = _a.updateTimeRange, exploreId = _a.exploreId;
            updateTimeRange({ exploreId: exploreId, rawRange: rawRange });
        };
        // Use this in help pages to set page to a single query
        _this.onClickExample = function (query) {
            _this.props.setQueries(_this.props.exploreId, [query]);
        };
        _this.onClickLabel = function (key, value) {
            _this.onModifyQueries({ type: 'ADD_FILTER', key: key, value: value });
        };
        _this.onModifyQueries = function (action, index) {
            var datasourceInstance = _this.props.datasourceInstance;
            if (datasourceInstance && datasourceInstance.modifyQuery) {
                var modifier = function (queries, modification) { return datasourceInstance.modifyQuery(queries, modification); };
                _this.props.modifyQueries(_this.props.exploreId, action, index, modifier);
            }
        };
        _this.onResize = function (size) {
            _this.props.changeSize(_this.props.exploreId, size);
        };
        _this.onStartScanning = function () {
            // Scanner will trigger a query
            _this.props.scanStart(_this.props.exploreId);
        };
        _this.onStopScanning = function () {
            _this.props.scanStopAction({ exploreId: _this.props.exploreId });
        };
        _this.onToggleGraph = function (showingGraph) {
            var _a = _this.props, toggleGraph = _a.toggleGraph, exploreId = _a.exploreId;
            toggleGraph(exploreId, showingGraph);
        };
        _this.onUpdateTimeRange = function (absoluteRange) {
            var _a = _this.props, updateTimeRange = _a.updateTimeRange, exploreId = _a.exploreId;
            updateTimeRange({ exploreId: exploreId, absoluteRange: absoluteRange });
        };
        _this.refreshExplore = function () {
            var _a = _this.props, exploreId = _a.exploreId, update = _a.update;
            if (update.queries || update.ui || update.range || update.datasource || update.mode) {
                _this.props.refreshExplore(exploreId);
            }
        };
        _this.renderEmptyState = function () {
            return (React.createElement("div", { className: "explore-container" },
                React.createElement(NoDataSourceCallToAction, null)));
        };
        _this.onReconnect = function (event) {
            var _a = _this.props, exploreId = _a.exploreId, reconnectDatasource = _a.reconnectDatasource;
            event.preventDefault();
            reconnectDatasource(exploreId);
        };
        _this.exploreEvents = new Emitter();
        return _this;
    }
    Explore.prototype.componentDidMount = function () {
        var _a = this.props, initialized = _a.initialized, exploreId = _a.exploreId, initialDatasource = _a.initialDatasource, initialQueries = _a.initialQueries, initialRange = _a.initialRange, mode = _a.mode, initialUI = _a.initialUI, originPanelId = _a.originPanelId;
        var width = this.el ? this.el.offsetWidth : 0;
        // initialize the whole explore first time we mount and if browser history contains a change in datasource
        if (!initialized) {
            this.props.initializeExplore(exploreId, initialDatasource, initialQueries, initialRange, mode, width, this.exploreEvents, initialUI, originPanelId);
        }
    };
    Explore.prototype.componentWillUnmount = function () {
        this.exploreEvents.removeAllListeners();
    };
    Explore.prototype.componentDidUpdate = function (prevProps) {
        this.refreshExplore();
    };
    Explore.prototype.render = function () {
        var _this = this;
        var _a = this.props, StartPage = _a.StartPage, datasourceInstance = _a.datasourceInstance, datasourceError = _a.datasourceError, datasourceLoading = _a.datasourceLoading, datasourceMissing = _a.datasourceMissing, exploreId = _a.exploreId, showingStartPage = _a.showingStartPage, split = _a.split, queryKeys = _a.queryKeys, mode = _a.mode, graphResult = _a.graphResult, loading = _a.loading, absoluteRange = _a.absoluteRange, showingGraph = _a.showingGraph, showingTable = _a.showingTable, timeZone = _a.timeZone, queryResponse = _a.queryResponse;
        var exploreClass = split ? 'explore explore-split' : 'explore';
        var styles = getStyles();
        return (React.createElement("div", { className: exploreClass, ref: this.getRef },
            React.createElement(ExploreToolbar, { exploreId: exploreId, onChangeTime: this.onChangeTime }),
            datasourceLoading ? React.createElement("div", { className: "explore-container" }, "Loading datasource...") : null,
            datasourceMissing ? this.renderEmptyState() : null,
            React.createElement(FadeIn, { duration: datasourceError ? 150 : 5, in: datasourceError ? true : false },
                React.createElement("div", { className: "explore-container" },
                    React.createElement(Alert, { title: "Error connecting to datasource: " + datasourceError, button: { text: 'Reconnect', onClick: this.onReconnect } }))),
            datasourceInstance && (React.createElement("div", { className: "explore-container" },
                React.createElement(QueryRows, { exploreEvents: this.exploreEvents, exploreId: exploreId, queryKeys: queryKeys }),
                React.createElement(ErrorContainer, { queryErrors: [queryResponse.error] }),
                React.createElement(AutoSizer, { onResize: this.onResize, disableHeight: true }, function (_a) {
                    var width = _a.width;
                    if (width === 0) {
                        return null;
                    }
                    return (React.createElement("main", { className: "m-t-2 " + styles.logsMain, style: { width: width } },
                        React.createElement(ErrorBoundaryAlert, null,
                            showingStartPage && (React.createElement("div", { className: "grafana-info-box grafana-info-box--max-lg" },
                                React.createElement(StartPage, { onClickExample: _this.onClickExample, datasource: datasourceInstance }))),
                            !showingStartPage && (React.createElement(React.Fragment, null,
                                mode === ExploreMode.Metrics && (React.createElement(ExploreGraphPanel, { series: graphResult, width: width, loading: loading, absoluteRange: absoluteRange, isStacked: false, showPanel: true, showingGraph: showingGraph, showingTable: showingTable, timeZone: timeZone, onToggleGraph: _this.onToggleGraph, onUpdateTimeRange: _this.onUpdateTimeRange, showBars: false, showLines: true })),
                                mode === ExploreMode.Metrics && (React.createElement(TableContainer, { exploreId: exploreId, onClickCell: _this.onClickLabel })),
                                mode === ExploreMode.Logs && (React.createElement(LogsContainer, { width: width, exploreId: exploreId, onClickLabel: _this.onClickLabel, onStartScanning: _this.onStartScanning, onStopScanning: _this.onStopScanning })))))));
                })))));
    };
    return Explore;
}(React.PureComponent));
export { Explore };
var ensureQueriesMemoized = memoizeOne(ensureQueries);
var getTimeRangeFromUrlMemoized = memoizeOne(getTimeRangeFromUrl);
function mapStateToProps(state, _a) {
    var exploreId = _a.exploreId;
    var explore = state.explore;
    var split = explore.split;
    var item = explore[exploreId];
    var timeZone = getTimeZone(state.user);
    var StartPage = item.StartPage, datasourceError = item.datasourceError, datasourceInstance = item.datasourceInstance, datasourceLoading = item.datasourceLoading, datasourceMissing = item.datasourceMissing, initialized = item.initialized, showingStartPage = item.showingStartPage, queryKeys = item.queryKeys, urlState = item.urlState, update = item.update, isLive = item.isLive, supportedModes = item.supportedModes, mode = item.mode, graphResult = item.graphResult, loading = item.loading, showingGraph = item.showingGraph, showingTable = item.showingTable, absoluteRange = item.absoluteRange, queryResponse = item.queryResponse;
    var _b = (urlState ||
        {}), datasource = _b.datasource, queries = _b.queries, urlRange = _b.range, urlMode = _b.mode, ui = _b.ui, originPanelId = _b.originPanelId;
    var initialDatasource = datasource || store.get(lastUsedDatasourceKeyForOrgId(state.user.orgId));
    var initialQueries = ensureQueriesMemoized(queries);
    var initialRange = urlRange ? getTimeRangeFromUrlMemoized(urlRange, timeZone).raw : DEFAULT_RANGE;
    var newMode;
    if (supportedModes.length) {
        var urlModeIsValid = supportedModes.includes(urlMode);
        var modeStateIsValid = supportedModes.includes(mode);
        if (modeStateIsValid) {
            newMode = mode;
        }
        else if (urlModeIsValid) {
            newMode = urlMode;
        }
        else {
            newMode = supportedModes[0];
        }
    }
    else {
        newMode = [ExploreMode.Metrics, ExploreMode.Logs].includes(mode) ? mode : ExploreMode.Metrics;
    }
    var initialUI = ui || DEFAULT_UI_STATE;
    return {
        StartPage: StartPage,
        datasourceError: datasourceError,
        datasourceInstance: datasourceInstance,
        datasourceLoading: datasourceLoading,
        datasourceMissing: datasourceMissing,
        initialized: initialized,
        showingStartPage: showingStartPage,
        split: split,
        queryKeys: queryKeys,
        update: update,
        initialDatasource: initialDatasource,
        initialQueries: initialQueries,
        initialRange: initialRange,
        mode: newMode,
        initialUI: initialUI,
        isLive: isLive,
        graphResult: graphResult,
        loading: loading,
        showingGraph: showingGraph,
        showingTable: showingTable,
        absoluteRange: absoluteRange,
        queryResponse: queryResponse,
        originPanelId: originPanelId,
    };
}
var mapDispatchToProps = {
    changeSize: changeSize,
    initializeExplore: initializeExplore,
    modifyQueries: modifyQueries,
    reconnectDatasource: reconnectDatasource,
    refreshExplore: refreshExplore,
    scanStart: scanStart,
    scanStopAction: scanStopAction,
    setQueries: setQueries,
    updateTimeRange: updateTimeRange,
    toggleGraph: toggleGraph,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Explore));
var templateObject_1;
//# sourceMappingURL=Explore.js.map
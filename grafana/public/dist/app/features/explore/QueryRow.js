import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import has from 'lodash/has';
import { hot } from 'react-hot-loader';
// @ts-ignore
import { connect } from 'react-redux';
// Components
import QueryEditor from './QueryEditor';
// Actions
import { changeQuery, modifyQueries, runQueries, addQueryRow } from './state/actions';
import { DataSourceStatus } from '@grafana/ui';
import { ExploreMode } from 'app/types/explore';
import { highlightLogsExpressionAction, removeQueryRowAction } from './state/actionTypes';
import QueryStatus from './QueryStatus';
var QueryRow = /** @class */ (function (_super) {
    tslib_1.__extends(QueryRow, _super);
    function QueryRow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            textEditModeEnabled: false,
        };
        _this.onRunQuery = function () {
            var exploreId = _this.props.exploreId;
            _this.props.runQueries(exploreId);
        };
        _this.onChange = function (query, override) {
            var _a = _this.props, datasourceInstance = _a.datasourceInstance, exploreId = _a.exploreId, index = _a.index;
            _this.props.changeQuery(exploreId, query, index, override);
            if (query && !override && datasourceInstance.getHighlighterExpression && index === 0) {
                // Live preview of log search matches. Only use on first row for now
                _this.updateLogsHighlights(query);
            }
        };
        _this.onClickAddButton = function () {
            var _a = _this.props, exploreId = _a.exploreId, index = _a.index;
            _this.props.addQueryRow(exploreId, index);
        };
        _this.onClickClearButton = function () {
            _this.onChange(null, true);
        };
        _this.onClickHintFix = function (action) {
            var _a = _this.props, datasourceInstance = _a.datasourceInstance, exploreId = _a.exploreId, index = _a.index;
            if (datasourceInstance && datasourceInstance.modifyQuery) {
                var modifier = function (queries, action) { return datasourceInstance.modifyQuery(queries, action); };
                _this.props.modifyQueries(exploreId, action, index, modifier);
            }
        };
        _this.onClickRemoveButton = function () {
            var _a = _this.props, exploreId = _a.exploreId, index = _a.index;
            _this.props.removeQueryRowAction({ exploreId: exploreId, index: index });
            _this.props.runQueries(exploreId);
        };
        _this.onClickToggleEditorMode = function () {
            _this.setState({ textEditModeEnabled: !_this.state.textEditModeEnabled });
        };
        _this.updateLogsHighlights = debounce(function (value) {
            var datasourceInstance = _this.props.datasourceInstance;
            if (datasourceInstance.getHighlighterExpression) {
                var exploreId = _this.props.exploreId;
                var expressions = datasourceInstance.getHighlighterExpression(value);
                _this.props.highlightLogsExpressionAction({ exploreId: exploreId, expressions: expressions });
            }
        }, 500);
        return _this;
    }
    QueryRow.prototype.componentWillUnmount = function () {
        console.log('QueryRow will unmount');
    };
    QueryRow.prototype.render = function () {
        var _a = this.props, datasourceInstance = _a.datasourceInstance, history = _a.history, query = _a.query, exploreEvents = _a.exploreEvents, range = _a.range, absoluteRange = _a.absoluteRange, datasourceStatus = _a.datasourceStatus, queryResponse = _a.queryResponse, latency = _a.latency, mode = _a.mode;
        var canToggleEditorModes = mode === ExploreMode.Metrics && has(datasourceInstance, 'components.QueryCtrl.prototype.toggleEditorMode');
        var queryErrors = queryResponse.error && queryResponse.error.refId === query.refId ? [queryResponse.error] : [];
        var QueryField;
        if (mode === ExploreMode.Metrics && datasourceInstance.components.ExploreMetricsQueryField) {
            QueryField = datasourceInstance.components.ExploreMetricsQueryField;
        }
        else if (mode === ExploreMode.Logs && datasourceInstance.components.ExploreLogsQueryField) {
            QueryField = datasourceInstance.components.ExploreLogsQueryField;
        }
        else {
            QueryField = datasourceInstance.components.ExploreQueryField;
        }
        return (React.createElement("div", { className: "query-row" },
            React.createElement("div", { className: "query-row-field flex-shrink-1" }, QueryField ? (
            //@ts-ignore
            React.createElement(QueryField, { datasource: datasourceInstance, datasourceStatus: datasourceStatus, query: query, history: history, onRunQuery: this.onRunQuery, onHint: this.onClickHintFix, onChange: this.onChange, panelData: null, queryResponse: queryResponse, absoluteRange: absoluteRange })) : (React.createElement(QueryEditor, { error: queryErrors, datasource: datasourceInstance, onQueryChange: this.onChange, onExecuteQuery: this.onRunQuery, initialQuery: query, exploreEvents: exploreEvents, range: range, textEditModeEnabled: this.state.textEditModeEnabled }))),
            React.createElement("div", { className: "query-row-status" },
                React.createElement(QueryStatus, { queryResponse: queryResponse, latency: latency })),
            React.createElement("div", { className: "gf-form-inline flex-shrink-0" },
                canToggleEditorModes && (React.createElement("div", { className: "gf-form" },
                    React.createElement("button", { className: "gf-form-label gf-form-label--btn", onClick: this.onClickToggleEditorMode },
                        React.createElement("i", { className: "fa fa-pencil" })))),
                React.createElement("div", { className: "gf-form" },
                    React.createElement("button", { className: "gf-form-label gf-form-label--btn", onClick: this.onClickClearButton },
                        React.createElement("i", { className: "fa fa-times" }))),
                React.createElement("div", { className: "gf-form" },
                    React.createElement("button", { className: "gf-form-label gf-form-label--btn", onClick: this.onClickAddButton },
                        React.createElement("i", { className: "fa fa-plus" }))),
                React.createElement("div", { className: "gf-form" },
                    React.createElement("button", { className: "gf-form-label gf-form-label--btn", onClick: this.onClickRemoveButton },
                        React.createElement("i", { className: "fa fa-minus" }))))));
    };
    return QueryRow;
}(PureComponent));
export { QueryRow };
function mapStateToProps(state, _a) {
    var exploreId = _a.exploreId, index = _a.index;
    var explore = state.explore;
    var item = explore[exploreId];
    var datasourceInstance = item.datasourceInstance, history = item.history, queries = item.queries, range = item.range, absoluteRange = item.absoluteRange, datasourceError = item.datasourceError, latency = item.latency, mode = item.mode, queryResponse = item.queryResponse;
    var query = queries[index];
    var datasourceStatus = datasourceError ? DataSourceStatus.Disconnected : DataSourceStatus.Connected;
    return {
        datasourceInstance: datasourceInstance,
        history: history,
        query: query,
        range: range,
        absoluteRange: absoluteRange,
        datasourceStatus: datasourceStatus,
        queryResponse: queryResponse,
        latency: latency,
        mode: mode,
    };
}
var mapDispatchToProps = {
    addQueryRow: addQueryRow,
    changeQuery: changeQuery,
    highlightLogsExpressionAction: highlightLogsExpressionAction,
    modifyQueries: modifyQueries,
    removeQueryRowAction: removeQueryRowAction,
    runQueries: runQueries,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(QueryRow));
//# sourceMappingURL=QueryRow.js.map
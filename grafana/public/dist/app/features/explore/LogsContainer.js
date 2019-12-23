import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Collapse, RefreshPicker } from '@grafana/ui';
import { LogsDedupStrategy, } from '@grafana/data';
import { changeDedupStrategy, updateTimeRange } from './state/actions';
import { toggleLogLevelAction, changeRefreshIntervalAction, setPausedStateAction, } from 'app/features/explore/state/actionTypes';
import { deduplicatedLogsSelector, exploreItemUIStateSelector } from 'app/features/explore/state/selectors';
import { getTimeZone } from '../profile/state/selectors';
import { LiveLogsWithTheme } from './LiveLogs';
import { Logs } from './Logs';
import { LogsCrossFadeTransition } from './utils/LogsCrossFadeTransition';
var LogsContainer = /** @class */ (function (_super) {
    tslib_1.__extends(LogsContainer, _super);
    function LogsContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChangeTime = function (absoluteRange) {
            var _a = _this.props, exploreId = _a.exploreId, updateTimeRange = _a.updateTimeRange;
            updateTimeRange({ exploreId: exploreId, absoluteRange: absoluteRange });
        };
        _this.onStopLive = function () {
            var exploreId = _this.props.exploreId;
            _this.onPause();
            _this.props.stopLive({ exploreId: exploreId, refreshInterval: RefreshPicker.offOption.value });
        };
        _this.onPause = function () {
            var exploreId = _this.props.exploreId;
            _this.props.setPausedStateAction({ exploreId: exploreId, isPaused: true });
        };
        _this.onResume = function () {
            var exploreId = _this.props.exploreId;
            _this.props.setPausedStateAction({ exploreId: exploreId, isPaused: false });
        };
        _this.handleDedupStrategyChange = function (dedupStrategy) {
            _this.props.changeDedupStrategy(_this.props.exploreId, dedupStrategy);
        };
        _this.handleToggleLogLevel = function (hiddenLogLevels) {
            var exploreId = _this.props.exploreId;
            _this.props.toggleLogLevelAction({
                exploreId: exploreId,
                hiddenLogLevels: hiddenLogLevels,
            });
        };
        _this.getLogRowContext = function (row, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasourceInstance;
            return tslib_1.__generator(this, function (_a) {
                datasourceInstance = this.props.datasourceInstance;
                if (datasourceInstance) {
                    return [2 /*return*/, datasourceInstance.getLogRowContext(row, options)];
                }
                return [2 /*return*/, []];
            });
        }); };
        return _this;
    }
    LogsContainer.prototype.render = function () {
        var _a = this.props, loading = _a.loading, logsHighlighterExpressions = _a.logsHighlighterExpressions, logsResult = _a.logsResult, dedupedResult = _a.dedupedResult, onClickLabel = _a.onClickLabel, onStartScanning = _a.onStartScanning, onStopScanning = _a.onStopScanning, absoluteRange = _a.absoluteRange, timeZone = _a.timeZone, scanning = _a.scanning, range = _a.range, width = _a.width, isLive = _a.isLive;
        return (React.createElement(React.Fragment, null,
            React.createElement(LogsCrossFadeTransition, { visible: isLive },
                React.createElement(Collapse, { label: "Logs", loading: false, isOpen: true },
                    React.createElement(LiveLogsWithTheme, { logsResult: logsResult, timeZone: timeZone, stopLive: this.onStopLive, isPaused: this.props.isPaused, onPause: this.onPause, onResume: this.onResume }))),
            React.createElement(LogsCrossFadeTransition, { visible: !isLive },
                React.createElement(Collapse, { label: "Logs", loading: loading, isOpen: true },
                    React.createElement(Logs, { dedupStrategy: this.props.dedupStrategy || LogsDedupStrategy.none, data: logsResult, dedupedData: dedupedResult, highlighterExpressions: logsHighlighterExpressions, loading: loading, onChangeTime: this.onChangeTime, onClickLabel: onClickLabel, onStartScanning: onStartScanning, onStopScanning: onStopScanning, onDedupStrategyChange: this.handleDedupStrategyChange, onToggleLogLevel: this.handleToggleLogLevel, absoluteRange: absoluteRange, timeZone: timeZone, scanning: scanning, scanRange: range.raw, width: width, getRowContext: this.getLogRowContext })))));
    };
    return LogsContainer;
}(PureComponent));
export { LogsContainer };
function mapStateToProps(state, _a) {
    var exploreId = _a.exploreId;
    var explore = state.explore;
    // @ts-ignore
    var item = explore[exploreId];
    var logsHighlighterExpressions = item.logsHighlighterExpressions, logsResult = item.logsResult, loading = item.loading, scanning = item.scanning, datasourceInstance = item.datasourceInstance, isLive = item.isLive, isPaused = item.isPaused, range = item.range, absoluteRange = item.absoluteRange;
    var dedupStrategy = exploreItemUIStateSelector(item).dedupStrategy;
    var dedupedResult = deduplicatedLogsSelector(item);
    var timeZone = getTimeZone(state.user);
    return {
        loading: loading,
        logsHighlighterExpressions: logsHighlighterExpressions,
        logsResult: logsResult,
        scanning: scanning,
        timeZone: timeZone,
        dedupStrategy: dedupStrategy,
        dedupedResult: dedupedResult,
        datasourceInstance: datasourceInstance,
        isLive: isLive,
        isPaused: isPaused,
        range: range,
        absoluteRange: absoluteRange,
    };
}
var mapDispatchToProps = {
    changeDedupStrategy: changeDedupStrategy,
    toggleLogLevelAction: toggleLogLevelAction,
    stopLive: changeRefreshIntervalAction,
    updateTimeRange: updateTimeRange,
    setPausedStateAction: setPausedStateAction,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(LogsContainer));
//# sourceMappingURL=LogsContainer.js.map
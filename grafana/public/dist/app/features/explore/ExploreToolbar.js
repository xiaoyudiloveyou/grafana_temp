import * as tslib_1 from "tslib";
import omitBy from 'lodash/omitBy';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import memoizeOne from 'memoize-one';
import classNames from 'classnames';
import { css } from 'emotion';
import { ExploreMode } from 'app/types/explore';
import { ToggleButtonGroup, ToggleButton, Tooltip, ButtonSelect, RefreshPicker, SetInterval, } from '@grafana/ui';
import { DataSourcePicker } from 'app/core/components/Select/DataSourcePicker';
import { changeDatasource, clearQueries, splitClose, runQueries, splitOpen, changeRefreshInterval, changeMode, clearOrigin, } from './state/actions';
import { changeRefreshIntervalAction, setPausedStateAction } from './state/actionTypes';
import { updateLocation } from 'app/core/actions';
import { getTimeZone } from '../profile/state/selectors';
import { getDashboardSrv } from '../dashboard/services/DashboardSrv';
import kbn from '../../core/utils/kbn';
import { ExploreTimeControls } from './ExploreTimeControls';
import { LiveTailButton } from './LiveTailButton';
import { ResponsiveButton } from './ResponsiveButton';
import { RunButton } from './RunButton';
var getStyles = memoizeOne(function () {
    return {
        liveTailButtons: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n      margin-left: 10px;\n    "], ["\n      margin-left: 10px;\n    "]))),
    };
});
var UnConnectedExploreToolbar = /** @class */ (function (_super) {
    tslib_1.__extends(UnConnectedExploreToolbar, _super);
    function UnConnectedExploreToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.onChangeDatasource = function (option) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.props.changeDatasource(this.props.exploreId, option.value);
                return [2 /*return*/];
            });
        }); };
        _this.onClearAll = function () {
            _this.props.clearAll(_this.props.exploreId);
        };
        _this.onRunQuery = function () {
            return _this.props.runQueries(_this.props.exploreId);
        };
        _this.onChangeRefreshInterval = function (item) {
            var _a = _this.props, changeRefreshInterval = _a.changeRefreshInterval, exploreId = _a.exploreId;
            changeRefreshInterval(exploreId, item);
        };
        _this.onModeChange = function (mode) {
            var _a = _this.props, changeMode = _a.changeMode, exploreId = _a.exploreId;
            changeMode(exploreId, mode);
        };
        _this.returnToPanel = function (_a) {
            var _b = (_a === void 0 ? {} : _a).withChanges, withChanges = _b === void 0 ? false : _b;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var originPanelId, dashboardSrv, dash, titleSlug, dashViewOptions;
                return tslib_1.__generator(this, function (_c) {
                    originPanelId = this.props.originPanelId;
                    dashboardSrv = getDashboardSrv();
                    dash = dashboardSrv.getCurrent();
                    titleSlug = kbn.slugifyForUrl(dash.title);
                    if (!withChanges) {
                        this.props.clearOrigin();
                    }
                    dashViewOptions = {
                        fullscreen: withChanges || dash.meta.fullscreen,
                        edit: withChanges || dash.meta.isEditing,
                    };
                    this.props.updateLocation({
                        path: "/d/" + dash.uid + "/:" + titleSlug,
                        query: tslib_1.__assign({}, omitBy(dashViewOptions, function (v) { return !v; }), { panelId: originPanelId }),
                    });
                    return [2 /*return*/];
                });
            });
        };
        _this.stopLive = function () {
            var exploreId = _this.props.exploreId;
            _this.pauseLive();
            // TODO referencing this from perspective of refresh picker when there is designated button for it now is not
            //  great. Needs another refactor.
            _this.props.changeRefreshIntervalAction({ exploreId: exploreId, refreshInterval: RefreshPicker.offOption.value });
        };
        _this.startLive = function () {
            var exploreId = _this.props.exploreId;
            _this.props.changeRefreshIntervalAction({ exploreId: exploreId, refreshInterval: RefreshPicker.liveOption.value });
        };
        _this.pauseLive = function () {
            var exploreId = _this.props.exploreId;
            _this.props.setPausedStateAction({ exploreId: exploreId, isPaused: true });
        };
        _this.resumeLive = function () {
            var exploreId = _this.props.exploreId;
            _this.props.setPausedStateAction({ exploreId: exploreId, isPaused: false });
        };
        return _this;
    }
    UnConnectedExploreToolbar.prototype.render = function () {
        var _this = this;
        var _a = this.props, datasourceMissing = _a.datasourceMissing, exploreDatasources = _a.exploreDatasources, closeSplit = _a.closeSplit, exploreId = _a.exploreId, loading = _a.loading, range = _a.range, timeZone = _a.timeZone, selectedDatasource = _a.selectedDatasource, splitted = _a.splitted, refreshInterval = _a.refreshInterval, onChangeTime = _a.onChangeTime, split = _a.split, supportedModeOptions = _a.supportedModeOptions, selectedModeOption = _a.selectedModeOption, hasLiveOption = _a.hasLiveOption, isLive = _a.isLive, isPaused = _a.isPaused, originPanelId = _a.originPanelId;
        var styles = getStyles();
        var originDashboardIsEditable = Number.isInteger(originPanelId);
        var panelReturnClasses = classNames('btn', 'navbar-button', {
            'btn--radius-right-0': originDashboardIsEditable,
            'navbar-button navbar-button--border-right-0': originDashboardIsEditable,
        });
        return (React.createElement("div", { className: splitted ? 'explore-toolbar splitted' : 'explore-toolbar' },
            React.createElement("div", { className: "explore-toolbar-item" },
                React.createElement("div", { className: "explore-toolbar-header" },
                    React.createElement("div", { className: "explore-toolbar-header-title" }, exploreId === 'left' && (React.createElement("span", { className: "navbar-page-btn" },
                        React.createElement("i", { className: "gicon gicon-explore" }),
                        "Explore"))),
                    splitted && (React.createElement("a", { className: "explore-toolbar-header-close", onClick: function () { return closeSplit(exploreId); } },
                        React.createElement("i", { className: "fa fa-times fa-fw" }))))),
            React.createElement("div", { className: "explore-toolbar-item" },
                React.createElement("div", { className: "explore-toolbar-content" },
                    !datasourceMissing ? (React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement("div", { className: "datasource-picker" },
                            React.createElement(DataSourcePicker, { onChange: this.onChangeDatasource, datasources: exploreDatasources, current: selectedDatasource })),
                        supportedModeOptions.length > 1 ? (React.createElement("div", { className: "query-type-toggle" },
                            React.createElement(ToggleButtonGroup, { label: "", transparent: true },
                                React.createElement(ToggleButton, { key: ExploreMode.Metrics, value: ExploreMode.Metrics, onChange: this.onModeChange, selected: selectedModeOption.value === ExploreMode.Metrics }, 'Metrics'),
                                React.createElement(ToggleButton, { key: ExploreMode.Logs, value: ExploreMode.Logs, onChange: this.onModeChange, selected: selectedModeOption.value === ExploreMode.Logs }, 'Logs')))) : null)) : null,
                    Number.isInteger(originPanelId) && !splitted && (React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement(Tooltip, { content: 'Return to panel', placement: "bottom" },
                            React.createElement("button", { className: panelReturnClasses, onClick: function () { return _this.returnToPanel(); } },
                                React.createElement("i", { className: "fa fa-arrow-left" }))),
                        originDashboardIsEditable && (React.createElement(ButtonSelect, { className: "navbar-button--attached btn--radius-left-0$", options: [{ label: 'Return to panel with changes', value: '' }], onChange: function () { return _this.returnToPanel({ withChanges: true }); }, maxMenuHeight: 380 })))),
                    exploreId === 'left' && !splitted ? (React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement(ResponsiveButton, { splitted: splitted, title: "Split", onClick: split, iconClassName: "fa fa-fw fa-columns icon-margin-right", disabled: isLive }))) : null,
                    !isLive && (React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement(ExploreTimeControls, { exploreId: exploreId, range: range, timeZone: timeZone, onChangeTime: onChangeTime }))),
                    React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement("button", { className: "btn navbar-button", onClick: this.onClearAll }, "Clear All")),
                    React.createElement("div", { className: "explore-toolbar-content-item" },
                        React.createElement(RunButton, { refreshInterval: refreshInterval, onChangeRefreshInterval: this.onChangeRefreshInterval, splitted: splitted, loading: loading || (isLive && !isPaused), onRun: this.onRunQuery, showDropdown: !isLive }),
                        refreshInterval && React.createElement(SetInterval, { func: this.onRunQuery, interval: refreshInterval, loading: loading })),
                    hasLiveOption && (React.createElement("div", { className: "explore-toolbar-content-item " + styles.liveTailButtons },
                        React.createElement(LiveTailButton, { isLive: isLive, isPaused: isPaused, start: this.startLive, pause: this.pauseLive, resume: this.resumeLive, stop: this.stopLive })))))));
    };
    return UnConnectedExploreToolbar;
}(PureComponent));
export { UnConnectedExploreToolbar };
var getModeOptionsMemoized = memoizeOne(function (supportedModes, mode) {
    var e_1, _a;
    var supportedModeOptions = [];
    var selectedModeOption = null;
    try {
        for (var supportedModes_1 = tslib_1.__values(supportedModes), supportedModes_1_1 = supportedModes_1.next(); !supportedModes_1_1.done; supportedModes_1_1 = supportedModes_1.next()) {
            var supportedMode = supportedModes_1_1.value;
            switch (supportedMode) {
                case ExploreMode.Metrics:
                    var option1 = {
                        value: ExploreMode.Metrics,
                        label: ExploreMode.Metrics,
                    };
                    supportedModeOptions.push(option1);
                    if (mode === ExploreMode.Metrics) {
                        selectedModeOption = option1;
                    }
                    break;
                case ExploreMode.Logs:
                    var option2 = {
                        value: ExploreMode.Logs,
                        label: ExploreMode.Logs,
                    };
                    supportedModeOptions.push(option2);
                    if (mode === ExploreMode.Logs) {
                        selectedModeOption = option2;
                    }
                    break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (supportedModes_1_1 && !supportedModes_1_1.done && (_a = supportedModes_1.return)) _a.call(supportedModes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return [supportedModeOptions, selectedModeOption];
});
var mapStateToProps = function (state, _a) {
    var exploreId = _a.exploreId;
    var splitted = state.explore.split;
    var exploreItem = state.explore[exploreId];
    var datasourceInstance = exploreItem.datasourceInstance, datasourceMissing = exploreItem.datasourceMissing, exploreDatasources = exploreItem.exploreDatasources, range = exploreItem.range, refreshInterval = exploreItem.refreshInterval, loading = exploreItem.loading, supportedModes = exploreItem.supportedModes, mode = exploreItem.mode, isLive = exploreItem.isLive, isPaused = exploreItem.isPaused, originPanelId = exploreItem.originPanelId, queries = exploreItem.queries;
    var selectedDatasource = datasourceInstance
        ? exploreDatasources.find(function (datasource) { return datasource.name === datasourceInstance.name; })
        : undefined;
    var hasLiveOption = datasourceInstance && datasourceInstance.meta && datasourceInstance.meta.streaming ? true : false;
    var _b = tslib_1.__read(getModeOptionsMemoized(supportedModes, mode), 2), supportedModeOptions = _b[0], selectedModeOption = _b[1];
    return {
        datasourceMissing: datasourceMissing,
        exploreDatasources: exploreDatasources,
        loading: loading,
        range: range,
        timeZone: getTimeZone(state.user),
        selectedDatasource: selectedDatasource,
        splitted: splitted,
        refreshInterval: refreshInterval,
        supportedModeOptions: supportedModeOptions,
        selectedModeOption: selectedModeOption,
        hasLiveOption: hasLiveOption,
        isLive: isLive,
        isPaused: isPaused,
        originPanelId: originPanelId,
        queries: queries,
    };
};
var mapDispatchToProps = {
    changeDatasource: changeDatasource,
    updateLocation: updateLocation,
    changeRefreshInterval: changeRefreshInterval,
    clearAll: clearQueries,
    runQueries: runQueries,
    closeSplit: splitClose,
    split: splitOpen,
    changeMode: changeMode,
    clearOrigin: clearOrigin,
    changeRefreshIntervalAction: changeRefreshIntervalAction,
    setPausedStateAction: setPausedStateAction,
};
export var ExploreToolbar = hot(module)(connect(mapStateToProps, mapDispatchToProps)(UnConnectedExploreToolbar));
var templateObject_1;
//# sourceMappingURL=ExploreToolbar.js.map
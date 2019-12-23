import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { rangeUtil, LogLevel, LogsMetaKind, LogsDedupStrategy, LogsDedupDescription, } from '@grafana/data';
import { Switch, LogLabels, ToggleButtonGroup, ToggleButton, LogRows } from '@grafana/ui';
import { ExploreGraphPanel } from './ExploreGraphPanel';
function renderMetaItem(value, kind) {
    if (kind === LogsMetaKind.LabelsMap) {
        return (React.createElement("span", { className: "logs-meta-item__labels" },
            React.createElement(LogLabels, { labels: value, plain: true, getRows: function () { return []; } })));
    }
    return value;
}
var Logs = /** @class */ (function (_super) {
    tslib_1.__extends(Logs, _super);
    function Logs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            showLabels: false,
            showTime: true,
        };
        _this.onChangeDedup = function (dedup) {
            var onDedupStrategyChange = _this.props.onDedupStrategyChange;
            if (_this.props.dedupStrategy === dedup) {
                return onDedupStrategyChange(LogsDedupStrategy.none);
            }
            return onDedupStrategyChange(dedup);
        };
        _this.onChangeLabels = function (event) {
            var target = event && event.target;
            if (target) {
                _this.setState({
                    showLabels: target.checked,
                });
            }
        };
        _this.onChangeTime = function (event) {
            var target = event && event.target;
            if (target) {
                _this.setState({
                    showTime: target.checked,
                });
            }
        };
        _this.onToggleLogLevel = function (hiddenRawLevels) {
            var hiddenLogLevels = hiddenRawLevels.map(function (level) { return LogLevel[level]; });
            _this.props.onToggleLogLevel(hiddenLogLevels);
        };
        _this.onClickScan = function (event) {
            event.preventDefault();
            if (_this.props.onStartScanning) {
                _this.props.onStartScanning();
            }
        };
        _this.onClickStopScan = function (event) {
            event.preventDefault();
            if (_this.props.onStopScanning) {
                _this.props.onStopScanning();
            }
        };
        return _this;
    }
    Logs.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, highlighterExpressions = _a.highlighterExpressions, _b = _a.loading, loading = _b === void 0 ? false : _b, onClickLabel = _a.onClickLabel, timeZone = _a.timeZone, scanning = _a.scanning, scanRange = _a.scanRange, width = _a.width, dedupedData = _a.dedupedData, absoluteRange = _a.absoluteRange, onChangeTime = _a.onChangeTime;
        if (!data) {
            return null;
        }
        var _c = this.state, showLabels = _c.showLabels, showTime = _c.showTime;
        var dedupStrategy = this.props.dedupStrategy;
        var hasData = data && data.rows && data.rows.length > 0;
        var dedupCount = dedupedData
            ? dedupedData.rows.reduce(function (sum, row) { return (row.duplicates ? sum + row.duplicates : sum); }, 0)
            : 0;
        var meta = data && data.meta ? tslib_1.__spread(data.meta) : [];
        if (dedupStrategy !== LogsDedupStrategy.none) {
            meta.push({
                label: 'Dedup count',
                value: dedupCount,
                kind: LogsMetaKind.Number,
            });
        }
        var scanText = scanRange ? "Scanning " + rangeUtil.describeTimeRange(scanRange) : 'Scanning...';
        var series = data && data.series ? data.series : [];
        return (React.createElement("div", { className: "logs-panel" },
            React.createElement("div", { className: "logs-panel-graph" },
                React.createElement(ExploreGraphPanel, { series: series, width: width, onHiddenSeriesChanged: this.onToggleLogLevel, loading: loading, absoluteRange: absoluteRange, isStacked: true, showPanel: false, showingGraph: true, showingTable: true, timeZone: timeZone, showBars: true, showLines: false, onUpdateTimeRange: onChangeTime })),
            React.createElement("div", { className: "logs-panel-options" },
                React.createElement("div", { className: "logs-panel-controls" },
                    React.createElement(Switch, { label: "Time", checked: showTime, onChange: this.onChangeTime, transparent: true }),
                    React.createElement(Switch, { label: "Labels", checked: showLabels, onChange: this.onChangeLabels, transparent: true }),
                    React.createElement(ToggleButtonGroup, { label: "Dedup", transparent: true }, Object.keys(LogsDedupStrategy).map(function (dedupType, i) { return (React.createElement(ToggleButton, { key: i, value: dedupType, onChange: _this.onChangeDedup, selected: dedupStrategy === dedupType, 
                        // @ts-ignore
                        tooltip: LogsDedupDescription[dedupType] }, dedupType)); })))),
            hasData && meta && (React.createElement("div", { className: "logs-panel-meta" }, meta.map(function (item) { return (React.createElement("div", { className: "logs-panel-meta__item", key: item.label },
                React.createElement("span", { className: "logs-panel-meta__label" },
                    item.label,
                    ":"),
                React.createElement("span", { className: "logs-panel-meta__value" }, renderMetaItem(item.value, item.kind)))); }))),
            React.createElement(LogRows, { data: data, deduplicatedData: dedupedData, dedupStrategy: dedupStrategy, getRowContext: this.props.getRowContext, highlighterExpressions: highlighterExpressions, onClickLabel: onClickLabel, rowLimit: data ? data.rows.length : undefined, showLabels: showLabels, showTime: showTime, timeZone: timeZone }),
            !loading && !hasData && !scanning && (React.createElement("div", { className: "logs-panel-nodata" },
                "No logs found.",
                React.createElement("a", { className: "link", onClick: this.onClickScan }, "Scan for older logs"))),
            scanning && (React.createElement("div", { className: "logs-panel-nodata" },
                React.createElement("span", null, scanText),
                React.createElement("a", { className: "link", onClick: this.onClickStopScan }, "Stop scan")))));
    };
    return Logs;
}(PureComponent));
export { Logs };
//# sourceMappingURL=Logs.js.map
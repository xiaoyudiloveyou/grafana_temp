import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { css, cx } from 'emotion';
import { dateTimeForTimeZone } from '@grafana/data';
import { selectThemeVariant, GraphWithLegend, LegendDisplayMode, withTheme, Collapse, GraphSeriesToggler, } from '@grafana/ui';
var MAX_NUMBER_OF_TIME_SERIES = 20;
var getStyles = function (theme) { return ({
    timeSeriesDisclaimer: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    label: time-series-disclaimer;\n    width: 300px;\n    margin: ", " auto;\n    padding: 10px 0;\n    border-radius: ", ";\n    text-align: center;\n    background-color: ", ";\n  "], ["\n    label: time-series-disclaimer;\n    width: 300px;\n    margin: ", " auto;\n    padding: 10px 0;\n    border-radius: ", ";\n    text-align: center;\n    background-color: ", ";\n  "])), theme.spacing.sm, theme.border.radius.md, selectThemeVariant({ light: theme.colors.white, dark: theme.colors.dark4 }, theme.type)),
    disclaimerIcon: css(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n    label: disclaimer-icon;\n    color: ", ";\n    margin-right: ", ";\n  "], ["\n    label: disclaimer-icon;\n    color: ", ";\n    margin-right: ", ";\n  "])), theme.colors.yellow, theme.spacing.xs),
    showAllTimeSeries: css(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n    label: show-all-time-series;\n    cursor: pointer;\n    color: ", ";\n  "], ["\n    label: show-all-time-series;\n    cursor: pointer;\n    color: ", ";\n  "])), theme.colors.linkExternal),
}); };
var UnThemedExploreGraphPanel = /** @class */ (function (_super) {
    tslib_1.__extends(UnThemedExploreGraphPanel, _super);
    function UnThemedExploreGraphPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hiddenSeries: [],
            showAllTimeSeries: false,
        };
        _this.onShowAllTimeSeries = function () {
            _this.setState({
                showAllTimeSeries: true,
            });
        };
        _this.onClickGraphButton = function () {
            var _a = _this.props, onToggleGraph = _a.onToggleGraph, showingGraph = _a.showingGraph;
            if (onToggleGraph) {
                onToggleGraph(showingGraph);
            }
        };
        _this.onChangeTime = function (from, to) {
            var onUpdateTimeRange = _this.props.onUpdateTimeRange;
            onUpdateTimeRange({ from: from, to: to });
        };
        _this.renderGraph = function () {
            var _a = _this.props, width = _a.width, series = _a.series, onHiddenSeriesChanged = _a.onHiddenSeriesChanged, timeZone = _a.timeZone, absoluteRange = _a.absoluteRange, showPanel = _a.showPanel, showingGraph = _a.showingGraph, showingTable = _a.showingTable, showBars = _a.showBars, showLines = _a.showLines, isStacked = _a.isStacked;
            var showAllTimeSeries = _this.state.showAllTimeSeries;
            if (!series) {
                return null;
            }
            var timeRange = {
                from: dateTimeForTimeZone(timeZone, absoluteRange.from),
                to: dateTimeForTimeZone(timeZone, absoluteRange.to),
                raw: {
                    from: dateTimeForTimeZone(timeZone, absoluteRange.from),
                    to: dateTimeForTimeZone(timeZone, absoluteRange.to),
                },
            };
            var height = showPanel === false ? 100 : showingGraph && showingTable ? 200 : 400;
            var lineWidth = showLines ? 1 : 5;
            var seriesToShow = showAllTimeSeries ? series : series.slice(0, MAX_NUMBER_OF_TIME_SERIES);
            return (React.createElement(GraphSeriesToggler, { series: seriesToShow, onHiddenSeriesChanged: onHiddenSeriesChanged }, function (_a) {
                var onSeriesToggle = _a.onSeriesToggle, toggledSeries = _a.toggledSeries;
                return (React.createElement(GraphWithLegend, { displayMode: LegendDisplayMode.List, height: height, isLegendVisible: true, placement: 'under', width: width, timeRange: timeRange, timeZone: timeZone, showBars: showBars, showLines: showLines, showPoints: false, onToggleSort: function () { }, series: toggledSeries, isStacked: isStacked, lineWidth: lineWidth, onSeriesToggle: onSeriesToggle, onHorizontalRegionSelected: _this.onChangeTime }));
            }));
        };
        return _this;
    }
    UnThemedExploreGraphPanel.prototype.render = function () {
        var _a = this.props, series = _a.series, showPanel = _a.showPanel, showingGraph = _a.showingGraph, loading = _a.loading, theme = _a.theme;
        var showAllTimeSeries = this.state.showAllTimeSeries;
        var style = getStyles(theme);
        return (React.createElement(React.Fragment, null,
            series && series.length > MAX_NUMBER_OF_TIME_SERIES && !showAllTimeSeries && (React.createElement("div", { className: cx([style.timeSeriesDisclaimer]) },
                React.createElement("i", { className: cx(['fa fa-fw fa-warning', style.disclaimerIcon]) }), "Showing only " + MAX_NUMBER_OF_TIME_SERIES + " time series. ",
                React.createElement("span", { className: cx([style.showAllTimeSeries]), onClick: this.onShowAllTimeSeries }, "Show all " + series.length))),
            showPanel && (React.createElement(Collapse, { label: "Graph", collapsible: true, isOpen: showingGraph, loading: loading, onToggle: this.onClickGraphButton }, this.renderGraph())),
            !showPanel && this.renderGraph()));
    };
    return UnThemedExploreGraphPanel;
}(PureComponent));
export var ExploreGraphPanel = withTheme(UnThemedExploreGraphPanel);
ExploreGraphPanel.displayName = 'ExploreGraphPanel';
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ExploreGraphPanel.js.map
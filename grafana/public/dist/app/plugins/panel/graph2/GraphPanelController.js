import { __assign, __extends } from "tslib";
import React from 'react';
import { GraphSeriesToggler } from '@grafana/ui';
import { getGraphSeriesModel } from './getGraphSeriesModel';
var GraphPanelController = /** @class */ (function (_super) {
    __extends(GraphPanelController, _super);
    function GraphPanelController(props) {
        var _this = _super.call(this, props) || this;
        _this.onSeriesColorChange = _this.onSeriesColorChange.bind(_this);
        _this.onSeriesAxisToggle = _this.onSeriesAxisToggle.bind(_this);
        _this.onToggleSort = _this.onToggleSort.bind(_this);
        _this.onHorizontalRegionSelected = _this.onHorizontalRegionSelected.bind(_this);
        _this.state = {
            graphSeriesModel: getGraphSeriesModel(props.data.series, props.options.series, props.options.graph, props.options.legend),
        };
        return _this;
    }
    GraphPanelController.getDerivedStateFromProps = function (props, state) {
        return __assign(__assign({}, state), { graphSeriesModel: getGraphSeriesModel(props.data.series, props.options.series, props.options.graph, props.options.legend) });
    };
    GraphPanelController.prototype.onSeriesOptionsUpdate = function (label, optionsUpdate) {
        var _a = this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
        var updatedSeriesOptions = __assign({}, options.series);
        updatedSeriesOptions[label] = optionsUpdate;
        onOptionsChange(__assign(__assign({}, options), { series: updatedSeriesOptions }));
    };
    GraphPanelController.prototype.onSeriesAxisToggle = function (label, yAxis) {
        var series = this.props.options.series;
        var seriesOptionsUpdate = series[label]
            ? __assign(__assign({}, series[label]), { yAxis: __assign(__assign({}, series[label].yAxis), { index: yAxis }) }) : {
            yAxis: {
                index: yAxis,
            },
        };
        this.onSeriesOptionsUpdate(label, seriesOptionsUpdate);
    };
    GraphPanelController.prototype.onSeriesColorChange = function (label, color) {
        var series = this.props.options.series;
        var seriesOptionsUpdate = series[label]
            ? __assign(__assign({}, series[label]), { color: color }) : {
            color: color,
        };
        this.onSeriesOptionsUpdate(label, seriesOptionsUpdate);
    };
    GraphPanelController.prototype.onToggleSort = function (sortBy) {
        var _a = this.props, onOptionsChange = _a.onOptionsChange, options = _a.options;
        onOptionsChange(__assign(__assign({}, options), { legend: __assign(__assign({}, options.legend), { sortBy: sortBy, sortDesc: sortBy === options.legend.sortBy ? !options.legend.sortDesc : false }) }));
    };
    GraphPanelController.prototype.onHorizontalRegionSelected = function (from, to) {
        var onChangeTimeRange = this.props.onChangeTimeRange;
        onChangeTimeRange({ from: from, to: to });
    };
    GraphPanelController.prototype.render = function () {
        var _this = this;
        var children = this.props.children;
        var graphSeriesModel = this.state.graphSeriesModel;
        return (React.createElement(GraphSeriesToggler, { series: graphSeriesModel }, function (_a) {
            var onSeriesToggle = _a.onSeriesToggle, toggledSeries = _a.toggledSeries;
            return children({
                series: toggledSeries,
                onSeriesColorChange: _this.onSeriesColorChange,
                onSeriesAxisToggle: _this.onSeriesAxisToggle,
                onToggleSort: _this.onToggleSort,
                onSeriesToggle: onSeriesToggle,
                onHorizontalRegionSelected: _this.onHorizontalRegionSelected,
            });
        }));
    };
    return GraphPanelController;
}(React.Component));
export { GraphPanelController };
//# sourceMappingURL=GraphPanelController.js.map
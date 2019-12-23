import { __assign, __rest } from "tslib";
import React from 'react';
import { GraphWithLegend } from '@grafana/ui';
import { GraphPanelController } from './GraphPanelController';
import { LegendDisplayMode } from '@grafana/ui/src/components/Legend/Legend';
export var GraphPanel = function (_a) {
    var data = _a.data, timeRange = _a.timeRange, timeZone = _a.timeZone, width = _a.width, height = _a.height, options = _a.options, onOptionsChange = _a.onOptionsChange, onChangeTimeRange = _a.onChangeTimeRange;
    if (!data) {
        return (React.createElement("div", { className: "panel-empty" },
            React.createElement("p", null, "No data found in response")));
    }
    var _b = options.graph, showLines = _b.showLines, showBars = _b.showBars, showPoints = _b.showPoints, legendOptions = options.legend;
    var graphProps = {
        showBars: showBars,
        showLines: showLines,
        showPoints: showPoints,
    };
    var asTable = legendOptions.asTable, isVisible = legendOptions.isVisible, legendProps = __rest(legendOptions, ["asTable", "isVisible"]);
    return (React.createElement(GraphPanelController, { data: data, options: options, onOptionsChange: onOptionsChange, onChangeTimeRange: onChangeTimeRange }, function (_a) {
        var onSeriesToggle = _a.onSeriesToggle, onHorizontalRegionSelected = _a.onHorizontalRegionSelected, controllerApi = __rest(_a, ["onSeriesToggle", "onHorizontalRegionSelected"]);
        return (React.createElement(GraphWithLegend, __assign({ timeRange: timeRange, timeZone: timeZone, width: width, height: height, displayMode: asTable ? LegendDisplayMode.Table : LegendDisplayMode.List, isLegendVisible: isVisible, sortLegendBy: legendOptions.sortBy, sortLegendDesc: legendOptions.sortDesc, onSeriesToggle: onSeriesToggle, onHorizontalRegionSelected: onHorizontalRegionSelected }, graphProps, legendProps, controllerApi)));
    }));
};
//# sourceMappingURL=GraphPanel.js.map
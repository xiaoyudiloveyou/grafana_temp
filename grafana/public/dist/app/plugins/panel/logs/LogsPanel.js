import React from 'react';
import { LogRows, CustomScrollbar } from '@grafana/ui';
import { LogsDedupStrategy } from '@grafana/data';
import { dataFrameToLogsModel } from 'app/core/logs_model';
import { sortLogsResult } from 'app/core/utils/explore';
export var LogsPanel = function (_a) {
    var data = _a.data, timeZone = _a.timeZone, _b = _a.options, showTime = _b.showTime, sortOrder = _b.sortOrder, width = _a.width;
    if (!data) {
        return (React.createElement("div", { className: "panel-empty" },
            React.createElement("p", null, "No data found in response")));
    }
    var newResults = data ? dataFrameToLogsModel(data.series, data.request.intervalMs) : null;
    var sortedNewResults = sortLogsResult(newResults, sortOrder);
    return (React.createElement(CustomScrollbar, { autoHide: true },
        React.createElement(LogRows, { data: sortedNewResults, dedupStrategy: LogsDedupStrategy.none, highlighterExpressions: [], showTime: showTime, showLabels: false, timeZone: timeZone })));
};
//# sourceMappingURL=LogsPanel.js.map
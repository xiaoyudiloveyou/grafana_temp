import { __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Services & Utils
import { config } from 'app/core/config';
// Components
import { PieChart, getFieldDisplayValues } from '@grafana/ui';
var PieChartPanel = /** @class */ (function (_super) {
    __extends(PieChartPanel, _super);
    function PieChartPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PieChartPanel.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, options = _a.options, data = _a.data, replaceVariables = _a.replaceVariables;
        var values = getFieldDisplayValues({
            fieldOptions: options.fieldOptions,
            data: data.series,
            theme: config.theme,
            replaceVariables: replaceVariables,
        }).map(function (v) { return v.display; });
        return (React.createElement(PieChart, { width: width, height: height, values: values, pieType: options.pieType, strokeWidth: options.strokeWidth, theme: config.theme }));
    };
    return PieChartPanel;
}(PureComponent));
export { PieChartPanel };
//# sourceMappingURL=PieChartPanel.js.map
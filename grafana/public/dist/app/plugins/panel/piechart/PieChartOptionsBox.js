import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { Select, FormLabel, PanelOptionsGroup } from '@grafana/ui';
// Types
import { FormField } from '@grafana/ui';
import { PieChartType } from '@grafana/ui';
var labelWidth = 8;
var pieChartOptions = [{ value: PieChartType.PIE, label: 'Pie' }, { value: PieChartType.DONUT, label: 'Donut' }];
var PieChartOptionsBox = /** @class */ (function (_super) {
    __extends(PieChartOptionsBox, _super);
    function PieChartOptionsBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onPieTypeChange = function (pieType) { return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { pieType: pieType.value })); };
        _this.onStrokeWidthChange = function (_a) {
            var target = _a.target;
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { strokeWidth: target.value }));
        };
        return _this;
    }
    PieChartOptionsBox.prototype.render = function () {
        var options = this.props.options;
        var pieType = options.pieType, strokeWidth = options.strokeWidth;
        return (React.createElement(PanelOptionsGroup, { title: "PieChart" },
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormLabel, { width: labelWidth }, "Type"),
                React.createElement(Select, { width: 12, options: pieChartOptions, onChange: this.onPieTypeChange, value: pieChartOptions.find(function (option) { return option.value === pieType; }) })),
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormField, { label: "Divider width", labelWidth: labelWidth, onChange: this.onStrokeWidthChange, value: strokeWidth }))));
    };
    return PieChartOptionsBox;
}(PureComponent));
export { PieChartOptionsBox };
//# sourceMappingURL=PieChartOptionsBox.js.map
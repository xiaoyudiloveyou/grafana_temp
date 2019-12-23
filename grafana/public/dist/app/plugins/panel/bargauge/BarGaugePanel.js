import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Services & Utils
import { config } from 'app/core/config';
// Components
import { BarGauge, VizRepeater, getFieldDisplayValues, DataLinksContextMenu } from '@grafana/ui';
import { getFieldLinksSupplier } from 'app/features/panel/panellinks/linkSuppliers';
var BarGaugePanel = /** @class */ (function (_super) {
    __extends(BarGaugePanel, _super);
    function BarGaugePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderValue = function (value, width, height) {
            var options = _this.props.options;
            var field = value.field, display = value.display;
            return (React.createElement(DataLinksContextMenu, { links: getFieldLinksSupplier(value) }, function (_a) {
                var openMenu = _a.openMenu, targetClassName = _a.targetClassName;
                return (React.createElement(BarGauge, { value: display, width: width, height: height, orientation: options.orientation, thresholds: field.thresholds, theme: config.theme, itemSpacing: _this.getItemSpacing(), displayMode: options.displayMode, minValue: field.min, maxValue: field.max, onClick: openMenu, className: targetClassName }));
            }));
        };
        _this.getValues = function () {
            var _a = _this.props, data = _a.data, options = _a.options, replaceVariables = _a.replaceVariables;
            return getFieldDisplayValues(__assign(__assign({}, options), { replaceVariables: replaceVariables, theme: config.theme, data: data.series }));
        };
        return _this;
    }
    BarGaugePanel.prototype.getItemSpacing = function () {
        if (this.props.options.displayMode === 'lcd') {
            return 2;
        }
        return 10;
    };
    BarGaugePanel.prototype.render = function () {
        var _a = this.props, height = _a.height, width = _a.width, options = _a.options, data = _a.data, renderCounter = _a.renderCounter;
        return (React.createElement(VizRepeater, { source: data, getValues: this.getValues, renderValue: this.renderValue, renderCounter: renderCounter, width: width, height: height, itemSpacing: this.getItemSpacing(), orientation: options.orientation }));
    };
    return BarGaugePanel;
}(PureComponent));
export { BarGaugePanel };
//# sourceMappingURL=BarGaugePanel.js.map
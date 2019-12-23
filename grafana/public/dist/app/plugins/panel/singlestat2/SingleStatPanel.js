import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Utils & Services
import { config } from 'app/core/config';
import { getFieldDisplayValues, VizRepeater, BigValue, DataLinksContextMenu, } from '@grafana/ui';
import { getFieldLinksSupplier } from 'app/features/panel/panellinks/linkSuppliers';
var SingleStatPanel = /** @class */ (function (_super) {
    __extends(SingleStatPanel, _super);
    function SingleStatPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderValue = function (value, width, height) {
            var sparkline;
            if (value.sparkline) {
                var _a = _this.props, timeRange = _a.timeRange, options = _a.options;
                sparkline = __assign(__assign({}, options.sparkline), { data: value.sparkline, minX: timeRange.from.valueOf(), maxX: timeRange.to.valueOf() });
            }
            return (React.createElement(DataLinksContextMenu, { links: getFieldLinksSupplier(value) }, function (_a) {
                var openMenu = _a.openMenu, targetClassName = _a.targetClassName;
                return (React.createElement(BigValue, { value: value.display, sparkline: sparkline, width: width, height: height, theme: config.theme, onClick: openMenu, className: targetClassName }));
            }));
        };
        _this.getValues = function () {
            var _a = _this.props, data = _a.data, options = _a.options, replaceVariables = _a.replaceVariables;
            return getFieldDisplayValues(__assign(__assign({}, options), { replaceVariables: replaceVariables, theme: config.theme, data: data.series, sparkline: options.sparkline.show }));
        };
        return _this;
    }
    SingleStatPanel.prototype.render = function () {
        var _a = this.props, height = _a.height, width = _a.width, options = _a.options, data = _a.data, renderCounter = _a.renderCounter;
        return (React.createElement(VizRepeater, { getValues: this.getValues, renderValue: this.renderValue, width: width, height: height, source: data, renderCounter: renderCounter, orientation: options.orientation }));
    };
    return SingleStatPanel;
}(PureComponent));
export { SingleStatPanel };
//# sourceMappingURL=SingleStatPanel.js.map
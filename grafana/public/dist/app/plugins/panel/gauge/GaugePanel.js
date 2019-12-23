import { __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Services & Utils
import { config } from 'app/core/config';
// Components
import { Gauge, getFieldDisplayValues, VizOrientation, DataLinksContextMenu } from '@grafana/ui';
import { VizRepeater } from '@grafana/ui';
import { getFieldLinksSupplier } from 'app/features/panel/panellinks/linkSuppliers';
var GaugePanel = /** @class */ (function (_super) {
    __extends(GaugePanel, _super);
    function GaugePanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderValue = function (value, width, height) {
            var options = _this.props.options;
            var field = value.field, display = value.display;
            return (React.createElement(DataLinksContextMenu, { links: getFieldLinksSupplier(value) }, function (_a) {
                var openMenu = _a.openMenu, targetClassName = _a.targetClassName;
                return (React.createElement(Gauge, { value: display, width: width, height: height, thresholds: field.thresholds, showThresholdLabels: options.showThresholdLabels, showThresholdMarkers: options.showThresholdMarkers, minValue: field.min, maxValue: field.max, theme: config.theme, onClick: openMenu, className: targetClassName }));
            }));
        };
        _this.getValues = function () {
            var _a = _this.props, data = _a.data, options = _a.options, replaceVariables = _a.replaceVariables;
            return getFieldDisplayValues({
                fieldOptions: options.fieldOptions,
                replaceVariables: replaceVariables,
                theme: config.theme,
                data: data.series,
            });
        };
        return _this;
    }
    GaugePanel.prototype.render = function () {
        var _a = this.props, height = _a.height, width = _a.width, data = _a.data, renderCounter = _a.renderCounter;
        return (React.createElement(VizRepeater, { getValues: this.getValues, renderValue: this.renderValue, width: width, height: height, source: data, renderCounter: renderCounter, orientation: VizOrientation.Auto }));
    };
    return GaugePanel;
}(PureComponent));
export { GaugePanel };
//# sourceMappingURL=GaugePanel.js.map
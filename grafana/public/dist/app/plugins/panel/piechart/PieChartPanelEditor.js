import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { PanelOptionsGrid, ValueMappingsEditor, FieldDisplayEditor, FieldPropertiesEditor, PanelOptionsGroup, } from '@grafana/ui';
import { PieChartOptionsBox } from './PieChartOptionsBox';
var PieChartPanelEditor = /** @class */ (function (_super) {
    __extends(PieChartPanelEditor, _super);
    function PieChartPanelEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onValueMappingsChanged = function (mappings) {
            var current = _this.props.options.fieldOptions.defaults;
            _this.onDefaultsChange(__assign(__assign({}, current), { mappings: mappings }));
        };
        _this.onDisplayOptionsChanged = function (fieldOptions) {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { fieldOptions: fieldOptions }));
        };
        _this.onDefaultsChange = function (field) {
            _this.onDisplayOptionsChanged(__assign(__assign({}, _this.props.options.fieldOptions), { defaults: field }));
        };
        return _this;
    }
    PieChartPanelEditor.prototype.render = function () {
        var _a = this.props, onOptionsChange = _a.onOptionsChange, options = _a.options, data = _a.data;
        var fieldOptions = options.fieldOptions;
        var defaults = fieldOptions.defaults;
        return (React.createElement(React.Fragment, null,
            React.createElement(PanelOptionsGrid, null,
                React.createElement(PanelOptionsGroup, { title: "Display" },
                    React.createElement(FieldDisplayEditor, { onChange: this.onDisplayOptionsChanged, value: fieldOptions })),
                React.createElement(PanelOptionsGroup, { title: "Field (default)" },
                    React.createElement(FieldPropertiesEditor, { showMinMax: true, onChange: this.onDefaultsChange, value: defaults })),
                React.createElement(PieChartOptionsBox, { data: data, onOptionsChange: onOptionsChange, options: options })),
            React.createElement(ValueMappingsEditor, { onChange: this.onValueMappingsChanged, valueMappings: defaults.mappings })));
    };
    return PieChartPanelEditor;
}(PureComponent));
export { PieChartPanelEditor };
//# sourceMappingURL=PieChartPanelEditor.js.map
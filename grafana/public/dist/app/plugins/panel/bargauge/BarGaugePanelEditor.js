import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { ThresholdsEditor, ValueMappingsEditor, PanelOptionsGrid, FieldDisplayEditor, FieldPropertiesEditor, PanelOptionsGroup, FormLabel, Select, DataLinksEditor, } from '@grafana/ui';
import { orientationOptions, displayModes } from './types';
import { getDataLinksVariableSuggestions, getCalculationValueDataLinksVariableSuggestions, } from 'app/features/panel/panellinks/link_srv';
var BarGaugePanelEditor = /** @class */ (function (_super) {
    __extends(BarGaugePanelEditor, _super);
    function BarGaugePanelEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onThresholdsChanged = function (thresholds) {
            var current = _this.props.options.fieldOptions.defaults;
            _this.onDefaultsChange(__assign(__assign({}, current), { thresholds: thresholds }));
        };
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
        _this.onOrientationChange = function (_a) {
            var value = _a.value;
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { orientation: value }));
        };
        _this.onDisplayModeChange = function (_a) {
            var value = _a.value;
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { displayMode: value }));
        };
        _this.onDataLinksChanged = function (links) {
            _this.onDefaultsChange(__assign(__assign({}, _this.props.options.fieldOptions.defaults), { links: links }));
        };
        return _this;
    }
    BarGaugePanelEditor.prototype.render = function () {
        var options = this.props.options;
        var fieldOptions = options.fieldOptions;
        var defaults = fieldOptions.defaults;
        var suggestions = fieldOptions.values
            ? getDataLinksVariableSuggestions(this.props.data.series)
            : getCalculationValueDataLinksVariableSuggestions(this.props.data.series);
        var labelWidth = 6;
        return (React.createElement(React.Fragment, null,
            React.createElement(PanelOptionsGrid, null,
                React.createElement(PanelOptionsGroup, { title: "Display" },
                    React.createElement(FieldDisplayEditor, { onChange: this.onDisplayOptionsChanged, value: fieldOptions, labelWidth: labelWidth }),
                    React.createElement("div", { className: "form-field" },
                        React.createElement(FormLabel, { width: labelWidth }, "Orientation"),
                        React.createElement(Select, { width: 12, options: orientationOptions, defaultValue: orientationOptions[0], onChange: this.onOrientationChange, value: orientationOptions.find(function (item) { return item.value === options.orientation; }) })),
                    React.createElement("div", { className: "form-field" },
                        React.createElement(FormLabel, { width: labelWidth }, "Mode"),
                        React.createElement(Select, { width: 12, options: displayModes, defaultValue: displayModes[0], onChange: this.onDisplayModeChange, value: displayModes.find(function (item) { return item.value === options.displayMode; }) }))),
                React.createElement(PanelOptionsGroup, { title: "Field" },
                    React.createElement(FieldPropertiesEditor, { showMinMax: true, onChange: this.onDefaultsChange, value: defaults })),
                React.createElement(ThresholdsEditor, { onChange: this.onThresholdsChanged, thresholds: defaults.thresholds })),
            React.createElement(ValueMappingsEditor, { onChange: this.onValueMappingsChanged, valueMappings: defaults.mappings }),
            React.createElement(PanelOptionsGroup, { title: "Data links" },
                React.createElement(DataLinksEditor, { value: defaults.links, onChange: this.onDataLinksChanged, suggestions: suggestions, maxLinks: 10 }))));
    };
    return BarGaugePanelEditor;
}(PureComponent));
export { BarGaugePanelEditor };
//# sourceMappingURL=BarGaugePanelEditor.js.map
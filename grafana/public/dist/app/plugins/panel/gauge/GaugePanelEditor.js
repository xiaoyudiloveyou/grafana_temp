import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { ThresholdsEditor, PanelOptionsGrid, ValueMappingsEditor, FieldDisplayEditor, FieldPropertiesEditor, Switch, PanelOptionsGroup, DataLinksEditor, } from '@grafana/ui';
import { getCalculationValueDataLinksVariableSuggestions, getDataLinksVariableSuggestions, } from 'app/features/panel/panellinks/link_srv';
var GaugePanelEditor = /** @class */ (function (_super) {
    __extends(GaugePanelEditor, _super);
    function GaugePanelEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelWidth = 6;
        _this.onToggleThresholdLabels = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { showThresholdLabels: !_this.props.options.showThresholdLabels }));
        };
        _this.onToggleThresholdMarkers = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { showThresholdMarkers: !_this.props.options.showThresholdMarkers }));
        };
        _this.onThresholdsChanged = function (thresholds) {
            var current = _this.props.options.fieldOptions.defaults;
            _this.onDefaultsChange(__assign(__assign({}, current), { thresholds: thresholds }));
        };
        _this.onValueMappingsChanged = function (mappings) {
            var current = _this.props.options.fieldOptions.defaults;
            _this.onDefaultsChange(__assign(__assign({}, current), { mappings: mappings }));
        };
        _this.onDisplayOptionsChanged = function (fieldOptions, event, callback) {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { fieldOptions: fieldOptions }), callback);
        };
        _this.onDefaultsChange = function (field, event, callback) {
            _this.onDisplayOptionsChanged(__assign(__assign({}, _this.props.options.fieldOptions), { defaults: field }), event, callback);
        };
        _this.onDataLinksChanged = function (links, callback) {
            _this.onDefaultsChange(__assign(__assign({}, _this.props.options.fieldOptions.defaults), { links: links }), undefined, callback);
        };
        return _this;
    }
    GaugePanelEditor.prototype.render = function () {
        var options = this.props.options;
        var fieldOptions = options.fieldOptions, showThresholdLabels = options.showThresholdLabels, showThresholdMarkers = options.showThresholdMarkers;
        var defaults = fieldOptions.defaults;
        var suggestions = fieldOptions.values
            ? getDataLinksVariableSuggestions(this.props.data.series)
            : getCalculationValueDataLinksVariableSuggestions(this.props.data.series);
        return (React.createElement(React.Fragment, null,
            React.createElement(PanelOptionsGrid, null,
                React.createElement(PanelOptionsGroup, { title: "Display" },
                    React.createElement(FieldDisplayEditor, { onChange: this.onDisplayOptionsChanged, value: fieldOptions, labelWidth: this.labelWidth }),
                    React.createElement(Switch, { label: "Labels", labelClass: "width-" + this.labelWidth, checked: showThresholdLabels, onChange: this.onToggleThresholdLabels }),
                    React.createElement(Switch, { label: "Markers", labelClass: "width-" + this.labelWidth, checked: showThresholdMarkers, onChange: this.onToggleThresholdMarkers })),
                React.createElement(PanelOptionsGroup, { title: "Field" },
                    React.createElement(FieldPropertiesEditor, { showMinMax: true, onChange: this.onDefaultsChange, value: defaults })),
                React.createElement(ThresholdsEditor, { onChange: this.onThresholdsChanged, thresholds: defaults.thresholds })),
            React.createElement(ValueMappingsEditor, { onChange: this.onValueMappingsChanged, valueMappings: defaults.mappings }),
            React.createElement(PanelOptionsGroup, { title: "Data links" },
                React.createElement(DataLinksEditor, { value: defaults.links, onChange: this.onDataLinksChanged, suggestions: suggestions, maxLinks: 10 }))));
    };
    return GaugePanelEditor;
}(PureComponent));
export { GaugePanelEditor };
//# sourceMappingURL=GaugePanelEditor.js.map
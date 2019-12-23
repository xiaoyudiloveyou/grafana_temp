import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { ThresholdsEditor, PanelOptionsGrid, ValueMappingsEditor, FieldDisplayEditor, FieldPropertiesEditor, PanelOptionsGroup, DataLinksEditor, } from '@grafana/ui';
import { ColoringEditor } from './ColoringEditor';
import { FontSizeEditor } from './FontSizeEditor';
import { SparklineEditor } from './SparklineEditor';
import { getDataLinksVariableSuggestions, getCalculationValueDataLinksVariableSuggestions, } from 'app/features/panel/panellinks/link_srv';
var SingleStatEditor = /** @class */ (function (_super) {
    __extends(SingleStatEditor, _super);
    function SingleStatEditor() {
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
        _this.onSparklineChanged = function (sparkline) {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { sparkline: sparkline }));
        };
        _this.onDefaultsChange = function (field) {
            _this.onDisplayOptionsChanged(__assign(__assign({}, _this.props.options.fieldOptions), { defaults: field }));
        };
        _this.onDataLinksChanged = function (links) {
            _this.onDefaultsChange(__assign(__assign({}, _this.props.options.fieldOptions.defaults), { links: links }));
        };
        return _this;
    }
    SingleStatEditor.prototype.render = function () {
        var options = this.props.options;
        var fieldOptions = options.fieldOptions;
        var defaults = fieldOptions.defaults;
        var suggestions = fieldOptions.values
            ? getDataLinksVariableSuggestions(this.props.data.series)
            : getCalculationValueDataLinksVariableSuggestions(this.props.data.series);
        return (React.createElement(React.Fragment, null,
            React.createElement(PanelOptionsGrid, null,
                React.createElement(PanelOptionsGroup, { title: "Display" },
                    React.createElement(FieldDisplayEditor, { onChange: this.onDisplayOptionsChanged, value: fieldOptions })),
                React.createElement(PanelOptionsGroup, { title: "Field (default)" },
                    React.createElement(FieldPropertiesEditor, { showMinMax: true, onChange: this.onDefaultsChange, value: defaults })),
                React.createElement(FontSizeEditor, { options: options, onChange: this.props.onOptionsChange }),
                React.createElement(ColoringEditor, { options: options, onChange: this.props.onOptionsChange }),
                React.createElement(SparklineEditor, { options: options.sparkline, onChange: this.onSparklineChanged }),
                React.createElement(ThresholdsEditor, { onChange: this.onThresholdsChanged, thresholds: defaults.thresholds })),
            React.createElement(ValueMappingsEditor, { onChange: this.onValueMappingsChanged, valueMappings: defaults.mappings }),
            React.createElement(PanelOptionsGroup, { title: "Data links" },
                React.createElement(DataLinksEditor, { value: defaults.links, onChange: this.onDataLinksChanged, suggestions: suggestions, maxLinks: 10 }))));
    };
    return SingleStatEditor;
}(PureComponent));
export { SingleStatEditor };
//# sourceMappingURL=SingleStatEditor.js.map
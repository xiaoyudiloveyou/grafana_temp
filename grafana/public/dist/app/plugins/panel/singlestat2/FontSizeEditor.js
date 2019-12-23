import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { FormLabel, Select, PanelOptionsGroup } from '@grafana/ui';
var labelWidth = 6;
var percents = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
var fontSizeOptions = percents.map(function (v) {
    return { value: v, label: v };
});
var FontSizeEditor = /** @class */ (function (_super) {
    __extends(FontSizeEditor, _super);
    function FontSizeEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setPrefixFontSize = function (v) {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { prefixFontSize: v.value }));
        };
        _this.setValueFontSize = function (v) {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { valueFontSize: v.value }));
        };
        _this.setPostfixFontSize = function (v) {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { postfixFontSize: v.value }));
        };
        return _this;
    }
    FontSizeEditor.prototype.render = function () {
        var _a = this.props.options, prefixFontSize = _a.prefixFontSize, valueFontSize = _a.valueFontSize, postfixFontSize = _a.postfixFontSize;
        return (React.createElement(PanelOptionsGroup, { title: "Font Size" },
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormLabel, { width: labelWidth }, "Prefix"),
                React.createElement(Select, { width: 12, options: fontSizeOptions, onChange: this.setPrefixFontSize, value: fontSizeOptions.find(function (option) { return option.value === prefixFontSize; }) })),
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormLabel, { width: labelWidth }, "Value"),
                React.createElement(Select, { width: 12, options: fontSizeOptions, onChange: this.setValueFontSize, value: fontSizeOptions.find(function (option) { return option.value === valueFontSize; }) })),
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormLabel, { width: labelWidth }, "Postfix"),
                React.createElement(Select, { width: 12, options: fontSizeOptions, onChange: this.setPostfixFontSize, value: fontSizeOptions.find(function (option) { return option.value === postfixFontSize; }) }))));
    };
    return FontSizeEditor;
}(PureComponent));
export { FontSizeEditor };
//# sourceMappingURL=FontSizeEditor.js.map
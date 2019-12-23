import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { Switch, PanelOptionsGroup } from '@grafana/ui';
var labelWidth = 6;
var ColoringEditor = /** @class */ (function (_super) {
    __extends(ColoringEditor, _super);
    function ColoringEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onToggleColorBackground = function () {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { colorBackground: !_this.props.options.colorBackground }));
        };
        _this.onToggleColorValue = function () { return _this.props.onChange(__assign(__assign({}, _this.props.options), { colorValue: !_this.props.options.colorValue })); };
        _this.onToggleColorPrefix = function () {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { colorPrefix: !_this.props.options.colorPrefix }));
        };
        _this.onToggleColorPostfix = function () {
            return _this.props.onChange(__assign(__assign({}, _this.props.options), { colorPostfix: !_this.props.options.colorPostfix }));
        };
        return _this;
    }
    ColoringEditor.prototype.render = function () {
        var _a = this.props.options, colorBackground = _a.colorBackground, colorValue = _a.colorValue, colorPrefix = _a.colorPrefix, colorPostfix = _a.colorPostfix;
        return (React.createElement(PanelOptionsGroup, { title: "Coloring" },
            React.createElement(Switch, { label: "Background", labelClass: "width-" + labelWidth, checked: colorBackground, onChange: this.onToggleColorBackground }),
            React.createElement(Switch, { label: "Value", labelClass: "width-" + labelWidth, checked: colorValue, onChange: this.onToggleColorValue }),
            React.createElement(Switch, { label: "Prefix", labelClass: "width-" + labelWidth, checked: colorPrefix, onChange: this.onToggleColorPrefix }),
            React.createElement(Switch, { label: "Postfix", labelClass: "width-" + labelWidth, checked: colorPostfix, onChange: this.onToggleColorPostfix })));
    };
    return ColoringEditor;
}(PureComponent));
export { ColoringEditor };
//# sourceMappingURL=ColoringEditor.js.map
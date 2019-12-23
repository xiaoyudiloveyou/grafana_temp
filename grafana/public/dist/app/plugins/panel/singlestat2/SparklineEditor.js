import { __assign, __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { Switch, PanelOptionsGroup } from '@grafana/ui';
var labelWidth = 6;
var SparklineEditor = /** @class */ (function (_super) {
    __extends(SparklineEditor, _super);
    function SparklineEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onToggleShow = function () { return _this.props.onChange(__assign(__assign({}, _this.props.options), { show: !_this.props.options.show })); };
        _this.onToggleFull = function () { return _this.props.onChange(__assign(__assign({}, _this.props.options), { full: !_this.props.options.full })); };
        return _this;
    }
    SparklineEditor.prototype.render = function () {
        var _a = this.props.options, show = _a.show, full = _a.full;
        return (React.createElement(PanelOptionsGroup, { title: "Sparkline" },
            React.createElement(Switch, { label: "Show", labelClass: "width-" + labelWidth, checked: show, onChange: this.onToggleShow }),
            React.createElement(Switch, { label: "Full Height", labelClass: "width-" + labelWidth, checked: full, onChange: this.onToggleFull })));
    };
    return SparklineEditor;
}(PureComponent));
export { SparklineEditor };
//# sourceMappingURL=SparklineEditor.js.map
import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { Input } from '@grafana/ui';
var DefaultVariableQueryEditor = /** @class */ (function (_super) {
    tslib_1.__extends(DefaultVariableQueryEditor, _super);
    function DefaultVariableQueryEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = function (event) {
            _this.setState({ value: event.currentTarget.value });
        };
        _this.onBlur = function (event) {
            _this.props.onChange(event.currentTarget.value, event.currentTarget.value);
        };
        _this.state = { value: props.query };
        return _this;
    }
    DefaultVariableQueryEditor.prototype.render = function () {
        return (React.createElement("div", { className: "gf-form" },
            React.createElement("span", { className: "gf-form-label width-10" }, "Query"),
            React.createElement(Input, { type: "text", className: "gf-form-input", value: this.state.value, onChange: this.onChange, onBlur: this.onBlur, placeholder: "metric name or tags query", required: true })));
    };
    return DefaultVariableQueryEditor;
}(PureComponent));
export default DefaultVariableQueryEditor;
//# sourceMappingURL=DefaultVariableQueryEditor.js.map
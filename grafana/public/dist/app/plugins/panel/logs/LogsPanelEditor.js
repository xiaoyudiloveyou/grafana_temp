import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { Switch, PanelOptionsGrid, PanelOptionsGroup, FormLabel, Select } from '@grafana/ui';
import { SortOrder } from 'app/core/utils/explore';
var sortOrderOptions = [
    { value: SortOrder.Descending, label: 'Descending' },
    { value: SortOrder.Ascending, label: 'Ascending' },
];
var LogsPanelEditor = /** @class */ (function (_super) {
    tslib_1.__extends(LogsPanelEditor, _super);
    function LogsPanelEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onToggleTime = function () {
            var _a = _this.props, options = _a.options, onOptionsChange = _a.onOptionsChange;
            var showTime = options.showTime;
            onOptionsChange(tslib_1.__assign({}, options, { showTime: !showTime }));
        };
        _this.onShowValuesChange = function (item) {
            var _a = _this.props, options = _a.options, onOptionsChange = _a.onOptionsChange;
            onOptionsChange(tslib_1.__assign({}, options, { sortOrder: item.value }));
        };
        return _this;
    }
    LogsPanelEditor.prototype.render = function () {
        var _a = this.props.options, showTime = _a.showTime, sortOrder = _a.sortOrder;
        var value = sortOrderOptions.filter(function (option) { return option.value === sortOrder; })[0];
        return (React.createElement(React.Fragment, null,
            React.createElement(PanelOptionsGrid, null,
                React.createElement(PanelOptionsGroup, { title: "Columns" },
                    React.createElement(Switch, { label: "Time", labelClass: "width-10", checked: showTime, onChange: this.onToggleTime }),
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, null, "Order"),
                        React.createElement(Select, { options: sortOrderOptions, value: value, onChange: this.onShowValuesChange }))))));
    };
    return LogsPanelEditor;
}(PureComponent));
export { LogsPanelEditor };
//# sourceMappingURL=LogsPanelEditor.js.map
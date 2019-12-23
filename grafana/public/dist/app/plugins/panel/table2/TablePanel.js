import { __assign, __extends } from "tslib";
// Libraries
import React, { Component } from 'react';
// Types
import { ThemeContext } from '@grafana/ui';
import Table from '@grafana/ui/src/components/Table/Table';
var TablePanel = /** @class */ (function (_super) {
    __extends(TablePanel, _super);
    function TablePanel(props) {
        return _super.call(this, props) || this;
    }
    TablePanel.prototype.render = function () {
        var _this = this;
        var _a = this.props, data = _a.data, options = _a.options;
        if (data.series.length < 1) {
            return React.createElement("div", null, "No Table Data...");
        }
        return (React.createElement(ThemeContext.Consumer, null, function (theme) { return React.createElement(Table, __assign({}, _this.props, options, { theme: theme, data: data.series[0] })); }));
    };
    return TablePanel;
}(Component));
export { TablePanel };
//# sourceMappingURL=TablePanel.js.map
import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
// Types
import { Switch } from '@grafana/ui';
import { GraphLegendEditor } from './GraphLegendEditor';
var GraphPanelEditor = /** @class */ (function (_super) {
    __extends(GraphPanelEditor, _super);
    function GraphPanelEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onGraphOptionsChange = function (options) {
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { graph: __assign(__assign({}, _this.props.options.graph), options) }));
        };
        _this.onLegendOptionsChange = function (options) {
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { legend: options }));
        };
        _this.onToggleLines = function () {
            _this.onGraphOptionsChange({ showLines: !_this.props.options.graph.showLines });
        };
        _this.onToggleBars = function () {
            _this.onGraphOptionsChange({ showBars: !_this.props.options.graph.showBars });
        };
        _this.onTogglePoints = function () {
            _this.onGraphOptionsChange({ showPoints: !_this.props.options.graph.showPoints });
        };
        return _this;
    }
    GraphPanelEditor.prototype.render = function () {
        var _a = this.props.options.graph, showBars = _a.showBars, showPoints = _a.showPoints, showLines = _a.showLines;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "section gf-form-group" },
                React.createElement("h5", { className: "section-heading" }, "Draw Modes"),
                React.createElement(Switch, { label: "Lines", labelClass: "width-5", checked: showLines, onChange: this.onToggleLines }),
                React.createElement(Switch, { label: "Bars", labelClass: "width-5", checked: showBars, onChange: this.onToggleBars }),
                React.createElement(Switch, { label: "Points", labelClass: "width-5", checked: showPoints, onChange: this.onTogglePoints })),
            React.createElement(GraphLegendEditor, { options: this.props.options.legend, onChange: this.onLegendOptionsChange })));
    };
    return GraphPanelEditor;
}(PureComponent));
export { GraphPanelEditor };
//# sourceMappingURL=GraphPanelEditor.js.map
import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { TableInputCSV } from '@grafana/ui';
import { MutableDataFrame } from '@grafana/data';
import { dataFrameToCSV } from './utils';
var InputConfigEditor = /** @class */ (function (_super) {
    tslib_1.__extends(InputConfigEditor, _super);
    function InputConfigEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            text: '',
        };
        _this.onSeriesParsed = function (data, text) {
            var _a = _this.props, options = _a.options, onOptionsChange = _a.onOptionsChange;
            if (!data) {
                data = [new MutableDataFrame()];
            }
            // data is a property on 'jsonData'
            var jsonData = tslib_1.__assign({}, options.jsonData, { data: data });
            onOptionsChange(tslib_1.__assign({}, options, { jsonData: jsonData }));
            _this.setState({ text: text });
        };
        return _this;
    }
    InputConfigEditor.prototype.componentDidMount = function () {
        var options = this.props.options;
        if (options.jsonData.data) {
            var text = dataFrameToCSV(options.jsonData.data);
            this.setState({ text: text });
        }
    };
    InputConfigEditor.prototype.render = function () {
        var text = this.state.text;
        return (React.createElement("div", null,
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("h4", null, "Shared Data:"),
                React.createElement("span", null, "Enter CSV"),
                React.createElement(TableInputCSV, { text: text, onSeriesParsed: this.onSeriesParsed, width: '100%', height: 200 })),
            React.createElement("div", { className: "grafana-info-box" },
                "This data is stored in the datasource json and is returned to every user in the initial request for any datasource. This is an appropriate place to enter a few values. Large datasets will perform better in other datasources.",
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("b", null, "NOTE:"),
                " Changes to this data will only be reflected after a browser refresh.")));
    };
    return InputConfigEditor;
}(PureComponent));
export { InputConfigEditor };
//# sourceMappingURL=InputConfigEditor.js.map
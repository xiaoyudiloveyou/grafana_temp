import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Types
import { describeDataFrame } from './InputDatasource';
import { FormLabel, Select, TableInputCSV } from '@grafana/ui';
import { toCSV, MutableDataFrame } from '@grafana/data';
import { dataFrameToCSV } from './utils';
var options = [
    { value: 'panel', label: 'Panel', description: 'Save data in the panel configuration.' },
    { value: 'shared', label: 'Shared', description: 'Save data in the shared datasource object.' },
];
var InputQueryEditor = /** @class */ (function (_super) {
    tslib_1.__extends(InputQueryEditor, _super);
    function InputQueryEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            text: '',
        };
        _this.onSourceChange = function (item) {
            var _a = _this.props, datasource = _a.datasource, query = _a.query, onChange = _a.onChange, onRunQuery = _a.onRunQuery;
            var data = undefined;
            if (item.value === 'panel') {
                if (query.data) {
                    return;
                }
                data = tslib_1.__spread(datasource.data);
                if (!data) {
                    data = [new MutableDataFrame()];
                }
                _this.setState({ text: toCSV(data) });
            }
            onChange(tslib_1.__assign({}, query, { data: data }));
            onRunQuery();
        };
        _this.onSeriesParsed = function (data, text) {
            var _a = _this.props, query = _a.query, onChange = _a.onChange, onRunQuery = _a.onRunQuery;
            _this.setState({ text: text });
            if (!data) {
                data = [new MutableDataFrame()];
            }
            onChange(tslib_1.__assign({}, query, { data: data }));
            onRunQuery();
        };
        return _this;
    }
    InputQueryEditor.prototype.onComponentDidMount = function () {
        var query = this.props.query;
        var text = dataFrameToCSV(query.data);
        this.setState({ text: text });
    };
    InputQueryEditor.prototype.render = function () {
        var _a = this.props, datasource = _a.datasource, query = _a.query;
        var id = datasource.id, name = datasource.name;
        var text = this.state.text;
        var selected = query.data ? options[0] : options[1];
        return (React.createElement("div", null,
            React.createElement("div", { className: "gf-form" },
                React.createElement(FormLabel, { width: 4 }, "Data"),
                React.createElement(Select, { width: 6, options: options, value: selected, onChange: this.onSourceChange }),
                React.createElement("div", { className: "btn btn-link" }, query.data ? (describeDataFrame(query.data)) : (React.createElement("a", { href: "datasources/edit/" + id + "/" },
                    name,
                    ": ",
                    describeDataFrame(datasource.data),
                    " \u00A0\u00A0",
                    React.createElement("i", { className: "fa fa-pencil-square-o" }))))),
            query.data && React.createElement(TableInputCSV, { text: text, onSeriesParsed: this.onSeriesParsed, width: '100%', height: 200 })));
    };
    return InputQueryEditor;
}(PureComponent));
export { InputQueryEditor };
//# sourceMappingURL=InputQueryEditor.js.map
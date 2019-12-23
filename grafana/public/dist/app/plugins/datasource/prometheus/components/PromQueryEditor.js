import * as tslib_1 from "tslib";
import _ from 'lodash';
import React, { PureComponent } from 'react';
// Types
import { FormLabel, Select, Switch, DataSourceStatus } from '@grafana/ui';
import PromQueryField from './PromQueryField';
import PromLink from './PromLink';
var FORMAT_OPTIONS = [
    { label: 'Time series', value: 'time_series' },
    { label: 'Table', value: 'table' },
    { label: 'Heatmap', value: 'heatmap' },
];
var INTERVAL_FACTOR_OPTIONS = _.map([1, 2, 3, 4, 5, 10], function (value) { return ({
    value: value,
    label: '1/' + value,
}); });
var PromQueryEditor = /** @class */ (function (_super) {
    tslib_1.__extends(PromQueryEditor, _super);
    function PromQueryEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.onFieldChange = function (query, override) {
            _this.query.expr = query.expr;
        };
        _this.onFormatChange = function (option) {
            _this.query.format = option.value;
            _this.setState({ formatOption: option }, _this.onRunQuery);
        };
        _this.onInstantChange = function (e) {
            var instant = e.target.checked;
            _this.query.instant = instant;
            _this.setState({ instant: instant }, _this.onRunQuery);
        };
        _this.onIntervalChange = function (e) {
            var interval = e.currentTarget.value;
            _this.query.interval = interval;
            _this.setState({ interval: interval });
        };
        _this.onIntervalFactorChange = function (option) {
            _this.query.intervalFactor = option.value;
            _this.setState({ intervalFactorOption: option }, _this.onRunQuery);
        };
        _this.onLegendChange = function (e) {
            var legendFormat = e.currentTarget.value;
            _this.query.legendFormat = legendFormat;
            _this.setState({ legendFormat: legendFormat });
        };
        _this.onRunQuery = function () {
            var query = _this.query;
            _this.props.onChange(query);
            _this.props.onRunQuery();
        };
        var query = props.query;
        _this.query = query;
        // Query target properties that are fully controlled inputs
        _this.state = {
            // Fully controlled text inputs
            interval: query.interval,
            legendFormat: query.legendFormat,
            // Select options
            formatOption: FORMAT_OPTIONS.find(function (option) { return option.value === query.format; }) || FORMAT_OPTIONS[0],
            intervalFactorOption: INTERVAL_FACTOR_OPTIONS.find(function (option) { return option.value === query.intervalFactor; }) || INTERVAL_FACTOR_OPTIONS[0],
            // Switch options
            instant: Boolean(query.instant),
        };
        return _this;
    }
    PromQueryEditor.prototype.render = function () {
        var _a = this.props, datasource = _a.datasource, query = _a.query, panelData = _a.panelData, queryResponse = _a.queryResponse;
        var _b = this.state, formatOption = _b.formatOption, instant = _b.instant, interval = _b.interval, intervalFactorOption = _b.intervalFactorOption, legendFormat = _b.legendFormat;
        return (React.createElement("div", null,
            React.createElement(PromQueryField, { datasource: datasource, query: query, onRunQuery: this.onRunQuery, onChange: this.onFieldChange, history: [], panelData: panelData, queryResponse: queryResponse, datasourceStatus: DataSourceStatus.Connected }),
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement(FormLabel, { width: 7, tooltip: "Controls the name of the time series, using name or pattern. For example\n        {{hostname}} will be replaced with label value for the label hostname." }, "Legend"),
                    React.createElement("input", { type: "text", className: "gf-form-input", placeholder: "legend format", value: legendFormat, onChange: this.onLegendChange, onBlur: this.onRunQuery })),
                React.createElement("div", { className: "gf-form" },
                    React.createElement(FormLabel, { width: 7, tooltip: "Leave blank for auto handling based on time range and panel width.\n            Note that the actual dates used in the query will be adjusted\n        to a multiple of the interval step." }, "Min step"),
                    React.createElement("input", { type: "text", className: "gf-form-input width-8", placeholder: interval, onChange: this.onIntervalChange, onBlur: this.onRunQuery, value: interval })),
                React.createElement("div", { className: "gf-form" },
                    React.createElement("div", { className: "gf-form-label" }, "Resolution"),
                    React.createElement(Select, { isSearchable: false, options: INTERVAL_FACTOR_OPTIONS, onChange: this.onIntervalFactorChange, value: intervalFactorOption })),
                React.createElement("div", { className: "gf-form" },
                    React.createElement("div", { className: "gf-form-label" }, "Format"),
                    React.createElement(Select, { isSearchable: false, options: FORMAT_OPTIONS, onChange: this.onFormatChange, value: formatOption }),
                    React.createElement(Switch, { label: "Instant", checked: instant, onChange: this.onInstantChange }),
                    React.createElement(FormLabel, { width: 10, tooltip: "Link to Graph in Prometheus" },
                        React.createElement(PromLink, { datasource: datasource, query: this.query, panelData: panelData }))))));
    };
    return PromQueryEditor;
}(PureComponent));
export { PromQueryEditor };
//# sourceMappingURL=PromQueryEditor.js.map
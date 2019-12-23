import * as tslib_1 from "tslib";
import React from 'react';
// @ts-ignore
import Cascader from 'rc-cascader';
import InfluxQueryModel from '../influx_query_model';
import { AdHocFilterField } from 'app/features/explore/AdHocFilterField';
import { TemplateSrv } from 'app/features/templating/template_srv';
import { InfluxQueryBuilder } from '../query_builder';
// Helper function for determining if a collection of pairs are valid
// where a valid pair is either fully defined, or not defined at all, but not partially defined
export function pairsAreValid(pairs) {
    return (!pairs ||
        pairs.every(function (pair) {
            var allDefined = !!(pair.key && pair.operator && pair.value);
            var allEmpty = pair.key === undefined && pair.operator === undefined && pair.value === undefined;
            return allDefined || allEmpty;
        }));
}
var InfluxLogsQueryField = /** @class */ (function (_super) {
    tslib_1.__extends(InfluxLogsQueryField, _super);
    function InfluxLogsQueryField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.templateSrv = new TemplateSrv();
        _this.state = { measurements: [], measurement: null, field: null };
        _this.onMeasurementsChange = function (values) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, measurement, field;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                query = this.props.query;
                measurement = values[0];
                field = values[1];
                this.setState({ measurement: measurement, field: field }, function () {
                    _this.onPairsChanged(query.tags);
                });
                return [2 /*return*/];
            });
        }); };
        _this.onPairsChanged = function (pairs) {
            var query = _this.props.query;
            var _a = _this.state, measurement = _a.measurement, field = _a.field;
            var queryModel = new InfluxQueryModel(tslib_1.__assign({}, query, { resultFormat: 'table', groupBy: [], select: [[{ type: 'field', params: [field] }]], tags: pairs, limit: '1000', measurement: measurement }), _this.templateSrv);
            _this.props.onChange(queryModel.target);
            // Only run the query if measurement & field are set, and there are no invalid pairs
            if (measurement && field && pairsAreValid(pairs)) {
                _this.props.onRunQuery();
            }
        };
        return _this;
    }
    InfluxLogsQueryField.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var datasource, queryBuilder, measureMentsQuery, influxMeasurements, measurements, index, measurementObj, queryBuilder_1, fieldsQuery, influxFields, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = this.props.datasource;
                        queryBuilder = new InfluxQueryBuilder({ measurement: '', tags: [] }, datasource.database);
                        measureMentsQuery = queryBuilder.buildExploreQuery('MEASUREMENTS');
                        return [4 /*yield*/, datasource.metricFindQuery(measureMentsQuery)];
                    case 1:
                        influxMeasurements = _a.sent();
                        measurements = [];
                        index = 0;
                        _a.label = 2;
                    case 2:
                        if (!(index < influxMeasurements.length)) return [3 /*break*/, 5];
                        measurementObj = influxMeasurements[index];
                        queryBuilder_1 = new InfluxQueryBuilder({ measurement: measurementObj.text, tags: [] }, datasource.database);
                        fieldsQuery = queryBuilder_1.buildExploreQuery('FIELDS');
                        return [4 /*yield*/, datasource.metricFindQuery(fieldsQuery)];
                    case 3:
                        influxFields = _a.sent();
                        fields = influxFields.map(function (field) { return ({
                            label: field.text,
                            value: field.text,
                            children: [],
                        }); });
                        measurements.push({
                            label: measurementObj.text,
                            value: measurementObj.text,
                            children: fields,
                        });
                        _a.label = 4;
                    case 4:
                        index++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.setState({ measurements: measurements });
                        return [2 /*return*/];
                }
            });
        });
    };
    InfluxLogsQueryField.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.query.measurement && !this.props.query.measurement) {
            this.setState({ measurement: null, field: null });
        }
    };
    InfluxLogsQueryField.prototype.render = function () {
        var datasource = this.props.datasource;
        var _a = this.state, measurements = _a.measurements, measurement = _a.measurement, field = _a.field;
        var cascadeText = measurement ? "Measurements (" + measurement + "/" + field + ")" : 'Measurements';
        return (React.createElement("div", { className: "gf-form-inline gf-form-inline--nowrap" },
            React.createElement("div", { className: "gf-form flex-shrink-0" },
                React.createElement(Cascader, { options: measurements, value: [measurement, field], onChange: this.onMeasurementsChange, expandIcon: null },
                    React.createElement("button", { className: "gf-form-label gf-form-label--btn" },
                        cascadeText,
                        " ",
                        React.createElement("i", { className: "fa fa-caret-down" })))),
            React.createElement("div", { className: "flex-shrink-1 flex-flow-column-nowrap" }, measurement && (React.createElement(AdHocFilterField, { onPairsChanged: this.onPairsChanged, datasource: datasource, extendedOptions: { measurement: measurement } })))));
    };
    return InfluxLogsQueryField;
}(React.PureComponent));
export { InfluxLogsQueryField };
//# sourceMappingURL=InfluxLogsQueryField.js.map
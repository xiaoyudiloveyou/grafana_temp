import * as tslib_1 from "tslib";
// Types
import { DataSourceApi, } from '@grafana/ui';
import { toDataFrame } from '@grafana/data';
var InputDatasource = /** @class */ (function (_super) {
    tslib_1.__extends(InputDatasource, _super);
    function InputDatasource(instanceSettings) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.data = [];
        if (instanceSettings.jsonData.data) {
            _this.data = instanceSettings.jsonData.data.map(function (v) { return toDataFrame(v); });
        }
        return _this;
    }
    /**
     * Convert a query to a simple text string
     */
    InputDatasource.prototype.getQueryDisplayText = function (query) {
        if (query.data) {
            return 'Panel Data: ' + describeDataFrame(query.data);
        }
        return "Shared Data From: " + this.name + " (" + describeDataFrame(this.data) + ")";
    };
    InputDatasource.prototype.metricFindQuery = function (query, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var e_1, _a, e_2, _b;
            var names = [];
            try {
                for (var _c = tslib_1.__values(_this.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var series = _d.value;
                    try {
                        for (var _e = (e_2 = void 0, tslib_1.__values(series.fields)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var field = _f.value;
                            // TODO, match query/options?
                            names.push({
                                text: field.name,
                            });
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            resolve(names);
        });
    };
    InputDatasource.prototype.query = function (options) {
        var e_3, _a;
        var results = [];
        try {
            for (var _b = tslib_1.__values(options.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                var query = _c.value;
                var data = this.data;
                if (query.data) {
                    data = query.data.map(function (v) { return toDataFrame(v); });
                }
                for (var i = 0; i < data.length; i++) {
                    results.push(tslib_1.__assign({}, data[i], { refId: query.refId }));
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return Promise.resolve({ data: results });
    };
    InputDatasource.prototype.testDatasource = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var e_4, _a;
            var rowCount = 0;
            var info = _this.data.length + " Series:";
            try {
                for (var _b = tslib_1.__values(_this.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var series = _c.value;
                    var length_1 = series.length;
                    info += " [" + series.fields.length + " Fields, " + length_1 + " Rows]";
                    rowCount += length_1;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (rowCount > 0) {
                resolve({
                    status: 'success',
                    message: info,
                });
            }
            reject({
                status: 'error',
                message: 'No Data Entered',
            });
        });
    };
    return InputDatasource;
}(DataSourceApi));
export { InputDatasource };
function getLength(data) {
    if (!data || !data.fields || !data.fields.length) {
        return 0;
    }
    if (data.hasOwnProperty('length')) {
        return data.length;
    }
    return data.fields[0].values.length;
}
export function describeDataFrame(data) {
    if (!data || !data.length) {
        return '';
    }
    if (data.length > 1) {
        var count = data.reduce(function (acc, series) {
            return acc + getLength(series);
        }, 0);
        return data.length + " Series, " + count + " Rows";
    }
    var series = data[0];
    if (!series.fields) {
        return 'Missing Fields';
    }
    var length = getLength(series);
    return series.fields.length + " Fields, " + length + " Rows";
}
export default InputDatasource;
//# sourceMappingURL=InputDatasource.js.map
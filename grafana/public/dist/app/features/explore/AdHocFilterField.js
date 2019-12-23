import * as tslib_1 from "tslib";
import React from 'react';
import _ from 'lodash';
import { AdHocFilter } from './AdHocFilter';
export var DEFAULT_REMOVE_FILTER_VALUE = '-- remove filter --';
var addFilterButton = function (onAddFilter) { return (React.createElement("button", { className: "gf-form-label gf-form-label--btn query-part", onClick: onAddFilter },
    React.createElement("i", { className: "fa fa-plus" }))); };
var AdHocFilterField = /** @class */ (function (_super) {
    tslib_1.__extends(AdHocFilterField, _super);
    function AdHocFilterField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { pairs: [] };
        _this.loadTagKeys = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, datasource, extendedOptions, options, tagKeys, _b, keys;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, datasource = _a.datasource, extendedOptions = _a.extendedOptions;
                        options = extendedOptions || {};
                        if (!datasource.getTagKeys) return [3 /*break*/, 2];
                        return [4 /*yield*/, datasource.getTagKeys(options)];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = [];
                        _c.label = 3;
                    case 3:
                        tagKeys = _b;
                        keys = tagKeys.map(function (tagKey) { return tagKey.text; });
                        return [2 /*return*/, keys];
                }
            });
        }); };
        _this.loadTagValues = function (key) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, datasource, extendedOptions, options, tagValues, _b, values;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, datasource = _a.datasource, extendedOptions = _a.extendedOptions;
                        options = extendedOptions || {};
                        if (!datasource.getTagValues) return [3 /*break*/, 2];
                        return [4 /*yield*/, datasource.getTagValues(tslib_1.__assign({}, options, { key: key }))];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = [];
                        _c.label = 3;
                    case 3:
                        tagValues = _b;
                        values = tagValues.map(function (tagValue) { return tagValue.text; });
                        return [2 /*return*/, values];
                }
            });
        }); };
        _this.onKeyChanged = function (index) { return function (key) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var onPairsChanged_1, values, pairs_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(key !== DEFAULT_REMOVE_FILTER_VALUE)) return [3 /*break*/, 2];
                        onPairsChanged_1 = this.props.onPairsChanged;
                        return [4 /*yield*/, this.loadTagValues(key)];
                    case 1:
                        values = _a.sent();
                        pairs_1 = this.updatePairs(this.state.pairs, index, { key: key, values: values });
                        this.setState({ pairs: pairs_1 }, function () { return onPairsChanged_1(pairs_1); });
                        return [3 /*break*/, 3];
                    case 2:
                        this.onRemoveFilter(index);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); }; };
        _this.onValueChanged = function (index) { return function (value) {
            var pairs = _this.updatePairs(_this.state.pairs, index, { value: value });
            _this.setState({ pairs: pairs }, function () { return _this.props.onPairsChanged(pairs); });
        }; };
        _this.onOperatorChanged = function (index) { return function (operator) {
            var pairs = _this.updatePairs(_this.state.pairs, index, { operator: operator });
            _this.setState({ pairs: pairs }, function () { return _this.props.onPairsChanged(pairs); });
        }; };
        _this.onAddFilter = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var keys, pairs;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadTagKeys()];
                    case 1:
                        keys = _a.sent();
                        pairs = this.state.pairs.concat(this.updatePairs([], 0, { keys: keys }));
                        this.setState({ pairs: pairs }, function () { return _this.props.onPairsChanged(pairs); });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onRemoveFilter = function (index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var pairs;
            return tslib_1.__generator(this, function (_a) {
                pairs = this.state.pairs.reduce(function (allPairs, pair, pairIndex) {
                    if (pairIndex === index) {
                        return allPairs;
                    }
                    return allPairs.concat(pair);
                }, []);
                this.setState({ pairs: pairs });
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    AdHocFilterField.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (_.isEqual(prevProps.extendedOptions, this.props.extendedOptions) === false) {
            var pairs_2 = [];
            this.setState({ pairs: pairs_2 }, function () { return _this.props.onPairsChanged(pairs_2); });
        }
    };
    AdHocFilterField.prototype.updatePairs = function (pairs, index, pair) {
        if (pairs.length === 0) {
            return [
                {
                    key: pair.key || '',
                    keys: pair.keys || [],
                    operator: pair.operator || '',
                    value: pair.value || '',
                    values: pair.values || [],
                },
            ];
        }
        var newPairs = [];
        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            var newPair = pairs[pairIndex];
            if (index === pairIndex) {
                newPairs.push(tslib_1.__assign({}, newPair, { key: pair.key || newPair.key, value: pair.value || newPair.value, operator: pair.operator || newPair.operator, keys: pair.keys || newPair.keys, values: pair.values || newPair.values }));
                continue;
            }
            newPairs.push(newPair);
        }
        return newPairs;
    };
    AdHocFilterField.prototype.render = function () {
        var _this = this;
        var pairs = this.state.pairs;
        return (React.createElement(React.Fragment, null,
            pairs.length < 1 && addFilterButton(this.onAddFilter),
            pairs.map(function (pair, index) {
                var adHocKey = "adhoc-filter-" + index + "-" + pair.key + "-" + pair.value;
                return (React.createElement("div", { className: "align-items-center flex-grow-1", key: adHocKey },
                    React.createElement(AdHocFilter, { keys: [DEFAULT_REMOVE_FILTER_VALUE].concat(pair.keys), values: pair.values, initialKey: pair.key, initialOperator: pair.operator, initialValue: pair.value, onKeyChanged: _this.onKeyChanged(index), onOperatorChanged: _this.onOperatorChanged(index), onValueChanged: _this.onValueChanged(index) }),
                    index < pairs.length - 1 && React.createElement("span", null, "\u00A0AND\u00A0"),
                    index === pairs.length - 1 && addFilterButton(_this.onAddFilter)));
            })));
    };
    return AdHocFilterField;
}(React.PureComponent));
export { AdHocFilterField };
//# sourceMappingURL=AdHocFilterField.js.map
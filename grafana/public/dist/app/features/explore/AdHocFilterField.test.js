var _this = this;
import * as tslib_1 from "tslib";
import React from 'react';
import { mount, shallow } from 'enzyme';
import { AdHocFilterField, DEFAULT_REMOVE_FILTER_VALUE } from './AdHocFilterField';
import { AdHocFilter } from './AdHocFilter';
import { MockDataSourceApi } from '../../../test/mocks/datasource_srv';
describe('<AdHocFilterField />', function () {
    var mockDataSourceApi;
    beforeEach(function () {
        mockDataSourceApi = new MockDataSourceApi();
    });
    it('should initially have no filters', function () {
        var mockOnPairsChanged = jest.fn();
        var wrapper = shallow(React.createElement(AdHocFilterField, { datasource: mockDataSourceApi, onPairsChanged: mockOnPairsChanged }));
        expect(wrapper.state('pairs')).toEqual([]);
        expect(wrapper.find(AdHocFilter).exists()).toBeFalsy();
    });
    it('should add <AdHocFilter /> when onAddFilter is invoked', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var mockOnPairsChanged, wrapper, asyncCheck;
        return tslib_1.__generator(this, function (_a) {
            mockOnPairsChanged = jest.fn();
            wrapper = shallow(React.createElement(AdHocFilterField, { datasource: mockDataSourceApi, onPairsChanged: mockOnPairsChanged }));
            expect(wrapper.state('pairs')).toEqual([]);
            wrapper
                .find('button')
                .first()
                .simulate('click');
            asyncCheck = setImmediate(function () {
                expect(wrapper.find(AdHocFilter).exists()).toBeTruthy();
            });
            global.clearImmediate(asyncCheck);
            return [2 /*return*/];
        });
    }); });
    it("should remove the relevant filter when the '" + DEFAULT_REMOVE_FILTER_VALUE + "' key is selected", function () {
        var mockOnPairsChanged = jest.fn();
        var wrapper = shallow(React.createElement(AdHocFilterField, { datasource: mockDataSourceApi, onPairsChanged: mockOnPairsChanged }));
        expect(wrapper.state('pairs')).toEqual([]);
        wrapper
            .find('button')
            .first()
            .simulate('click');
        var asyncCheck = setImmediate(function () {
            expect(wrapper.find(AdHocFilter).exists()).toBeTruthy();
            wrapper.find(AdHocFilter).prop('onKeyChanged')(DEFAULT_REMOVE_FILTER_VALUE);
            expect(wrapper.find(AdHocFilter).exists()).toBeFalsy();
        });
        global.clearImmediate(asyncCheck);
    });
    it('it should call onPairsChanged when a filter is removed', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var mockOnPairsChanged, wrapper, asyncCheck;
        return tslib_1.__generator(this, function (_a) {
            mockOnPairsChanged = jest.fn();
            wrapper = shallow(React.createElement(AdHocFilterField, { datasource: mockDataSourceApi, onPairsChanged: mockOnPairsChanged }));
            expect(wrapper.state('pairs')).toEqual([]);
            wrapper
                .find('button')
                .first()
                .simulate('click');
            asyncCheck = setImmediate(function () {
                expect(wrapper.find(AdHocFilter).exists()).toBeTruthy();
                wrapper.find(AdHocFilter).prop('onKeyChanged')(DEFAULT_REMOVE_FILTER_VALUE);
                expect(wrapper.find(AdHocFilter).exists()).toBeFalsy();
                expect(mockOnPairsChanged.mock.calls.length).toBe(1);
            });
            global.clearImmediate(asyncCheck);
            return [2 /*return*/];
        });
    }); });
});
var setup = function (propOverrides) {
    var datasource = {
        getTagKeys: jest.fn().mockReturnValue([{ text: 'key 1' }, { text: 'key 2' }]),
        getTagValues: jest.fn().mockReturnValue([{ text: 'value 1' }, { text: 'value 2' }]),
    };
    var props = {
        datasource: datasource,
        onPairsChanged: jest.fn(),
    };
    Object.assign(props, propOverrides);
    var wrapper = mount(React.createElement(AdHocFilterField, tslib_1.__assign({}, props)));
    var instance = wrapper.instance();
    return {
        instance: instance,
        wrapper: wrapper,
        datasource: datasource,
    };
};
describe('AdHocFilterField', function () {
    describe('loadTagKeys', function () {
        describe('when called and there is no extendedOptions', function () {
            var _a = setup({ extendedOptions: undefined }), instance = _a.instance, datasource = _a.datasource;
            it('then it should return correct keys', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var keys;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagKeys()];
                        case 1:
                            keys = _a.sent();
                            expect(keys).toEqual(['key 1', 'key 2']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('then datasource.getTagKeys should be called with an empty object', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagKeys()];
                        case 1:
                            _a.sent();
                            expect(datasource.getTagKeys).toBeCalledWith({});
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when called and there is extendedOptions', function () {
            var extendedOptions = { measurement: 'default' };
            var _a = setup({ extendedOptions: extendedOptions }), instance = _a.instance, datasource = _a.datasource;
            it('then it should return correct keys', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var keys;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagKeys()];
                        case 1:
                            keys = _a.sent();
                            expect(keys).toEqual(['key 1', 'key 2']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('then datasource.getTagKeys should be called with extendedOptions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagKeys()];
                        case 1:
                            _a.sent();
                            expect(datasource.getTagKeys).toBeCalledWith(extendedOptions);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('loadTagValues', function () {
        describe('when called and there is no extendedOptions', function () {
            var _a = setup({ extendedOptions: undefined }), instance = _a.instance, datasource = _a.datasource;
            it('then it should return correct values', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var values;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagValues('key 1')];
                        case 1:
                            values = _a.sent();
                            expect(values).toEqual(['value 1', 'value 2']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('then datasource.getTagValues should be called with the correct key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagValues('key 1')];
                        case 1:
                            _a.sent();
                            expect(datasource.getTagValues).toBeCalledWith({ key: 'key 1' });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('when called and there is extendedOptions', function () {
            var extendedOptions = { measurement: 'default' };
            var _a = setup({ extendedOptions: extendedOptions }), instance = _a.instance, datasource = _a.datasource;
            it('then it should return correct values', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var values;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagValues('key 1')];
                        case 1:
                            values = _a.sent();
                            expect(values).toEqual(['value 1', 'value 2']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('then datasource.getTagValues should be called with extendedOptions and the correct key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, instance.loadTagValues('key 1')];
                        case 1:
                            _a.sent();
                            expect(datasource.getTagValues).toBeCalledWith({ measurement: 'default', key: 'key 1' });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('updatePairs', function () {
        describe('when called with an empty pairs array', function () {
            describe('and called with keys', function () {
                it('then it should return correct pairs', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var instance, pairs, index, key, keys, value, values, operator, result;
                    return tslib_1.__generator(this, function (_a) {
                        instance = setup().instance;
                        pairs = [];
                        index = 0;
                        key = undefined;
                        keys = ['key 1', 'key 2'];
                        value = undefined;
                        values = undefined;
                        operator = undefined;
                        result = instance.updatePairs(pairs, index, { key: key, keys: keys, value: value, values: values, operator: operator });
                        expect(result).toEqual([{ key: '', keys: keys, value: '', values: [], operator: '' }]);
                        return [2 /*return*/];
                    });
                }); });
            });
        });
        describe('when called with an non empty pairs array', function () {
            it('then it should update correct pairs at supplied index', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var instance, pairs, index, key, keys, value, values, operator, result;
                return tslib_1.__generator(this, function (_a) {
                    instance = setup().instance;
                    pairs = [
                        {
                            key: 'prev key 1',
                            keys: ['prev key 1', 'prev key 2'],
                            value: 'prev value 1',
                            values: ['prev value 1', 'prev value 2'],
                            operator: '=',
                        },
                        {
                            key: 'prev key 3',
                            keys: ['prev key 3', 'prev key 4'],
                            value: 'prev value 3',
                            values: ['prev value 3', 'prev value 4'],
                            operator: '!=',
                        },
                    ];
                    index = 1;
                    key = 'key 3';
                    keys = ['key 3', 'key 4'];
                    value = 'value 3';
                    values = ['value 3', 'value 4'];
                    operator = '=';
                    result = instance.updatePairs(pairs, index, { key: key, keys: keys, value: value, values: values, operator: operator });
                    expect(result).toEqual([
                        {
                            key: 'prev key 1',
                            keys: ['prev key 1', 'prev key 2'],
                            value: 'prev value 1',
                            values: ['prev value 1', 'prev value 2'],
                            operator: '=',
                        },
                        {
                            key: 'key 3',
                            keys: ['key 3', 'key 4'],
                            value: 'value 3',
                            values: ['value 3', 'value 4'],
                            operator: '=',
                        },
                    ]);
                    return [2 /*return*/];
                });
            }); });
        });
    });
});
//# sourceMappingURL=AdHocFilterField.test.js.map
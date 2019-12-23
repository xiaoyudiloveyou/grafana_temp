var _this = this;
import * as tslib_1 from "tslib";
import Plain from 'slate-plain-serializer';
import { Editor as SlateEditor } from 'slate';
import LanguageProvider, { LABEL_REFRESH_INTERVAL, rangeToParams } from './language_provider';
import { advanceTo, clear, advanceBy } from 'jest-date-mock';
import { beforeEach } from 'test/lib/common';
import { makeMockLokiDatasource } from './mocks';
describe('Language completion provider', function () {
    var datasource = makeMockLokiDatasource({});
    var rangeMock = {
        from: 1560153109000,
        to: 1560163909000,
    };
    describe('empty query suggestions', function () {
        it('returns no suggestions on empty context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource);
                        value = Plain.deserialize('');
                        return [4 /*yield*/, instance.provideCompletionItems({ text: '', prefix: '', value: value, wrapperClasses: [] })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns default suggestions with history on empty context when history was provided', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, history, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource);
                        value = Plain.deserialize('');
                        history = [
                            {
                                query: { refId: '1', expr: '{app="foo"}' },
                                ts: 1,
                            },
                        ];
                        return [4 /*yield*/, instance.provideCompletionItems({ text: '', prefix: '', value: value, wrapperClasses: [] }, { history: history, absoluteRange: rangeMock })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'History',
                                items: [
                                    {
                                        label: '{app="foo"}',
                                    },
                                ],
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns no suggestions within regexp', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, input, history, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource);
                        input = createTypeaheadInput('{} ()', '', undefined, 4, []);
                        history = [
                            {
                                query: { refId: '1', expr: '{app="foo"}' },
                                ts: 1,
                            },
                        ];
                        return [4 /*yield*/, instance.provideCompletionItems(input, { history: history })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions.length).toEqual(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('label suggestions', function () {
        it('returns default label suggestions on label context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource);
                        value = Plain.deserialize('{}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(1).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-labels'],
                                value: valueWithSelection,
                            }, { absoluteRange: rangeMock })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-labels');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'job' }, { label: 'namespace' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions from Loki', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, provider, input, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = makeMockLokiDatasource({ label1: [], label2: [] });
                        return [4 /*yield*/, getLanguageProvider(datasource)];
                    case 1:
                        provider = _a.sent();
                        input = createTypeaheadInput('{}', '');
                        return [4 /*yield*/, provider.provideCompletionItems(input, { absoluteRange: rangeMock })];
                    case 2:
                        result = _a.sent();
                        expect(result.context).toBe('context-labels');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'label1' }, { label: 'label2' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label values suggestions from Loki', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, provider, input, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = makeMockLokiDatasource({ label1: ['label1_val1', 'label1_val2'], label2: [] });
                        return [4 /*yield*/, getLanguageProvider(datasource)];
                    case 1:
                        provider = _a.sent();
                        input = createTypeaheadInput('{label1=}', '=', 'label1');
                        return [4 /*yield*/, provider.provideCompletionItems(input, { absoluteRange: rangeMock })];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, provider.provideCompletionItems(input, { absoluteRange: rangeMock })];
                    case 3:
                        result = _a.sent();
                        expect(result.context).toBe('context-label-values');
                        expect(result.suggestions).toEqual([
                            { items: [{ label: 'label1_val1' }, { label: 'label1_val2' }], label: 'Label values for "label1"' },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('Request URL', function () {
    it('should contain range params', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var rangeMock, datasourceWithLabels, datasourceSpy, instance, expectedUrl;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rangeMock = {
                        from: 1560153109000,
                        to: 1560163909000,
                    };
                    datasourceWithLabels = makeMockLokiDatasource({ other: [] });
                    datasourceSpy = jest.spyOn(datasourceWithLabels, 'metadataRequest');
                    instance = new LanguageProvider(datasourceWithLabels, { initialRange: rangeMock });
                    return [4 /*yield*/, instance.refreshLogLabels(rangeMock, true)];
                case 1:
                    _a.sent();
                    expectedUrl = '/api/prom/label';
                    expect(datasourceSpy).toHaveBeenCalledWith(expectedUrl, rangeToParams(rangeMock));
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Query imports', function () {
    var datasource = makeMockLokiDatasource({});
    var rangeMock = {
        from: 1560153109000,
        to: 1560163909000,
    };
    it('returns empty queries for unknown origin datasource', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var instance, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = new LanguageProvider(datasource, { initialRange: rangeMock });
                    return [4 /*yield*/, instance.importQueries([{ refId: 'bar', expr: 'foo' }], 'unknown')];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([{ refId: 'bar', expr: '' }]);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('prometheus query imports', function () {
        it('returns empty query from metric-only query', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { initialRange: rangeMock });
                        return [4 /*yield*/, instance.importPrometheusQuery('foo')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns empty query from selector query if label is not available', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasourceWithLabels, instance, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasourceWithLabels = makeMockLokiDatasource({ other: [] });
                        instance = new LanguageProvider(datasourceWithLabels, { initialRange: rangeMock });
                        return [4 /*yield*/, instance.importPrometheusQuery('{foo="bar"}')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual('{}');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns selector query from selector query with common labels', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasourceWithLabels, instance, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasourceWithLabels = makeMockLokiDatasource({ foo: [] });
                        instance = new LanguageProvider(datasourceWithLabels, { initialRange: rangeMock });
                        return [4 /*yield*/, instance.importPrometheusQuery('metric{foo="bar",baz="42"}')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual('{foo="bar"}');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns selector query from selector query with all labels if logging label list is empty', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasourceWithLabels, instance, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasourceWithLabels = makeMockLokiDatasource({});
                        instance = new LanguageProvider(datasourceWithLabels, { initialRange: rangeMock });
                        return [4 /*yield*/, instance.importPrometheusQuery('metric{foo="bar",baz="42"}')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual('{baz="42",foo="bar"}');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('Labels refresh', function () {
    var datasource = makeMockLokiDatasource({});
    var instance = new LanguageProvider(datasource);
    var rangeMock = {
        from: 1560153109000,
        to: 1560163909000,
    };
    beforeEach(function () {
        instance.fetchLogLabels = jest.fn();
    });
    afterEach(function () {
        jest.clearAllMocks();
        clear();
    });
    it("should not refresh labels if refresh interval hasn't passed", function () {
        advanceTo(new Date(2019, 1, 1, 0, 0, 0));
        instance.logLabelFetchTs = Date.now();
        advanceBy(LABEL_REFRESH_INTERVAL / 2);
        instance.refreshLogLabels(rangeMock);
        expect(instance.fetchLogLabels).not.toBeCalled();
    });
    it('should refresh labels if refresh interval passed', function () {
        advanceTo(new Date(2019, 1, 1, 0, 0, 0));
        instance.logLabelFetchTs = Date.now();
        advanceBy(LABEL_REFRESH_INTERVAL + 1);
        instance.refreshLogLabels(rangeMock);
        expect(instance.fetchLogLabels).toBeCalled();
    });
});
function getLanguageProvider(datasource) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var instance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instance = new LanguageProvider(datasource);
                    instance.initialRange = {
                        from: Date.now() - 10000,
                        to: Date.now(),
                    };
                    return [4 /*yield*/, instance.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, instance];
            }
        });
    });
}
/**
 * @param value Value of the full input
 * @param text Last piece of text (not sure but in case of {label=} this would be just '=')
 * @param labelKey Label by which to search for values. Cutting corners a bit here as this should be inferred from value
 */
function createTypeaheadInput(value, text, labelKey, anchorOffset, wrapperClasses) {
    var deserialized = Plain.deserialize(value);
    var range = deserialized.selection.setAnchor(deserialized.selection.anchor.setOffset(anchorOffset || 1));
    var valueWithSelection = deserialized.setSelection(range);
    return {
        text: text,
        prefix: '',
        wrapperClasses: wrapperClasses || ['context-labels'],
        value: valueWithSelection,
        labelKey: labelKey,
    };
}
//# sourceMappingURL=language_provider.test.js.map
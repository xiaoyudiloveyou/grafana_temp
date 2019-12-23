var _this = this;
import * as tslib_1 from "tslib";
import Plain from 'slate-plain-serializer';
import { Editor as SlateEditor } from 'slate';
import LanguageProvider from '../language_provider';
describe('Language completion provider', function () {
    var datasource = {
        metadataRequest: function () { return ({ data: { data: [] } }); },
        getTimeRange: function () { return ({ start: 0, end: 1 }); },
    };
    describe('empty query suggestions', function () {
        it('returns default suggestions on empty context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'Functions',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns default suggestions with metrics on empty context when metrics were provided', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { metrics: ['foo', 'bar'] });
                        value = Plain.deserialize('');
                        return [4 /*yield*/, instance.provideCompletionItems({ text: '', prefix: '', value: value, wrapperClasses: [] })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'Functions',
                            },
                            {
                                label: 'Metrics',
                            },
                        ]);
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
                                ts: 0,
                                query: { refId: '1', expr: 'metric' },
                            },
                        ];
                        return [4 /*yield*/, instance.provideCompletionItems({ text: '', prefix: '', value: value, wrapperClasses: [] }, { history: history })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'History',
                                items: [
                                    {
                                        label: 'metric',
                                    },
                                ],
                            },
                            {
                                label: 'Functions',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('range suggestions', function () {
        it('returns range suggestions in range context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource);
                        value = Plain.deserialize('1');
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '1',
                                prefix: '1',
                                value: value,
                                wrapperClasses: ['context-range'],
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-range');
                        expect(result.suggestions).toMatchObject([
                            {
                                items: [
                                    { label: '$__interval', sortText: '$__interval' },
                                    { label: '1m', sortText: '00:01:00' },
                                    { label: '5m', sortText: '00:05:00' },
                                    { label: '10m', sortText: '00:10:00' },
                                    { label: '30m', sortText: '00:30:00' },
                                    { label: '1h', sortText: '01:00:00' },
                                    { label: '1d', sortText: '24:00:00' },
                                ],
                                label: 'Range vector',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('metric suggestions', function () {
        it('returns metrics and function suggestions in an unknown context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { metrics: ['foo', 'bar'] });
                        value = Plain.deserialize('a');
                        value = value.setSelection({ anchor: { offset: 1 }, focus: { offset: 1 } });
                        return [4 /*yield*/, instance.provideCompletionItems({ text: 'a', prefix: 'a', value: value, wrapperClasses: [] })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'Functions',
                            },
                            {
                                label: 'Metrics',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns metrics and function  suggestions after a binary operator', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { metrics: ['foo', 'bar'] });
                        value = Plain.deserialize('*');
                        return [4 /*yield*/, instance.provideCompletionItems({ text: '*', prefix: '', value: value, wrapperClasses: [] })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toMatchObject([
                            {
                                label: 'Functions',
                            },
                            {
                                label: 'Metrics',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns no suggestions at the beginning of a non-empty function', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { metrics: ['foo', 'bar'] });
                        value = Plain.deserialize('sum(up)');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(4).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                value: valueWithSelection,
                                wrapperClasses: [],
                            })];
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
        it('returns default label suggestions on label context and no metric', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-labels');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'job' }, { label: 'instance' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions on label context and metric', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasources, instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasources = {
                            metadataRequest: function () { return ({ data: { data: [{ __name__: 'metric', bar: 'bazinga' }] } }); },
                            getTimeRange: function () { return ({ start: 0, end: 1 }); },
                        };
                        instance = new LanguageProvider(datasources, { labelKeys: { '{__name__="metric"}': ['bar'] } });
                        value = Plain.deserialize('metric{}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(7).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-labels'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-labels');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'bar' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions on label context but leaves out labels that already exist', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasources, instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasources = {
                            metadataRequest: function () { return ({
                                data: {
                                    data: [
                                        {
                                            __name__: 'metric',
                                            bar: 'asdasd',
                                            job1: 'dsadsads',
                                            job2: 'fsfsdfds',
                                            job3: 'dsadsad',
                                        },
                                    ],
                                },
                            }); },
                            getTimeRange: function () { return ({ start: 0, end: 1 }); },
                        };
                        instance = new LanguageProvider(datasources, {
                            labelKeys: {
                                '{job1="foo",job2!="foo",job3=~"foo",__name__="metric"}': ['bar', 'job1', 'job2', 'job3', '__name__'],
                            },
                        });
                        value = Plain.deserialize('{job1="foo",job2!="foo",job3=~"foo",__name__="metric",}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(54).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-labels'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-labels');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'bar' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label value suggestions inside a label value context after a negated matching operator', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{}': ['label'] },
                            labelValues: { '{}': { label: ['a', 'b', 'c'] } },
                        });
                        value = Plain.deserialize('{label!=}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(8).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '!=',
                                prefix: '',
                                wrapperClasses: ['context-labels'],
                                labelKey: 'label',
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-label-values');
                        expect(result.suggestions).toEqual([
                            {
                                items: [{ label: 'a' }, { label: 'b' }, { label: 'c' }],
                                label: 'Label values for "label"',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns a refresher on label context and unavailable metric', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { labelKeys: { '{__name__="foo"}': ['bar'] } });
                        value = Plain.deserialize('metric{}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(7).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-labels'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBeUndefined();
                        expect(result.suggestions).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label values on label context when given a metric and a label key', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric"}': ['bar'] },
                            labelValues: { '{__name__="metric"}': { bar: ['baz'] } },
                        });
                        value = Plain.deserialize('metric{bar=ba}');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(13).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '=ba',
                                prefix: 'ba',
                                wrapperClasses: ['context-labels'],
                                labelKey: 'bar',
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-label-values');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'baz' }], label: 'Label values for "bar"' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions on aggregation context and metric w/ selector', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { labelKeys: { '{__name__="metric",foo="xx"}': ['bar'] } });
                        value = Plain.deserialize('sum(metric{foo="xx"}) by ()');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(26).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'bar' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions on aggregation context and metric w/o selector', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, { labelKeys: { '{__name__="metric"}': ['bar'] } });
                        value = Plain.deserialize('sum(metric) by ()');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(16).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([{ items: [{ label: 'bar' }], label: 'Labels' }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions inside a multi-line aggregation context', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, aggregationTextBlock, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric"}': ['label1', 'label2', 'label3'] },
                        });
                        value = Plain.deserialize('sum(\nmetric\n)\nby ()');
                        aggregationTextBlock = value.document.getBlocks().get(3);
                        ed = new SlateEditor({ value: value });
                        ed.moveToStartOfNode(aggregationTextBlock);
                        valueWithSelection = ed.moveForward(4).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([
                            {
                                items: [{ label: 'label1' }, { label: 'label2' }, { label: 'label3' }],
                                label: 'Labels',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions inside an aggregation context with a range vector', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric"}': ['label1', 'label2', 'label3'] },
                        });
                        value = Plain.deserialize('sum(rate(metric[1h])) by ()');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(26).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([
                            {
                                items: [{ label: 'label1' }, { label: 'label2' }, { label: 'label3' }],
                                label: 'Labels',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions inside an aggregation context with a range vector and label', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric",label1="value"}': ['label1', 'label2', 'label3'] },
                        });
                        value = Plain.deserialize('sum(rate(metric{label1="value"}[1h])) by ()');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(42).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([
                            {
                                items: [{ label: 'label1' }, { label: 'label2' }, { label: 'label3' }],
                                label: 'Labels',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns no suggestions inside an unclear aggregation context using alternate syntax', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric"}': ['label1', 'label2', 'label3'] },
                        });
                        value = Plain.deserialize('sum by ()');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(8).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns label suggestions inside an aggregation context using alternate syntax', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var instance, value, ed, valueWithSelection, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new LanguageProvider(datasource, {
                            labelKeys: { '{__name__="metric"}': ['label1', 'label2', 'label3'] },
                        });
                        value = Plain.deserialize('sum by () (metric)');
                        ed = new SlateEditor({ value: value });
                        valueWithSelection = ed.moveForward(8).value;
                        return [4 /*yield*/, instance.provideCompletionItems({
                                text: '',
                                prefix: '',
                                wrapperClasses: ['context-aggregation'],
                                value: valueWithSelection,
                            })];
                    case 1:
                        result = _a.sent();
                        expect(result.context).toBe('context-aggregation');
                        expect(result.suggestions).toEqual([
                            {
                                items: [{ label: 'label1' }, { label: 'label2' }, { label: 'label3' }],
                                label: 'Labels',
                            },
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=language_provider.test.js.map
import * as tslib_1 from "tslib";
import _ from 'lodash';
import { dateTime } from '@grafana/data';
import { LanguageProvider, } from 'app/types/explore';
import { parseSelector, processLabels, processHistogramLabels } from './language_utils';
import PromqlSyntax, { FUNCTIONS, RATE_RANGES } from './promql';
var DEFAULT_KEYS = ['job', 'instance'];
var EMPTY_SELECTOR = '{}';
var HISTORY_ITEM_COUNT = 5;
var HISTORY_COUNT_CUTOFF = 1000 * 60 * 60 * 24; // 24h
var wrapLabel = function (label) { return ({ label: label }); };
var setFunctionKind = function (suggestion) {
    suggestion.kind = 'function';
    return suggestion;
};
export function addHistoryMetadata(item, history) {
    var cutoffTs = Date.now() - HISTORY_COUNT_CUTOFF;
    var historyForItem = history.filter(function (h) { return h.ts > cutoffTs && h.query === item.label; });
    var count = historyForItem.length;
    var recent = historyForItem[0];
    var hint = "Queried " + count + " times in the last 24h.";
    if (recent) {
        var lastQueried = dateTime(recent.ts).fromNow();
        hint = hint + " Last queried " + lastQueried + ".";
    }
    return tslib_1.__assign({}, item, { documentation: hint });
}
var PromQlLanguageProvider = /** @class */ (function (_super) {
    tslib_1.__extends(PromQlLanguageProvider, _super);
    function PromQlLanguageProvider(datasource, initialValues) {
        var _this = _super.call(this) || this;
        // Strip syntax chars
        _this.cleanText = function (s) { return s.replace(/[{}[\]="(),!~+\-*/^%]/g, '').trim(); };
        _this.request = function (url) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var res, body, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.datasource.metadataRequest(url)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, (res.data || res.json())];
                    case 2:
                        body = _a.sent();
                        return [2 /*return*/, body.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        }); };
        _this.start = function () {
            if (!_this.startTask) {
                _this.startTask = _this.fetchMetrics();
            }
            return _this.startTask;
        };
        _this.fetchMetrics = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.fetchMetricNames()];
                    case 1:
                        _a.metrics = _b.sent();
                        this.processHistogramMetrics(this.metrics);
                        return [2 /*return*/, Promise.resolve([])];
                }
            });
        }); };
        _this.fetchMetricNames = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.request('/api/v1/label/__name__/values')];
            });
        }); };
        _this.processHistogramMetrics = function (data) {
            var values = processHistogramLabels(data).values;
            if (values && values['__name__']) {
                _this.histogramMetrics = values['__name__'].slice().sort();
            }
        };
        _this.provideCompletionItems = function (_a, context) {
            var prefix = _a.prefix, text = _a.text, value = _a.value, labelKey = _a.labelKey, wrapperClasses = _a.wrapperClasses;
            if (context === void 0) { context = { history: [] }; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var empty, selectedLines, currentLine, nextCharacter, tokenRecognized, prefixUnrecognized, noSuffix, safeEmptyPrefix, operatorsPattern, isNextOperand;
                return tslib_1.__generator(this, function (_b) {
                    empty = value.document.text.length === 0;
                    selectedLines = value.document.getTextsAtRange(value.selection);
                    currentLine = selectedLines.size === 1 ? selectedLines.first().getText() : null;
                    nextCharacter = currentLine ? currentLine[value.selection.anchor.offset] : null;
                    tokenRecognized = wrapperClasses.length > 3;
                    prefixUnrecognized = prefix && !tokenRecognized;
                    noSuffix = !nextCharacter || nextCharacter === ')';
                    safeEmptyPrefix = prefix === '' && !text.match(/^[\]})\s]+$/) && noSuffix;
                    operatorsPattern = /[+\-*/^%]/;
                    isNextOperand = text.match(operatorsPattern);
                    // Determine candidates by CSS context
                    if (wrapperClasses.includes('context-range')) {
                        // Suggestions for metric[|]
                        return [2 /*return*/, this.getRangeCompletionItems()];
                    }
                    else if (wrapperClasses.includes('context-labels')) {
                        // Suggestions for metric{|} and metric{foo=|}, as well as metric-independent label queries like {|}
                        return [2 /*return*/, this.getLabelCompletionItems({ prefix: prefix, text: text, value: value, labelKey: labelKey, wrapperClasses: wrapperClasses })];
                    }
                    else if (wrapperClasses.includes('context-aggregation')) {
                        // Suggestions for sum(metric) by (|)
                        return [2 /*return*/, this.getAggregationCompletionItems({ prefix: prefix, text: text, value: value, labelKey: labelKey, wrapperClasses: wrapperClasses })];
                    }
                    else if (empty) {
                        // Suggestions for empty query field
                        return [2 /*return*/, this.getEmptyCompletionItems(context)];
                    }
                    else if ((prefixUnrecognized && noSuffix) || safeEmptyPrefix || isNextOperand) {
                        // Show term suggestions in a couple of scenarios
                        return [2 /*return*/, this.getTermCompletionItems()];
                    }
                    return [2 /*return*/, {
                            suggestions: [],
                        }];
                });
            });
        };
        _this.getEmptyCompletionItems = function (context) {
            var history = context.history;
            var suggestions = [];
            if (history && history.length) {
                var historyItems = _.chain(history)
                    .map(function (h) { return h.query.expr; })
                    .filter()
                    .uniq()
                    .take(HISTORY_ITEM_COUNT)
                    .map(wrapLabel)
                    .map(function (item) { return addHistoryMetadata(item, history); })
                    .value();
                suggestions.push({
                    prefixMatch: true,
                    skipSort: true,
                    label: 'History',
                    items: historyItems,
                });
            }
            var termCompletionItems = _this.getTermCompletionItems();
            suggestions.push.apply(suggestions, tslib_1.__spread(termCompletionItems.suggestions));
            return { suggestions: suggestions };
        };
        _this.getTermCompletionItems = function () {
            var metrics = _this.metrics;
            var suggestions = [];
            suggestions.push({
                prefixMatch: true,
                label: 'Functions',
                items: FUNCTIONS.map(setFunctionKind),
            });
            if (metrics && metrics.length) {
                suggestions.push({
                    label: 'Metrics',
                    items: metrics.map(wrapLabel),
                });
            }
            return { suggestions: suggestions };
        };
        _this.getAggregationCompletionItems = function (_a) {
            var value = _a.value;
            var refresher = null;
            var suggestions = [];
            // Stitch all query lines together to support multi-line queries
            var queryOffset;
            var queryText = value.document.getBlocks().reduce(function (text, block) {
                var blockText = block.getText();
                if (value.anchorBlock.key === block.key) {
                    // Newline characters are not accounted for but this is irrelevant
                    // for the purpose of extracting the selector string
                    queryOffset = value.selection.anchor.offset + text.length;
                }
                return text + blockText;
            }, '');
            // Try search for selector part on the left-hand side, such as `sum (m) by (l)`
            var openParensAggregationIndex = queryText.lastIndexOf('(', queryOffset);
            var openParensSelectorIndex = queryText.lastIndexOf('(', openParensAggregationIndex - 1);
            var closeParensSelectorIndex = queryText.indexOf(')', openParensSelectorIndex);
            // Try search for selector part of an alternate aggregation clause, such as `sum by (l) (m)`
            if (openParensSelectorIndex === -1) {
                var closeParensAggregationIndex = queryText.indexOf(')', queryOffset);
                closeParensSelectorIndex = queryText.indexOf(')', closeParensAggregationIndex + 1);
                openParensSelectorIndex = queryText.lastIndexOf('(', closeParensSelectorIndex);
            }
            var result = {
                refresher: refresher,
                suggestions: suggestions,
                context: 'context-aggregation',
            };
            // Suggestions are useless for alternative aggregation clauses without a selector in context
            if (openParensSelectorIndex === -1) {
                return result;
            }
            // Range vector syntax not accounted for by subsequent parse so discard it if present
            var selectorString = queryText
                .slice(openParensSelectorIndex + 1, closeParensSelectorIndex)
                .replace(/\[[^\]]+\]$/, '');
            var selector = parseSelector(selectorString, selectorString.length - 2).selector;
            var labelKeys = _this.labelKeys[selector];
            if (labelKeys && !_this.timeRangeChanged()) {
                suggestions.push({ label: 'Labels', items: labelKeys.map(wrapLabel) });
            }
            else {
                result.refresher = _this.fetchSeriesLabels(selector);
            }
            return result;
        };
        _this.getLabelCompletionItems = function (_a) {
            var text = _a.text, wrapperClasses = _a.wrapperClasses, labelKey = _a.labelKey, value = _a.value;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var line, cursorOffset, selector, parsedSelector, containsMetric, existingKeys, suggestions, context, labelValues, labelKeys, possibleKeys, newItems, newSuggestion;
                var _this = this;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            line = value.anchorBlock.getText();
                            cursorOffset = value.selection.anchor.offset;
                            try {
                                parsedSelector = parseSelector(line, cursorOffset);
                                selector = parsedSelector.selector;
                            }
                            catch (_c) {
                                selector = EMPTY_SELECTOR;
                            }
                            containsMetric = selector.includes('__name__=');
                            existingKeys = parsedSelector ? parsedSelector.labelKeys : [];
                            if (!(selector && (!this.labelValues[selector] || this.timeRangeChanged()))) return [3 /*break*/, 4];
                            if (!(selector === EMPTY_SELECTOR)) return [3 /*break*/, 2];
                            // Query label values for default labels
                            return [4 /*yield*/, Promise.all(DEFAULT_KEYS.map(function (key) { return _this.fetchLabelValues(key); }))];
                        case 1:
                            // Query label values for default labels
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.fetchSeriesLabels(selector, !containsMetric)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            suggestions = [];
                            if ((text && text.match(/^!?=~?/)) || wrapperClasses.includes('attr-value')) {
                                // Label values
                                if (labelKey && this.labelValues[selector] && this.labelValues[selector][labelKey]) {
                                    labelValues = this.labelValues[selector][labelKey];
                                    context = 'context-label-values';
                                    suggestions.push({
                                        label: "Label values for \"" + labelKey + "\"",
                                        items: labelValues.map(wrapLabel),
                                    });
                                }
                            }
                            else {
                                labelKeys = this.labelKeys[selector] || (containsMetric ? null : DEFAULT_KEYS);
                                if (labelKeys) {
                                    possibleKeys = _.difference(labelKeys, existingKeys);
                                    if (possibleKeys.length) {
                                        context = 'context-labels';
                                        newItems = possibleKeys.map(function (key) { return ({ label: key }); });
                                        newSuggestion = { label: "Labels", items: newItems };
                                        suggestions.push(newSuggestion);
                                    }
                                }
                            }
                            return [2 /*return*/, { context: context, suggestions: suggestions }];
                    }
                });
            });
        };
        _this.fetchLabelValues = function (key) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data, existingValues, values, e_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request("/api/v1/label/" + key + "/values")];
                    case 1:
                        data = _b.sent();
                        existingValues = this.labelValues[EMPTY_SELECTOR];
                        values = tslib_1.__assign({}, existingValues, (_a = {}, _a[key] = data, _a));
                        this.labelValues[EMPTY_SELECTOR] = values;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.fetchSeriesLabels = function (name, withName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tRange, data, _a, keys, values, e_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        tRange = this.datasource.getTimeRange();
                        return [4 /*yield*/, this.request("/api/v1/series?match[]=" + name + "&start=" + tRange['start'] + "&end=" + tRange['end'])];
                    case 1:
                        data = _b.sent();
                        _a = processLabels(data, withName), keys = _a.keys, values = _a.values;
                        this.labelKeys[name] = keys;
                        this.labelValues[name] = values;
                        this.timeRange = tRange;
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _b.sent();
                        console.error(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.datasource = datasource;
        _this.histogramMetrics = [];
        _this.timeRange = { start: 0, end: 0 };
        _this.labelKeys = {};
        _this.labelValues = {};
        _this.metrics = [];
        Object.assign(_this, initialValues);
        return _this;
    }
    Object.defineProperty(PromQlLanguageProvider.prototype, "syntax", {
        get: function () {
            return PromqlSyntax;
        },
        enumerable: true,
        configurable: true
    });
    PromQlLanguageProvider.prototype.getRangeCompletionItems = function () {
        return {
            context: 'context-range',
            suggestions: [
                {
                    label: 'Range vector',
                    items: tslib_1.__spread(RATE_RANGES),
                },
            ],
        };
    };
    PromQlLanguageProvider.prototype.roundToMinutes = function (seconds) {
        return Math.floor(seconds / 60);
    };
    PromQlLanguageProvider.prototype.timeRangeChanged = function () {
        var dsRange = this.datasource.getTimeRange();
        return (this.roundToMinutes(dsRange.end) !== this.roundToMinutes(this.timeRange.end) ||
            this.roundToMinutes(dsRange.start) !== this.roundToMinutes(this.timeRange.start));
    };
    return PromQlLanguageProvider;
}(LanguageProvider));
export default PromQlLanguageProvider;
//# sourceMappingURL=language_provider.js.map
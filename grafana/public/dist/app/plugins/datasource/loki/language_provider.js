import { __assign, __awaiter, __extends, __generator, __rest } from "tslib";
// Libraries
import _ from 'lodash';
// Services & Utils
import { parseSelector, labelRegexp, selectorRegexp } from 'app/plugins/datasource/prometheus/language_utils';
import syntax from './syntax';
// Types
import { LanguageProvider } from 'app/types/explore';
import { dateTime } from '@grafana/data';
var DEFAULT_KEYS = ['job', 'namespace'];
var EMPTY_SELECTOR = '{}';
var HISTORY_ITEM_COUNT = 10;
var HISTORY_COUNT_CUTOFF = 1000 * 60 * 60 * 24; // 24h
var NS_IN_MS = 1000000;
export var LABEL_REFRESH_INTERVAL = 1000 * 30; // 30sec
var wrapLabel = function (label) { return ({ label: label }); };
export var rangeToParams = function (range) { return ({ start: range.from * NS_IN_MS, end: range.to * NS_IN_MS }); };
export function addHistoryMetadata(item, history) {
    var cutoffTs = Date.now() - HISTORY_COUNT_CUTOFF;
    var historyForItem = history.filter(function (h) { return h.ts > cutoffTs && h.query.expr === item.label; });
    var count = historyForItem.length;
    var recent = historyForItem[0];
    var hint = "Queried " + count + " times in the last 24h.";
    if (recent) {
        var lastQueried = dateTime(recent.ts).fromNow();
        hint = hint + " Last queried " + lastQueried + ".";
    }
    return __assign(__assign({}, item), { documentation: hint });
}
var LokiLanguageProvider = /** @class */ (function (_super) {
    __extends(LokiLanguageProvider, _super);
    function LokiLanguageProvider(datasource, initialValues) {
        var _this = _super.call(this) || this;
        // Strip syntax chars
        _this.cleanText = function (s) { return s.replace(/[{}[\]="(),!~+\-*/^%]/g, '').trim(); };
        _this.request = function (url, params) {
            return _this.datasource.metadataRequest(url, params);
        };
        /**
         * Initialise the language provider by fetching set of labels. Without this initialisation the provider would return
         * just a set of hardcoded default labels on provideCompletionItems or a recent queries from history.
         */
        _this.start = function () {
            if (!_this.startTask) {
                _this.startTask = _this.fetchLogLabels(_this.initialRange).then(function () {
                    _this.started = true;
                    return [];
                });
            }
            return _this.startTask;
        };
        _this.datasource = datasource;
        _this.labelKeys = {};
        _this.labelValues = {};
        Object.assign(_this, initialValues);
        return _this;
    }
    LokiLanguageProvider.prototype.getSyntax = function () {
        return syntax;
    };
    LokiLanguageProvider.prototype.getLabelKeys = function () {
        return this.labelKeys[EMPTY_SELECTOR];
    };
    LokiLanguageProvider.prototype.getLabelValues = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchLabelValues(key, this.initialRange)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.labelValues[EMPTY_SELECTOR][key]];
                }
            });
        });
    };
    /**
     * Return suggestions based on input that can be then plugged into a typeahead dropdown.
     * Keep this DOM-free for testing
     * @param input
     * @param context Is optional in types but is required in case we are doing getLabelCompletionItems
     * @param context.absoluteRange Required in case we are doing getLabelCompletionItems
     * @param context.history Optional used only in getEmptyCompletionItems
     */
    LokiLanguageProvider.prototype.provideCompletionItems = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var wrapperClasses, value, empty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapperClasses = input.wrapperClasses, value = input.value;
                        empty = value.document.text.length === 0;
                        if (!_.includes(wrapperClasses, 'context-labels')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLabelCompletionItems(input, context)];
                    case 1: 
                    // Suggestions for {|} and {foo=|}
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        if (empty) {
                            return [2 /*return*/, this.getEmptyCompletionItems(context || {})];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            suggestions: [],
                        }];
                }
            });
        });
    };
    LokiLanguageProvider.prototype.getEmptyCompletionItems = function (context) {
        var history = context.history;
        var suggestions = [];
        if (history && history.length > 0) {
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
        return { suggestions: suggestions };
    };
    LokiLanguageProvider.prototype.getLabelCompletionItems = function (_a, _b) {
        var text = _a.text, wrapperClasses = _a.wrapperClasses, labelKey = _a.labelKey, value = _a.value;
        var absoluteRange = _b.absoluteRange;
        return __awaiter(this, void 0, void 0, function () {
            var context, suggestions, line, cursorOffset, selector, parsedSelector, existingKeys, labelValues, labelKeys, possibleKeys;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        suggestions = [];
                        line = value.anchorBlock.getText();
                        cursorOffset = value.selection.anchor.offset;
                        selector = EMPTY_SELECTOR;
                        try {
                            parsedSelector = parseSelector(line, cursorOffset);
                        }
                        catch (_d) { }
                        existingKeys = parsedSelector ? parsedSelector.labelKeys : [];
                        if (!((text && text.match(/^!?=~?/)) || wrapperClasses.includes('attr-value'))) return [3 /*break*/, 4];
                        if (!(labelKey && this.labelValues[selector])) return [3 /*break*/, 3];
                        labelValues = this.labelValues[selector][labelKey];
                        if (!!labelValues) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchLabelValues(labelKey, absoluteRange)];
                    case 1:
                        _c.sent();
                        labelValues = this.labelValues[selector][labelKey];
                        _c.label = 2;
                    case 2:
                        context = 'context-label-values';
                        suggestions.push({
                            label: "Label values for \"" + labelKey + "\"",
                            items: labelValues.map(wrapLabel),
                        });
                        _c.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        labelKeys = this.labelKeys[selector] || DEFAULT_KEYS;
                        if (labelKeys) {
                            possibleKeys = _.difference(labelKeys, existingKeys);
                            if (possibleKeys.length > 0) {
                                context = 'context-labels';
                                suggestions.push({ label: "Labels", items: possibleKeys.map(wrapLabel) });
                            }
                        }
                        _c.label = 5;
                    case 5: return [2 /*return*/, { context: context, suggestions: suggestions }];
                }
            });
        });
    };
    LokiLanguageProvider.prototype.importQueries = function (queries, datasourceType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (datasourceType === 'prometheus') {
                    return [2 /*return*/, Promise.all(queries.map(function (query) { return __awaiter(_this, void 0, void 0, function () {
                            var expr, _a, context, rest;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.importPrometheusQuery(query.expr)];
                                    case 1:
                                        expr = _b.sent();
                                        _a = query, context = _a.context, rest = __rest(_a, ["context"]);
                                        return [2 /*return*/, __assign(__assign({}, rest), { expr: expr })];
                                }
                            });
                        }); }))];
                }
                // Return a cleaned LokiQuery
                return [2 /*return*/, queries.map(function (query) { return ({
                        refId: query.refId,
                        expr: '',
                    }); })];
            });
        });
    };
    LokiLanguageProvider.prototype.importPrometheusQuery = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var selectorMatch, selector, labels_1, existingKeys, labelsToKeep_1, key, labelKeys, cleanSelector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!query) {
                            return [2 /*return*/, ''];
                        }
                        selectorMatch = query.match(selectorRegexp);
                        if (!selectorMatch) return [3 /*break*/, 2];
                        selector = selectorMatch[0];
                        labels_1 = {};
                        selector.replace(labelRegexp, function (_, key, operator, value) {
                            labels_1[key] = { value: value, operator: operator };
                            return '';
                        });
                        // Keep only labels that exist on origin and target datasource
                        return [4 /*yield*/, this.start()];
                    case 1:
                        // Keep only labels that exist on origin and target datasource
                        _a.sent(); // fetches all existing label keys
                        existingKeys = this.labelKeys[EMPTY_SELECTOR];
                        labelsToKeep_1 = {};
                        if (existingKeys && existingKeys.length > 0) {
                            // Check for common labels
                            for (key in labels_1) {
                                if (existingKeys && existingKeys.includes(key)) {
                                    // Should we check for label value equality here?
                                    labelsToKeep_1[key] = labels_1[key];
                                }
                            }
                        }
                        else {
                            // Keep all labels by default
                            labelsToKeep_1 = labels_1;
                        }
                        labelKeys = Object.keys(labelsToKeep_1).sort();
                        cleanSelector = labelKeys
                            .map(function (key) { return "" + key + labelsToKeep_1[key].operator + labelsToKeep_1[key].value; })
                            .join(',');
                        return [2 /*return*/, ['{', cleanSelector, '}'].join('')];
                    case 2: return [2 /*return*/, ''];
                }
            });
        });
    };
    LokiLanguageProvider.prototype.fetchLogLabels = function (absoluteRange) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, body, labelKeys, e_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = '/api/prom/label';
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        this.logLabelFetchTs = Date.now();
                        return [4 /*yield*/, this.request(url, rangeToParams(absoluteRange))];
                    case 2:
                        res = _c.sent();
                        return [4 /*yield*/, (res.data || res.json())];
                    case 3:
                        body = _c.sent();
                        labelKeys = body.data.slice().sort();
                        this.labelKeys = __assign(__assign({}, this.labelKeys), (_a = {}, _a[EMPTY_SELECTOR] = labelKeys, _a));
                        this.labelValues = (_b = {},
                            _b[EMPTY_SELECTOR] = {},
                            _b);
                        this.logLabelOptions = labelKeys.map(function (key) { return ({ label: key, value: key, isLeaf: false }); });
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, []];
                }
            });
        });
    };
    LokiLanguageProvider.prototype.refreshLogLabels = function (absoluteRange, forceRefresh) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((this.labelKeys && Date.now() - this.logLabelFetchTs > LABEL_REFRESH_INTERVAL) || forceRefresh)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchLogLabels(absoluteRange)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LokiLanguageProvider.prototype.fetchLabelValues = function (key, absoluteRange) {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, body, values_1, exisingValues, nextValues, e_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = "/api/prom/label/" + key + "/values";
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.request(url, rangeToParams(absoluteRange))];
                    case 2:
                        res = _c.sent();
                        return [4 /*yield*/, (res.data || res.json())];
                    case 3:
                        body = _c.sent();
                        values_1 = body.data.slice().sort();
                        // Add to label options
                        this.logLabelOptions = this.logLabelOptions.map(function (keyOption) {
                            if (keyOption.value === key) {
                                return __assign(__assign({}, keyOption), { children: values_1.map(function (value) { return ({ label: value, value: value }); }) });
                            }
                            return keyOption;
                        });
                        exisingValues = this.labelValues[EMPTY_SELECTOR];
                        nextValues = __assign(__assign({}, exisingValues), (_a = {}, _a[key] = values_1, _a));
                        this.labelValues = __assign(__assign({}, this.labelValues), (_b = {}, _b[EMPTY_SELECTOR] = nextValues, _b));
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _c.sent();
                        console.error(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return LokiLanguageProvider;
}(LanguageProvider));
export default LokiLanguageProvider;
//# sourceMappingURL=language_provider.js.map
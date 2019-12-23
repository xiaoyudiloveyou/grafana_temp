import * as tslib_1 from "tslib";
import _ from 'lodash';
import React from 'react';
// @ts-ignore
import Cascader from 'rc-cascader';
import { SlatePrism } from '@grafana/ui';
import Prism from 'prismjs';
// dom also includes Element polyfills
import BracesPlugin from 'app/features/explore/slate-plugins/braces';
import QueryField from 'app/features/explore/QueryField';
import { PromContext } from '../types';
import { makePromiseCancelable } from 'app/core/utils/CancelablePromise';
import { DataSourceStatus, DOMUtil } from '@grafana/ui';
import { isDataFrame, toLegacyResponseData } from '@grafana/data';
var HISTOGRAM_GROUP = '__histograms__';
var METRIC_MARK = 'metric';
var PRISM_SYNTAX = 'promql';
export var RECORDING_RULES_GROUP = '__recording_rules__';
function getChooserText(hasSyntax, datasourceStatus) {
    if (datasourceStatus === DataSourceStatus.Disconnected) {
        return '(Disconnected)';
    }
    if (!hasSyntax) {
        return 'Loading metrics...';
    }
    return 'Metrics';
}
export function groupMetricsByPrefix(metrics, delimiter) {
    if (delimiter === void 0) { delimiter = '_'; }
    // Filter out recording rules and insert as first option
    var ruleRegex = /:\w+:/;
    var ruleNames = metrics.filter(function (metric) { return ruleRegex.test(metric); });
    var rulesOption = {
        label: 'Recording rules',
        value: RECORDING_RULES_GROUP,
        children: ruleNames
            .slice()
            .sort()
            .map(function (name) { return ({ label: name, value: name }); }),
    };
    var options = ruleNames.length > 0 ? [rulesOption] : [];
    var metricsOptions = _.chain(metrics)
        .filter(function (metric) { return !ruleRegex.test(metric); })
        .groupBy(function (metric) { return metric.split(delimiter)[0]; })
        .map(function (metricsForPrefix, prefix) {
        var prefixIsMetric = metricsForPrefix.length === 1 && metricsForPrefix[0] === prefix;
        var children = prefixIsMetric ? [] : metricsForPrefix.sort().map(function (m) { return ({ label: m, value: m }); });
        return {
            children: children,
            label: prefix,
            value: prefix,
        };
    })
        .sortBy('label')
        .value();
    return tslib_1.__spread(options, metricsOptions);
}
export function willApplySuggestion(suggestion, _a) {
    var typeaheadContext = _a.typeaheadContext, typeaheadText = _a.typeaheadText;
    // Modify suggestion based on context
    switch (typeaheadContext) {
        case 'context-labels': {
            var nextChar = DOMUtil.getNextCharacter();
            if (!nextChar || nextChar === '}' || nextChar === ',') {
                suggestion += '=';
            }
            break;
        }
        case 'context-label-values': {
            // Always add quotes and remove existing ones instead
            if (!typeaheadText.match(/^(!?=~?"|")/)) {
                suggestion = "\"" + suggestion;
            }
            if (DOMUtil.getNextCharacter() !== '"') {
                suggestion = suggestion + "\"";
            }
            break;
        }
        default:
    }
    return suggestion;
}
var PromQueryField = /** @class */ (function (_super) {
    tslib_1.__extends(PromQueryField, _super);
    function PromQueryField(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.refreshHint = function () {
            var _a = _this.props, datasource = _a.datasource, query = _a.query, queryResponse = _a.queryResponse;
            if (!queryResponse || queryResponse.series.length === 0) {
                _this.setState({ hint: null });
                return;
            }
            var result = isDataFrame(queryResponse.series[0])
                ? queryResponse.series.map(toLegacyResponseData)
                : queryResponse.series;
            var hints = datasource.getQueryHints(query, result);
            var hint = hints && hints.length > 0 ? hints[0] : null;
            _this.setState({ hint: hint });
        };
        _this.refreshMetrics = function (cancelablePromise) {
            _this.languageProviderInitializationPromise = cancelablePromise;
            _this.languageProviderInitializationPromise.promise
                .then(function (remaining) {
                remaining.map(function (task) { return task.then(_this.onUpdateLanguage).catch(function () { }); });
            })
                .then(function () { return _this.onUpdateLanguage(); })
                .catch(function (_a) {
                var isCanceled = _a.isCanceled;
                if (isCanceled) {
                    console.warn('PromQueryField has unmounted, language provider intialization was canceled');
                }
            });
        };
        _this.onChangeMetrics = function (values, selectedOptions) {
            var query;
            if (selectedOptions.length === 1) {
                if (selectedOptions[0].children.length === 0) {
                    query = selectedOptions[0].value;
                }
                else {
                    // Ignore click on group
                    return;
                }
            }
            else {
                var prefix = selectedOptions[0].value;
                var metric = selectedOptions[1].value;
                if (prefix === HISTOGRAM_GROUP) {
                    query = "histogram_quantile(0.95, sum(rate(" + metric + "[5m])) by (le))";
                }
                else {
                    query = metric;
                }
            }
            _this.onChangeQuery(query, true);
        };
        _this.onChangeQuery = function (value, override) {
            // Send text change to parent
            var _a = _this.props, query = _a.query, onChange = _a.onChange, onRunQuery = _a.onRunQuery;
            if (onChange) {
                var nextQuery = tslib_1.__assign({}, query, { expr: value, context: PromContext.Explore });
                onChange(nextQuery);
                if (override && onRunQuery) {
                    onRunQuery();
                }
            }
        };
        _this.onClickHintFix = function () {
            var hint = _this.state.hint;
            var onHint = _this.props.onHint;
            if (onHint && hint && hint.fix) {
                onHint(hint.fix.action);
            }
        };
        _this.onUpdateLanguage = function () {
            var _a = _this.languageProvider, histogramMetrics = _a.histogramMetrics, metrics = _a.metrics;
            if (!metrics) {
                return;
            }
            Prism.languages[PRISM_SYNTAX] = _this.languageProvider.syntax;
            Prism.languages[PRISM_SYNTAX][METRIC_MARK] = {
                alias: 'variable',
                pattern: new RegExp("(?:^|\\s)(" + metrics.join('|') + ")(?:$|\\s)"),
            };
            // Build metrics tree
            var metricsByPrefix = groupMetricsByPrefix(metrics);
            var histogramOptions = histogramMetrics.map(function (hm) { return ({ label: hm, value: hm }); });
            var metricsOptions = histogramMetrics.length > 0
                ? tslib_1.__spread([
                    { label: 'Histograms', value: HISTOGRAM_GROUP, children: histogramOptions, isLeaf: false }
                ], metricsByPrefix) : metricsByPrefix;
            _this.setState({ metricsOptions: metricsOptions, syntaxLoaded: true });
        };
        _this.onTypeahead = function (typeahead) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var history, prefix, text, value, wrapperClasses, labelKey, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.languageProvider) {
                            return [2 /*return*/, { suggestions: [] }];
                        }
                        history = this.props.history;
                        prefix = typeahead.prefix, text = typeahead.text, value = typeahead.value, wrapperClasses = typeahead.wrapperClasses, labelKey = typeahead.labelKey;
                        return [4 /*yield*/, this.languageProvider.provideCompletionItems({ text: text, value: value, prefix: prefix, wrapperClasses: wrapperClasses, labelKey: labelKey }, { history: history })];
                    case 1:
                        result = _a.sent();
                        // console.log('handleTypeahead', wrapperClasses, text, prefix, labelKey, result.context);
                        return [2 /*return*/, result];
                }
            });
        }); };
        if (props.datasource.languageProvider) {
            _this.languageProvider = props.datasource.languageProvider;
        }
        _this.plugins = [
            BracesPlugin(),
            SlatePrism({
                onlyIn: function (node) { return node.type === 'code_block'; },
                getSyntax: function (node) { return 'promql'; },
            }),
        ];
        _this.state = {
            metricsOptions: [],
            syntaxLoaded: false,
            hint: null,
        };
        return _this;
    }
    PromQueryField.prototype.componentDidMount = function () {
        if (this.languageProvider) {
            this.refreshMetrics(makePromiseCancelable(this.languageProvider.start()));
        }
        this.refreshHint();
    };
    PromQueryField.prototype.componentWillUnmount = function () {
        if (this.languageProviderInitializationPromise) {
            this.languageProviderInitializationPromise.cancel();
        }
    };
    PromQueryField.prototype.componentDidUpdate = function (prevProps) {
        var queryResponse = this.props.queryResponse;
        if (queryResponse && prevProps.queryResponse && prevProps.queryResponse.series !== queryResponse.series) {
            this.refreshHint();
        }
        var reconnected = prevProps.datasourceStatus === DataSourceStatus.Disconnected &&
            this.props.datasourceStatus === DataSourceStatus.Connected;
        if (!reconnected) {
            return;
        }
        if (this.languageProviderInitializationPromise) {
            this.languageProviderInitializationPromise.cancel();
        }
        if (this.languageProvider) {
            this.refreshMetrics(makePromiseCancelable(this.languageProvider.fetchMetrics()));
        }
    };
    PromQueryField.prototype.render = function () {
        var _a = this.props, queryResponse = _a.queryResponse, query = _a.query, datasourceStatus = _a.datasourceStatus;
        var _b = this.state, metricsOptions = _b.metricsOptions, syntaxLoaded = _b.syntaxLoaded, hint = _b.hint;
        var cleanText = this.languageProvider ? this.languageProvider.cleanText : undefined;
        var chooserText = getChooserText(syntaxLoaded, datasourceStatus);
        var buttonDisabled = !syntaxLoaded || datasourceStatus === DataSourceStatus.Disconnected;
        var showError = queryResponse && queryResponse.error && queryResponse.error.refId === query.refId;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-inline gf-form-inline--nowrap" },
                React.createElement("div", { className: "gf-form flex-shrink-0" },
                    React.createElement(Cascader, { options: metricsOptions, onChange: this.onChangeMetrics, expandIcon: null },
                        React.createElement("button", { className: "gf-form-label gf-form-label--btn", disabled: buttonDisabled },
                            chooserText,
                            " ",
                            React.createElement("i", { className: "fa fa-caret-down" })))),
                React.createElement("div", { className: "gf-form gf-form--grow flex-shrink-1" },
                    React.createElement(QueryField, { additionalPlugins: this.plugins, cleanText: cleanText, query: query.expr, onTypeahead: this.onTypeahead, onWillApplySuggestion: willApplySuggestion, onChange: this.onChangeQuery, onRunQuery: this.props.onRunQuery, placeholder: "Enter a PromQL query", portalOrigin: "prometheus", syntaxLoaded: syntaxLoaded }))),
            showError ? React.createElement("div", { className: "prom-query-field-info text-error" }, queryResponse.error.message) : null,
            hint ? (React.createElement("div", { className: "prom-query-field-info text-warning" },
                hint.label,
                ' ',
                hint.fix ? (React.createElement("a", { className: "text-link muted", onClick: this.onClickHintFix }, hint.fix.label)) : null)) : null));
    };
    return PromQueryField;
}(React.PureComponent));
export default PromQueryField;
//# sourceMappingURL=PromQueryField.js.map
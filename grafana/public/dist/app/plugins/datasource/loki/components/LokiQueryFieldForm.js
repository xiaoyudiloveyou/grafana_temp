import { __assign, __awaiter, __extends, __generator } from "tslib";
// Libraries
import React from 'react';
// @ts-ignore
import Cascader from 'rc-cascader';
import { SlatePrism } from '@grafana/ui';
// Components
import QueryField from 'app/features/explore/QueryField';
// Utils & Services
// dom also includes Element polyfills
import BracesPlugin from 'app/features/explore/slate-plugins/braces';
import { DataSourceStatus, DOMUtil } from '@grafana/ui';
function getChooserText(hasSyntax, hasLogLabels, datasourceStatus) {
    if (datasourceStatus === DataSourceStatus.Disconnected) {
        return '(Disconnected)';
    }
    if (!hasSyntax) {
        return 'Loading labels...';
    }
    if (!hasLogLabels) {
        return '(No labels found)';
    }
    return 'Log labels';
}
function willApplySuggestion(suggestion, _a) {
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
var LokiQueryFieldForm = /** @class */ (function (_super) {
    __extends(LokiQueryFieldForm, _super);
    function LokiQueryFieldForm(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.loadOptions = function (selectedOptions) {
            _this.props.onLoadOptions(selectedOptions);
        };
        _this.onChangeLogLabels = function (values, selectedOptions) {
            if (selectedOptions.length === 2) {
                var key = selectedOptions[0].value;
                var value = selectedOptions[1].value;
                var query = "{" + key + "=\"" + value + "\"}";
                _this.onChangeQuery(query, true);
            }
        };
        _this.onChangeQuery = function (value, override) {
            // Send text change to parent
            var _a = _this.props, query = _a.query, onChange = _a.onChange, onRunQuery = _a.onRunQuery;
            if (onChange) {
                var nextQuery = __assign(__assign({}, query), { expr: value });
                onChange(nextQuery);
                if (override && onRunQuery) {
                    onRunQuery();
                }
            }
        };
        _this.onTypeahead = function (typeahead) { return __awaiter(_this, void 0, void 0, function () {
            var datasource, lokiLanguageProvider, _a, history, absoluteRange, prefix, text, value, wrapperClasses, labelKey, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        datasource = this.props.datasource;
                        if (!datasource.languageProvider) {
                            return [2 /*return*/, { suggestions: [] }];
                        }
                        lokiLanguageProvider = datasource.languageProvider;
                        _a = this.props, history = _a.history, absoluteRange = _a.absoluteRange;
                        prefix = typeahead.prefix, text = typeahead.text, value = typeahead.value, wrapperClasses = typeahead.wrapperClasses, labelKey = typeahead.labelKey;
                        return [4 /*yield*/, lokiLanguageProvider.provideCompletionItems({ text: text, value: value, prefix: prefix, wrapperClasses: wrapperClasses, labelKey: labelKey }, { history: history, absoluteRange: absoluteRange })];
                    case 1:
                        result = _b.sent();
                        //console.log('handleTypeahead', wrapperClasses, text, prefix, nextChar, labelKey, result.context);
                        return [2 /*return*/, result];
                }
            });
        }); };
        _this.plugins = [
            BracesPlugin(),
            SlatePrism({
                onlyIn: function (node) { return node.object === 'block' && node.type === 'code_block'; },
                getSyntax: function (node) { return 'promql'; },
            }),
        ];
        return _this;
    }
    LokiQueryFieldForm.prototype.render = function () {
        var _a = this.props, queryResponse = _a.queryResponse, query = _a.query, syntaxLoaded = _a.syntaxLoaded, logLabelOptions = _a.logLabelOptions, onLoadOptions = _a.onLoadOptions, onLabelsRefresh = _a.onLabelsRefresh, datasource = _a.datasource, datasourceStatus = _a.datasourceStatus;
        var lokiLanguageProvider = datasource.languageProvider;
        var cleanText = datasource.languageProvider ? lokiLanguageProvider.cleanText : undefined;
        var hasLogLabels = logLabelOptions && logLabelOptions.length > 0;
        var chooserText = getChooserText(syntaxLoaded, hasLogLabels, datasourceStatus);
        var buttonDisabled = !syntaxLoaded || datasourceStatus === DataSourceStatus.Disconnected;
        var showError = queryResponse && queryResponse.error && queryResponse.error.refId === query.refId;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-inline" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement(Cascader, { options: logLabelOptions, onChange: this.onChangeLogLabels, loadData: onLoadOptions, expandIcon: null, onPopupVisibleChange: function (isVisible) {
                            if (isVisible && onLabelsRefresh) {
                                onLabelsRefresh();
                            }
                        } },
                        React.createElement("button", { className: "gf-form-label gf-form-label--btn", disabled: buttonDisabled },
                            chooserText,
                            " ",
                            React.createElement("i", { className: "fa fa-caret-down" })))),
                React.createElement("div", { className: "gf-form gf-form--grow" },
                    React.createElement(QueryField, { additionalPlugins: this.plugins, cleanText: cleanText, query: query.expr, onTypeahead: this.onTypeahead, onWillApplySuggestion: willApplySuggestion, onChange: this.onChangeQuery, onRunQuery: this.props.onRunQuery, placeholder: "Enter a Loki query", portalOrigin: "loki", syntaxLoaded: syntaxLoaded }))),
            React.createElement("div", null, showError ? React.createElement("div", { className: "prom-query-field-info text-error" }, queryResponse.error.message) : null)));
    };
    return LokiQueryFieldForm;
}(React.PureComponent));
export { LokiQueryFieldForm };
//# sourceMappingURL=LokiQueryFieldForm.js.map
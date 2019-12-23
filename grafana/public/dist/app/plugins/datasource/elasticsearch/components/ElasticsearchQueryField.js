import * as tslib_1 from "tslib";
import React from 'react';
import { SlatePrism } from '@grafana/ui';
// dom also includes Element polyfills
import QueryField from 'app/features/explore/QueryField';
var ElasticsearchQueryField = /** @class */ (function (_super) {
    tslib_1.__extends(ElasticsearchQueryField, _super);
    function ElasticsearchQueryField(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onChangeQuery = function (value, override) {
            // Send text change to parent
            var _a = _this.props, query = _a.query, onChange = _a.onChange, onRunQuery = _a.onRunQuery;
            if (onChange) {
                var nextQuery = tslib_1.__assign({}, query, { query: value, isLogsQuery: true });
                onChange(nextQuery);
                if (override && onRunQuery) {
                    onRunQuery();
                }
            }
        };
        _this.plugins = [
            SlatePrism({
                onlyIn: function (node) { return node.type === 'code_block'; },
                getSyntax: function (node) { return 'lucene'; },
            }),
        ];
        _this.state = {
            syntaxLoaded: false,
        };
        return _this;
    }
    ElasticsearchQueryField.prototype.componentDidMount = function () {
        if (!this.props.query.isLogsQuery) {
            this.onChangeQuery('', true);
        }
    };
    ElasticsearchQueryField.prototype.componentWillUnmount = function () { };
    ElasticsearchQueryField.prototype.componentDidUpdate = function (prevProps) {
        // if query changed from the outside (i.e. cleared via explore toolbar)
        if (!this.props.query.isLogsQuery) {
            this.onChangeQuery('', true);
        }
    };
    ElasticsearchQueryField.prototype.render = function () {
        var _a = this.props, queryResponse = _a.queryResponse, query = _a.query;
        var syntaxLoaded = this.state.syntaxLoaded;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-inline gf-form-inline--nowrap" },
                React.createElement("div", { className: "gf-form gf-form--grow flex-shrink-1" },
                    React.createElement(QueryField, { additionalPlugins: this.plugins, query: query.query, onChange: this.onChangeQuery, onRunQuery: this.props.onRunQuery, placeholder: "Enter a Lucene query", portalOrigin: "elasticsearch", syntaxLoaded: syntaxLoaded }))),
            queryResponse && queryResponse.error ? (React.createElement("div", { className: "prom-query-field-info text-error" }, queryResponse.error.message)) : null));
    };
    return ElasticsearchQueryField;
}(React.PureComponent));
export default ElasticsearchQueryField;
//# sourceMappingURL=ElasticsearchQueryField.js.map
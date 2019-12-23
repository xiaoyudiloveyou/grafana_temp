import { __assign, __rest } from "tslib";
// Libraries
import React, { memo } from 'react';
// Types
import { DataSourceStatus } from '@grafana/ui';
import { useLokiSyntax } from './useLokiSyntax';
import { LokiQueryFieldForm } from './LokiQueryFieldForm';
export var LokiAnnotationsQueryEditor = memo(function LokiAnnotationQueryEditor(props) {
    var expr = props.expr, datasource = props.datasource, onChange = props.onChange;
    // Timerange to get existing labels from. Hard coding like this seems to be good enough right now.
    var absolute = {
        from: Date.now() - 10000,
        to: Date.now(),
    };
    var _a = useLokiSyntax(datasource.languageProvider, DataSourceStatus.Connected, absolute), isSyntaxReady = _a.isSyntaxReady, setActiveOption = _a.setActiveOption, refreshLabels = _a.refreshLabels, syntaxProps = __rest(_a, ["isSyntaxReady", "setActiveOption", "refreshLabels"]);
    var query = {
        refId: '',
        expr: expr,
    };
    return (React.createElement("div", { className: "gf-form-group" },
        React.createElement(LokiQueryFieldForm, __assign({ datasource: datasource, datasourceStatus: DataSourceStatus.Connected, query: query, onChange: function (query) { return onChange(query.expr); }, onRunQuery: function () { }, history: [], panelData: null, onLoadOptions: setActiveOption, onLabelsRefresh: refreshLabels, syntaxLoaded: isSyntaxReady, absoluteRange: absolute }, syntaxProps))));
});
//# sourceMappingURL=AnnotationsQueryEditor.js.map
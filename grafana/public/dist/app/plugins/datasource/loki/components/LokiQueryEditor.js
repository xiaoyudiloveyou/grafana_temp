import * as tslib_1 from "tslib";
// Libraries
import React, { memo } from 'react';
import { DataSourceStatus } from '@grafana/ui';
import { LokiQueryField } from './LokiQueryField';
import { useLokiSyntax } from './useLokiSyntax';
export var LokiQueryEditor = memo(function LokiQueryEditor(props) {
    var query = props.query, panelData = props.panelData, datasource = props.datasource, onChange = props.onChange, onRunQuery = props.onRunQuery;
    var absolute;
    if (panelData && panelData.request) {
        var range = panelData.request.range;
        absolute = {
            from: range.from.valueOf(),
            to: range.to.valueOf(),
        };
    }
    else {
        absolute = {
            from: Date.now() - 10000,
            to: Date.now(),
        };
    }
    var _a = useLokiSyntax(datasource.languageProvider, 
    // TODO maybe use real status
    DataSourceStatus.Connected, absolute), isSyntaxReady = _a.isSyntaxReady, setActiveOption = _a.setActiveOption, refreshLabels = _a.refreshLabels, syntaxProps = tslib_1.__rest(_a, ["isSyntaxReady", "setActiveOption", "refreshLabels"]);
    return (React.createElement("div", null,
        React.createElement(LokiQueryField, tslib_1.__assign({ datasource: datasource, datasourceStatus: DataSourceStatus.Connected, query: query, onChange: onChange, onRunQuery: onRunQuery, history: [], panelData: panelData, onLoadOptions: setActiveOption, onLabelsRefresh: refreshLabels, syntaxLoaded: isSyntaxReady, absoluteRange: absolute }, syntaxProps))));
});
export default LokiQueryEditor;
//# sourceMappingURL=LokiQueryEditor.js.map
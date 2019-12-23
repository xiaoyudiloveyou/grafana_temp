import * as tslib_1 from "tslib";
import React from 'react';
import { LokiQueryFieldForm } from './LokiQueryFieldForm';
import { useLokiSyntax } from './useLokiSyntax';
export var LokiQueryField = function (_a) {
    var datasource = _a.datasource, datasourceStatus = _a.datasourceStatus, otherProps = tslib_1.__rest(_a, ["datasource", "datasourceStatus"]);
    var _b = useLokiSyntax(datasource.languageProvider, datasourceStatus, otherProps.absoluteRange), isSyntaxReady = _b.isSyntaxReady, setActiveOption = _b.setActiveOption, refreshLabels = _b.refreshLabels, syntaxProps = tslib_1.__rest(_b, ["isSyntaxReady", "setActiveOption", "refreshLabels"]);
    return (React.createElement(LokiQueryFieldForm, tslib_1.__assign({ datasource: datasource, datasourceStatus: datasourceStatus, syntaxLoaded: isSyntaxReady, 
        /**
         * setActiveOption name is intentional. Because of the way rc-cascader requests additional data
         * https://github.com/react-component/cascader/blob/master/src/Cascader.jsx#L165
         * we are notyfing useLokiSyntax hook, what the active option is, and then it's up to the hook logic
         * to fetch data of options that aren't fetched yet
         */
        onLoadOptions: setActiveOption, onLabelsRefresh: refreshLabels }, syntaxProps, otherProps)));
};
export default LokiQueryField;
//# sourceMappingURL=LokiQueryField.js.map
import * as tslib_1 from "tslib";
import React, { lazy, Suspense } from 'react';
import { cx, css } from 'emotion';
import { LoadingPlaceholder, ErrorBoundary, Button } from '@grafana/ui';
export var LoadingChunkPlaceHolder = function () { return (React.createElement("div", { className: cx('preloader') },
    React.createElement(LoadingPlaceholder, { text: 'Loading...' }))); };
function getAlertPageStyle() {
    return css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    width: 508px;\n    margin: 128px auto;\n  "], ["\n    width: 508px;\n    margin: 128px auto;\n  "])));
}
export var SafeDynamicImport = function (importStatement) { return function (_a) {
    var props = tslib_1.__rest(_a, []);
    var LazyComponent = lazy(function () { return importStatement; });
    return (React.createElement(ErrorBoundary, null, function (_a) {
        var error = _a.error, errorInfo = _a.errorInfo;
        if (!errorInfo) {
            return (React.createElement(Suspense, { fallback: React.createElement(LoadingChunkPlaceHolder, null) },
                React.createElement(LazyComponent, tslib_1.__assign({}, props))));
        }
        return (React.createElement("div", { className: getAlertPageStyle() },
            React.createElement("h2", null, "Unable to find application file"),
            React.createElement("br", null),
            React.createElement("h2", { className: "page-heading" }, "Grafana has likely been updated. Please try reloading the page."),
            React.createElement("br", null),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement(Button, { size: 'md', variant: 'secondary', icon: "fa fa-repeat", onClick: function () { return window.location.reload(); } }, "Reload")),
            React.createElement("details", { style: { whiteSpace: 'pre-wrap' } },
                error && error.toString(),
                React.createElement("br", null),
                errorInfo.componentStack)));
    }));
}; };
var templateObject_1;
//# sourceMappingURL=SafeDynamicImport.js.map
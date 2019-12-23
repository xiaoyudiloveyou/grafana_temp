import * as tslib_1 from "tslib";
import React from 'react';
import { RefreshPicker } from '@grafana/ui';
import memoizeOne from 'memoize-one';
import { css } from 'emotion';
import classNames from 'classnames';
import { ResponsiveButton } from './ResponsiveButton';
var getStyles = memoizeOne(function () {
    return {
        selectButtonOverride: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n      label: selectButtonOverride;\n      .select-button-value {\n        color: white !important;\n      }\n    "], ["\n      label: selectButtonOverride;\n      .select-button-value {\n        color: white !important;\n      }\n    "]))),
    };
});
export function RunButton(props) {
    var splitted = props.splitted, loading = props.loading, onRun = props.onRun, onChangeRefreshInterval = props.onChangeRefreshInterval, refreshInterval = props.refreshInterval, showDropdown = props.showDropdown;
    var styles = getStyles();
    var runButton = (React.createElement(ResponsiveButton, { splitted: splitted, title: "Run Query", onClick: onRun, buttonClassName: classNames('navbar-button--secondary', { 'btn--radius-right-0': showDropdown }), iconClassName: loading ? 'fa fa-spinner fa-fw fa-spin run-icon' : 'fa fa-refresh fa-fw' }));
    if (showDropdown) {
        return (React.createElement(RefreshPicker, { onIntervalChanged: onChangeRefreshInterval, value: refreshInterval, buttonSelectClassName: "navbar-button--secondary " + styles.selectButtonOverride, refreshButton: runButton }));
    }
    return runButton;
}
var templateObject_1;
//# sourceMappingURL=RunButton.js.map
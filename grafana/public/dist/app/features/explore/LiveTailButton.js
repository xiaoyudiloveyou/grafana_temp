import * as tslib_1 from "tslib";
import React from 'react';
import classNames from 'classnames';
import { css } from 'emotion';
import memoizeOne from 'memoize-one';
import tinycolor from 'tinycolor2';
import { CSSTransition } from 'react-transition-group';
import { GrafanaThemeType, useTheme } from '@grafana/ui';
var getStyles = memoizeOne(function (theme) {
    var orange = theme.type === GrafanaThemeType.Dark ? '#FF780A' : '#ED5700';
    var orangeLighter = tinycolor(orange)
        .lighten(10)
        .toString();
    var pulseTextColor = tinycolor(orange)
        .desaturate(90)
        .toString();
    return {
        noRightBorderStyle: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n      label: noRightBorderStyle;\n      border-right: 0;\n    "], ["\n      label: noRightBorderStyle;\n      border-right: 0;\n    "]))),
        liveButton: css(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n      label: liveButton;\n      transition: background-color 1s, border-color 1s, color 1s;\n      margin: 0;\n    "], ["\n      label: liveButton;\n      transition: background-color 1s, border-color 1s, color 1s;\n      margin: 0;\n    "]))),
        isLive: css(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n      label: isLive;\n      border-color: ", ";\n      color: ", ";\n      background: transparent;\n      &:focus {\n        border-color: ", ";\n        color: ", ";\n      }\n      &:active,\n      &:hover {\n        border-color: ", ";\n        color: ", ";\n      }\n    "], ["\n      label: isLive;\n      border-color: ", ";\n      color: ", ";\n      background: transparent;\n      &:focus {\n        border-color: ", ";\n        color: ", ";\n      }\n      &:active,\n      &:hover {\n        border-color: ", ";\n        color: ", ";\n      }\n    "])), orange, orange, orange, orange, orangeLighter, orangeLighter),
        isPaused: css(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n      label: isPaused;\n      border-color: ", ";\n      background: transparent;\n      animation: pulse 3s ease-out 0s infinite normal forwards;\n      &:focus {\n        border-color: ", ";\n      }\n      &:active,\n      &:hover {\n        border-color: ", ";\n      }\n      @keyframes pulse {\n        0% {\n          color: ", ";\n        }\n        50% {\n          color: ", ";\n        }\n        100% {\n          color: ", ";\n        }\n      }\n    "], ["\n      label: isPaused;\n      border-color: ", ";\n      background: transparent;\n      animation: pulse 3s ease-out 0s infinite normal forwards;\n      &:focus {\n        border-color: ", ";\n      }\n      &:active,\n      &:hover {\n        border-color: ", ";\n      }\n      @keyframes pulse {\n        0% {\n          color: ", ";\n        }\n        50% {\n          color: ", ";\n        }\n        100% {\n          color: ", ";\n        }\n      }\n    "])), orange, orange, orangeLighter, pulseTextColor, orange, pulseTextColor),
        stopButtonEnter: css(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n      label: stopButtonEnter;\n      width: 0;\n      opacity: 0;\n      overflow: hidden;\n    "], ["\n      label: stopButtonEnter;\n      width: 0;\n      opacity: 0;\n      overflow: hidden;\n    "]))),
        stopButtonEnterActive: css(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n      label: stopButtonEnterActive;\n      opacity: 1;\n      width: 32px;\n      transition: opacity 500ms ease-in 50ms, width 500ms ease-in 50ms;\n    "], ["\n      label: stopButtonEnterActive;\n      opacity: 1;\n      width: 32px;\n      transition: opacity 500ms ease-in 50ms, width 500ms ease-in 50ms;\n    "]))),
        stopButtonExit: css(templateObject_7 || (templateObject_7 = tslib_1.__makeTemplateObject(["\n      label: stopButtonExit;\n      width: 32px;\n      opacity: 1;\n      overflow: hidden;\n    "], ["\n      label: stopButtonExit;\n      width: 32px;\n      opacity: 1;\n      overflow: hidden;\n    "]))),
        stopButtonExitActive: css(templateObject_8 || (templateObject_8 = tslib_1.__makeTemplateObject(["\n      label: stopButtonExitActive;\n      opacity: 0;\n      width: 0;\n      transition: opacity 500ms ease-in 50ms, width 500ms ease-in 50ms;\n    "], ["\n      label: stopButtonExitActive;\n      opacity: 0;\n      width: 0;\n      transition: opacity 500ms ease-in 50ms, width 500ms ease-in 50ms;\n    "]))),
    };
});
export function LiveTailButton(props) {
    var _a;
    var start = props.start, pause = props.pause, resume = props.resume, isLive = props.isLive, isPaused = props.isPaused, stop = props.stop;
    var theme = useTheme();
    var styles = getStyles(theme);
    var onClickMain = isLive ? (isPaused ? resume : pause) : start;
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: classNames('btn navbar-button', styles.liveButton, (_a = {},
                _a["btn--radius-right-0 " + styles.noRightBorderStyle] = isLive,
                _a[styles.isLive] = isLive && !isPaused,
                _a[styles.isPaused] = isLive && isPaused,
                _a)), onClick: onClickMain },
            React.createElement("i", { className: classNames('fa', isPaused || !isLive ? 'fa-play' : 'fa-pause') }),
            "\u00A0 Live tailing"),
        React.createElement(CSSTransition, { mountOnEnter: true, unmountOnExit: true, timeout: 500, in: isLive, classNames: {
                enter: styles.stopButtonEnter,
                enterActive: styles.stopButtonEnterActive,
                exit: styles.stopButtonExit,
                exitActive: styles.stopButtonExitActive,
            } },
            React.createElement("div", null,
                React.createElement("button", { className: "btn navbar-button navbar-button--attached " + styles.isLive, onClick: stop },
                    React.createElement("i", { className: 'fa fa-stop' }))))));
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=LiveTailButton.js.map
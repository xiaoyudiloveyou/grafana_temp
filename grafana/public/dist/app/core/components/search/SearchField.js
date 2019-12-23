import { __assign, __makeTemplateObject, __rest } from "tslib";
import React, { useContext } from 'react';
// @ts-ignore
import tinycolor from 'tinycolor2';
import { css, cx } from 'emotion';
import { ThemeContext, selectThemeVariant } from '@grafana/ui';
var getSearchFieldStyles = function (theme) { return ({
    wrapper: css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    width: 100%;\n    height: 55px; /* this variable is not part of GrafanaTheme yet*/\n    display: flex;\n    background-color: ", ";\n    position: relative;\n  "], ["\n    width: 100%;\n    height: 55px; /* this variable is not part of GrafanaTheme yet*/\n    display: flex;\n    background-color: ",
        ";\n    position: relative;\n  "])), selectThemeVariant({
        light: theme.colors.white,
        dark: theme.colors.dark4,
    }, theme.type)),
    input: css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    max-width: 653px;\n    padding: ", " ", " ", " ", ";\n    height: 51px;\n    box-sizing: border-box;\n    outline: none;\n    background: ", ";\n    background-color: ", ";\n    flex-grow: 10;\n  "], ["\n    max-width: 653px;\n    padding: ", " ", " ", " ", ";\n    height: 51px;\n    box-sizing: border-box;\n    outline: none;\n    background: ",
        ";\n    background-color: ",
        ";\n    flex-grow: 10;\n  "])), theme.spacing.md, theme.spacing.md, theme.spacing.sm, theme.spacing.md, selectThemeVariant({
        light: theme.colors.dark1,
        dark: theme.colors.black,
    }, theme.type), selectThemeVariant({
        light: tinycolor(theme.colors.white)
            .lighten(4)
            .toString(),
        dark: theme.colors.dark4,
    }, theme.type)),
    spacer: css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    flex-grow: 1;\n  "], ["\n    flex-grow: 1;\n  "]))),
    icon: cx(css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      font-size: ", ";\n      padding: ", " ", " ", " ", ";\n    "], ["\n      font-size: ", ";\n      padding: ", " ", " ", " ", ";\n    "])), theme.typography.size.lg, theme.spacing.md, theme.spacing.md, theme.spacing.sm, theme.spacing.md), 'pointer'),
}); };
export var SearchField = function (_a) {
    var query = _a.query, onChange = _a.onChange, inputProps = __rest(_a, ["query", "onChange"]);
    var theme = useContext(ThemeContext);
    var styles = getSearchFieldStyles(theme);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles.wrapper + " search-field-wrapper" },
            React.createElement("div", { className: styles.icon },
                React.createElement("i", { className: "fa fa-search" })),
            React.createElement("input", __assign({ type: "text", placeholder: "Find dashboards by name", value: query.query, onChange: function (event) {
                    onChange(event.currentTarget.value);
                }, tabIndex: 1, spellCheck: false }, inputProps, { className: styles.input })),
            React.createElement("div", { className: styles.spacer }))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SearchField.js.map
import { __assign, __makeTemplateObject, __rest } from "tslib";
import React, { useContext } from 'react';
import { ContextMenu, SeriesIcon, ThemeContext } from '@grafana/ui';
import { css } from 'emotion';
export var GraphContextMenu = function (_a) {
    var getContextMenuSource = _a.getContextMenuSource, formatSourceDate = _a.formatSourceDate, items = _a.items, otherProps = __rest(_a, ["getContextMenuSource", "formatSourceDate", "items"]);
    var theme = useContext(ThemeContext);
    var source = getContextMenuSource();
    //  Do not render items that do not have label specified
    var itemsToRender = items
        ? items.map(function (group) { return (__assign(__assign({}, group), { items: group.items.filter(function (item) { return item.label; }) })); })
        : [];
    var renderHeader = source
        ? function () {
            if (!source) {
                return null;
            }
            var timeFormat = source.series.hasMsResolution ? 'YYYY-MM-DD HH:mm:ss.SSS' : 'YYYY-MM-DD HH:mm:ss';
            return (React.createElement("div", { className: css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n              padding: ", " ", ";\n              font-size: ", ";\n            "], ["\n              padding: ", " ", ";\n              font-size: ", ";\n            "])), theme.spacing.xs, theme.spacing.sm, theme.typography.size.sm) },
                React.createElement("strong", null, formatSourceDate(source.datapoint[0], timeFormat)),
                React.createElement("div", null,
                    React.createElement(SeriesIcon, { color: source.series.color }),
                    React.createElement("span", { className: css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                  white-space: nowrap;\n                  padding-left: ", ";\n                "], ["\n                  white-space: nowrap;\n                  padding-left: ", ";\n                "])), theme.spacing.xs) }, source.series.alias))));
        }
        : null;
    return React.createElement(ContextMenu, __assign({}, otherProps, { items: itemsToRender, renderHeader: renderHeader }));
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=GraphContextMenu.js.map
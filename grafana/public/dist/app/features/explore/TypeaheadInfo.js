import { __extends, __makeTemplateObject } from "tslib";
import React, { PureComponent } from 'react';
import { css, cx } from 'emotion';
import { selectThemeVariant } from '@grafana/ui';
var TypeaheadInfo = /** @class */ (function (_super) {
    __extends(TypeaheadInfo, _super);
    function TypeaheadInfo(props) {
        var _this = _super.call(this, props) || this;
        _this.getStyles = function (visible) {
            var _a = _this.props, height = _a.height, theme = _a.theme;
            return {
                typeaheadItem: css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        label: type-ahead-item;\n        padding: ", " ", " ", " ", ";\n        border-radius: ", ";\n        border: ", ";\n        overflow-y: scroll;\n        overflow-x: hidden;\n        outline: none;\n        background: ", ";\n        color: ", ";\n        box-shadow: ", ";\n        visibility: ", ";\n        width: 250px;\n        height: ", "px;\n        position: relative;\n      "], ["\n        label: type-ahead-item;\n        padding: ", " ", " ", " ", ";\n        border-radius: ", ";\n        border: ",
                    ";\n        overflow-y: scroll;\n        overflow-x: hidden;\n        outline: none;\n        background: ", ";\n        color: ", ";\n        box-shadow: ",
                    ";\n        visibility: ", ";\n        width: 250px;\n        height: ", "px;\n        position: relative;\n      "])), theme.spacing.sm, theme.spacing.sm, theme.spacing.sm, theme.spacing.md, theme.border.radius.md, selectThemeVariant({ light: "solid 1px " + theme.colors.gray5, dark: "solid 1px " + theme.colors.dark1 }, theme.type), selectThemeVariant({ light: theme.colors.white, dark: theme.colors.dark4 }, theme.type), theme.colors.text, selectThemeVariant({ light: "0 5px 10px 0 " + theme.colors.gray5, dark: "0 5px 10px 0 " + theme.colors.black }, theme.type), visible === true ? 'visible' : 'hidden', height + parseInt(theme.spacing.xxs, 10)),
            };
        };
        return _this;
    }
    TypeaheadInfo.prototype.render = function () {
        var item = this.props.item;
        var visible = item && !!item.documentation;
        var label = item ? item.label : '';
        var documentation = item && item.documentation ? item.documentation : '';
        var styles = this.getStyles(visible);
        return (React.createElement("div", { className: cx([styles.typeaheadItem]) },
            React.createElement("b", null, label),
            React.createElement("hr", null),
            React.createElement("span", null, documentation)));
    };
    return TypeaheadInfo;
}(PureComponent));
export { TypeaheadInfo };
var templateObject_1;
//# sourceMappingURL=TypeaheadInfo.js.map
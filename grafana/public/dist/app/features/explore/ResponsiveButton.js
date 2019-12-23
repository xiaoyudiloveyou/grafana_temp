import * as tslib_1 from "tslib";
import React from 'react';
export var IconSide;
(function (IconSide) {
    IconSide["left"] = "left";
    IconSide["right"] = "right";
})(IconSide || (IconSide = {}));
export var ResponsiveButton = function (props) {
    var defaultProps = {
        iconSide: IconSide.left,
    };
    props = tslib_1.__assign({}, defaultProps, props);
    var title = props.title, onClick = props.onClick, buttonClassName = props.buttonClassName, iconClassName = props.iconClassName, splitted = props.splitted, iconSide = props.iconSide, disabled = props.disabled;
    return (React.createElement("button", { className: "btn navbar-button " + (buttonClassName ? buttonClassName : ''), onClick: onClick, disabled: disabled || false },
        iconClassName && iconSide === IconSide.left ? (React.createElement(React.Fragment, null,
            React.createElement("i", { className: "" + iconClassName }),
            "\u00A0")) : null,
        React.createElement("span", { className: "btn-title" }, !splitted ? title : ''),
        iconClassName && iconSide === IconSide.right ? (React.createElement(React.Fragment, null,
            "\u00A0",
            React.createElement("i", { className: "" + iconClassName }))) : null));
};
//# sourceMappingURL=ResponsiveButton.js.map
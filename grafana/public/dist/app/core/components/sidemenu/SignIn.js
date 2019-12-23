import React from 'react';
import { connectWithStore } from 'app/core/utils/connectWithReduxStore';
export var SignIn = function (_a) {
    var url = _a.url;
    var loginUrl = "login?redirect=" + encodeURIComponent(url);
    return (React.createElement("div", { className: "sidemenu-item" },
        React.createElement("a", { href: loginUrl, className: "sidemenu-link", target: "_self" },
            React.createElement("span", { className: "icon-circle sidemenu-icon" },
                React.createElement("i", { className: "fa fa-fw fa-sign-in" }))),
        React.createElement("a", { href: loginUrl, target: "_self" },
            React.createElement("ul", { className: "dropdown-menu dropdown-menu--sidemenu", role: "menu" },
                React.createElement("li", { className: "side-menu-header" },
                    React.createElement("span", { className: "sidemenu-item-text" }, "Sign In"))))));
};
var mapStateToProps = function (state) { return ({
    url: state.location.url,
}); };
export default connectWithStore(SignIn, mapStateToProps);
//# sourceMappingURL=SignIn.js.map
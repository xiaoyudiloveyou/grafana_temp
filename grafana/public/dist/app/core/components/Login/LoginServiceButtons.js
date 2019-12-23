import React from 'react';
import config from 'app/core/config';
var loginServices = function () { return ({
    saml: {
        enabled: config.samlEnabled,
        name: 'SAML',
        className: 'github',
        icon: 'key',
    },
    google: {
        enabled: config.oauth.google,
        name: 'Google',
    },
    github: {
        enabled: config.oauth.github,
        name: 'GitHub',
    },
    gitlab: {
        enabled: config.oauth.gitlab,
        name: 'GitLab',
    },
    grafanacom: {
        enabled: config.oauth.grafana_com,
        name: 'Grafana.com',
        hrefName: 'grafana_com',
        icon: 'grafana_com',
    },
    oauth: {
        enabled: config.oauth.generic_oauth,
        name: 'OAuth',
        icon: 'sign-in',
        hrefName: 'generic_oauth',
    },
}); };
var LoginDivider = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "text-center login-divider" },
            React.createElement("div", null,
                React.createElement("div", { className: "login-divider-line" })),
            React.createElement("div", null,
                React.createElement("span", { className: "login-divider-text" }, config.disableLoginForm ? null : React.createElement("span", null, "or"))),
            React.createElement("div", null,
                React.createElement("div", { className: "login-divider-line" }))),
        React.createElement("div", { className: "clearfix" })));
};
export var LoginServiceButtons = function () {
    var keyNames = Object.keys(loginServices());
    var serviceElementsEnabled = keyNames.filter(function (key) {
        var service = loginServices()[key];
        return service.enabled;
    });
    if (serviceElementsEnabled.length === 0) {
        return null;
    }
    var serviceElements = serviceElementsEnabled.map(function (key) {
        var service = loginServices()[key];
        return (React.createElement("a", { key: key, className: "btn btn-medium btn-service btn-service--" + (service.className || key) + " login-btn", href: "login/" + (service.hrefName ? service.hrefName : key), target: "_self" },
            React.createElement("i", { className: "btn-service-icon fa fa-" + (service.icon ? service.icon : key) }),
            "Sign in with ",
            service.name));
    });
    var divider = LoginDivider();
    return (React.createElement(React.Fragment, null,
        divider,
        React.createElement("div", { className: "login-oauth text-center" }, serviceElements)));
};
//# sourceMappingURL=LoginServiceButtons.js.map
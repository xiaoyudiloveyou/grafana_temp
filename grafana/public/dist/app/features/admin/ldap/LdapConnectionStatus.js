import React from 'react';
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
import { AppNotificationSeverity } from 'app/types';
export var LdapConnectionStatus = function (_a) {
    var ldapConnectionInfo = _a.ldapConnectionInfo;
    return (React.createElement(React.Fragment, null,
        React.createElement("h3", { className: "page-heading" }, "LDAP Connection"),
        React.createElement("div", { className: "gf-form-group" },
            React.createElement("div", { className: "gf-form" },
                React.createElement("table", { className: "filter-table form-inline" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Host"),
                            React.createElement("th", { colSpan: 2 }, "Port"))),
                    React.createElement("tbody", null, ldapConnectionInfo &&
                        ldapConnectionInfo.map(function (serverInfo, index) { return (React.createElement("tr", { key: index },
                            React.createElement("td", null, serverInfo.host),
                            React.createElement("td", null, serverInfo.port),
                            React.createElement("td", null, serverInfo.available ? (React.createElement("i", { className: "fa fa-fw fa-check pull-right" })) : (React.createElement("i", { className: "fa fa-fw fa-exclamation-triangle pull-right" }))))); })))),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement(LdapErrorBox, { ldapConnectionInfo: ldapConnectionInfo })))));
};
export var LdapErrorBox = function (_a) {
    var ldapConnectionInfo = _a.ldapConnectionInfo;
    var hasError = ldapConnectionInfo.some(function (info) { return info.error; });
    if (!hasError) {
        return null;
    }
    var connectionErrors = [];
    ldapConnectionInfo.forEach(function (info) {
        if (info.error) {
            connectionErrors.push(info);
        }
    });
    var errorElements = connectionErrors.map(function (info, index) { return (React.createElement("div", { key: index },
        React.createElement("span", { style: { fontWeight: 500 } },
            info.host,
            ":",
            info.port,
            React.createElement("br", null)),
        React.createElement("span", null, info.error),
        index !== connectionErrors.length - 1 && (React.createElement(React.Fragment, null,
            React.createElement("br", null),
            React.createElement("br", null))))); });
    return React.createElement(AlertBox, { title: "Connection error", severity: AppNotificationSeverity.Error, body: errorElements });
};
//# sourceMappingURL=LdapConnectionStatus.js.map
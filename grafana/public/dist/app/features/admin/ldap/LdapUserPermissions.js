import React from 'react';
export var LdapUserPermissions = function (_a) {
    var permissions = _a.permissions;
    return (React.createElement("div", { className: "gf-form-group" },
        React.createElement("div", { className: "gf-form" },
            React.createElement("table", { className: "filter-table form-inline" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { colSpan: 1 }, "Permissions"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { className: "width-16" }, " Grafana admin"),
                        React.createElement("td", null, permissions.isGrafanaAdmin ? (React.createElement(React.Fragment, null,
                            React.createElement("i", { className: "gicon gicon-shield" }),
                            " Yes")) : ('No'))),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "width-16" }, "Status"),
                        React.createElement("td", null, permissions.isDisabled ? (React.createElement(React.Fragment, null,
                            React.createElement("i", { className: "fa fa-fw fa-times" }),
                            " Inactive")) : (React.createElement(React.Fragment, null,
                            React.createElement("i", { className: "fa fa-fw fa-check" }),
                            " Active")))))))));
};
//# sourceMappingURL=LdapUserPermissions.js.map
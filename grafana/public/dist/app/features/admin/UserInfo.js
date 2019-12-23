import React from 'react';
export var UserInfo = function (_a) {
    var user = _a.user;
    return (React.createElement("div", { className: "gf-form-group" },
        React.createElement("div", { className: "gf-form" },
            React.createElement("table", { className: "filter-table form-inline" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { colSpan: 2 }, "User information"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { className: "width-16" }, "Name"),
                        React.createElement("td", null, user.name)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "width-16" }, "Username"),
                        React.createElement("td", null, user.login)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "width-16" }, "Email"),
                        React.createElement("td", null, user.email)))))));
};
//# sourceMappingURL=UserInfo.js.map
import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
var UserSessions = /** @class */ (function (_super) {
    tslib_1.__extends(UserSessions, _super);
    function UserSessions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSessionRevoke = function (id) {
            return function () {
                _this.props.onSessionRevoke(id);
            };
        };
        _this.handleAllSessionsRevoke = function () {
            _this.props.onAllSessionsRevoke();
        };
        return _this;
    }
    UserSessions.prototype.render = function () {
        var _this = this;
        var sessions = this.props.sessions;
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" }, "Sessions"),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement("table", { className: "filter-table form-inline" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Last seen"),
                                React.createElement("th", null, "Logged on"),
                                React.createElement("th", null, "IP address"),
                                React.createElement("th", { colSpan: 2 }, "Browser & OS"))),
                        React.createElement("tbody", null, sessions &&
                            sessions.map(function (session, index) { return (React.createElement("tr", { key: session.id + "-" + index },
                                React.createElement("td", null, session.isActive ? 'Now' : session.seenAt),
                                React.createElement("td", null, session.createdAt),
                                React.createElement("td", null, session.clientIp),
                                React.createElement("td", null, session.browser + " on " + session.os + " " + session.osVersion),
                                React.createElement("td", null,
                                    React.createElement("button", { className: "btn btn-danger btn-small", onClick: _this.handleSessionRevoke(session.id) },
                                        React.createElement("i", { className: "fa fa-power-off" }))))); })))),
                React.createElement("div", { className: "gf-form-button-row" }, sessions.length > 0 && (React.createElement("button", { className: "btn btn-danger", onClick: this.handleAllSessionsRevoke }, "Logout user from all devices"))))));
    };
    return UserSessions;
}(PureComponent));
export { UserSessions };
//# sourceMappingURL=UserSessions.js.map
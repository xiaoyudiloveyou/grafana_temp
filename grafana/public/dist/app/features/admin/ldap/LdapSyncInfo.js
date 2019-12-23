import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { dateTime } from '@grafana/data';
var syncTimeFormat = 'dddd YYYY-MM-DD HH:mm zz';
var LdapSyncInfo = /** @class */ (function (_super) {
    tslib_1.__extends(LdapSyncInfo, _super);
    function LdapSyncInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isSyncing: false,
        };
        _this.handleSyncClick = function () {
            console.log('Bulk-sync now');
            _this.setState({ isSyncing: !_this.state.isSyncing });
        };
        return _this;
    }
    LdapSyncInfo.prototype.render = function () {
        var ldapSyncInfo = this.props.ldapSyncInfo;
        var isSyncing = this.state.isSyncing;
        var nextSyncTime = dateTime(ldapSyncInfo.nextSync).format(syncTimeFormat);
        var prevSyncSuccessful = ldapSyncInfo && ldapSyncInfo.prevSync;
        var prevSyncTime = prevSyncSuccessful ? dateTime(ldapSyncInfo.prevSync.started).format(syncTimeFormat) : '';
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" },
                "LDAP Synchronisation",
                React.createElement("button", { className: "btn btn-secondary pull-right", onClick: this.handleSyncClick, hidden: true },
                    React.createElement("span", { className: "btn-title" }, "Bulk-sync now"),
                    isSyncing && React.createElement("i", { className: "fa fa-spinner fa-fw fa-spin run-icon" }))),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement("table", { className: "filter-table form-inline" },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("td", null, "Active synchronisation"),
                                React.createElement("td", { colSpan: 2 }, ldapSyncInfo.enabled ? 'Enabled' : 'Disabled')),
                            React.createElement("tr", null,
                                React.createElement("td", null, "Scheduled"),
                                React.createElement("td", null, ldapSyncInfo.schedule)),
                            React.createElement("tr", null,
                                React.createElement("td", null, "Next scheduled synchronisation"),
                                React.createElement("td", null, nextSyncTime)),
                            React.createElement("tr", null,
                                React.createElement("td", null, "Last synchronisation"),
                                prevSyncSuccessful && (React.createElement(React.Fragment, null,
                                    React.createElement("td", null, prevSyncTime),
                                    React.createElement("td", null, "Successful"))))))))));
    };
    return LdapSyncInfo;
}(PureComponent));
export { LdapSyncInfo };
//# sourceMappingURL=LdapSyncInfo.js.map
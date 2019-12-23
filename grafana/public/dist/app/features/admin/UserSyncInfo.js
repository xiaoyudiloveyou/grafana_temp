import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { dateTime } from '@grafana/data';
var syncTimeFormat = 'dddd YYYY-MM-DD HH:mm zz';
var UserSyncInfo = /** @class */ (function (_super) {
    tslib_1.__extends(UserSyncInfo, _super);
    function UserSyncInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isSyncing: false,
        };
        _this.handleSyncClick = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var onSync;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onSync = this.props.onSync;
                        this.setState({ isSyncing: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 5]);
                        if (!onSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, onSync()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.setState({ isSyncing: false });
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    UserSyncInfo.prototype.render = function () {
        var syncInfo = this.props.syncInfo;
        var isSyncing = this.state.isSyncing;
        var nextSyncTime = syncInfo.nextSync ? dateTime(syncInfo.nextSync).format(syncTimeFormat) : '';
        var prevSyncSuccessful = syncInfo && syncInfo.prevSync;
        var prevSyncTime = prevSyncSuccessful ? dateTime(syncInfo.prevSync).format(syncTimeFormat) : '';
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" },
                "LDAP",
                React.createElement("button", { className: "btn btn-secondary pull-right", onClick: this.handleSyncClick, hidden: true },
                    React.createElement("span", { className: "btn-title" }, "Sync user"),
                    isSyncing && React.createElement("i", { className: "fa fa-spinner fa-fw fa-spin run-icon" }))),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("div", { className: "gf-form" },
                    React.createElement("table", { className: "filter-table form-inline" },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("td", null, "Last synchronisation"),
                                React.createElement("td", null, prevSyncTime),
                                prevSyncSuccessful && React.createElement("td", { className: "pull-right" }, "Successful")),
                            React.createElement("tr", null,
                                React.createElement("td", null, "Next scheduled synchronisation"),
                                React.createElement("td", { colSpan: 2 }, nextSyncTime))))))));
    };
    return UserSyncInfo;
}(PureComponent));
export { UserSyncInfo };
//# sourceMappingURL=UserSyncInfo.js.map
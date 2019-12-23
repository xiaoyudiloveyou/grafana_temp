import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import Page from 'app/core/components/Page/Page';
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
import { getNavModel } from 'app/core/selectors/navModel';
import { AppNotificationSeverity, } from 'app/types';
import { clearUserError, loadLdapUserInfo, revokeSession, revokeAllSessions, loadLdapSyncStatus, syncUser, } from '../state/actions';
import { LdapUserInfo } from './LdapUserInfo';
import { getRouteParamsId } from 'app/core/selectors/location';
import { UserSessions } from '../UserSessions';
import { UserInfo } from '../UserInfo';
import { UserSyncInfo } from '../UserSyncInfo';
var LdapUserPage = /** @class */ (function (_super) {
    tslib_1.__extends(LdapUserPage, _super);
    function LdapUserPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isLoading: true,
        };
        _this.onClearUserError = function () {
            _this.props.clearUserError();
        };
        _this.onSyncUser = function () {
            var _a = _this.props, syncUser = _a.syncUser, user = _a.user;
            if (syncUser && user) {
                syncUser(user.id);
            }
        };
        _this.onSessionRevoke = function (tokenId) {
            var _a = _this.props, userId = _a.userId, revokeSession = _a.revokeSession;
            revokeSession(tokenId, userId);
        };
        _this.onAllSessionsRevoke = function () {
            var _a = _this.props, userId = _a.userId, revokeAllSessions = _a.revokeAllSessions;
            revokeAllSessions(userId);
        };
        return _this;
    }
    LdapUserPage.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, userId, loadLdapUserInfo, loadLdapSyncStatus;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, userId = _a.userId, loadLdapUserInfo = _a.loadLdapUserInfo, loadLdapSyncStatus = _a.loadLdapSyncStatus;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, loadLdapUserInfo(userId)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loadLdapSyncStatus()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.setState({ isLoading: false });
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LdapUserPage.prototype.render = function () {
        var _a = this.props, user = _a.user, ldapUser = _a.ldapUser, userError = _a.userError, navModel = _a.navModel, sessions = _a.sessions, ldapSyncInfo = _a.ldapSyncInfo;
        var isLoading = this.state.isLoading;
        var userSyncInfo = {};
        if (ldapSyncInfo) {
            userSyncInfo.nextSync = ldapSyncInfo.nextSync;
        }
        if (user) {
            userSyncInfo.prevSync = user.updatedAt;
        }
        return (React.createElement(Page, { navModel: navModel },
            React.createElement(Page.Contents, { isLoading: isLoading },
                React.createElement("div", { className: "grafana-info-box" }, "This user is synced via LDAP \u2013 all changes must be done in LDAP or mappings."),
                userError && userError.title && (React.createElement("div", { className: "gf-form-group" },
                    React.createElement(AlertBox, { title: userError.title, severity: AppNotificationSeverity.Error, body: userError.body, onClose: this.onClearUserError }))),
                ldapUser && React.createElement(LdapUserInfo, { ldapUser: ldapUser }),
                !ldapUser && user && React.createElement(UserInfo, { user: user }),
                userSyncInfo && React.createElement(UserSyncInfo, { syncInfo: userSyncInfo, onSync: this.onSyncUser }),
                sessions && (React.createElement(UserSessions, { sessions: sessions, onSessionRevoke: this.onSessionRevoke, onAllSessionsRevoke: this.onAllSessionsRevoke })))));
    };
    return LdapUserPage;
}(PureComponent));
export { LdapUserPage };
var mapStateToProps = function (state) { return ({
    userId: getRouteParamsId(state.location),
    navModel: getNavModel(state.navIndex, 'global-users'),
    user: state.ldapUser.user,
    ldapUser: state.ldapUser.ldapUser,
    userError: state.ldapUser.userError,
    ldapSyncInfo: state.ldapUser.ldapSyncInfo,
    sessions: state.ldapUser.sessions,
}); };
var mapDispatchToProps = {
    loadLdapUserInfo: loadLdapUserInfo,
    loadLdapSyncStatus: loadLdapSyncStatus,
    syncUser: syncUser,
    revokeSession: revokeSession,
    revokeAllSessions: revokeAllSessions,
    clearUserError: clearUserError,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(LdapUserPage));
//# sourceMappingURL=LdapUserPage.js.map
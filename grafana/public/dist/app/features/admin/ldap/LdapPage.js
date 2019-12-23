import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { FormField } from '@grafana/ui';
import { getNavModel } from 'app/core/selectors/navModel';
import config from 'app/core/config';
import Page from 'app/core/components/Page/Page';
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
import { LdapConnectionStatus } from './LdapConnectionStatus';
import { LdapSyncInfo } from './LdapSyncInfo';
import { LdapUserInfo } from './LdapUserInfo';
import { AppNotificationSeverity } from 'app/types';
import { loadLdapState, loadLdapSyncStatus, loadUserMapping, clearUserError, clearUserMappingInfo, } from '../state/actions';
var LdapPage = /** @class */ (function (_super) {
    tslib_1.__extends(LdapPage, _super);
    function LdapPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isLoading: true,
        };
        _this.search = function (event) {
            event.preventDefault();
            var username = event.target.elements['username'].value;
            if (username) {
                _this.fetchUserMapping(username);
            }
        };
        _this.onClearUserError = function () {
            _this.props.clearUserError();
        };
        return _this;
    }
    LdapPage.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.clearUserMappingInfo()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fetchLDAPStatus()];
                    case 2:
                        _a.sent();
                        this.setState({ isLoading: false });
                        return [2 /*return*/];
                }
            });
        });
    };
    LdapPage.prototype.fetchLDAPStatus = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, loadLdapState, loadLdapSyncStatus;
            return tslib_1.__generator(this, function (_b) {
                _a = this.props, loadLdapState = _a.loadLdapState, loadLdapSyncStatus = _a.loadLdapSyncStatus;
                return [2 /*return*/, Promise.all([loadLdapState(), loadLdapSyncStatus()])];
            });
        });
    };
    LdapPage.prototype.fetchUserMapping = function (username) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loadUserMapping;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loadUserMapping = this.props.loadUserMapping;
                        return [4 /*yield*/, loadUserMapping(username)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LdapPage.prototype.render = function () {
        var _a = this.props, ldapUser = _a.ldapUser, userError = _a.userError, ldapError = _a.ldapError, ldapSyncInfo = _a.ldapSyncInfo, ldapConnectionInfo = _a.ldapConnectionInfo, navModel = _a.navModel;
        var isLoading = this.state.isLoading;
        return (React.createElement(Page, { navModel: navModel },
            React.createElement(Page.Contents, { isLoading: isLoading },
                React.createElement(React.Fragment, null,
                    ldapError && ldapError.title && (React.createElement("div", { className: "gf-form-group" },
                        React.createElement(AlertBox, { title: ldapError.title, severity: AppNotificationSeverity.Error, body: ldapError.body }))),
                    React.createElement(LdapConnectionStatus, { ldapConnectionInfo: ldapConnectionInfo }),
                    config.buildInfo.isEnterprise && ldapSyncInfo && React.createElement(LdapSyncInfo, { ldapSyncInfo: ldapSyncInfo }),
                    React.createElement("h3", { className: "page-heading" }, "Test user mapping"),
                    React.createElement("div", { className: "gf-form-group" },
                        React.createElement("form", { onSubmit: this.search, className: "gf-form-inline" },
                            React.createElement(FormField, { label: "Username", labelWidth: 8, inputWidth: 30, type: "text", id: "username", name: "username" }),
                            React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Run"))),
                    userError && userError.title && (React.createElement("div", { className: "gf-form-group" },
                        React.createElement(AlertBox, { title: userError.title, severity: AppNotificationSeverity.Error, body: userError.body, onClose: this.onClearUserError }))),
                    ldapUser && React.createElement(LdapUserInfo, { ldapUser: ldapUser, showAttributeMapping: true })))));
    };
    return LdapPage;
}(PureComponent));
export { LdapPage };
var mapStateToProps = function (state) { return ({
    navModel: getNavModel(state.navIndex, 'ldap'),
    ldapConnectionInfo: state.ldap.connectionInfo,
    ldapUser: state.ldap.user,
    ldapSyncInfo: state.ldap.syncInfo,
    userError: state.ldap.userError,
    ldapError: state.ldap.ldapError,
}); };
var mapDispatchToProps = {
    loadLdapState: loadLdapState,
    loadLdapSyncStatus: loadLdapSyncStatus,
    loadUserMapping: loadUserMapping,
    clearUserError: clearUserError,
    clearUserMappingInfo: clearUserMappingInfo,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(LdapPage));
//# sourceMappingURL=LdapPage.js.map
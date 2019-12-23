import * as tslib_1 from "tslib";
import { actionCreatorFactory, noPayloadActionCreatorFactory } from 'app/core/redux';
import config from 'app/core/config';
import { getUserInfo, getLdapState, syncLdapUser, getUser, getUserSessions, revokeUserSession, revokeAllUserSessions, getLdapSyncStatus, } from './apis';
// Action types
export var ldapConnectionInfoLoadedAction = actionCreatorFactory('ldap/CONNECTION_INFO_LOADED').create();
export var ldapSyncStatusLoadedAction = actionCreatorFactory('ldap/SYNC_STATUS_LOADED').create();
export var userMappingInfoLoadedAction = actionCreatorFactory('ldap/USER_INFO_LOADED').create();
export var userMappingInfoFailedAction = actionCreatorFactory('ldap/USER_INFO_FAILED').create();
export var clearUserMappingInfoAction = noPayloadActionCreatorFactory('ldap/CLEAR_USER_MAPPING_INFO').create();
export var clearUserErrorAction = noPayloadActionCreatorFactory('ldap/CLEAR_USER_ERROR').create();
export var ldapFailedAction = actionCreatorFactory('ldap/LDAP_FAILED').create();
export var userLoadedAction = actionCreatorFactory('USER_LOADED').create();
export var userSessionsLoadedAction = actionCreatorFactory('USER_SESSIONS_LOADED').create();
export var userSyncFailedAction = noPayloadActionCreatorFactory('USER_SYNC_FAILED').create();
export var revokeUserSessionAction = noPayloadActionCreatorFactory('REVOKE_USER_SESSION').create();
export var revokeAllUserSessionsAction = noPayloadActionCreatorFactory('REVOKE_ALL_USER_SESSIONS').create();
// Actions
export function loadLdapState() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var connectionInfo, error_1, ldapError;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getLdapState()];
                case 1:
                    connectionInfo = _a.sent();
                    dispatch(ldapConnectionInfoLoadedAction(connectionInfo));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    error_1.isHandled = true;
                    ldapError = {
                        title: error_1.data.message,
                        body: error_1.data.error,
                    };
                    dispatch(ldapFailedAction(ldapError));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
export function loadLdapSyncStatus() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var syncStatus;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.buildInfo.isEnterprise) return [3 /*break*/, 2];
                    return [4 /*yield*/, getLdapSyncStatus()];
                case 1:
                    syncStatus = _a.sent();
                    dispatch(ldapSyncStatusLoadedAction(syncStatus));
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
}
export function loadUserMapping(username) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var userInfo, error_2, userError;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUserInfo(username)];
                case 1:
                    userInfo = _a.sent();
                    dispatch(userMappingInfoLoadedAction(userInfo));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    error_2.isHandled = true;
                    userError = {
                        title: error_2.data.message,
                        body: error_2.data.error,
                    };
                    dispatch(clearUserMappingInfoAction());
                    dispatch(userMappingInfoFailedAction(userError));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
export function clearUserError() {
    return function (dispatch) {
        dispatch(clearUserErrorAction());
    };
}
export function clearUserMappingInfo() {
    return function (dispatch) {
        dispatch(clearUserErrorAction());
        dispatch(clearUserMappingInfoAction());
    };
}
export function syncUser(userId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, syncLdapUser(userId)];
                case 1:
                    _a.sent();
                    dispatch(loadLdapUserInfo(userId));
                    dispatch(loadLdapSyncStatus());
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    dispatch(userSyncFailedAction());
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
export function loadLdapUserInfo(userId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var user, error_4, userError;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUser(userId)];
                case 1:
                    user = _a.sent();
                    dispatch(userLoadedAction(user));
                    dispatch(loadUserSessions(userId));
                    dispatch(loadUserMapping(user.login));
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    error_4.isHandled = true;
                    userError = {
                        title: error_4.data.message,
                        body: error_4.data.error,
                    };
                    dispatch(userMappingInfoFailedAction(userError));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
export function loadUserSessions(userId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var sessions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getUserSessions(userId)];
                case 1:
                    sessions = _a.sent();
                    dispatch(userSessionsLoadedAction(sessions));
                    return [2 /*return*/];
            }
        });
    }); };
}
export function revokeSession(tokenId, userId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, revokeUserSession(tokenId, userId)];
                case 1:
                    _a.sent();
                    dispatch(loadUserSessions(userId));
                    return [2 /*return*/];
            }
        });
    }); };
}
export function revokeAllSessions(userId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, revokeAllUserSessions(userId)];
                case 1:
                    _a.sent();
                    dispatch(loadUserSessions(userId));
                    return [2 /*return*/];
            }
        });
    }); };
}
//# sourceMappingURL=actions.js.map
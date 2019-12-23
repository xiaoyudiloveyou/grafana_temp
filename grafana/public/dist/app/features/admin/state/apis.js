var _this = this;
import * as tslib_1 from "tslib";
import { getBackendSrv } from '@grafana/runtime';
import { dateTime } from '@grafana/data';
export var getServerStats = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var res, error_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getBackendSrv().get('api/admin/stats')];
            case 1:
                res = _a.sent();
                return [2 /*return*/, [
                        { name: 'Total users', value: res.users },
                        { name: 'Total admins', value: res.admins },
                        { name: 'Total editors', value: res.editors },
                        { name: 'Total viewers', value: res.viewers },
                        { name: 'Active users (seen last 30 days)', value: res.activeUsers },
                        { name: 'Active admins (seen last 30 days)', value: res.activeAdmins },
                        { name: 'Active editors (seen last 30 days)', value: res.activeEditors },
                        { name: 'Active viewers (seen last 30 days)', value: res.activeViewers },
                        { name: 'Active sessions', value: res.activeSessions },
                        { name: 'Total dashboards', value: res.dashboards },
                        { name: 'Total orgs', value: res.orgs },
                        { name: 'Total playlists', value: res.playlists },
                        { name: 'Total snapshots', value: res.snapshots },
                        { name: 'Total dashboard tags', value: res.tags },
                        { name: 'Total starred dashboards', value: res.stars },
                        { name: 'Total alerts', value: res.alerts },
                    ]];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
export var getLdapState = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().get("/api/admin/ldap/status")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var getLdapSyncStatus = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().get("/api/admin/ldap-sync-status")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var syncLdapUser = function (userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().post("/api/admin/ldap/sync/" + userId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var getUserInfo = function (username) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var response, name, surname, email, login, isGrafanaAdmin, isDisabled, roles, teams;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().get("/api/admin/ldap/" + username)];
            case 1:
                response = _a.sent();
                name = response.name, surname = response.surname, email = response.email, login = response.login, isGrafanaAdmin = response.isGrafanaAdmin, isDisabled = response.isDisabled, roles = response.roles, teams = response.teams;
                return [2 /*return*/, {
                        info: { name: name, surname: surname, email: email, login: login },
                        permissions: { isGrafanaAdmin: isGrafanaAdmin, isDisabled: isDisabled },
                        roles: roles,
                        teams: teams,
                    }];
        }
    });
}); };
export var getUser = function (id) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().get('/api/users/' + id)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var getUserSessions = function (id) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var sessions;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().get('/api/admin/users/' + id + '/auth-tokens')];
            case 1:
                sessions = _a.sent();
                sessions.reverse();
                return [2 /*return*/, sessions.map(function (session) {
                        return {
                            id: session.id,
                            isActive: session.isActive,
                            seenAt: dateTime(session.seenAt).fromNow(),
                            createdAt: dateTime(session.createdAt).format('MMMM DD, YYYY'),
                            clientIp: session.clientIp,
                            browser: session.browser,
                            browserVersion: session.browserVersion,
                            os: session.os,
                            osVersion: session.osVersion,
                            device: session.device,
                        };
                    })];
        }
    });
}); };
export var revokeUserSession = function (tokenId, userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().post("/api/admin/users/" + userId + "/revoke-auth-token", {
                    authTokenId: tokenId,
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var revokeAllUserSessions = function (userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getBackendSrv().post("/api/admin/users/" + userId + "/logout")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
//# sourceMappingURL=apis.js.map
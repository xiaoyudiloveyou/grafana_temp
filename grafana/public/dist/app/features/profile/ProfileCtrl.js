import { coreModule } from 'app/core/core';
import { dateTime } from '@grafana/data';
var ProfileCtrl = /** @class */ (function () {
    /** @ngInject */
    function ProfileCtrl(backendSrv, navModelSrv) {
        this.backendSrv = backendSrv;
        this.sessions = [];
        this.getUserSessions();
        this.navModel = navModelSrv.getNav('profile', 'profile-settings', 0);
    }
    ProfileCtrl.prototype.getUserSessions = function () {
        var _this = this;
        this.backendSrv.get('/api/user/auth-tokens').then(function (sessions) {
            sessions.reverse();
            var found = sessions.findIndex(function (session) {
                return session.isActive;
            });
            if (found) {
                var now = sessions[found];
                sessions.splice(found, found);
                sessions.unshift(now);
            }
            _this.sessions = sessions.map(function (session) {
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
            });
        });
    };
    ProfileCtrl.prototype.revokeUserSession = function (tokenId) {
        var _this = this;
        this.backendSrv
            .post('/api/user/revoke-auth-token', {
            authTokenId: tokenId,
        })
            .then(function () {
            _this.sessions = _this.sessions.filter(function (session) {
                if (session.id === tokenId) {
                    return false;
                }
                return true;
            });
        });
    };
    return ProfileCtrl;
}());
export { ProfileCtrl };
coreModule.controller('ProfileCtrl', ProfileCtrl);
//# sourceMappingURL=ProfileCtrl.js.map
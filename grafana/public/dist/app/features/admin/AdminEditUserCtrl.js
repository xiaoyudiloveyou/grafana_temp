import _ from 'lodash';
import { dateTime } from '@grafana/data';
var AdminEditUserCtrl = /** @class */ (function () {
    /** @ngInject */
    function AdminEditUserCtrl($scope, $routeParams, backendSrv, $location, navModelSrv) {
        $scope.user = {};
        $scope.sessions = [];
        $scope.newOrg = { name: '', role: 'Editor' };
        $scope.permissions = {};
        $scope.navModel = navModelSrv.getNav('admin', 'global-users', 0);
        $scope.init = function () {
            if ($routeParams.id) {
                $scope.getUser($routeParams.id);
                $scope.getUserSessions($routeParams.id);
                $scope.getUserOrgs($routeParams.id);
            }
        };
        $scope.getUser = function (id) {
            backendSrv.get('/api/users/' + id).then(function (user) {
                $scope.user = user;
                $scope.user_id = id;
                $scope.permissions.isGrafanaAdmin = user.isGrafanaAdmin;
            });
        };
        $scope.getUserSessions = function (id) {
            backendSrv.get('/api/admin/users/' + id + '/auth-tokens').then(function (sessions) {
                sessions.reverse();
                $scope.sessions = sessions.map(function (session) {
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
        $scope.revokeUserSession = function (tokenId) {
            backendSrv
                .post('/api/admin/users/' + $scope.user_id + '/revoke-auth-token', {
                authTokenId: tokenId,
            })
                .then(function () {
                $scope.sessions = $scope.sessions.filter(function (session) {
                    if (session.id === tokenId) {
                        return false;
                    }
                    return true;
                });
            });
        };
        $scope.revokeAllUserSessions = function (tokenId) {
            backendSrv.post('/api/admin/users/' + $scope.user_id + '/logout').then(function () {
                $scope.sessions = [];
            });
        };
        $scope.setPassword = function () {
            if (!$scope.passwordForm.$valid) {
                return;
            }
            var payload = { password: $scope.password };
            backendSrv.put('/api/admin/users/' + $scope.user_id + '/password', payload).then(function () {
                $location.path('/admin/users');
            });
        };
        $scope.updatePermissions = function () {
            var payload = $scope.permissions;
            backendSrv.put('/api/admin/users/' + $scope.user_id + '/permissions', payload);
        };
        $scope.create = function () {
            if (!$scope.userForm.$valid) {
                return;
            }
            backendSrv.post('/api/admin/users', $scope.user).then(function () {
                $location.path('/admin/users');
            });
        };
        $scope.getUserOrgs = function (id) {
            backendSrv.get('/api/users/' + id + '/orgs').then(function (orgs) {
                $scope.orgs = orgs;
            });
        };
        $scope.update = function () {
            if (!$scope.userForm.$valid) {
                return;
            }
            backendSrv.put('/api/users/' + $scope.user_id, $scope.user).then(function () {
                $location.path('/admin/users');
            });
        };
        $scope.updateOrgUser = function (orgUser) {
            backendSrv.patch('/api/orgs/' + orgUser.orgId + '/users/' + $scope.user_id, orgUser).then(function () { });
        };
        $scope.removeOrgUser = function (orgUser) {
            backendSrv.delete('/api/orgs/' + orgUser.orgId + '/users/' + $scope.user_id).then(function () {
                $scope.getUser($scope.user_id);
                $scope.getUserOrgs($scope.user_id);
            });
        };
        $scope.orgsSearchCache = [];
        $scope.searchOrgs = function (queryStr, callback) {
            if ($scope.orgsSearchCache.length > 0) {
                callback(_.map($scope.orgsSearchCache, 'name'));
                return;
            }
            backendSrv.get('/api/orgs', { query: '' }).then(function (result) {
                $scope.orgsSearchCache = result;
                callback(_.map(result, 'name'));
            });
        };
        $scope.addOrgUser = function () {
            if (!$scope.addOrgForm.$valid) {
                return;
            }
            var orgInfo = _.find($scope.orgsSearchCache, {
                name: $scope.newOrg.name,
            });
            if (!orgInfo) {
                return;
            }
            $scope.newOrg.loginOrEmail = $scope.user.login;
            backendSrv.post('/api/orgs/' + orgInfo.id + '/users/', $scope.newOrg).then(function () {
                $scope.getUser($scope.user_id);
                $scope.getUserOrgs($scope.user_id);
            });
        };
        $scope.deleteUser = function (user) {
            $scope.appEvent('confirm-modal', {
                title: 'Delete',
                text: 'Do you want to delete ' + user.login + '?',
                icon: 'fa-trash',
                yesText: 'Delete',
                onConfirm: function () {
                    backendSrv.delete('/api/admin/users/' + user.id).then(function () {
                        $location.path('/admin/users');
                    });
                },
            });
        };
        $scope.disableUser = function (event) {
            var user = $scope.user;
            // External user can not be disabled
            if (user.isExternal) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            var actionEndpoint = user.isDisabled ? '/enable' : '/disable';
            backendSrv.post('/api/admin/users/' + user.id + actionEndpoint).then(function () {
                $scope.init();
            });
        };
        $scope.init();
    }
    return AdminEditUserCtrl;
}());
export default AdminEditUserCtrl;
//# sourceMappingURL=AdminEditUserCtrl.js.map
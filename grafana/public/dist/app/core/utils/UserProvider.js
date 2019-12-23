import { __assign, __awaiter, __extends, __generator } from "tslib";
import React, { PureComponent } from 'react';
import { getBackendSrv } from '@grafana/runtime';
import { config } from 'app/core/config';
var UserProvider = /** @class */ (function (_super) {
    __extends(UserProvider, _super);
    function UserProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            teams: [],
            orgs: [],
            loadingStates: {
                changePassword: false,
                loadUser: true,
                loadTeams: false,
                loadOrgs: false,
                updateUserProfile: false,
                updateUserOrg: false,
            },
        };
        _this.changePassword = function (payload) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ loadingStates: __assign(__assign({}, this.state.loadingStates), { changePassword: true }) });
                        return [4 /*yield*/, getBackendSrv().put('/api/user/password', payload)];
                    case 1:
                        _a.sent();
                        this.setState({ loadingStates: __assign(__assign({}, this.state.loadingStates), { changePassword: false }) });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadUser = function () { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({
                            loadingStates: __assign(__assign({}, this.state.loadingStates), { loadUser: true }),
                        });
                        return [4 /*yield*/, getBackendSrv().get('/api/user')];
                    case 1:
                        user = _a.sent();
                        this.setState({ user: user, loadingStates: __assign(__assign({}, this.state.loadingStates), { loadUser: Object.keys(user).length === 0 }) });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadTeams = function () { return __awaiter(_this, void 0, void 0, function () {
            var teams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({
                            loadingStates: __assign(__assign({}, this.state.loadingStates), { loadTeams: true }),
                        });
                        return [4 /*yield*/, getBackendSrv().get('/api/user/teams')];
                    case 1:
                        teams = _a.sent();
                        this.setState({ teams: teams, loadingStates: __assign(__assign({}, this.state.loadingStates), { loadTeams: false }) });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.loadOrgs = function () { return __awaiter(_this, void 0, void 0, function () {
            var orgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({
                            loadingStates: __assign(__assign({}, this.state.loadingStates), { loadOrgs: true }),
                        });
                        return [4 /*yield*/, getBackendSrv().get('/api/user/orgs')];
                    case 1:
                        orgs = _a.sent();
                        this.setState({ orgs: orgs, loadingStates: __assign(__assign({}, this.state.loadingStates), { loadOrgs: false }) });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.setUserOrg = function (org) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({
                            loadingStates: __assign(__assign({}, this.state.loadingStates), { updateUserOrg: true }),
                        });
                        return [4 /*yield*/, getBackendSrv()
                                .post('/api/user/using/' + org.orgId, {})
                                .then(function () {
                                window.location.href = config.appSubUrl + '/profile';
                            })
                                .finally(function () {
                                _this.setState({ loadingStates: __assign(__assign({}, _this.state.loadingStates), { updateUserOrg: false }) });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.updateUserProfile = function (payload) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ loadingStates: __assign(__assign({}, this.state.loadingStates), { updateUserProfile: true }) });
                        return [4 /*yield*/, getBackendSrv()
                                .put('/api/user', payload)
                                .then(function () {
                                _this.loadUser();
                            })
                                .catch(function (e) { return console.log(e); })
                                .finally(function () {
                                _this.setState({ loadingStates: __assign(__assign({}, _this.state.loadingStates), { updateUserProfile: false }) });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    UserProvider.prototype.componentWillMount = function () {
        if (this.props.userId) {
            this.loadUser();
        }
    };
    UserProvider.prototype.render = function () {
        var children = this.props.children;
        var _a = this.state, loadingStates = _a.loadingStates, teams = _a.teams, orgs = _a.orgs, user = _a.user;
        var api = {
            changePassword: this.changePassword,
            loadUser: this.loadUser,
            loadTeams: this.loadTeams,
            loadOrgs: this.loadOrgs,
            updateUserProfile: this.updateUserProfile,
            setUserOrg: this.setUserOrg,
        };
        return React.createElement(React.Fragment, null, children(api, loadingStates, teams, orgs, user));
    };
    return UserProvider;
}(PureComponent));
export { UserProvider };
export default UserProvider;
//# sourceMappingURL=UserProvider.js.map
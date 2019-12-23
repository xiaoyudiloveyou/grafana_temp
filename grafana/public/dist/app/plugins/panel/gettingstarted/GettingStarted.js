import { __extends } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { contextSrv } from 'app/core/core';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
var GettingStarted = /** @class */ (function (_super) {
    __extends(GettingStarted, _super);
    function GettingStarted(props) {
        var _this = _super.call(this, props) || this;
        _this.stepIndex = 0;
        _this.dismiss = function () {
            var id = _this.props.id;
            var dashboard = getDashboardSrv().getCurrent();
            var panel = dashboard.getPanelById(id);
            dashboard.removePanel(panel);
            getBackendSrv()
                .request({
                method: 'PUT',
                url: '/api/user/helpflags/1',
                showSuccessAlert: false,
            })
                .then(function (res) {
                contextSrv.user.helpFlags1 = res.helpFlags1;
            });
        };
        _this.state = {
            checksDone: false,
        };
        _this.steps = [
            {
                title: 'Install Grafana',
                icon: 'icon-gf icon-gf-check',
                href: 'http://docs.grafana.org/',
                target: '_blank',
                note: 'Review the installation docs',
                check: function () { return Promise.resolve(true); },
            },
            {
                title: 'Create your first data source',
                cta: 'Add data source',
                icon: 'gicon gicon-datasources',
                href: 'datasources/new?gettingstarted',
                check: function () {
                    return new Promise(function (resolve) {
                        resolve(getDatasourceSrv()
                            .getMetricSources()
                            .filter(function (item) {
                            return item.meta.builtIn !== true;
                        }).length > 0);
                    });
                },
            },
            {
                title: 'Create your first dashboard',
                cta: 'New dashboard',
                icon: 'gicon gicon-dashboard',
                href: 'dashboard/new?gettingstarted',
                check: function () {
                    return getBackendSrv()
                        .search({ limit: 1 })
                        .then(function (result) {
                        return result.length > 0;
                    });
                },
            },
            {
                title: 'Invite your team',
                cta: 'Add Users',
                icon: 'gicon gicon-team',
                href: 'org/users?gettingstarted',
                check: function () {
                    return getBackendSrv()
                        .get('/api/org/users/lookup')
                        .then(function (res) {
                        return res.length > 1;
                    });
                },
            },
            {
                title: 'Install apps & plugins',
                cta: 'Explore plugin repository',
                icon: 'gicon gicon-plugins',
                href: 'https://grafana.com/plugins?utm_source=grafana_getting_started',
                check: function () {
                    return getBackendSrv()
                        .get('/api/plugins', { embedded: 0, core: 0 })
                        .then(function (plugins) {
                        return plugins.length > 0;
                    });
                },
            },
        ];
        return _this;
    }
    GettingStarted.prototype.componentDidMount = function () {
        var _this = this;
        this.stepIndex = -1;
        return this.nextStep().then(function (res) {
            _this.setState({ checksDone: true });
        });
    };
    GettingStarted.prototype.nextStep = function () {
        var _this = this;
        if (this.stepIndex === this.steps.length - 1) {
            return Promise.resolve();
        }
        this.stepIndex += 1;
        var currentStep = this.steps[this.stepIndex];
        return currentStep.check().then(function (passed) {
            if (passed) {
                currentStep.done = true;
                return _this.nextStep();
            }
            return Promise.resolve();
        });
    };
    GettingStarted.prototype.render = function () {
        var checksDone = this.state.checksDone;
        if (!checksDone) {
            return React.createElement("div", null, "checking...");
        }
        return (React.createElement("div", { className: "progress-tracker-container" },
            React.createElement("button", { className: "progress-tracker-close-btn", onClick: this.dismiss },
                React.createElement("i", { className: "fa fa-remove" })),
            React.createElement("div", { className: "progress-tracker" }, this.steps.map(function (step, index) {
                return (React.createElement("div", { key: index, className: step.done ? 'progress-step completed' : 'progress-step active' },
                    React.createElement("a", { className: "progress-link", href: step.href, target: step.target, title: step.note },
                        React.createElement("span", { className: "progress-marker" },
                            React.createElement("i", { className: step.icon })),
                        React.createElement("span", { className: "progress-text" }, step.title)),
                    React.createElement("a", { className: "btn-small progress-step-cta", href: step.href, target: step.target }, step.cta)));
            }))));
    };
    return GettingStarted;
}(PureComponent));
export { GettingStarted };
//# sourceMappingURL=GettingStarted.js.map
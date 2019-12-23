import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { Button } from '@grafana/ui';
import { getAngularLoader, getDataSourceSrv } from '@grafana/runtime';
import appEvents from 'app/core/app_events';
import { getAlertingValidationMessage } from './getAlertingValidationMessage';
import { EditorTabBody } from '../dashboard/panel_editor/EditorTabBody';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import StateHistory from './StateHistory';
import 'app/features/alerting/AlertTabCtrl';
import { TestRuleResult } from './TestRuleResult';
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
import { AppNotificationSeverity } from 'app/types';
import { PanelEditorTabIds, getPanelEditorTab } from '../dashboard/panel_editor/state/reducers';
import { changePanelEditorTab } from '../dashboard/panel_editor/state/actions';
var UnConnectedAlertTab = /** @class */ (function (_super) {
    tslib_1.__extends(UnConnectedAlertTab, _super);
    function UnConnectedAlertTab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            validatonMessage: '',
        };
        _this.stateHistory = function () {
            return {
                title: 'State history',
                render: function () {
                    return (React.createElement(StateHistory, { dashboard: _this.props.dashboard, panelId: _this.props.panel.id, onRefresh: _this.panelCtrl.refresh }));
                },
            };
        };
        _this.deleteAlert = function () {
            var panel = _this.props.panel;
            return {
                title: 'Delete',
                btnType: 'danger',
                onClick: function () {
                    appEvents.emit('confirm-modal', {
                        title: 'Delete Alert',
                        text: 'Are you sure you want to delete this alert rule?',
                        text2: 'You need to save dashboard for the delete to take effect',
                        icon: 'fa-trash',
                        yesText: 'Delete',
                        onConfirm: function () {
                            delete panel.alert;
                            panel.thresholds = [];
                            _this.panelCtrl.alertState = null;
                            _this.panelCtrl.render();
                            _this.forceUpdate();
                        },
                    });
                },
            };
        };
        _this.renderTestRuleResult = function () {
            var _a = _this.props, panel = _a.panel, dashboard = _a.dashboard;
            return React.createElement(TestRuleResult, { panelId: panel.id, dashboard: dashboard });
        };
        _this.testRule = function () { return ({
            title: 'Test Rule',
            render: function () { return _this.renderTestRuleResult(); },
        }); };
        _this.onAddAlert = function () {
            _this.panelCtrl._enableAlert();
            _this.component.digest();
            _this.forceUpdate();
        };
        _this.switchToQueryTab = function () {
            var changePanelEditorTab = _this.props.changePanelEditorTab;
            changePanelEditorTab(getPanelEditorTab(PanelEditorTabIds.Queries));
        };
        _this.renderValidationMessage = function () {
            var validatonMessage = _this.state.validatonMessage;
            return (React.createElement("div", { className: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n          width: 508px;\n          margin: 128px auto;\n        "], ["\n          width: 508px;\n          margin: 128px auto;\n        "]))) },
                React.createElement("h2", null, validatonMessage),
                React.createElement("br", null),
                React.createElement("div", { className: "gf-form-group" },
                    React.createElement(Button, { size: 'md', variant: 'secondary', icon: "fa fa-arrow-left", onClick: _this.switchToQueryTab }, "Go back to Queries"))));
        };
        return _this;
    }
    UnConnectedAlertTab.prototype.componentDidMount = function () {
        if (this.shouldLoadAlertTab()) {
            this.loadAlertTab();
        }
    };
    UnConnectedAlertTab.prototype.componentDidUpdate = function (prevProps) {
        if (this.shouldLoadAlertTab()) {
            this.loadAlertTab();
        }
    };
    UnConnectedAlertTab.prototype.shouldLoadAlertTab = function () {
        return this.props.angularPanel && this.element && !this.component;
    };
    UnConnectedAlertTab.prototype.componentWillUnmount = function () {
        if (this.component) {
            this.component.destroy();
        }
    };
    UnConnectedAlertTab.prototype.loadAlertTab = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, angularPanel, panel, scope, loader, template, scopeProps, validatonMessage;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, angularPanel = _a.angularPanel, panel = _a.panel;
                        scope = angularPanel.getScope();
                        // When full page reloading in edit mode the angular panel has on fully compiled & instantiated yet
                        if (!scope.$$childHead) {
                            setTimeout(function () {
                                _this.forceUpdate();
                            });
                            return [2 /*return*/];
                        }
                        this.panelCtrl = scope.$$childHead.ctrl;
                        loader = getAngularLoader();
                        template = '<alert-tab />';
                        scopeProps = { ctrl: this.panelCtrl };
                        this.component = loader.load(this.element, scopeProps, template);
                        return [4 /*yield*/, getAlertingValidationMessage(panel.transformations, panel.targets, getDataSourceSrv(), panel.datasource)];
                    case 1:
                        validatonMessage = _b.sent();
                        if (validatonMessage) {
                            this.setState({ validatonMessage: validatonMessage });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UnConnectedAlertTab.prototype.render = function () {
        var _this = this;
        var _a = this.props.panel, alert = _a.alert, transformations = _a.transformations;
        var validatonMessage = this.state.validatonMessage;
        var hasTransformations = transformations && transformations.length > 0;
        if (!alert && validatonMessage) {
            return this.renderValidationMessage();
        }
        var toolbarItems = alert ? [this.stateHistory(), this.testRule(), this.deleteAlert()] : [];
        var model = {
            title: 'Panel has no alert rule defined',
            buttonIcon: 'gicon gicon-alert',
            onClick: this.onAddAlert,
            buttonTitle: 'Create Alert',
        };
        return (React.createElement(EditorTabBody, { heading: "Alert", toolbarItems: toolbarItems },
            React.createElement(React.Fragment, null,
                alert && hasTransformations && (React.createElement(AlertBox, { severity: AppNotificationSeverity.Error, title: "Transformations are not supported in alert queries" })),
                React.createElement("div", { ref: function (element) { return (_this.element = element); } }),
                !alert && !validatonMessage && React.createElement(EmptyListCTA, tslib_1.__assign({}, model)))));
    };
    return UnConnectedAlertTab;
}(PureComponent));
export var mapStateToProps = function (state) { return ({}); };
var mapDispatchToProps = { changePanelEditorTab: changePanelEditorTab };
export var AlertTab = hot(module)(connect(mapStateToProps, mapDispatchToProps)(UnConnectedAlertTab));
var templateObject_1;
//# sourceMappingURL=AlertTab.js.map
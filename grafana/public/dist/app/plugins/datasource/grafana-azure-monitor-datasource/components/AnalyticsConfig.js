import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { AzureCredentialsForm } from './AzureCredentialsForm';
import { Switch, FormLabel, Select, Button } from '@grafana/ui';
var AnalyticsConfig = /** @class */ (function (_super) {
    tslib_1.__extends(AnalyticsConfig, _super);
    function AnalyticsConfig(props) {
        var _this = _super.call(this, props) || this;
        _this.onLogAnalyticsTenantIdChange = function (logAnalyticsTenantId) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { logAnalyticsTenantId: logAnalyticsTenantId }) }));
        };
        _this.onLogAnalyticsClientIdChange = function (logAnalyticsClientId) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { logAnalyticsClientId: logAnalyticsClientId }) }));
        };
        _this.onLogAnalyticsClientSecretChange = function (logAnalyticsClientSecret) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorSecureJsonData: tslib_1.__assign({}, _this.state.config.editorSecureJsonData, { logAnalyticsClientSecret: logAnalyticsClientSecret }) }));
        };
        _this.onLogAnalyticsResetClientSecret = function () {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { version: _this.state.config.version + 1, secureJsonFields: tslib_1.__assign({}, _this.state.config.secureJsonFields, { logAnalyticsClientSecret: false }) }));
        };
        _this.onLogAnalyticsSubscriptionSelect = function (logAnalyticsSubscription) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { logAnalyticsSubscriptionId: logAnalyticsSubscription.value }) }));
        };
        _this.onWorkspaceSelectChange = function (logAnalyticsDefaultWorkspace) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { logAnalyticsDefaultWorkspace: logAnalyticsDefaultWorkspace.value }) }));
        };
        _this.onAzureLogAnalyticsSameAsChange = function (azureLogAnalyticsSameAs) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { jsonData: tslib_1.__assign({}, _this.state.config.jsonData, { azureLogAnalyticsSameAs: azureLogAnalyticsSameAs }) }));
        };
        _this.hasWorkspaceRequiredFields = function () {
            var _a = _this.state.config, editorJsonData = _a.editorJsonData, editorSecureJsonData = _a.editorSecureJsonData, jsonData = _a.jsonData, secureJsonFields = _a.secureJsonFields;
            if (jsonData.azureLogAnalyticsSameAs) {
                return (editorJsonData.tenantId &&
                    editorJsonData.clientId &&
                    editorJsonData.subscriptionId &&
                    (editorSecureJsonData.clientSecret || secureJsonFields.clientSecret));
            }
            return (editorJsonData.logAnalyticsTenantId.length &&
                editorJsonData.logAnalyticsClientId.length &&
                editorJsonData.logAnalyticsSubscriptionId &&
                (secureJsonFields.logAnalyticsClientSecret || editorSecureJsonData.logAnalyticsClientSecret));
        };
        var datasourceConfig = _this.props.datasourceConfig;
        _this.state = {
            config: datasourceConfig,
            logAnalyticsSubscriptions: [],
            logAnalyticsWorkspaces: [],
        };
        return _this;
    }
    AnalyticsConfig.getDerivedStateFromProps = function (props, state) {
        return tslib_1.__assign({}, state, { config: props.datasourceConfig, logAnalyticsSubscriptions: props.logAnalyticsSubscriptions, logAnalyticsWorkspaces: props.logAnalyticsWorkspaces });
    };
    AnalyticsConfig.prototype.render = function () {
        var _this = this;
        var _a = this.state, _b = _a.config, editorJsonData = _b.editorJsonData, editorSecureJsonData = _b.editorSecureJsonData, jsonData = _b.jsonData, secureJsonFields = _b.secureJsonFields, logAnalyticsSubscriptions = _a.logAnalyticsSubscriptions, logAnalyticsWorkspaces = _a.logAnalyticsWorkspaces;
        var addtlAttrs = tslib_1.__assign({}, (jsonData.azureLogAnalyticsSameAs && {
            tooltip: 'Workspaces are pulled from default subscription selected above.',
        }));
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" }, "Azure Log Analytics API Details"),
            React.createElement(Switch, tslib_1.__assign({ label: "Same details as Azure Monitor API", checked: jsonData.azureLogAnalyticsSameAs, onChange: function (event) { return _this.onAzureLogAnalyticsSameAsChange(!jsonData.azureLogAnalyticsSameAs); } }, addtlAttrs)),
            !jsonData.azureLogAnalyticsSameAs && (React.createElement(AzureCredentialsForm, { subscriptionOptions: logAnalyticsSubscriptions, selectedSubscription: editorJsonData.logAnalyticsSubscriptionId, tenantId: editorJsonData.logAnalyticsTenantId, clientId: editorJsonData.logAnalyticsClientId, clientSecret: editorSecureJsonData.logAnalyticsClientSecret, clientSecretConfigured: secureJsonFields.logAnalyticsClientSecret, onSubscriptionSelectChange: this.onLogAnalyticsSubscriptionSelect, onTenantIdChange: this.onLogAnalyticsTenantIdChange, onClientIdChange: this.onLogAnalyticsClientIdChange, onClientSecretChange: this.onLogAnalyticsClientSecretChange, onResetClientSecret: this.onLogAnalyticsResetClientSecret, onLoadSubscriptions: function () { return _this.props.onLoadSubscriptions('workspacesloganalytics'); } })),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12", tooltip: "Choose the default/preferred Workspace for Azure Log Analytics queries." }, "Default Workspace"),
                        React.createElement("div", { className: "width-25" },
                            React.createElement(Select, { value: logAnalyticsWorkspaces.find(function (workspace) { return workspace.value === editorJsonData.logAnalyticsDefaultWorkspace; }), options: logAnalyticsWorkspaces, defaultValue: editorJsonData.logAnalyticsDefaultWorkspace, onChange: this.onWorkspaceSelectChange })))),
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement("div", { className: "max-width-30 gf-form-inline" },
                            React.createElement(Button, { variant: "secondary", size: "sm", type: "button", onClick: function () { return _this.props.onLoadWorkspaces(); }, disabled: !this.hasWorkspaceRequiredFields() }, "Load Workspaces")))))));
    };
    return AnalyticsConfig;
}(PureComponent));
export { AnalyticsConfig };
export default AnalyticsConfig;
//# sourceMappingURL=AnalyticsConfig.js.map
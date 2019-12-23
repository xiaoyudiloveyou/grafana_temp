import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { AzureCredentialsForm } from './AzureCredentialsForm';
var MonitorConfig = /** @class */ (function (_super) {
    tslib_1.__extends(MonitorConfig, _super);
    function MonitorConfig(props) {
        var _this = _super.call(this, props) || this;
        _this.onAzureCloudSelect = function (cloudName) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { jsonData: tslib_1.__assign({}, _this.state.config.jsonData, { cloudName: cloudName }) }));
        };
        _this.onTenantIdChange = function (tenantId) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { tenantId: tenantId }) }));
        };
        _this.onClientIdChange = function (clientId) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { clientId: clientId }) }));
        };
        _this.onClientSecretChange = function (clientSecret) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorSecureJsonData: tslib_1.__assign({}, _this.state.config.editorSecureJsonData, { clientSecret: clientSecret }) }));
        };
        _this.onResetClientSecret = function () {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { version: _this.state.config.version + 1, secureJsonFields: tslib_1.__assign({}, _this.state.config.secureJsonFields, { clientSecret: false }) }));
        };
        _this.onSubscriptionSelect = function (subscription) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { subscriptionId: subscription.value }) }));
        };
        var datasourceConfig = _this.props.datasourceConfig;
        _this.state = {
            config: datasourceConfig,
            azureClouds: [
                { value: 'azuremonitor', label: 'Azure' },
                { value: 'govazuremonitor', label: 'Azure US Government' },
                { value: 'germanyazuremonitor', label: 'Azure Germany' },
                { value: 'chinaazuremonitor', label: 'Azure China' },
            ],
            subscriptions: [],
        };
        return _this;
    }
    MonitorConfig.getDerivedStateFromProps = function (props, state) {
        return tslib_1.__assign({}, state, { config: props.datasourceConfig, subscriptions: props.subscriptions });
    };
    MonitorConfig.prototype.render = function () {
        var _a = this.state, azureClouds = _a.azureClouds, config = _a.config, subscriptions = _a.subscriptions;
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" }, "Azure Monitor Details"),
            React.createElement(AzureCredentialsForm, { selectedAzureCloud: config.jsonData.cloudName, azureCloudOptions: azureClouds, subscriptionOptions: subscriptions, selectedSubscription: config.editorJsonData.subscriptionId, tenantId: config.editorJsonData.tenantId, clientId: config.editorJsonData.clientId, clientSecret: config.editorSecureJsonData.clientSecret, clientSecretConfigured: config.secureJsonFields.clientSecret, onAzureCloudChange: this.onAzureCloudSelect, onSubscriptionSelectChange: this.onSubscriptionSelect, onTenantIdChange: this.onTenantIdChange, onClientIdChange: this.onClientIdChange, onClientSecretChange: this.onClientSecretChange, onResetClientSecret: this.onResetClientSecret, onLoadSubscriptions: this.props.onLoadSubscriptions })));
    };
    return MonitorConfig;
}(PureComponent));
export { MonitorConfig };
export default MonitorConfig;
//# sourceMappingURL=MonitorConfig.js.map
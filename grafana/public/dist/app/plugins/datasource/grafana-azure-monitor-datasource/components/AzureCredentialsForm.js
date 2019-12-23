import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { Input, FormLabel, Select, Button } from '@grafana/ui';
var AzureCredentialsForm = /** @class */ (function (_super) {
    tslib_1.__extends(AzureCredentialsForm, _super);
    function AzureCredentialsForm(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, selectedAzureCloud = _a.selectedAzureCloud, selectedSubscription = _a.selectedSubscription, tenantId = _a.tenantId, clientId = _a.clientId, clientSecret = _a.clientSecret, clientSecretConfigured = _a.clientSecretConfigured;
        _this.state = {
            selectedAzureCloud: selectedAzureCloud,
            selectedSubscription: selectedSubscription,
            tenantId: tenantId,
            clientId: clientId,
            clientSecret: clientSecret,
            clientSecretConfigured: clientSecretConfigured,
        };
        return _this;
    }
    AzureCredentialsForm.getDerivedStateFromProps = function (nextProps, prevState) {
        var selectedAzureCloud = nextProps.selectedAzureCloud, tenantId = nextProps.tenantId, clientId = nextProps.clientId, clientSecret = nextProps.clientSecret, clientSecretConfigured = nextProps.clientSecretConfigured;
        return {
            selectedAzureCloud: selectedAzureCloud,
            tenantId: tenantId,
            clientId: clientId,
            clientSecret: clientSecret,
            clientSecretConfigured: clientSecretConfigured,
        };
    };
    AzureCredentialsForm.prototype.render = function () {
        var _a = this.props, azureCloudOptions = _a.azureCloudOptions, subscriptionOptions = _a.subscriptionOptions, onAzureCloudChange = _a.onAzureCloudChange, onSubscriptionSelectChange = _a.onSubscriptionSelectChange, onTenantIdChange = _a.onTenantIdChange, onClientIdChange = _a.onClientIdChange, onClientSecretChange = _a.onClientSecretChange, onResetClientSecret = _a.onResetClientSecret, onLoadSubscriptions = _a.onLoadSubscriptions;
        var _b = this.state, selectedAzureCloud = _b.selectedAzureCloud, selectedSubscription = _b.selectedSubscription, tenantId = _b.tenantId, clientId = _b.clientId, clientSecret = _b.clientSecret, clientSecretConfigured = _b.clientSecretConfigured;
        var hasRequiredFields = tenantId && clientId && (clientSecret || clientSecretConfigured);
        var hasSubscriptions = onLoadSubscriptions && subscriptionOptions;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "gf-form-group" },
                azureCloudOptions && (React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12", tooltip: "Choose an Azure Cloud." }, "Azure Cloud"),
                        React.createElement(Select, { className: "width-15", value: azureCloudOptions.find(function (azureCloud) { return azureCloud.value === selectedAzureCloud; }), options: azureCloudOptions, defaultValue: selectedAzureCloud, onChange: onAzureCloudChange })))),
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "Directory (tenant) ID"),
                        React.createElement("div", { className: "width-15" },
                            React.createElement(Input, { className: "width-30", placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", value: tenantId, onChange: function (event) { return onTenantIdChange(event.target.value); } })))),
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "Application (client) ID"),
                        React.createElement("div", { className: "width-15" },
                            React.createElement(Input, { className: "width-30", placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", value: clientId, onChange: function (event) { return onClientIdChange(event.target.value); } })))),
                clientSecretConfigured ? (React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "Client Secret"),
                        React.createElement(Input, { className: "width-25", placeholder: "configured", disabled: true })),
                    React.createElement("div", { className: "gf-form" },
                        React.createElement("div", { className: "max-width-30 gf-form-inline" },
                            React.createElement(Button, { variant: "secondary", type: "button", onClick: onResetClientSecret }, "reset"))))) : (React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "Client Secret"),
                        React.createElement("div", { className: "width-15" },
                            React.createElement(Input, { className: "width-30", placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", value: clientSecret, onChange: function (event) { return onClientSecretChange(event.target.value); } }))))),
                hasSubscriptions && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "gf-form-inline" },
                        React.createElement("div", { className: "gf-form" },
                            React.createElement(FormLabel, { className: "width-12" }, "Default Subscription"),
                            React.createElement("div", { className: "width-25" },
                                React.createElement(Select, { value: subscriptionOptions.find(function (subscription) { return subscription.value === selectedSubscription; }), options: subscriptionOptions, defaultValue: selectedSubscription, onChange: onSubscriptionSelectChange })))),
                    React.createElement("div", { className: "gf-form-inline" },
                        React.createElement("div", { className: "gf-form" },
                            React.createElement("div", { className: "max-width-30 gf-form-inline" },
                                React.createElement(Button, { variant: "secondary", size: "sm", type: "button", onClick: onLoadSubscriptions, disabled: !hasRequiredFields }, "Load Subscriptions")))))))));
    };
    return AzureCredentialsForm;
}(PureComponent));
export { AzureCredentialsForm };
export default AzureCredentialsForm;
//# sourceMappingURL=AzureCredentialsForm.js.map
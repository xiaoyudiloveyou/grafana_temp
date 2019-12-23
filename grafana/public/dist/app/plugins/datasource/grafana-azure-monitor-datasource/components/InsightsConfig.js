import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { FormLabel, Button, Input } from '@grafana/ui';
var InsightsConfig = /** @class */ (function (_super) {
    tslib_1.__extends(InsightsConfig, _super);
    function InsightsConfig(props) {
        var _this = _super.call(this, props) || this;
        _this.onAppInsightsAppIdChange = function (appInsightsAppId) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorJsonData: tslib_1.__assign({}, _this.state.config.editorJsonData, { appInsightsAppId: appInsightsAppId }) }));
        };
        _this.onAppInsightsApiKeyChange = function (appInsightsApiKey) {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { editorSecureJsonData: tslib_1.__assign({}, _this.state.config.editorSecureJsonData, { appInsightsApiKey: appInsightsApiKey }) }));
        };
        _this.onAppInsightsResetApiKey = function () {
            _this.props.onDatasourceUpdate(tslib_1.__assign({}, _this.state.config, { version: _this.state.config.version + 1, secureJsonFields: tslib_1.__assign({}, _this.state.config.secureJsonFields, { appInsightsApiKey: false }) }));
        };
        var datasourceConfig = _this.props.datasourceConfig;
        _this.state = {
            config: datasourceConfig,
        };
        return _this;
    }
    InsightsConfig.getDerivedStateFromProps = function (props, state) {
        return tslib_1.__assign({}, state, { config: props.datasourceConfig });
    };
    InsightsConfig.prototype.render = function () {
        var _this = this;
        var config = this.state.config;
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-heading" }, "Application Insights Details"),
            React.createElement("div", { className: "gf-form-group" },
                config.secureJsonFields.appInsightsApiKey ? (React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "API Key"),
                        React.createElement(Input, { className: "width-25", placeholder: "configured", disabled: true })),
                    React.createElement("div", { className: "gf-form" },
                        React.createElement("div", { className: "max-width-30 gf-form-inline" },
                            React.createElement(Button, { variant: "secondary", type: "button", onClick: this.onAppInsightsResetApiKey }, "reset"))))) : (React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "API Key"),
                        React.createElement("div", { className: "width-15" },
                            React.createElement(Input, { className: "width-30", placeholder: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", value: config.editorSecureJsonData.appInsightsApiKey, onChange: function (event) { return _this.onAppInsightsApiKeyChange(event.target.value); } }))))),
                React.createElement("div", { className: "gf-form-inline" },
                    React.createElement("div", { className: "gf-form" },
                        React.createElement(FormLabel, { className: "width-12" }, "Application ID"),
                        React.createElement("div", { className: "width-15" },
                            React.createElement(Input, { className: "width-30", value: config.editorJsonData.appInsightsAppId, onChange: function (event) { return _this.onAppInsightsAppIdChange(event.target.value); } })))))));
    };
    return InsightsConfig;
}(PureComponent));
export { InsightsConfig };
export default InsightsConfig;
//# sourceMappingURL=InsightsConfig.js.map
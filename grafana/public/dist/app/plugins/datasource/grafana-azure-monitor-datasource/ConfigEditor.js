import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { MonitorConfig } from './components/MonitorConfig';
import { AnalyticsConfig } from './components/AnalyticsConfig';
import { TemplateSrv } from 'app/features/templating/template_srv';
import { getBackendSrv } from 'app/core/services/backend_srv';
import AzureMonitorDatasource from './azure_monitor/azure_monitor_datasource';
import AzureLogAnalyticsDatasource from './azure_log_analytics/azure_log_analytics_datasource';
import { InsightsConfig } from './components/InsightsConfig';
var ConfigEditor = /** @class */ (function (_super) {
    tslib_1.__extends(ConfigEditor, _super);
    function ConfigEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.backendSrv = null;
        _this.templateSrv = null;
        _this.init = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubscriptions()];
                    case 1:
                        _a.sent();
                        if (!!this.state.config.jsonData.azureLogAnalyticsSameAs) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getLogAnalyticsSubscriptions()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.updateDatasource = function (config) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var j, k, m, l;
            return tslib_1.__generator(this, function (_a) {
                for (j in config.jsonData) {
                    if (config.jsonData[j].length === 0) {
                        delete config.jsonData[j];
                    }
                }
                for (k in config.secureJsonData) {
                    if (config.secureJsonData[k].length === 0) {
                        delete config.secureJsonData[k];
                    }
                }
                for (m in config.editorJsonData) {
                    if (!config.hasOwnProperty('jsonData')) {
                        config.jsonData = {};
                    }
                    if (config.editorJsonData[m].length === 0) {
                        if (config.hasOwnProperty('jsonData') && config.jsonData.hasOwnProperty(m)) {
                            delete config.jsonData[m];
                        }
                    }
                    else {
                        config.jsonData[m] = config.editorJsonData[m];
                    }
                }
                for (l in config.editorSecureJsonData) {
                    if (!config.hasOwnProperty('secureJsonData')) {
                        config.secureJsonData = {};
                    }
                    if (config.editorSecureJsonData[l].length === 0) {
                        if (config.hasOwnProperty('secureJsonData') && config.secureJsonData.hasOwnProperty(l)) {
                            delete config.secureJsonData[l];
                        }
                    }
                    else {
                        config.secureJsonData[l] = config.editorSecureJsonData[l];
                    }
                }
                this.props.onOptionsChange(tslib_1.__assign({}, config));
                return [2 /*return*/];
            });
        }); };
        _this.hasNecessaryCredentials = function () {
            if (!_this.state.config.secureJsonFields.clientSecret && !_this.state.config.editorSecureJsonData.clientSecret) {
                return false;
            }
            if (!_this.state.config.jsonData.clientId || !_this.state.config.jsonData.tenantId) {
                return false;
            }
            return true;
        };
        _this.logAnalyticsHasNecessaryCredentials = function () {
            if (!_this.state.config.secureJsonFields.logAnalyticsClientSecret &&
                !_this.state.config.editorSecureJsonData.logAnalyticsClientSecret) {
                return false;
            }
            if (!_this.state.config.jsonData.logAnalyticsClientId || !_this.state.config.jsonData.logAnalyticsTenantId) {
                return false;
            }
            return true;
        };
        _this.onConfigUpdate = function (config) {
            _this.updateDatasource(config);
        };
        _this.onLoadSubscriptions = function (type) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.backendSrv.put("/api/datasources/" + this.state.config.id, this.state.config).then(function () {
                            _this.updateDatasource(tslib_1.__assign({}, _this.state.config, { version: _this.state.config.version + 1 }));
                        })];
                    case 1:
                        _a.sent();
                        if (type && type === 'workspacesloganalytics') {
                            this.getLogAnalyticsSubscriptions();
                        }
                        else {
                            this.getSubscriptions();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.getSubscriptions = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var azureMonitorDatasource, subscriptions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasNecessaryCredentials()) {
                            return [2 /*return*/];
                        }
                        azureMonitorDatasource = new AzureMonitorDatasource(this.state.config, this.backendSrv, this.templateSrv);
                        return [4 /*yield*/, azureMonitorDatasource.getSubscriptions()];
                    case 1:
                        subscriptions = (_a.sent()) || [];
                        subscriptions = subscriptions.map(function (subscription) {
                            return {
                                value: subscription.value,
                                label: subscription.text,
                            };
                        });
                        if (subscriptions && subscriptions.length > 0) {
                            this.setState({ subscriptions: subscriptions });
                            this.state.config.editorJsonData.subscriptionId =
                                this.state.config.editorJsonData.subscriptionId || subscriptions[0].value;
                        }
                        if (!(this.state.config.editorJsonData.subscriptionId && this.state.config.jsonData.azureLogAnalyticsSameAs)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getWorkspaces()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.getLogAnalyticsSubscriptions = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var azureMonitorDatasource, logAnalyticsSubscriptions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.logAnalyticsHasNecessaryCredentials()) {
                            return [2 /*return*/];
                        }
                        azureMonitorDatasource = new AzureMonitorDatasource(this.state.config, this.backendSrv, this.templateSrv);
                        return [4 /*yield*/, azureMonitorDatasource.getSubscriptions('workspacesloganalytics')];
                    case 1:
                        logAnalyticsSubscriptions = (_a.sent()) || [];
                        logAnalyticsSubscriptions = logAnalyticsSubscriptions.map(function (subscription) {
                            return {
                                value: subscription.value,
                                label: subscription.text,
                            };
                        });
                        if (logAnalyticsSubscriptions && logAnalyticsSubscriptions.length > 0) {
                            this.setState({ logAnalyticsSubscriptions: logAnalyticsSubscriptions });
                            this.state.config.editorJsonData.logAnalyticsSubscriptionId =
                                this.state.config.editorJsonData.logAnalyticsSubscriptionId || logAnalyticsSubscriptions[0].value;
                        }
                        if (!this.state.config.editorJsonData.logAnalyticsSubscriptionId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getWorkspaces()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.getWorkspaces = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sameAs, azureLogAnalyticsDatasource, logAnalyticsWorkspaces;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sameAs = this.state.config.jsonData.azureLogAnalyticsSameAs && this.state.config.editorJsonData.subscriptionId;
                        if (!sameAs && !this.state.config.editorJsonData.logAnalyticsSubscriptionId) {
                            return [2 /*return*/];
                        }
                        azureLogAnalyticsDatasource = new AzureLogAnalyticsDatasource(this.state.config, this.backendSrv, this.templateSrv);
                        return [4 /*yield*/, azureLogAnalyticsDatasource.getWorkspaces(sameAs
                                ? this.state.config.editorJsonData.subscriptionId
                                : this.state.config.editorJsonData.logAnalyticsSubscriptionId)];
                    case 1:
                        logAnalyticsWorkspaces = _a.sent();
                        logAnalyticsWorkspaces = logAnalyticsWorkspaces.map(function (workspace) {
                            return {
                                value: workspace.value,
                                label: workspace.text,
                            };
                        });
                        if (logAnalyticsWorkspaces.length > 0) {
                            this.setState({ logAnalyticsWorkspaces: logAnalyticsWorkspaces });
                            this.state.config.editorJsonData.logAnalyticsDefaultWorkspace =
                                this.state.config.editorJsonData.logAnalyticsDefaultWorkspace || logAnalyticsWorkspaces[0].value;
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        var options = _this.props.options;
        _this.state = {
            config: ConfigEditor.keyFill(options),
            subscriptions: [],
            logAnalyticsSubscriptions: [],
            logAnalyticsWorkspaces: [],
        };
        _this.backendSrv = getBackendSrv();
        _this.templateSrv = new TemplateSrv();
        if (options.id) {
            _this.state.config.url = '/api/datasources/proxy/' + options.id;
            _this.init();
        }
        _this.updateDatasource(_this.state.config);
        return _this;
    }
    ConfigEditor.getDerivedStateFromProps = function (props, state) {
        return tslib_1.__assign({}, state, { config: ConfigEditor.keyFill(props.options) });
    };
    ConfigEditor.prototype.render = function () {
        var _a = this.state, config = _a.config, subscriptions = _a.subscriptions, logAnalyticsSubscriptions = _a.logAnalyticsSubscriptions, logAnalyticsWorkspaces = _a.logAnalyticsWorkspaces;
        return (React.createElement(React.Fragment, null,
            React.createElement(MonitorConfig, { datasourceConfig: config, subscriptions: subscriptions, onLoadSubscriptions: this.onLoadSubscriptions, onDatasourceUpdate: this.onConfigUpdate }),
            React.createElement(AnalyticsConfig, { datasourceConfig: config, logAnalyticsWorkspaces: logAnalyticsWorkspaces, logAnalyticsSubscriptions: logAnalyticsSubscriptions, onLoadSubscriptions: this.onLoadSubscriptions, onDatasourceUpdate: this.onConfigUpdate, onLoadWorkspaces: this.getWorkspaces }),
            React.createElement(InsightsConfig, { datasourceConfig: config, onDatasourceUpdate: this.onConfigUpdate })));
    };
    ConfigEditor.keyFill = function (options) {
        options.jsonData.cloudName = options.jsonData.cloudName || 'azuremonitor';
        if (!options.jsonData.hasOwnProperty('azureLogAnalyticsSameAs')) {
            options.jsonData.azureLogAnalyticsSameAs = true;
        }
        if (!options.hasOwnProperty('editorSecureJsonData')) {
            options.editorSecureJsonData = {
                clientSecret: '',
                logAnalyticsClientSecret: '',
                appInsightsApiKey: '',
            };
        }
        if (!options.hasOwnProperty('editorJsonData')) {
            options.editorJsonData = {
                clientId: options.jsonData.clientId || '',
                tenantId: options.jsonData.tenantId || '',
                subscriptionId: options.jsonData.subscriptionId || '',
                logAnalyticsClientId: options.jsonData.logAnalyticsClientId || '',
                logAnalyticsDefaultWorkspace: options.jsonData.logAnalyticsDefaultWorkspace || '',
                logAnalyticsTenantId: options.jsonData.logAnalyticsTenantId || '',
                logAnalyticsSubscriptionId: options.jsonData.logAnalyticsSubscriptionId || '',
                appInsightsAppId: options.jsonData.appInsightsAppId || '',
            };
        }
        if (!options.hasOwnProperty('secureJsonFields')) {
            options.secureJsonFields = {
                clientSecret: false,
                logAnalyticsClientSecret: false,
                appInsightsApiKey: false,
            };
        }
        return options;
    };
    return ConfigEditor;
}(PureComponent));
export { ConfigEditor };
export default ConfigEditor;
//# sourceMappingURL=ConfigEditor.js.map
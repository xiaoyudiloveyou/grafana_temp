import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import isString from 'lodash/isString';
// Components
import Page from 'app/core/components/Page/Page';
import { PluginSettings } from './PluginSettings';
import BasicSettings from './BasicSettings';
import ButtonRow from './ButtonRow';
// Services & Utils
import appEvents from 'app/core/app_events';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
// Actions & selectors
import { getDataSource, getDataSourceMeta } from '../state/selectors';
import { deleteDataSource, loadDataSource, setDataSourceName, setIsDefault, updateDataSource, dataSourceLoaded, } from '../state/actions';
import { getNavModel } from 'app/core/selectors/navModel';
import { getRouteParamsId } from 'app/core/selectors/location';
import { getDataSourceLoadingNav } from '../state/navModel';
import PluginStateinfo from 'app/features/plugins/PluginStateInfo';
import { importDataSourcePlugin } from 'app/features/plugins/plugin_loader';
var DataSourceSettingsPage = /** @class */ (function (_super) {
    tslib_1.__extends(DataSourceSettingsPage, _super);
    function DataSourceSettingsPage(props) {
        var _this = _super.call(this, props) || this;
        _this.onSubmit = function (evt) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        evt.preventDefault();
                        return [4 /*yield*/, this.props.updateDataSource(tslib_1.__assign({}, this.props.dataSource))];
                    case 1:
                        _a.sent();
                        this.testDataSource();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onTest = function (evt) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                evt.preventDefault();
                this.testDataSource();
                return [2 /*return*/];
            });
        }); };
        _this.onDelete = function () {
            appEvents.emit('confirm-modal', {
                title: 'Delete',
                text: 'Are you sure you want to delete this data source?',
                yesText: 'Delete',
                icon: 'fa-trash',
                onConfirm: function () {
                    _this.confirmDelete();
                },
            });
        };
        _this.confirmDelete = function () {
            _this.props.deleteDataSource();
        };
        _this.onModelChange = function (dataSource) {
            _this.props.dataSourceLoaded(dataSource);
        };
        _this.state = {
            plugin: props.plugin,
        };
        return _this;
    }
    DataSourceSettingsPage.prototype.loadPlugin = function (pluginId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dataSourceMeta, importedPlugin, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataSourceMeta = this.props.dataSourceMeta;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, importDataSourcePlugin(dataSourceMeta)];
                    case 2:
                        importedPlugin = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log('Failed to import plugin module', e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        this.setState({ plugin: importedPlugin });
                        return [2 /*return*/];
                }
            });
        });
    };
    DataSourceSettingsPage.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, loadDataSource, pageId, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, loadDataSource = _a.loadDataSource, pageId = _a.pageId;
                        if (isNaN(pageId)) {
                            this.setState({ loadError: 'Invalid ID' });
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, loadDataSource(pageId)];
                    case 2:
                        _b.sent();
                        if (!!this.state.plugin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.loadPlugin()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_1 = _b.sent();
                        this.setState({ loadError: err_1 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DataSourceSettingsPage.prototype.isReadOnly = function () {
        return this.props.dataSource.readOnly === true;
    };
    DataSourceSettingsPage.prototype.renderIsReadOnlyMessage = function () {
        return (React.createElement("div", { className: "grafana-info-box span8" }, "This datasource was added by config and cannot be modified using the UI. Please contact your server admin to update this datasource."));
    };
    DataSourceSettingsPage.prototype.testDataSource = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dsApi;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDatasourceSrv().get(this.props.dataSource.name)];
                    case 1:
                        dsApi = _a.sent();
                        if (!dsApi.testDatasource) {
                            return [2 /*return*/];
                        }
                        this.setState({ isTesting: true, testingMessage: 'Testing...', testingStatus: 'info' });
                        getBackendSrv().withNoBackendCache(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var result, err_2, message;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, dsApi.testDatasource()];
                                    case 1:
                                        result = _a.sent();
                                        this.setState({
                                            isTesting: false,
                                            testingStatus: result.status,
                                            testingMessage: result.message,
                                        });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_2 = _a.sent();
                                        message = '';
                                        if (err_2.statusText) {
                                            message = 'HTTP Error ' + err_2.statusText;
                                        }
                                        else {
                                            message = err_2.message;
                                        }
                                        this.setState({
                                            isTesting: false,
                                            testingStatus: 'error',
                                            testingMessage: message,
                                        });
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(DataSourceSettingsPage.prototype, "hasDataSource", {
        get: function () {
            return this.props.dataSource.id > 0;
        },
        enumerable: true,
        configurable: true
    });
    DataSourceSettingsPage.prototype.renderLoadError = function (loadError) {
        var showDelete = false;
        var msg = loadError.toString();
        if (loadError.data) {
            if (loadError.data.message) {
                msg = loadError.data.message;
            }
        }
        else if (isString(loadError)) {
            showDelete = true;
        }
        var node = {
            text: msg,
            subTitle: 'Data Source Error',
            icon: 'fa fa-fw fa-warning',
        };
        var nav = {
            node: node,
            main: node,
        };
        return (React.createElement(Page, { navModel: nav },
            React.createElement(Page.Contents, null,
                React.createElement("div", null,
                    React.createElement("div", { className: "gf-form-button-row" },
                        showDelete && (React.createElement("button", { type: "submit", className: "btn btn-danger", onClick: this.onDelete }, "Delete")),
                        React.createElement("a", { className: "btn btn-inverse", href: "datasources" }, "Back"))))));
    };
    DataSourceSettingsPage.prototype.renderConfigPageBody = function (page) {
        var e_2, _a;
        var plugin = this.state.plugin;
        if (!plugin || !plugin.configPages) {
            return null; // still loading
        }
        try {
            for (var _b = tslib_1.__values(plugin.configPages), _c = _b.next(); !_c.done; _c = _b.next()) {
                var p = _c.value;
                if (p.id === page) {
                    return React.createElement(p.body, { plugin: plugin, query: this.props.query });
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return React.createElement("div", null,
            "Page Not Found: ",
            page);
    };
    DataSourceSettingsPage.prototype.renderSettings = function () {
        var _this = this;
        var _a = this.props, dataSourceMeta = _a.dataSourceMeta, setDataSourceName = _a.setDataSourceName, setIsDefault = _a.setIsDefault, dataSource = _a.dataSource;
        var _b = this.state, testingMessage = _b.testingMessage, testingStatus = _b.testingStatus, plugin = _b.plugin;
        return (React.createElement("form", { onSubmit: this.onSubmit },
            this.isReadOnly() && this.renderIsReadOnlyMessage(),
            dataSourceMeta.state && (React.createElement("div", { className: "gf-form" },
                React.createElement("label", { className: "gf-form-label width-10" }, "Plugin state"),
                React.createElement("label", { className: "gf-form-label gf-form-label--transparent" },
                    React.createElement(PluginStateinfo, { state: dataSourceMeta.state })))),
            React.createElement(BasicSettings, { dataSourceName: dataSource.name, isDefault: dataSource.isDefault, onDefaultChange: function (state) { return setIsDefault(state); }, onNameChange: function (name) { return setDataSourceName(name); } }),
            plugin && (React.createElement(PluginSettings, { plugin: plugin, dataSource: dataSource, dataSourceMeta: dataSourceMeta, onModelChange: this.onModelChange })),
            React.createElement("div", { className: "gf-form-group" }, testingMessage && (React.createElement("div", { className: "alert-" + testingStatus + " alert", "aria-label": "Datasource settings page Alert" },
                React.createElement("div", { className: "alert-icon" }, testingStatus === 'error' ? (React.createElement("i", { className: "fa fa-exclamation-triangle" })) : (React.createElement("i", { className: "fa fa-check" }))),
                React.createElement("div", { className: "alert-body" },
                    React.createElement("div", { className: "alert-title", "aria-label": "Datasource settings page Alert message" }, testingMessage))))),
            React.createElement(ButtonRow, { onSubmit: function (event) { return _this.onSubmit(event); }, isReadOnly: this.isReadOnly(), onDelete: this.onDelete, onTest: function (event) { return _this.onTest(event); } })));
    };
    DataSourceSettingsPage.prototype.render = function () {
        var _a = this.props, navModel = _a.navModel, page = _a.page;
        var loadError = this.state.loadError;
        if (loadError) {
            return this.renderLoadError(loadError);
        }
        return (React.createElement(Page, { navModel: navModel },
            React.createElement(Page.Contents, { isLoading: !this.hasDataSource }, this.hasDataSource && React.createElement("div", null, page ? this.renderConfigPageBody(page) : this.renderSettings()))));
    };
    return DataSourceSettingsPage;
}(PureComponent));
export { DataSourceSettingsPage };
function mapStateToProps(state) {
    var pageId = getRouteParamsId(state.location);
    var dataSource = getDataSource(state.dataSources, pageId);
    var page = state.location.query.page;
    return {
        navModel: getNavModel(state.navIndex, page ? "datasource-page-" + page : "datasource-settings-" + pageId, getDataSourceLoadingNav('settings')),
        dataSource: getDataSource(state.dataSources, pageId),
        dataSourceMeta: getDataSourceMeta(state.dataSources, dataSource.type),
        pageId: pageId,
        query: state.location.query,
        page: page,
    };
}
var mapDispatchToProps = {
    deleteDataSource: deleteDataSource,
    loadDataSource: loadDataSource,
    setDataSourceName: setDataSourceName,
    updateDataSource: updateDataSource,
    setIsDefault: setIsDefault,
    dataSourceLoaded: dataSourceLoaded,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(DataSourceSettingsPage));
//# sourceMappingURL=DataSourceSettingsPage.js.map
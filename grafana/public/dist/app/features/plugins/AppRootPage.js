import * as tslib_1 from "tslib";
// Libraries
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import Page from 'app/core/components/Page/Page';
import { getPluginSettings } from './PluginSettingsCache';
import { importAppPlugin } from './plugin_loader';
import { PluginType } from '@grafana/ui';
import { getLoadingNav } from './PluginPage';
import { getNotFoundNav, getWarningNav } from 'app/core/nav_model_srv';
import { appEvents } from 'app/core/core';
export function getAppPluginPageError(meta) {
    if (!meta) {
        return 'Unknown Plugin';
    }
    if (meta.type !== PluginType.app) {
        return 'Plugin must be an app';
    }
    if (!meta.enabled) {
        return 'Application Not Enabled';
    }
    return null;
}
var AppRootPage = /** @class */ (function (_super) {
    tslib_1.__extends(AppRootPage, _super);
    function AppRootPage(props) {
        var _this = _super.call(this, props) || this;
        _this.onNavChanged = function (nav) {
            _this.setState({ nav: nav });
        };
        _this.state = {
            loading: true,
            nav: getLoadingNav(),
        };
        return _this;
    }
    AppRootPage.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pluginId, app, err_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pluginId = this.props.pluginId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getPluginSettings(pluginId).then(function (info) {
                                var error = getAppPluginPageError(info);
                                if (error) {
                                    appEvents.emit('alert-error', [error]);
                                    _this.setState({ nav: getWarningNav(error) });
                                    return null;
                                }
                                return importAppPlugin(info);
                            })];
                    case 2:
                        app = _a.sent();
                        this.setState({ plugin: app, loading: false });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.setState({ plugin: null, loading: false, nav: getNotFoundNav() });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AppRootPage.prototype.render = function () {
        var _a = this.props, path = _a.path, query = _a.query;
        var _b = this.state, loading = _b.loading, plugin = _b.plugin, nav = _b.nav;
        if (plugin && !plugin.root) {
            // TODO? redirect to plugin page?
            return React.createElement("div", null, "No Root App");
        }
        return (React.createElement(Page, { navModel: nav },
            React.createElement(Page.Contents, { isLoading: loading }, !loading && plugin && (React.createElement(plugin.root, { meta: plugin.meta, query: query, path: path, onNavChanged: this.onNavChanged })))));
    };
    return AppRootPage;
}(Component));
var mapStateToProps = function (state) { return ({
    pluginId: state.location.routeParams.pluginId,
    slug: state.location.routeParams.slug,
    query: state.location.query,
    path: state.location.path,
}); };
export default hot(module)(connect(mapStateToProps)(AppRootPage));
//# sourceMappingURL=AppRootPage.js.map
import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { AppNotificationSeverity } from 'app/types';
import { PluginIncludeType, PluginType, Tooltip, } from '@grafana/ui';
import Page from 'app/core/components/Page/Page';
import { getPluginSettings } from './PluginSettingsCache';
import { importAppPlugin, importDataSourcePlugin, importPanelPlugin } from './plugin_loader';
import { getNotFoundNav } from 'app/core/nav_model_srv';
import { PluginHelp } from 'app/core/components/PluginHelp/PluginHelp';
import { AppConfigCtrlWrapper } from './wrappers/AppConfigWrapper';
import { PluginDashboards } from './PluginDashboards';
import { appEvents } from 'app/core/core';
import { config } from 'app/core/config';
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
export function getLoadingNav() {
    var node = {
        text: 'Loading...',
        icon: 'icon-gf icon-gf-panel',
    };
    return {
        node: node,
        main: node,
    };
}
function loadPlugin(pluginId) {
    return getPluginSettings(pluginId).then(function (info) {
        if (info.type === PluginType.app) {
            return importAppPlugin(info);
        }
        if (info.type === PluginType.datasource) {
            return importDataSourcePlugin(info);
        }
        if (info.type === PluginType.panel) {
            return importPanelPlugin(pluginId).then(function (plugin) {
                // Panel Meta does not have the *full* settings meta
                return getPluginSettings(pluginId).then(function (meta) {
                    plugin.meta = tslib_1.__assign({}, meta, plugin.meta);
                    return plugin;
                });
            });
        }
        if (info.type === PluginType.renderer) {
            return Promise.resolve({ meta: info });
        }
        return Promise.reject('Unknown Plugin type: ' + info.type);
    });
}
var PAGE_ID_README = 'readme';
var PAGE_ID_DASHBOARDS = 'dashboards';
var PAGE_ID_CONFIG_CTRL = 'config';
var PluginPage = /** @class */ (function (_super) {
    tslib_1.__extends(PluginPage, _super);
    function PluginPage(props) {
        var _this = _super.call(this, props) || this;
        _this.showUpdateInfo = function () {
            appEvents.emit('show-modal', {
                src: 'public/app/features/plugins/partials/update_instructions.html',
                model: _this.state.plugin.meta,
            });
        };
        _this.state = {
            loading: true,
            nav: getLoadingNav(),
            defaultPage: PAGE_ID_README,
        };
        return _this;
    }
    PluginPage.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, pluginId, path, query, $contextSrv, appSubUrl, plugin, _b, defaultPage, nav;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, pluginId = _a.pluginId, path = _a.path, query = _a.query, $contextSrv = _a.$contextSrv;
                        appSubUrl = config.appSubUrl;
                        return [4 /*yield*/, loadPlugin(pluginId)];
                    case 1:
                        plugin = _c.sent();
                        if (!plugin) {
                            this.setState({
                                loading: false,
                                nav: getNotFoundNav(),
                            });
                            return [2 /*return*/]; // 404
                        }
                        _b = getPluginTabsNav(plugin, appSubUrl, path, query, $contextSrv.hasRole('Admin')), defaultPage = _b.defaultPage, nav = _b.nav;
                        this.setState({
                            loading: false,
                            plugin: plugin,
                            defaultPage: defaultPage,
                            nav: nav,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PluginPage.prototype.componentDidUpdate = function (prevProps) {
        var prevPage = prevProps.query.page;
        var page = this.props.query.page;
        if (prevPage !== page) {
            var _a = this.state, nav = _a.nav, defaultPage = _a.defaultPage;
            var node = tslib_1.__assign({}, nav.node, { children: setActivePage(page, nav.node.children, defaultPage) });
            this.setState({
                nav: {
                    node: node,
                    main: node,
                },
            });
        }
    };
    PluginPage.prototype.renderBody = function () {
        var e_1, _a;
        var query = this.props.query;
        var _b = this.state, plugin = _b.plugin, nav = _b.nav;
        if (!plugin) {
            return React.createElement(AlertBox, { severity: AppNotificationSeverity.Error, title: "Plugin Not Found" });
        }
        var active = nav.main.children.find(function (tab) { return tab.active; });
        if (active) {
            // Find the current config tab
            if (plugin.configPages) {
                try {
                    for (var _c = tslib_1.__values(plugin.configPages), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var tab = _d.value;
                        if (tab.id === active.id) {
                            return React.createElement(tab.body, { plugin: plugin, query: query });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            // Apps have some special behavior
            if (plugin.meta.type === PluginType.app) {
                if (active.id === PAGE_ID_DASHBOARDS) {
                    return React.createElement(PluginDashboards, { plugin: plugin.meta });
                }
                if (active.id === PAGE_ID_CONFIG_CTRL && plugin.angularConfigCtrl) {
                    return React.createElement(AppConfigCtrlWrapper, { app: plugin });
                }
            }
        }
        return React.createElement(PluginHelp, { plugin: plugin.meta, type: "help" });
    };
    PluginPage.prototype.renderVersionInfo = function (meta) {
        if (!meta.info.version) {
            return null;
        }
        return (React.createElement("section", { className: "page-sidebar-section" },
            React.createElement("h4", null, "Version"),
            React.createElement("span", null, meta.info.version),
            meta.hasUpdate && (React.createElement("div", null,
                React.createElement(Tooltip, { content: meta.latestVersion, theme: "info", placement: "top" },
                    React.createElement("a", { href: "#", onClick: this.showUpdateInfo }, "Update Available!"))))));
    };
    PluginPage.prototype.renderSidebarIncludeBody = function (item) {
        if (item.type === PluginIncludeType.page) {
            var pluginId = this.state.plugin.meta.id;
            var page = item.name.toLowerCase().replace(' ', '-');
            return (React.createElement("a", { href: "plugins/" + pluginId + "/page/" + page },
                React.createElement("i", { className: getPluginIcon(item.type) }),
                item.name));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("i", { className: getPluginIcon(item.type) }),
            item.name));
    };
    PluginPage.prototype.renderSidebarIncludes = function (includes) {
        var _this = this;
        if (!includes || !includes.length) {
            return null;
        }
        return (React.createElement("section", { className: "page-sidebar-section" },
            React.createElement("h4", null, "Includes"),
            React.createElement("ul", { className: "ui-list plugin-info-list" }, includes.map(function (include) {
                return (React.createElement("li", { className: "plugin-info-list-item", key: include.name }, _this.renderSidebarIncludeBody(include)));
            }))));
    };
    PluginPage.prototype.renderSidebarDependencies = function (dependencies) {
        if (!dependencies) {
            return null;
        }
        return (React.createElement("section", { className: "page-sidebar-section" },
            React.createElement("h4", null, "Dependencies"),
            React.createElement("ul", { className: "ui-list plugin-info-list" },
                React.createElement("li", { className: "plugin-info-list-item" },
                    React.createElement("img", { src: "public/img/grafana_icon.svg" }),
                    "Grafana ",
                    dependencies.grafanaVersion),
                dependencies.plugins &&
                    dependencies.plugins.map(function (plug) {
                        return (React.createElement("li", { className: "plugin-info-list-item", key: plug.name },
                            React.createElement("i", { className: getPluginIcon(plug.type) }),
                            plug.name,
                            " ",
                            plug.version));
                    }))));
    };
    PluginPage.prototype.renderSidebarLinks = function (info) {
        if (!info.links || !info.links.length) {
            return null;
        }
        return (React.createElement("section", { className: "page-sidebar-section" },
            React.createElement("h4", null, "Links"),
            React.createElement("ul", { className: "ui-list" }, info.links.map(function (link) {
                return (React.createElement("li", { key: link.url },
                    React.createElement("a", { href: link.url, className: "external-link", target: "_blank", rel: "noopener" }, link.name)));
            }))));
    };
    PluginPage.prototype.render = function () {
        var _a = this.state, loading = _a.loading, nav = _a.nav, plugin = _a.plugin;
        var $contextSrv = this.props.$contextSrv;
        var isAdmin = $contextSrv.hasRole('Admin');
        return (React.createElement(Page, { navModel: nav },
            React.createElement(Page.Contents, { isLoading: loading }, !loading && (React.createElement("div", { className: "sidebar-container" },
                React.createElement("div", { className: "sidebar-content" },
                    plugin.loadError && (React.createElement(AlertBox, { severity: AppNotificationSeverity.Error, title: "Error Loading Plugin", body: React.createElement(React.Fragment, null,
                            "Check the server startup logs for more information. ",
                            React.createElement("br", null),
                            "If this plugin was loaded from git, make sure it was compiled.") })),
                    this.renderBody()),
                React.createElement("aside", { className: "page-sidebar" }, plugin && (React.createElement("section", { className: "page-sidebar-section" },
                    this.renderVersionInfo(plugin.meta),
                    isAdmin && this.renderSidebarIncludes(plugin.meta.includes),
                    this.renderSidebarDependencies(plugin.meta.dependencies),
                    this.renderSidebarLinks(plugin.meta.info)))))))));
    };
    return PluginPage;
}(PureComponent));
function getPluginTabsNav(plugin, appSubUrl, path, query, isAdmin) {
    var e_2, _a;
    var meta = plugin.meta;
    var defaultPage;
    var pages = [];
    if (true) {
        pages.push({
            text: 'Readme',
            icon: 'fa fa-fw fa-file-text-o',
            url: "" + appSubUrl + path + "?page=" + PAGE_ID_README,
            id: PAGE_ID_README,
        });
    }
    // We allow non admins to see plugins but only their readme. Config is hidden even though the API needs to be
    // public for plugins to work properly.
    if (isAdmin) {
        // Only show Config/Pages for app
        if (meta.type === PluginType.app) {
            // Legacy App Config
            if (plugin.angularConfigCtrl) {
                pages.push({
                    text: 'Config',
                    icon: 'gicon gicon-cog',
                    url: "" + appSubUrl + path + "?page=" + PAGE_ID_CONFIG_CTRL,
                    id: PAGE_ID_CONFIG_CTRL,
                });
                defaultPage = PAGE_ID_CONFIG_CTRL;
            }
            if (plugin.configPages) {
                try {
                    for (var _b = tslib_1.__values(plugin.configPages), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var page = _c.value;
                        pages.push({
                            text: page.title,
                            icon: page.icon,
                            url: path + '?page=' + page.id,
                            id: page.id,
                        });
                        if (!defaultPage) {
                            defaultPage = page.id;
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
            }
            // Check for the dashboard pages
            if (find(meta.includes, { type: PluginIncludeType.dashboard })) {
                pages.push({
                    text: 'Dashboards',
                    icon: 'gicon gicon-dashboard',
                    url: "" + appSubUrl + path + "?page=" + PAGE_ID_DASHBOARDS,
                    id: PAGE_ID_DASHBOARDS,
                });
            }
        }
    }
    if (!defaultPage) {
        defaultPage = pages[0].id; // the first tab
    }
    var node = {
        text: meta.name,
        img: meta.info.logos.large,
        subTitle: meta.info.author.name,
        breadcrumbs: [{ title: 'Plugins', url: '/plugins' }],
        url: "" + appSubUrl + path,
        children: setActivePage(query.page, pages, defaultPage),
    };
    return {
        defaultPage: defaultPage,
        nav: {
            node: node,
            main: node,
        },
    };
}
function setActivePage(pageId, pages, defaultPageId) {
    var found = false;
    var selected = pageId || defaultPageId;
    var changed = pages.map(function (p) {
        var active = !found && selected === p.id;
        if (active) {
            found = true;
        }
        return tslib_1.__assign({}, p, { active: active });
    });
    if (!found) {
        changed[0].active = true;
    }
    return changed;
}
function getPluginIcon(type) {
    switch (type) {
        case 'datasource':
            return 'gicon gicon-datasources';
        case 'panel':
            return 'icon-gf icon-gf-panel';
        case 'app':
            return 'icon-gf icon-gf-apps';
        case 'page':
            return 'icon-gf icon-gf-endpoint-tiny';
        case 'dashboard':
            return 'gicon gicon-dashboard';
        default:
            return 'icon-gf icon-gf-apps';
    }
}
var mapStateToProps = function (state) { return ({
    pluginId: state.location.routeParams.pluginId,
    query: state.location.query,
    path: state.location.path,
}); };
export default hot(module)(connect(mapStateToProps)(PluginPage));
//# sourceMappingURL=PluginPage.js.map
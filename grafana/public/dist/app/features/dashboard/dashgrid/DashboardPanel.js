import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import classNames from 'classnames';
// Utils & Services
import { getAngularLoader } from '@grafana/runtime';
import { importPanelPlugin } from 'app/features/plugins/plugin_loader';
// Components
import { AddPanelWidget } from '../components/AddPanelWidget';
import { DashboardRow } from '../components/DashboardRow';
import { PanelChrome } from './PanelChrome';
import { PanelEditor } from '../panel_editor/PanelEditor';
import { PanelResizer } from './PanelResizer';
import { AutoSizer } from 'react-virtualized';
var DashboardPanel = /** @class */ (function (_super) {
    tslib_1.__extends(DashboardPanel, _super);
    function DashboardPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.specialPanels = {};
        _this.onPluginTypeChange = function (plugin) {
            _this.loadPlugin(plugin.id);
        };
        _this.onMouseEnter = function () {
            _this.props.dashboard.setPanelFocus(_this.props.panel.id);
        };
        _this.onMouseLeave = function () {
            _this.props.dashboard.setPanelFocus(0);
        };
        _this.state = {
            plugin: null,
            angularPanel: null,
            isLazy: !props.isInView,
        };
        _this.specialPanels['row'] = _this.renderRow.bind(_this);
        _this.specialPanels['add-panel'] = _this.renderAddPanel.bind(_this);
        return _this;
    }
    DashboardPanel.prototype.isSpecial = function (pluginId) {
        return this.specialPanels[pluginId];
    };
    DashboardPanel.prototype.renderRow = function () {
        return React.createElement(DashboardRow, { panel: this.props.panel, dashboard: this.props.dashboard });
    };
    DashboardPanel.prototype.renderAddPanel = function () {
        return React.createElement(AddPanelWidget, { panel: this.props.panel, dashboard: this.props.dashboard });
    };
    DashboardPanel.prototype.loadPlugin = function (pluginId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panel, plugin;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isSpecial(pluginId)) {
                            return [2 /*return*/];
                        }
                        panel = this.props.panel;
                        if (!(!this.state.plugin || this.state.plugin.meta.id !== pluginId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, importPanelPlugin(pluginId)];
                    case 1:
                        plugin = _a.sent();
                        // unmount angular panel
                        this.cleanUpAngularPanel();
                        if (panel.type !== pluginId) {
                            panel.changePlugin(plugin);
                        }
                        else {
                            panel.pluginLoaded(plugin);
                        }
                        this.setState({ plugin: plugin, angularPanel: null });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DashboardPanel.prototype.componentDidMount = function () {
        this.loadPlugin(this.props.panel.type);
    };
    DashboardPanel.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.state.isLazy && this.props.isInView) {
            this.setState({ isLazy: false });
        }
        if (!this.element || this.state.angularPanel) {
            return;
        }
        var loader = getAngularLoader();
        var template = '<plugin-component type="panel" class="panel-height-helper"></plugin-component>';
        var scopeProps = { panel: this.props.panel, dashboard: this.props.dashboard };
        var angularPanel = loader.load(this.element, scopeProps, template);
        this.setState({ angularPanel: angularPanel });
    };
    DashboardPanel.prototype.cleanUpAngularPanel = function () {
        if (this.state.angularPanel) {
            this.state.angularPanel.destroy();
            this.element = null;
        }
    };
    DashboardPanel.prototype.componentWillUnmount = function () {
        this.cleanUpAngularPanel();
    };
    DashboardPanel.prototype.renderPanel = function () {
        var _this = this;
        var _a = this.props, dashboard = _a.dashboard, panel = _a.panel, isFullscreen = _a.isFullscreen, isInView = _a.isInView;
        var plugin = this.state.plugin;
        if (plugin.angularPanelCtrl) {
            return React.createElement("div", { ref: function (element) { return (_this.element = element); }, className: "panel-height-helper" });
        }
        return (React.createElement(AutoSizer, null, function (_a) {
            var width = _a.width, height = _a.height;
            if (width === 0) {
                return null;
            }
            return (React.createElement(PanelChrome, { plugin: plugin, panel: panel, dashboard: dashboard, isFullscreen: isFullscreen, isInView: isInView, width: width, height: height }));
        }));
    };
    DashboardPanel.prototype.render = function () {
        var _this = this;
        var _a = this.props, panel = _a.panel, dashboard = _a.dashboard, isFullscreen = _a.isFullscreen, isEditing = _a.isEditing;
        var _b = this.state, plugin = _b.plugin, angularPanel = _b.angularPanel, isLazy = _b.isLazy;
        if (this.isSpecial(panel.type)) {
            return this.specialPanels[panel.type]();
        }
        // if we have not loaded plugin exports yet, wait
        if (!plugin) {
            return null;
        }
        // If we are lazy state don't render anything
        if (isLazy) {
            return null;
        }
        var editorContainerClasses = classNames({
            'panel-editor-container': isEditing,
            'panel-height-helper': !isEditing,
        });
        var panelWrapperClass = classNames({
            'panel-wrapper': true,
            'panel-wrapper--edit': isEditing,
            'panel-wrapper--view': isFullscreen && !isEditing,
        });
        return (React.createElement("div", { className: editorContainerClasses },
            React.createElement(PanelResizer, { isEditing: isEditing, panel: panel, render: function (styles) { return (React.createElement("div", { className: panelWrapperClass, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave, style: styles }, _this.renderPanel())); } }),
            panel.isEditing && (React.createElement(PanelEditor, { panel: panel, plugin: plugin, dashboard: dashboard, angularPanel: angularPanel, onPluginTypeChange: this.onPluginTypeChange }))));
    };
    return DashboardPanel;
}(PureComponent));
export { DashboardPanel };
//# sourceMappingURL=DashboardPanel.js.map
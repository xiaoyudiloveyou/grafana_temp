import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Tooltip } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { QueriesTab } from './QueriesTab';
import VisualizationTab from './VisualizationTab';
import { GeneralTab } from './GeneralTab';
import { AlertTab } from '../../alerting/AlertTab';
import { changePanelEditorTab, panelEditorCleanUp, refreshPanelEditor } from './state/actions';
import { getActiveTabAndTabs } from './state/selectors';
var UnConnectedPanelEditor = /** @class */ (function (_super) {
    tslib_1.__extends(UnConnectedPanelEditor, _super);
    function UnConnectedPanelEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.refreshFromState = function (meta) {
            var _a = _this.props, refreshPanelEditor = _a.refreshPanelEditor, plugin = _a.plugin;
            meta = meta || plugin.meta;
            refreshPanelEditor({
                hasQueriesTab: !meta.skipDataQuery,
                usesGraphPlugin: meta.id === 'graph',
                alertingEnabled: config.alertingEnabled,
            });
        };
        _this.onChangeTab = function (tab) {
            var changePanelEditorTab = _this.props.changePanelEditorTab;
            // Angular Query Components can potentially refresh the PanelModel
            // onBlur so this makes sure we change tab after that
            setTimeout(function () { return changePanelEditorTab(tab); }, 10);
        };
        _this.onPluginTypeChange = function (newType) {
            var onPluginTypeChange = _this.props.onPluginTypeChange;
            onPluginTypeChange(newType);
            _this.refreshFromState(newType);
        };
        return _this;
    }
    UnConnectedPanelEditor.prototype.componentDidMount = function () {
        this.refreshFromState();
    };
    UnConnectedPanelEditor.prototype.componentWillUnmount = function () {
        var panelEditorCleanUp = this.props.panelEditorCleanUp;
        panelEditorCleanUp();
    };
    UnConnectedPanelEditor.prototype.renderCurrentTab = function (activeTab) {
        var _a = this.props, panel = _a.panel, dashboard = _a.dashboard, plugin = _a.plugin, angularPanel = _a.angularPanel;
        switch (activeTab) {
            case 'advanced':
                return React.createElement(GeneralTab, { panel: panel });
            case 'queries':
                return React.createElement(QueriesTab, { panel: panel, dashboard: dashboard });
            case 'alert':
                return React.createElement(AlertTab, { angularPanel: angularPanel, dashboard: dashboard, panel: panel });
            case 'visualization':
                return (React.createElement(VisualizationTab, { panel: panel, dashboard: dashboard, plugin: plugin, onPluginTypeChange: this.onPluginTypeChange, angularPanel: angularPanel }));
            default:
                return null;
        }
    };
    UnConnectedPanelEditor.prototype.render = function () {
        var _this = this;
        var _a = this.props, activeTab = _a.activeTab, tabs = _a.tabs;
        return (React.createElement("div", { className: "panel-editor-container__editor" },
            React.createElement("div", { className: "panel-editor-tabs" }, tabs.map(function (tab) {
                return React.createElement(TabItem, { tab: tab, activeTab: activeTab, onClick: _this.onChangeTab, key: tab.id });
            })),
            React.createElement("div", { className: "panel-editor__right" }, this.renderCurrentTab(activeTab))));
    };
    return UnConnectedPanelEditor;
}(PureComponent));
export var mapStateToProps = function (state) { return getActiveTabAndTabs(state.location, state.panelEditor); };
var mapDispatchToProps = { refreshPanelEditor: refreshPanelEditor, panelEditorCleanUp: panelEditorCleanUp, changePanelEditorTab: changePanelEditorTab };
export var PanelEditor = hot(module)(connect(mapStateToProps, mapDispatchToProps)(UnConnectedPanelEditor));
function TabItem(_a) {
    var tab = _a.tab, activeTab = _a.activeTab, onClick = _a.onClick;
    var tabClasses = classNames({
        'panel-editor-tabs__link': true,
        active: activeTab === tab.id,
    });
    return (React.createElement("div", { className: "panel-editor-tabs__item", onClick: function () { return onClick(tab); } },
        React.createElement("a", { className: tabClasses, "aria-label": tab.text + " tab button" },
            React.createElement(Tooltip, { content: "" + tab.text, placement: "auto" },
                React.createElement("i", { className: "gicon gicon-" + tab.id + (activeTab === tab.id ? '-active' : '') })))));
}
//# sourceMappingURL=PanelEditor.js.map
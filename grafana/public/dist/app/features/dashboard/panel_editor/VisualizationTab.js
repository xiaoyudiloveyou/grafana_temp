import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Utils & Services
import { getAngularLoader } from '@grafana/runtime';
import { connectWithStore } from 'app/core/utils/connectWithReduxStore';
import { updateLocation } from 'app/core/actions';
// Components
import { EditorTabBody } from './EditorTabBody';
import { VizTypePicker } from './VizTypePicker';
import { PluginHelp } from 'app/core/components/PluginHelp/PluginHelp';
import { FadeIn } from 'app/core/components/Animations/FadeIn';
import { VizPickerSearch } from './VizPickerSearch';
import PluginStateinfo from 'app/features/plugins/PluginStateInfo';
import { LoadingState, DefaultTimeRange } from '@grafana/data';
var VisualizationTab = /** @class */ (function (_super) {
    tslib_1.__extends(VisualizationTab, _super);
    function VisualizationTab(props) {
        var _this = _super.call(this, props) || this;
        _this.getReactPanelOptions = function () {
            var panel = _this.props.panel;
            return panel.getOptions();
        };
        _this.clearQuery = function () {
            _this.setState({ searchQuery: '' });
        };
        _this.onPanelOptionsChanged = function (options, callback) {
            _this.props.panel.updateOptions(options);
            _this.forceUpdate(callback);
        };
        _this.onOpenVizPicker = function () {
            _this.setState({ isVizPickerOpen: true, scrollTop: 0 });
        };
        _this.onCloseVizPicker = function () {
            if (_this.props.urlOpenVizPicker) {
                _this.props.updateLocation({ query: { openVizPicker: null }, partial: true });
            }
            _this.setState({ isVizPickerOpen: false, hasBeenFocused: false });
        };
        _this.onSearchQueryChange = function (value) {
            _this.setState({
                searchQuery: value,
            });
        };
        _this.renderToolbar = function () {
            var plugin = _this.props.plugin;
            var _a = _this.state, isVizPickerOpen = _a.isVizPickerOpen, searchQuery = _a.searchQuery;
            var meta = plugin.meta;
            if (isVizPickerOpen) {
                return (React.createElement(VizPickerSearch, { plugin: meta, searchQuery: searchQuery, onChange: _this.onSearchQueryChange, onClose: _this.onCloseVizPicker }));
            }
            else {
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "toolbar__main", onClick: _this.onOpenVizPicker },
                        React.createElement("img", { className: "toolbar__main-image", src: meta.info.logos.small }),
                        React.createElement("div", { className: "toolbar__main-name" }, meta.name),
                        React.createElement("i", { className: "fa fa-caret-down" })),
                    React.createElement(PluginStateinfo, { state: meta.state })));
            }
        };
        _this.onPluginTypeChange = function (plugin) {
            if (plugin.id === _this.props.plugin.meta.id) {
                _this.setState({ isVizPickerOpen: false });
            }
            else {
                _this.props.onPluginTypeChange(plugin);
            }
        };
        _this.renderHelp = function () { return React.createElement(PluginHelp, { plugin: _this.props.plugin.meta, type: "help" }); };
        _this.setScrollTop = function (event) {
            var target = event.target;
            _this.setState({ scrollTop: target.scrollTop });
        };
        _this.state = {
            isVizPickerOpen: _this.props.urlOpenVizPicker,
            hasBeenFocused: false,
            searchQuery: '',
            scrollTop: 0,
            data: {
                state: LoadingState.NotStarted,
                series: [],
                timeRange: DefaultTimeRange,
            },
        };
        return _this;
    }
    VisualizationTab.prototype.renderPanelOptions = function () {
        var _this = this;
        var _a = this.props, plugin = _a.plugin, angularPanel = _a.angularPanel;
        if (angularPanel) {
            return React.createElement("div", { ref: function (element) { return (_this.element = element); } });
        }
        if (plugin.editor) {
            return (React.createElement(plugin.editor, { data: this.state.data, options: this.getReactPanelOptions(), onOptionsChange: this.onPanelOptionsChanged }));
        }
        return React.createElement("p", null, "Visualization has no options");
    };
    VisualizationTab.prototype.componentDidMount = function () {
        var _this = this;
        var panel = this.props.panel;
        var queryRunner = panel.getQueryRunner();
        if (this.shouldLoadAngularOptions()) {
            this.loadAngularOptions();
        }
        this.querySubscription = queryRunner.getData().subscribe({
            next: function (data) { return _this.setState({ data: data }); },
        });
    };
    VisualizationTab.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.plugin !== prevProps.plugin) {
            this.cleanUpAngularOptions();
        }
        if (this.shouldLoadAngularOptions()) {
            this.loadAngularOptions();
        }
    };
    VisualizationTab.prototype.shouldLoadAngularOptions = function () {
        return this.props.angularPanel && this.element && !this.angularOptions;
    };
    VisualizationTab.prototype.loadAngularOptions = function () {
        var _this = this;
        var angularPanel = this.props.angularPanel;
        var scope = angularPanel.getScope();
        // When full page reloading in edit mode the angular panel has on fully compiled & instantiated yet
        if (!scope.$$childHead) {
            setTimeout(function () {
                _this.forceUpdate();
            });
            return;
        }
        var panelCtrl = scope.$$childHead.ctrl;
        panelCtrl.initEditMode();
        panelCtrl.onPluginTypeChange = this.onPluginTypeChange;
        var template = '';
        for (var i = 0; i < panelCtrl.editorTabs.length; i++) {
            template +=
                "\n      <div class=\"panel-options-group\" ng-cloak>" +
                    (i > 0
                        ? "<div class=\"panel-options-group__header\">\n           <span class=\"panel-options-group__title\">{{ctrl.editorTabs[" + i + "].title}}\n           </span>\n         </div>"
                        : '') +
                    ("<div class=\"panel-options-group__body\">\n          <panel-editor-tab editor-tab=\"ctrl.editorTabs[" + i + "]\" ctrl=\"ctrl\"></panel-editor-tab>\n        </div>\n      </div>\n      ");
        }
        var loader = getAngularLoader();
        var scopeProps = { ctrl: panelCtrl };
        this.angularOptions = loader.load(this.element, scopeProps, template);
    };
    VisualizationTab.prototype.componentWillUnmount = function () {
        this.cleanUpAngularOptions();
    };
    VisualizationTab.prototype.cleanUpAngularOptions = function () {
        if (this.angularOptions) {
            this.angularOptions.destroy();
            this.angularOptions = null;
        }
    };
    VisualizationTab.prototype.render = function () {
        var plugin = this.props.plugin;
        var _a = this.state, isVizPickerOpen = _a.isVizPickerOpen, searchQuery = _a.searchQuery, scrollTop = _a.scrollTop;
        var meta = plugin.meta;
        var pluginHelp = {
            heading: 'Help',
            icon: 'fa fa-question',
            render: this.renderHelp,
        };
        return (React.createElement(EditorTabBody, { heading: "Visualization", renderToolbar: this.renderToolbar, toolbarItems: [pluginHelp], scrollTop: scrollTop, setScrollTop: this.setScrollTop },
            React.createElement(React.Fragment, null,
                React.createElement(FadeIn, { in: isVizPickerOpen, duration: 200, unmountOnExit: true, onExited: this.clearQuery },
                    React.createElement(VizTypePicker, { current: meta, onTypeChange: this.onPluginTypeChange, searchQuery: searchQuery, onClose: this.onCloseVizPicker })),
                this.renderPanelOptions())));
    };
    return VisualizationTab;
}(PureComponent));
export { VisualizationTab };
var mapStateToProps = function (state) { return ({
    urlOpenVizPicker: !!state.location.query.openVizPicker,
}); };
var mapDispatchToProps = {
    updateLocation: updateLocation,
};
export default connectWithStore(VisualizationTab, mapStateToProps, mapDispatchToProps);
//# sourceMappingURL=VisualizationTab.js.map
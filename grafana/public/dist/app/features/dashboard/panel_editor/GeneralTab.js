import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { getAngularLoader } from '@grafana/runtime';
import { EditorTabBody } from './EditorTabBody';
import './../../panel/GeneralTabCtrl';
import { PanelOptionsGroup, DataLinksEditor } from '@grafana/ui';
import { getPanelLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';
var GeneralTab = /** @class */ (function (_super) {
    tslib_1.__extends(GeneralTab, _super);
    function GeneralTab(props) {
        var _this = _super.call(this, props) || this;
        _this.onDataLinksChanged = function (links, callback) {
            _this.props.panel.links = links;
            _this.props.panel.render();
            _this.forceUpdate(callback);
        };
        return _this;
    }
    GeneralTab.prototype.componentDidMount = function () {
        if (!this.element) {
            return;
        }
        var panel = this.props.panel;
        var loader = getAngularLoader();
        var template = '<panel-general-tab />';
        var scopeProps = {
            ctrl: {
                panel: panel,
            },
        };
        this.component = loader.load(this.element, scopeProps, template);
    };
    GeneralTab.prototype.componentWillUnmount = function () {
        if (this.component) {
            this.component.destroy();
        }
    };
    GeneralTab.prototype.render = function () {
        var _this = this;
        var panel = this.props.panel;
        var suggestions = getPanelLinksVariableSuggestions();
        return (React.createElement(EditorTabBody, { heading: "General", toolbarItems: [] },
            React.createElement(React.Fragment, null,
                React.createElement("div", { ref: function (element) { return (_this.element = element); } }),
                React.createElement(PanelOptionsGroup, { title: "Panel links" },
                    React.createElement(DataLinksEditor, { value: panel.links, onChange: this.onDataLinksChanged, suggestions: suggestions, maxLinks: 10 })))));
    };
    return GeneralTab;
}(PureComponent));
export { GeneralTab };
//# sourceMappingURL=GeneralTab.js.map
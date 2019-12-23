import { __assign, __extends, __read, __spread } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Components
import { PanelOptionsGroup, PanelOptionsGrid, Switch, FormField, FormLabel } from '@grafana/ui';
import { toIntegerOrUndefined, toNumberString } from '@grafana/data';
import { TagBadge } from 'app/core/components/TagFilter/TagBadge';
var AnnoListEditor = /** @class */ (function (_super) {
    __extends(AnnoListEditor, _super);
    function AnnoListEditor(props) {
        var _this = _super.call(this, props) || this;
        // Display
        //-----------
        _this.onToggleShowUser = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { showUser: !_this.props.options.showUser }));
        };
        _this.onToggleShowTime = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { showTime: !_this.props.options.showTime }));
        };
        _this.onToggleShowTags = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { showTags: !_this.props.options.showTags }));
        };
        // Navigate
        //-----------
        _this.onNavigateBeforeChange = function (event) {
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { navigateBefore: event.target.value }));
        };
        _this.onNavigateAfterChange = function (event) {
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { navigateAfter: event.target.value }));
        };
        _this.onToggleNavigateToPanel = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { navigateToPanel: !_this.props.options.navigateToPanel }));
        };
        // Search
        //-----------
        _this.onLimitChange = function (event) {
            var v = toIntegerOrUndefined(event.target.value);
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { limit: v }));
        };
        _this.onToggleOnlyFromThisDashboard = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { onlyFromThisDashboard: !_this.props.options.onlyFromThisDashboard }));
        };
        _this.onToggleOnlyInTimeRange = function () {
            return _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { onlyInTimeRange: !_this.props.options.onlyInTimeRange }));
        };
        // Tags
        //-----------
        _this.onTagTextChange = function (event) {
            _this.setState({ tag: event.target.value });
        };
        _this.onTagClick = function (e, tag) {
            e.stopPropagation();
            var tags = _this.props.options.tags.filter(function (item) { return item !== tag; });
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { tags: tags }));
        };
        _this.renderTags = function (tags) {
            if (!tags || !tags.length) {
                return null;
            }
            return (React.createElement(React.Fragment, null, tags.map(function (tag) {
                return (React.createElement("span", { key: tag, onClick: function (e) { return _this.onTagClick(e, tag); }, className: "pointer" },
                    React.createElement(TagBadge, { label: tag, removeIcon: true, count: 0 })));
            })));
        };
        _this.state = {
            tag: '',
        };
        return _this;
    }
    AnnoListEditor.prototype.render = function () {
        var _this = this;
        var options = this.props.options;
        var labelWidth = 8;
        return (React.createElement(PanelOptionsGrid, null,
            React.createElement(PanelOptionsGroup, { title: "Display" },
                React.createElement(Switch, { label: "Show User", labelClass: "width-" + labelWidth, checked: options.showUser, onChange: this.onToggleShowUser }),
                React.createElement(Switch, { label: "Show Time", labelClass: "width-" + labelWidth, checked: options.showTime, onChange: this.onToggleShowTime }),
                React.createElement(Switch, { label: "Show Tags", labelClass: "width-" + labelWidth, checked: options.showTags, onChange: this.onToggleShowTags })),
            React.createElement(PanelOptionsGroup, { title: "Navigate" },
                React.createElement(FormField, { label: "Before", labelWidth: labelWidth, onChange: this.onNavigateBeforeChange, value: options.navigateBefore }),
                React.createElement(FormField, { label: "After", labelWidth: labelWidth, onChange: this.onNavigateAfterChange, value: options.navigateAfter }),
                React.createElement(Switch, { label: "To Panel", labelClass: "width-" + labelWidth, checked: options.navigateToPanel, onChange: this.onToggleNavigateToPanel })),
            React.createElement(PanelOptionsGroup, { title: "Search" },
                React.createElement(Switch, { label: "Only This Dashboard", labelClass: "width-12", checked: options.onlyFromThisDashboard, onChange: this.onToggleOnlyFromThisDashboard }),
                React.createElement(Switch, { label: "Within Time Range", labelClass: "width-12", checked: options.onlyInTimeRange, onChange: this.onToggleOnlyInTimeRange }),
                React.createElement("div", { className: "form-field" },
                    React.createElement(FormLabel, { width: 6 }, "Tags"),
                    this.renderTags(options.tags),
                    React.createElement("input", { type: "text", className: "gf-form-input width-" + 8, value: this.state.tag, onChange: this.onTagTextChange, onKeyPress: function (ev) {
                            if (_this.state.tag && ev.key === 'Enter') {
                                var tags = __spread(options.tags, [_this.state.tag]);
                                _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { tags: tags }));
                                _this.setState({ tag: '' });
                                ev.preventDefault();
                            }
                        } })),
                React.createElement(FormField, { label: "Limit", labelWidth: 6, onChange: this.onLimitChange, value: toNumberString(options.limit), type: "number" }))));
    };
    return AnnoListEditor;
}(PureComponent));
export { AnnoListEditor };
//# sourceMappingURL=AnnoListEditor.js.map
import { __assign } from "tslib";
import React from 'react';
import { PanelOptionsGroup, Switch, Input, StatsPicker } from '@grafana/ui';
export var GraphLegendEditor = function (props) {
    var options = props.options, onChange = props.onChange;
    var onStatsChanged = function (stats) {
        onChange(__assign(__assign({}, options), { stats: stats }));
    };
    var onOptionToggle = function (option) { return function (event) {
        var newOption = {};
        if (!event) {
            return;
        }
        // TODO: fix the ignores
        // @ts-ignore
        newOption[option] = event.target.checked;
        if (option === 'placement') {
            // @ts-ignore
            newOption[option] = event.target.checked ? 'right' : 'under';
        }
        onChange(__assign(__assign({}, options), newOption));
    }; };
    var labelWidth = 8;
    return (React.createElement(PanelOptionsGroup, { title: "Legend" },
        React.createElement("div", { className: "section gf-form-group" },
            React.createElement("h4", null, "Options"),
            React.createElement(Switch, { label: "Show legend", labelClass: "width-" + labelWidth, checked: options.isVisible, onChange: onOptionToggle('isVisible') }),
            React.createElement(Switch, { label: "Display as table", labelClass: "width-" + labelWidth, checked: options.asTable, onChange: onOptionToggle('asTable') }),
            React.createElement(Switch, { label: "To the right", labelClass: "width-" + labelWidth, checked: options.placement === 'right', onChange: onOptionToggle('placement') })),
        React.createElement("div", { className: "section gf-form-group" },
            React.createElement("h4", null, "Show"),
            React.createElement("div", { className: "gf-form" },
                React.createElement(StatsPicker, { allowMultiple: true, stats: options.stats ? options.stats : [], onChange: onStatsChanged, placeholder: 'Pick Values' })),
            React.createElement("div", { className: "gf-form" },
                React.createElement("div", { className: "gf-form-label" }, "Decimals"),
                React.createElement(Input, { className: "gf-form-input width-5", type: "number", value: options.decimals, placeholder: "Auto", onChange: function (event) {
                        onChange(__assign(__assign({}, options), { decimals: parseInt(event.target.value, 10) }));
                    } }))),
        React.createElement("div", { className: "section gf-form-group" },
            React.createElement("h4", null, "Hidden series"),
            React.createElement(Switch, { label: "With only zeros", checked: !!options.hideZero, onChange: onOptionToggle('hideZero') }))));
};
//# sourceMappingURL=GraphLegendEditor.js.map
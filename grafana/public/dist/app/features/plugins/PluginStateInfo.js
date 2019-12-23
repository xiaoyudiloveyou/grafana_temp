import * as tslib_1 from "tslib";
import React from 'react';
import { PluginState, AlphaNotice } from '@grafana/ui';
import { css } from 'emotion';
function getPluginStateInfoText(state) {
    switch (state) {
        case PluginState.alpha:
            return 'Alpha Plugin: This plugin is a work in progress and updates may include breaking changes';
        case PluginState.beta:
            return 'Beta Plugin: There could be bugs and minor breaking changes to this plugin';
    }
    return null;
}
var PluginStateinfo = function (props) {
    var text = getPluginStateInfoText(props.state);
    if (!text) {
        return null;
    }
    return (React.createElement(AlphaNotice, { state: props.state, text: text, className: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        margin-left: 16px;\n      "], ["\n        margin-left: 16px;\n      "]))) }));
};
export default PluginStateinfo;
var templateObject_1;
//# sourceMappingURL=PluginStateInfo.js.map
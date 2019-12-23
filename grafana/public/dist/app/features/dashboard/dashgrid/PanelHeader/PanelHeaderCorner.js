import * as tslib_1 from "tslib";
import React, { Component } from 'react';
import { renderMarkdown } from '@grafana/data';
import { Tooltip } from '@grafana/ui';
import templateSrv from 'app/features/templating/template_srv';
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
var InfoMode;
(function (InfoMode) {
    InfoMode["Error"] = "Error";
    InfoMode["Info"] = "Info";
    InfoMode["Links"] = "Links";
})(InfoMode || (InfoMode = {}));
var PanelHeaderCorner = /** @class */ (function (_super) {
    tslib_1.__extends(PanelHeaderCorner, _super);
    function PanelHeaderCorner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeSrv = getTimeSrv();
        _this.getInfoMode = function () {
            var _a = _this.props, panel = _a.panel, error = _a.error;
            if (error) {
                return InfoMode.Error;
            }
            if (!!panel.description) {
                return InfoMode.Info;
            }
            if (panel.links && panel.links.length) {
                return InfoMode.Links;
            }
            return undefined;
        };
        _this.getInfoContent = function () {
            var panel = _this.props.panel;
            var markdown = panel.description || '';
            var interpolatedMarkdown = templateSrv.replace(markdown, panel.scopedVars);
            var markedInterpolatedMarkdown = renderMarkdown(interpolatedMarkdown);
            var links = _this.props.links && _this.props.links.getLinks(panel);
            return (React.createElement("div", { className: "panel-info-content markdown-html" },
                React.createElement("div", { dangerouslySetInnerHTML: { __html: markedInterpolatedMarkdown } }),
                links && links.length > 0 && (React.createElement("ul", { className: "panel-info-corner-links" }, links.map(function (link, idx) {
                    return (React.createElement("li", { key: idx },
                        React.createElement("a", { className: "panel-info-corner-links__item", href: link.href, target: link.target }, link.title)));
                })))));
        };
        return _this;
    }
    PanelHeaderCorner.prototype.renderCornerType = function (infoMode, content) {
        var theme = infoMode === InfoMode.Error ? 'error' : 'info';
        return (React.createElement(Tooltip, { content: content, placement: "top-start", theme: theme },
            React.createElement("div", { className: "panel-info-corner panel-info-corner--" + infoMode.toLowerCase() },
                React.createElement("i", { className: "fa" }),
                React.createElement("span", { className: "panel-info-corner-inner" }))));
    };
    PanelHeaderCorner.prototype.render = function () {
        var infoMode = this.getInfoMode();
        if (!infoMode) {
            return null;
        }
        if (infoMode === InfoMode.Error) {
            return this.renderCornerType(infoMode, this.props.error);
        }
        if (infoMode === InfoMode.Info || infoMode === InfoMode.Links) {
            return this.renderCornerType(infoMode, this.getInfoContent);
        }
        return null;
    };
    return PanelHeaderCorner;
}(Component));
export { PanelHeaderCorner };
export default PanelHeaderCorner;
//# sourceMappingURL=PanelHeaderCorner.js.map
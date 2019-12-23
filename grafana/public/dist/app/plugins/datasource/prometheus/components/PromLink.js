import * as tslib_1 from "tslib";
import _ from 'lodash';
import React, { Component } from 'react';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
var PromLink = /** @class */ (function (_super) {
    tslib_1.__extends(PromLink, _super);
    function PromLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { href: null };
        return _this;
    }
    PromLink.prototype.componentDidUpdate = function (prevProps) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var href;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(prevProps.panelData !== this.props.panelData && this.props.panelData.request)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getExternalLink()];
                    case 1:
                        href = _a.sent();
                        this.setState({ href: href });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PromLink.prototype.getExternalLink = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, query, panelData, target, datasourceName, datasource, _b, range, start, end, rangeDiff, endTime, options, queryOptions, expr, args;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, query = _a.query, panelData = _a.panelData;
                        target = panelData.request.targets.length > 0 ? panelData.request.targets[0] : { datasource: null };
                        datasourceName = target.datasource;
                        if (!datasourceName) return [3 /*break*/, 2];
                        return [4 /*yield*/, getDatasourceSrv().get(datasourceName)];
                    case 1:
                        _b = (_c.sent());
                        return [3 /*break*/, 3];
                    case 2:
                        _b = this.props.datasource;
                        _c.label = 3;
                    case 3:
                        datasource = _b;
                        range = panelData.request.range;
                        start = datasource.getPrometheusTime(range.from, false);
                        end = datasource.getPrometheusTime(range.to, true);
                        rangeDiff = Math.ceil(end - start);
                        endTime = range.to.utc().format('YYYY-MM-DD HH:mm');
                        options = {
                            interval: panelData.request.interval,
                        };
                        queryOptions = datasource.createQuery(query, options, start, end);
                        expr = {
                            'g0.expr': queryOptions.expr,
                            'g0.range_input': rangeDiff + 's',
                            'g0.end_input': endTime,
                            'g0.step_input': queryOptions.step,
                            'g0.tab': 0,
                        };
                        args = _.map(expr, function (v, k) {
                            return k + '=' + encodeURIComponent(v);
                        }).join('&');
                        return [2 /*return*/, datasource.directUrl + "/graph?" + args];
                }
            });
        });
    };
    PromLink.prototype.render = function () {
        var href = this.state.href;
        return (React.createElement("a", { href: href, target: "_blank", rel: "noopener" },
            React.createElement("i", { className: "fa fa-share-square-o" }),
            " Prometheus"));
    };
    return PromLink;
}(Component));
export default PromLink;
//# sourceMappingURL=PromLink.js.map
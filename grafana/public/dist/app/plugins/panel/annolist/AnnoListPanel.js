import { __awaiter, __extends, __generator, __makeTemplateObject, __read, __spread } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import { dateTime } from '@grafana/data';
import { Tooltip } from '@grafana/ui';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { AbstractList } from '@grafana/ui/src/components/List/AbstractList';
import { TagBadge } from 'app/core/components/TagFilter/TagBadge';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
import appEvents from 'app/core/app_events';
import { updateLocation } from 'app/core/actions';
import { store } from 'app/store/store';
import { cx, css } from 'emotion';
var AnnoListPanel = /** @class */ (function (_super) {
    __extends(AnnoListPanel, _super);
    function AnnoListPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.onAnnoClick = function (e, anno) {
            e.stopPropagation();
            var options = _this.props.options;
            var dashboardSrv = getDashboardSrv();
            var current = dashboardSrv.getCurrent();
            var params = {
                from: _this._timeOffset(anno.time, options.navigateBefore, true),
                to: _this._timeOffset(anno.time, options.navigateAfter, false),
            };
            if (options.navigateToPanel) {
                params.panelId = anno.panelId;
                params.fullscreen = true;
            }
            if (current.id === anno.dashboardId) {
                store.dispatch(updateLocation({
                    query: params,
                    partial: true,
                }));
                return;
            }
            getBackendSrv()
                .get('/api/search', { dashboardIds: anno.dashboardId })
                .then(function (res) {
                if (res && res.length && res[0].id === anno.dashboardId) {
                    var dash = res[0];
                    store.dispatch(updateLocation({
                        query: params,
                        path: dash.url,
                    }));
                    return;
                }
                appEvents.emit('alert-warning', ['Unknown Dashboard: ' + anno.dashboardId]);
            });
        };
        _this.onTagClick = function (e, tag, remove) {
            e.stopPropagation();
            var queryTags = remove ? _this.state.queryTags.filter(function (item) { return item !== tag; }) : __spread(_this.state.queryTags, [tag]);
            _this.setState({ queryTags: queryTags });
        };
        _this.onUserClick = function (e, anno) {
            e.stopPropagation();
            _this.setState({
                queryUser: {
                    id: anno.userId,
                    login: anno.login,
                    email: anno.email,
                },
            });
        };
        _this.onClearUser = function () {
            _this.setState({
                queryUser: undefined,
            });
        };
        _this.renderTags = function (tags, remove) {
            if (!tags || !tags.length) {
                return null;
            }
            return (React.createElement(React.Fragment, null, tags.map(function (tag) {
                return (React.createElement("span", { key: tag, onClick: function (e) { return _this.onTagClick(e, tag, remove); }, className: "pointer" },
                    React.createElement(TagBadge, { label: tag, removeIcon: remove, count: 0 })));
            })));
        };
        _this.renderItem = function (anno, index) {
            var options = _this.props.options;
            var showUser = options.showUser, showTags = options.showTags, showTime = options.showTime;
            var dashboard = getDashboardSrv().getCurrent();
            return (React.createElement("div", { className: "dashlist-item" },
                React.createElement("span", { className: "dashlist-link pointer", onClick: function (e) {
                        _this.onAnnoClick(e, anno);
                    } },
                    React.createElement("span", { className: cx([
                            'dashlist-title',
                            css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                margin-right: 8px;\n              "], ["\n                margin-right: 8px;\n              "]))),
                        ]) }, anno.text),
                    React.createElement("span", { className: "pluginlist-message" },
                        anno.login && showUser && (React.createElement("span", { className: "graph-annotation" },
                            React.createElement(Tooltip, { content: React.createElement("span", null,
                                    "Created by:",
                                    React.createElement("br", null),
                                    " ",
                                    anno.email), theme: "info", placement: "top" },
                                React.createElement("span", { onClick: function (e) { return _this.onUserClick(e, anno); }, className: "graph-annotation__user" },
                                    React.createElement("img", { src: anno.avatarUrl }))))),
                        showTags && _this.renderTags(anno.tags, false)),
                    React.createElement("span", { className: "pluginlist-version" }, showTime && React.createElement("span", null, dashboard.formatDate(anno.time))))));
        };
        _this.state = {
            annotations: [],
            timeInfo: '',
            loaded: false,
            queryTags: [],
        };
        return _this;
    }
    AnnoListPanel.prototype.componentDidMount = function () {
        this.doSearch();
    };
    AnnoListPanel.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, options = _a.options, timeRange = _a.timeRange;
        var needsQuery = options !== prevProps.options ||
            this.state.queryTags !== prevState.queryTags ||
            this.state.queryUser !== prevState.queryUser ||
            timeRange !== prevProps.timeRange;
        if (needsQuery) {
            this.doSearch();
        }
    };
    AnnoListPanel.prototype.doSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a, queryUser, queryTags, params, timeInfo, timeRange, annotations;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = this.props.options;
                        _a = this.state, queryUser = _a.queryUser, queryTags = _a.queryTags;
                        params = {
                            tags: options.tags,
                            limit: options.limit,
                            type: 'annotation',
                        };
                        if (options.onlyFromThisDashboard) {
                            params.dashboardId = getDashboardSrv().getCurrent().id;
                        }
                        timeInfo = '';
                        if (options.onlyInTimeRange) {
                            timeRange = this.props.timeRange;
                            params.from = timeRange.from.valueOf();
                            params.to = timeRange.to.valueOf();
                        }
                        else {
                            timeInfo = 'All Time';
                        }
                        if (queryUser) {
                            params.userId = queryUser.id;
                        }
                        if (options.tags && options.tags.length) {
                            params.tags = options.tags;
                        }
                        if (queryTags.length) {
                            params.tags = params.tags ? __spread(params.tags, queryTags) : queryTags;
                        }
                        return [4 /*yield*/, getBackendSrv().get('/api/annotations', params)];
                    case 1:
                        annotations = _b.sent();
                        this.setState({
                            annotations: annotations,
                            timeInfo: timeInfo,
                            loaded: true,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    AnnoListPanel.prototype._timeOffset = function (time, offset, subtract) {
        if (subtract === void 0) { subtract = false; }
        var incr = 5;
        var unit = 'm';
        var parts = /^(\d+)(\w)/.exec(offset);
        if (parts && parts.length === 3) {
            incr = parseInt(parts[1], 10);
            unit = parts[2];
        }
        var t = dateTime(time);
        if (subtract) {
            incr *= -1;
        }
        return t.add(incr, unit).valueOf();
    };
    AnnoListPanel.prototype.render = function () {
        var height = this.props.height;
        var _a = this.state, loaded = _a.loaded, annotations = _a.annotations, queryUser = _a.queryUser, queryTags = _a.queryTags;
        if (!loaded) {
            return React.createElement("div", null, "loading...");
        }
        // Previously we showed inidication that it covered all time
        // { timeInfo && (
        //   <span className="panel-time-info">
        //     <i className="fa fa-clock-o" /> {timeInfo}
        //   </span>
        // )}
        var hasFilter = queryUser || queryTags.length > 0;
        return (React.createElement("div", { style: { height: height, overflow: 'scroll' } },
            hasFilter && (React.createElement("div", null,
                React.createElement("b", null, "Filter: \u00A0 "),
                queryUser && (React.createElement("span", { onClick: this.onClearUser, className: "pointer" }, queryUser.email)),
                queryTags.length > 0 && this.renderTags(queryTags, true))),
            annotations.length < 1 && React.createElement("div", { className: "panel-alert-list__no-alerts" }, "No Annotations Found"),
            React.createElement(AbstractList, { items: annotations, renderItem: this.renderItem, getItemKey: function (item) {
                    return item.id + '';
                }, className: "dashlist" })));
    };
    return AnnoListPanel;
}(PureComponent));
export { AnnoListPanel };
var templateObject_1;
//# sourceMappingURL=AnnoListPanel.js.map
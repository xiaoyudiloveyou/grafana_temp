import { __awaiter, __extends, __generator, __values } from "tslib";
// Libraries
import React, { PureComponent } from 'react';
// Types
import { Select } from '@grafana/ui';
import config from 'app/core/config';
import { css } from 'emotion';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { SHARED_DASHBODARD_QUERY } from './types';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
import { filterPanelDataToQuery } from 'app/features/dashboard/panel_editor/QueryEditorRow';
function getQueryDisplayText(query) {
    return JSON.stringify(query);
}
var DashboardQueryEditor = /** @class */ (function (_super) {
    __extends(DashboardQueryEditor, _super);
    function DashboardQueryEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.onPanelChanged = function (id) {
            var onChange = _this.props.onChange;
            var query = _this.getQuery();
            query.panelId = id;
            onChange(query);
            // Update the
            _this.props.panel.refresh();
        };
        _this.getPanelDescription = function (panel) {
            var defaultDatasource = _this.state.defaultDatasource;
            var dsname = panel.datasource ? panel.datasource : defaultDatasource;
            if (panel.targets.length === 1) {
                return '1 query to ' + dsname;
            }
            return panel.targets.length + ' queries to ' + dsname;
        };
        _this.state = {
            defaultDatasource: '',
            results: [],
        };
        return _this;
    }
    DashboardQueryEditor.prototype.getQuery = function () {
        var panel = this.props.panel;
        return panel.targets[0];
    };
    DashboardQueryEditor.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.componentDidUpdate(null);
                return [2 /*return*/];
            });
        });
    };
    DashboardQueryEditor.prototype.componentDidUpdate = function (prevProps) {
        return __awaiter(this, void 0, void 0, function () {
            var panelData, query, defaultDS, dashboard, panel, mainDS, info, _a, _b, query_1, ds, _c, fmt, qData, queryData, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        panelData = this.props.panelData;
                        if (!(!prevProps || prevProps.panelData !== panelData)) return [3 /*break*/, 13];
                        query = this.props.panel.targets[0];
                        return [4 /*yield*/, getDatasourceSrv().get(null)];
                    case 1:
                        defaultDS = _e.sent();
                        dashboard = getDashboardSrv().getCurrent();
                        panel = dashboard.getPanelById(query.panelId);
                        if (!panel) {
                            this.setState({ defaultDatasource: defaultDS.name });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, getDatasourceSrv().get(panel.datasource)];
                    case 2:
                        mainDS = _e.sent();
                        info = [];
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 10, 11, 12]);
                        _a = __values(panel.targets), _b = _a.next();
                        _e.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 9];
                        query_1 = _b.value;
                        if (!query_1.datasource) return [3 /*break*/, 6];
                        return [4 /*yield*/, getDatasourceSrv().get(query_1.datasource)];
                    case 5:
                        _c = _e.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _c = mainDS;
                        _e.label = 7;
                    case 7:
                        ds = _c;
                        fmt = ds.getQueryDisplayText ? ds.getQueryDisplayText : getQueryDisplayText;
                        qData = filterPanelDataToQuery(panelData, query_1.refId);
                        queryData = qData ? qData : panelData;
                        info.push({
                            refId: query_1.refId,
                            query: fmt(query_1),
                            img: ds.meta.info.logos.small,
                            data: queryData.series,
                            error: queryData.error,
                        });
                        _e.label = 8;
                    case 8:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        this.setState({ defaultDatasource: defaultDS.name, results: info });
                        _e.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    DashboardQueryEditor.prototype.renderQueryData = function (editURL) {
        var results = this.state.results;
        return (React.createElement("div", null, results.map(function (target, index) {
            return (React.createElement("div", { className: "query-editor-row__header", key: index },
                React.createElement("div", { className: "query-editor-row__ref-id" },
                    React.createElement("img", { src: target.img, width: 16, className: css({ marginRight: '8px' }) }),
                    target.refId,
                    ":"),
                React.createElement("div", { className: "query-editor-row__collapsed-text" },
                    React.createElement("a", { href: editURL },
                        target.query,
                        "\u00A0",
                        React.createElement("i", { className: "fa fa-external-link" })))));
        })));
    };
    DashboardQueryEditor.prototype.render = function () {
        var e_2, _a;
        var _this = this;
        var dashboard = getDashboardSrv().getCurrent();
        var query = this.getQuery();
        var selected;
        var panels = [];
        try {
            for (var _b = __values(dashboard.panels), _c = _b.next(); !_c.done; _c = _b.next()) {
                var panel = _c.value;
                var plugin = config.panels[panel.type];
                if (!plugin) {
                    continue;
                }
                if (panel.targets && panel.datasource !== SHARED_DASHBODARD_QUERY) {
                    var item = {
                        value: panel.id,
                        label: panel.title ? panel.title : 'Panel ' + panel.id,
                        description: this.getPanelDescription(panel),
                        imgUrl: plugin.info.logos.small,
                    };
                    panels.push(item);
                    if (query.panelId === panel.id) {
                        selected = item;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (panels.length < 1) {
            return (React.createElement("div", { className: css({ padding: '10px' }) }, "This dashboard does not have other panels. Add queries to other panels and try again"));
        }
        // Same as current URL, but different panelId
        var editURL = "d/" + dashboard.uid + "/" + dashboard.title + "?&fullscreen&edit&panelId=" + query.panelId;
        return (React.createElement("div", null,
            React.createElement("div", { className: "gf-form" },
                React.createElement("div", { className: "gf-form-label" }, "Use results from panel"),
                React.createElement(Select, { placeholder: "Choose Panel", isSearchable: true, options: panels, value: selected, onChange: function (item) { return _this.onPanelChanged(item.value); } })),
            React.createElement("div", { className: css({ padding: '16px' }) }, query.panelId && this.renderQueryData(editURL))));
    };
    return DashboardQueryEditor;
}(PureComponent));
export { DashboardQueryEditor };
//# sourceMappingURL=DashboardQueryEditor.js.map
import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { css } from 'emotion';
// Components
import { EditorTabBody } from './EditorTabBody';
import { DataSourcePicker } from 'app/core/components/Select/DataSourcePicker';
import { QueryInspector } from './QueryInspector';
import { QueryOptions } from './QueryOptions';
import { PanelOptionsGroup, TransformationsEditor, AlphaNotice, PluginState, } from '@grafana/ui';
import { QueryEditorRow } from './QueryEditorRow';
// Services
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { getBackendSrv } from 'app/core/services/backend_srv';
import config from 'app/core/config';
import { LoadingState, DefaultTimeRange } from '@grafana/data';
import { PluginHelp } from 'app/core/components/PluginHelp/PluginHelp';
import { isSharedDashboardQuery, DashboardQueryEditor } from 'app/plugins/datasource/dashboard';
var QueriesTab = /** @class */ (function (_super) {
    tslib_1.__extends(QueriesTab, _super);
    function QueriesTab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.datasources = getDatasourceSrv().getMetricSources();
        _this.backendSrv = getBackendSrv();
        _this.state = {
            isLoadingHelp: false,
            currentDS: _this.findCurrentDataSource(),
            helpContent: null,
            isPickerOpen: false,
            isAddingMixed: false,
            scrollTop: 0,
            data: {
                state: LoadingState.NotStarted,
                series: [],
                timeRange: DefaultTimeRange,
            },
        };
        _this.onChangeDataSource = function (datasource) {
            var e_1, _a;
            var panel = _this.props.panel;
            var currentDS = _this.state.currentDS;
            // switching to mixed
            if (datasource.meta.mixed) {
                panel.targets.forEach(function (target) {
                    target.datasource = panel.datasource;
                    if (!target.datasource) {
                        target.datasource = config.defaultDatasource;
                    }
                });
            }
            else if (currentDS) {
                // if switching from mixed
                if (currentDS.meta.mixed) {
                    try {
                        for (var _b = tslib_1.__values(panel.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var target = _c.value;
                            delete target.datasource;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else if (currentDS.meta.id !== datasource.meta.id) {
                    // we are changing data source type, clear queries
                    panel.targets = [{ refId: 'A' }];
                }
            }
            panel.datasource = datasource.value;
            panel.refresh();
            _this.setState({
                currentDS: datasource,
            });
        };
        _this.renderQueryInspector = function () {
            var panel = _this.props.panel;
            return React.createElement(QueryInspector, { panel: panel });
        };
        _this.renderHelp = function () {
            return React.createElement(PluginHelp, { plugin: _this.state.currentDS.meta, type: "query_help" });
        };
        _this.onAddQuery = function (query) {
            _this.props.panel.addQuery(query);
            _this.setState({ scrollTop: _this.state.scrollTop + 100000 });
        };
        _this.onAddQueryClick = function () {
            if (_this.state.currentDS.meta.mixed) {
                _this.setState({ isAddingMixed: true });
                return;
            }
            _this.onAddQuery();
        };
        _this.onRemoveQuery = function (query) {
            var panel = _this.props.panel;
            var index = _.indexOf(panel.targets, query);
            panel.targets.splice(index, 1);
            panel.refresh();
            _this.forceUpdate();
        };
        _this.onMoveQuery = function (query, direction) {
            var panel = _this.props.panel;
            var index = _.indexOf(panel.targets, query);
            // @ts-ignore
            _.move(panel.targets, index, index + direction);
            _this.forceUpdate();
        };
        _this.renderToolbar = function () {
            var _a = _this.state, currentDS = _a.currentDS, isAddingMixed = _a.isAddingMixed;
            var showAddButton = !(isAddingMixed || isSharedDashboardQuery(currentDS.name));
            return (React.createElement(React.Fragment, null,
                React.createElement(DataSourcePicker, { datasources: _this.datasources, onChange: _this.onChangeDataSource, current: currentDS }),
                React.createElement("div", { className: "flex-grow-1" }),
                showAddButton && (React.createElement("button", { className: "btn navbar-button", onClick: _this.onAddQueryClick }, "Add Query")),
                isAddingMixed && _this.renderMixedPicker()));
        };
        _this.renderMixedPicker = function () {
            return (React.createElement(DataSourcePicker, { datasources: _this.datasources, onChange: _this.onAddMixedQuery, current: null, autoFocus: true, onBlur: _this.onMixedPickerBlur, openMenuOnFocus: true }));
        };
        _this.onAddMixedQuery = function (datasource) {
            _this.onAddQuery({ datasource: datasource.name });
            _this.setState({ isAddingMixed: false, scrollTop: _this.state.scrollTop + 10000 });
        };
        _this.onMixedPickerBlur = function () {
            _this.setState({ isAddingMixed: false });
        };
        _this.onQueryChange = function (query, index) {
            _this.props.panel.changeQuery(query, index);
            _this.forceUpdate();
        };
        _this.onTransformersChange = function (transformers) {
            _this.props.panel.setTransformations(transformers);
            _this.forceUpdate();
        };
        _this.setScrollTop = function (event) {
            var target = event.target;
            _this.setState({ scrollTop: target.scrollTop });
        };
        return _this;
    }
    QueriesTab.prototype.componentDidMount = function () {
        var _this = this;
        var panel = this.props.panel;
        var queryRunner = panel.getQueryRunner();
        this.querySubscription = queryRunner.getData(false).subscribe({
            next: function (data) { return _this.onPanelDataUpdate(data); },
        });
    };
    QueriesTab.prototype.componentWillUnmount = function () {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
            this.querySubscription = null;
        }
    };
    QueriesTab.prototype.onPanelDataUpdate = function (data) {
        this.setState({ data: data });
    };
    QueriesTab.prototype.findCurrentDataSource = function () {
        var panel = this.props.panel;
        return this.datasources.find(function (datasource) { return datasource.value === panel.datasource; }) || this.datasources[0];
    };
    QueriesTab.prototype.render = function () {
        var _this = this;
        var _a = this.props, panel = _a.panel, dashboard = _a.dashboard;
        var _b = this.state, currentDS = _b.currentDS, scrollTop = _b.scrollTop, data = _b.data;
        var queryInspector = {
            title: 'Query Inspector',
            render: this.renderQueryInspector,
        };
        var dsHelp = {
            heading: 'Help',
            icon: 'fa fa-question',
            render: this.renderHelp,
        };
        var enableTransformations = config.featureToggles.transformations;
        return (React.createElement(EditorTabBody, { heading: "Query", renderToolbar: this.renderToolbar, toolbarItems: [queryInspector, dsHelp], setScrollTop: this.setScrollTop, scrollTop: scrollTop },
            React.createElement(React.Fragment, null,
                isSharedDashboardQuery(currentDS.name) ? (React.createElement(DashboardQueryEditor, { panel: panel, panelData: data, onChange: function (query) { return _this.onQueryChange(query, 0); } })) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "query-editor-rows" }, panel.targets.map(function (query, index) { return (React.createElement(QueryEditorRow, { dataSourceValue: query.datasource || panel.datasource, key: query.refId, panel: panel, dashboard: dashboard, data: data, query: query, onChange: function (query) { return _this.onQueryChange(query, index); }, onRemoveQuery: _this.onRemoveQuery, onAddQuery: _this.onAddQuery, onMoveQuery: _this.onMoveQuery, inMixedMode: currentDS.meta.mixed })); })),
                    React.createElement(PanelOptionsGroup, null,
                        React.createElement(QueryOptions, { panel: panel, datasource: currentDS })))),
                enableTransformations && (React.createElement(PanelOptionsGroup, { title: React.createElement(React.Fragment, null,
                        "Query results",
                        React.createElement(AlphaNotice, { state: PluginState.alpha, className: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n                      margin-left: 16px;\n                    "], ["\n                      margin-left: 16px;\n                    "]))) })) }, this.state.data.state !== LoadingState.NotStarted && (React.createElement(TransformationsEditor, { transformations: this.props.panel.transformations || [], onChange: this.onTransformersChange, dataFrames: data.series })))))));
    };
    return QueriesTab;
}(PureComponent));
export { QueriesTab };
var templateObject_1;
//# sourceMappingURL=QueriesTab.js.map
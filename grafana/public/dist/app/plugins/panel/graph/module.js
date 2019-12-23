import { __assign, __extends, __values } from "tslib";
import './graph';
import './series_overrides_ctrl';
import './thresholds_form';
import './time_regions_form';
import template from './template';
import _ from 'lodash';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import { DataProcessor } from './data_processor';
import { axesEditorComponent } from './axes_editor';
import config from 'app/core/config';
import { getColorFromHexRgbOrName } from '@grafana/ui';
import { getProcessedDataFrames } from 'app/features/dashboard/state/runRequest';
import { GraphContextMenuCtrl } from './GraphContextMenuCtrl';
import { getDataLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';
var GraphCtrl = /** @class */ (function (_super) {
    __extends(GraphCtrl, _super);
    /** @ngInject */
    function GraphCtrl($scope, $injector, annotationsSrv) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.annotationsSrv = annotationsSrv;
        _this.hiddenSeries = {};
        _this.seriesList = [];
        _this.dataList = [];
        _this.annotations = [];
        _this.colors = [];
        _this.linkVariableSuggestions = [];
        _this.panelDefaults = {
            // datasource name, null = default datasource
            datasource: null,
            // sets client side (flot) or native graphite png renderer (png)
            renderer: 'flot',
            yaxes: [
                {
                    label: null,
                    show: true,
                    logBase: 1,
                    min: null,
                    max: null,
                    format: 'short',
                },
                {
                    label: null,
                    show: true,
                    logBase: 1,
                    min: null,
                    max: null,
                    format: 'short',
                },
            ],
            xaxis: {
                show: true,
                mode: 'time',
                name: null,
                values: [],
                buckets: null,
            },
            yaxis: {
                align: false,
                alignLevel: null,
            },
            // show/hide lines
            lines: true,
            // fill factor
            fill: 1,
            // fill factor
            fillGradient: 0,
            // line width in pixels
            linewidth: 1,
            // show/hide dashed line
            dashes: false,
            // length of a dash
            dashLength: 10,
            // length of space between two dashes
            spaceLength: 10,
            // show hide points
            points: false,
            // point radius in pixels
            pointradius: 2,
            // show hide bars
            bars: false,
            // enable/disable stacking
            stack: false,
            // stack percentage mode
            percentage: false,
            // legend options
            legend: {
                show: true,
                values: false,
                min: false,
                max: false,
                current: false,
                total: false,
                avg: false,
            },
            // how null points should be handled
            nullPointMode: 'null',
            // staircase line mode
            steppedLine: false,
            // tooltip options
            tooltip: {
                value_type: 'individual',
                shared: true,
                sort: 0,
            },
            // time overrides
            timeFrom: null,
            timeShift: null,
            // metric queries
            targets: [{}],
            // series color overrides
            aliasColors: {},
            // other style overrides
            seriesOverrides: [],
            thresholds: [],
            timeRegions: [],
            options: {
                dataLinks: [],
            },
        };
        _this.onColorChange = function (series, color) {
            series.setColor(getColorFromHexRgbOrName(color, config.theme.type));
            _this.panel.aliasColors[series.alias] = color;
            _this.render();
        };
        _this.onToggleSeries = function (hiddenSeries) {
            _this.hiddenSeries = hiddenSeries;
            _this.render();
        };
        _this.onToggleSort = function (sortBy, sortDesc) {
            _this.panel.legend.sort = sortBy;
            _this.panel.legend.sortDesc = sortDesc;
            _this.render();
        };
        _this.onToggleAxis = function (info) {
            var override = _.find(_this.panel.seriesOverrides, { alias: info.alias });
            if (!override) {
                override = { alias: info.alias };
                _this.panel.seriesOverrides.push(override);
            }
            override.yaxis = info.yaxis;
            _this.render();
        };
        _this.onContextMenuClose = function () {
            _this.contextMenuCtrl.toggleMenu();
        };
        _this.formatDate = function (date, format) {
            return _this.dashboard.formatDate.apply(_this.dashboard, [date, format]);
        };
        _this.getDataFrameByRefId = function (refId) {
            return _this.dataList.filter(function (dataFrame) { return dataFrame.refId === refId; })[0];
        };
        _.defaults(_this.panel, _this.panelDefaults);
        _.defaults(_this.panel.tooltip, _this.panelDefaults.tooltip);
        _.defaults(_this.panel.legend, _this.panelDefaults.legend);
        _.defaults(_this.panel.xaxis, _this.panelDefaults.xaxis);
        _.defaults(_this.panel.options, _this.panelDefaults.options);
        _this.useDataFrames = true;
        _this.processor = new DataProcessor(_this.panel);
        _this.contextMenuCtrl = new GraphContextMenuCtrl($scope);
        _this.events.on('render', _this.onRender.bind(_this));
        _this.events.on('data-frames-received', _this.onDataFramesReceived.bind(_this));
        _this.events.on('data-error', _this.onDataError.bind(_this));
        _this.events.on('data-snapshot-load', _this.onDataSnapshotLoad.bind(_this));
        _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
        _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));
        _this.onDataLinksChange = _this.onDataLinksChange.bind(_this);
        return _this;
    }
    GraphCtrl.prototype.onInitEditMode = function () {
        this.addEditorTab('Display options', 'public/app/plugins/panel/graph/tab_display.html');
        this.addEditorTab('Axes', axesEditorComponent);
        this.addEditorTab('Legend', 'public/app/plugins/panel/graph/tab_legend.html');
        this.addEditorTab('Thresholds & Time Regions', 'public/app/plugins/panel/graph/tab_thresholds_time_regions.html');
        this.addEditorTab('Data links', 'public/app/plugins/panel/graph/tab_drilldown_links.html');
        this.subTabIndex = 0;
    };
    GraphCtrl.prototype.onInitPanelActions = function (actions) {
        actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
        actions.push({ text: 'Toggle legend', click: 'ctrl.toggleLegend()', shortcut: 'p l' });
    };
    GraphCtrl.prototype.issueQueries = function (datasource) {
        var _this = this;
        this.annotationsPromise = this.annotationsSrv.getAnnotations({
            dashboard: this.dashboard,
            panel: this.panel,
            range: this.range,
        });
        /* Wait for annotationSrv requests to get datasources to
         * resolve before issuing queries. This allows the annotations
         * service to fire annotations queries before graph queries
         * (but not wait for completion). This resolves
         * issue 11806.
         */
        return this.annotationsSrv.datasourcePromises.then(function (r) {
            return _super.prototype.issueQueries.call(_this, datasource);
        });
    };
    GraphCtrl.prototype.zoomOut = function (evt) {
        this.publishAppEvent('zoom-out', 2);
    };
    GraphCtrl.prototype.onDataSnapshotLoad = function (snapshotData) {
        this.annotationsPromise = this.annotationsSrv.getAnnotations({
            dashboard: this.dashboard,
            panel: this.panel,
            range: this.range,
        });
        var frames = getProcessedDataFrames(snapshotData);
        this.onDataFramesReceived(frames);
    };
    GraphCtrl.prototype.onDataError = function (err) {
        this.seriesList = [];
        this.annotations = [];
        this.render([]);
    };
    GraphCtrl.prototype.onDataFramesReceived = function (data) {
        var e_1, _a;
        var _this = this;
        this.dataList = data;
        this.seriesList = this.processor.getSeriesList({
            dataList: this.dataList,
            range: this.range,
        });
        this.linkVariableSuggestions = getDataLinksVariableSuggestions(data);
        this.dataWarning = null;
        var datapointsCount = this.seriesList.reduce(function (prev, series) {
            return prev + series.datapoints.length;
        }, 0);
        if (datapointsCount === 0) {
            this.dataWarning = {
                title: 'No data',
                tip: 'No data returned from query',
            };
        }
        else {
            try {
                for (var _b = __values(this.seriesList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var series = _c.value;
                    if (series.isOutsideRange) {
                        this.dataWarning = {
                            title: 'Data outside time range',
                            tip: 'Can be caused by timezone mismatch or missing time filter in query',
                        };
                        break;
                    }
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
        this.annotationsPromise.then(function (result) {
            _this.loading = false;
            _this.alertState = result.alertState;
            _this.annotations = result.annotations;
            _this.render(_this.seriesList);
        }, function () {
            _this.loading = false;
            _this.render(_this.seriesList);
        });
    };
    GraphCtrl.prototype.onRender = function () {
        var e_2, _a;
        if (!this.seriesList) {
            return;
        }
        try {
            for (var _b = __values(this.seriesList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var series = _c.value;
                series.applySeriesOverrides(this.panel.seriesOverrides);
                if (series.unit) {
                    this.panel.yaxes[series.yaxis - 1].format = series.unit;
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
    };
    GraphCtrl.prototype.onDataLinksChange = function (dataLinks) {
        this.panel.updateOptions(__assign(__assign({}, this.panel.options), { dataLinks: dataLinks }));
    };
    GraphCtrl.prototype.addSeriesOverride = function (override) {
        this.panel.seriesOverrides.push(override || {});
    };
    GraphCtrl.prototype.removeSeriesOverride = function (override) {
        this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override);
        this.render();
    };
    GraphCtrl.prototype.toggleLegend = function () {
        this.panel.legend.show = !this.panel.legend.show;
        this.render();
    };
    GraphCtrl.prototype.legendValuesOptionChanged = function () {
        var legend = this.panel.legend;
        legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
        this.render();
    };
    GraphCtrl.prototype.exportCsv = function () {
        var scope = this.$scope.$new(true);
        scope.seriesList = this.seriesList;
        this.publishAppEvent('show-modal', {
            templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
            scope: scope,
            modalClass: 'modal--narrow',
        });
    };
    GraphCtrl.template = template;
    return GraphCtrl;
}(MetricsPanelCtrl));
export { GraphCtrl, GraphCtrl as PanelCtrl };
//# sourceMappingURL=module.js.map
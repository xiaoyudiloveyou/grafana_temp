import { __assign, __extends, __values } from "tslib";
import _ from 'lodash';
import $ from 'jquery';
import 'vendor/flot/jquery.flot';
import 'vendor/flot/jquery.flot.gauge';
import 'app/features/panel/panellinks/link_srv';
import { convertOldAngularValueMapping, getColorFromHexRgbOrName, getDisplayProcessor, getFlotPairs, } from '@grafana/ui';
import kbn from 'app/core/utils/kbn';
import config from 'app/core/config';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import { fieldReducers, FieldType, reduceField, ReducerID, } from '@grafana/data';
import { getProcessedDataFrames } from 'app/features/dashboard/state/runRequest';
var BASE_FONT_SIZE = 38;
var SingleStatCtrl = /** @class */ (function (_super) {
    __extends(SingleStatCtrl, _super);
    /** @ngInject */
    function SingleStatCtrl($scope, $injector, linkSrv, $sanitize) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.linkSrv = linkSrv;
        _this.$sanitize = $sanitize;
        _this.data = {};
        _this.fieldNames = [];
        _this.valueNameOptions = [
            { value: 'min', text: 'Min' },
            { value: 'max', text: 'Max' },
            { value: 'avg', text: 'Average' },
            { value: 'current', text: 'Current' },
            { value: 'total', text: 'Total' },
            { value: 'name', text: 'Name' },
            { value: 'first', text: 'First' },
            { value: 'delta', text: 'Delta' },
            { value: 'diff', text: 'Difference' },
            { value: 'range', text: 'Range' },
            { value: 'last_time', text: 'Time of last point' },
        ];
        // Set and populate defaults
        _this.panelDefaults = {
            links: [],
            datasource: null,
            maxDataPoints: 100,
            interval: null,
            targets: [{}],
            cacheTimeout: null,
            format: 'none',
            prefix: '',
            postfix: '',
            nullText: null,
            valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
            mappingTypes: [{ name: 'value to text', value: 1 }, { name: 'range to text', value: 2 }],
            rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
            mappingType: 1,
            nullPointMode: 'connected',
            valueName: 'avg',
            prefixFontSize: '50%',
            valueFontSize: '80%',
            postfixFontSize: '50%',
            thresholds: '',
            colorBackground: false,
            colorValue: false,
            colors: ['#299c46', 'rgba(237, 129, 40, 0.89)', '#d44a3a'],
            sparkline: {
                show: false,
                full: false,
                ymin: null,
                ymax: null,
                lineColor: 'rgb(31, 120, 193)',
                fillColor: 'rgba(31, 118, 189, 0.18)',
            },
            gauge: {
                show: false,
                minValue: 0,
                maxValue: 100,
                thresholdMarkers: true,
                thresholdLabels: false,
            },
            tableColumn: '',
        };
        _.defaults(_this.panel, _this.panelDefaults);
        _this.events.on('data-frames-received', _this.onFramesReceived.bind(_this));
        _this.events.on('data-error', _this.onDataError.bind(_this));
        _this.events.on('data-snapshot-load', _this.onSnapshotLoad.bind(_this));
        _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
        _this.useDataFrames = true;
        _this.onSparklineColorChange = _this.onSparklineColorChange.bind(_this);
        _this.onSparklineFillChange = _this.onSparklineFillChange.bind(_this);
        return _this;
    }
    SingleStatCtrl.prototype.onInitEditMode = function () {
        this.fontSizes = ['20%', '30%', '50%', '70%', '80%', '100%', '110%', '120%', '150%', '170%', '200%'];
        this.addEditorTab('Options', 'public/app/plugins/panel/singlestat/editor.html', 2);
        this.addEditorTab('Value Mappings', 'public/app/plugins/panel/singlestat/mappings.html', 3);
        this.unitFormats = kbn.getUnitFormats();
    };
    SingleStatCtrl.prototype.migrateToGaugePanel = function (migrate) {
        if (migrate) {
            this.onPluginTypeChange(config.panels['gauge']);
        }
        else {
            this.panel.gauge.show = false;
            this.render();
        }
    };
    SingleStatCtrl.prototype.setUnitFormat = function (subItem) {
        this.panel.format = subItem.value;
        this.refresh();
    };
    SingleStatCtrl.prototype.onDataError = function (err) {
        this.handleDataFrames([]);
    };
    SingleStatCtrl.prototype.onSnapshotLoad = function (dataList) {
        this.onFramesReceived(getProcessedDataFrames(dataList));
    };
    SingleStatCtrl.prototype.onFramesReceived = function (frames) {
        var panel = this.panel;
        if (frames && frames.length > 1) {
            this.data = {
                value: 0,
                display: {
                    text: 'Only queries that return single series/table is supported',
                    numeric: NaN,
                },
            };
            this.render();
            return;
        }
        var distinct = getDistinctNames(frames);
        var fieldInfo = distinct.byName[panel.tableColumn]; //
        this.fieldNames = distinct.names;
        if (!fieldInfo) {
            fieldInfo = distinct.first;
        }
        if (!fieldInfo) {
            var processor = getDisplayProcessor({
                config: {
                    mappings: convertOldAngularValueMapping(this.panel),
                    noValue: 'No Data',
                },
                theme: config.theme,
            });
            // When we don't have any field
            this.data = {
                value: null,
                display: processor(null),
            };
        }
        else {
            this.data = this.processField(fieldInfo);
        }
        this.render();
    };
    SingleStatCtrl.prototype.processField = function (fieldInfo) {
        var _a = this, panel = _a.panel, dashboard = _a.dashboard;
        var name = fieldInfo.field.config.title || fieldInfo.field.name;
        var calc = panel.valueName;
        var calcField = fieldInfo.field;
        var val = undefined;
        if ('name' === calc) {
            val = name;
        }
        else {
            if ('last_time' === calc) {
                if (fieldInfo.frame.firstTimeField) {
                    calcField = fieldInfo.frame.firstTimeField;
                    calc = ReducerID.last;
                }
            }
            // Normalize functions (avg -> mean, etc)
            var r = fieldReducers.getIfExists(calc);
            if (r) {
                calc = r.id;
                // With strings, don't accidentally use a math function
                if (calcField.type === FieldType.string) {
                    var avoid = [ReducerID.mean, ReducerID.sum];
                    if (avoid.includes(calc)) {
                        calc = panel.valueName = ReducerID.first;
                    }
                }
            }
            else {
                calc = ReducerID.lastNotNull;
            }
            // Calculate the value
            val = reduceField({
                field: calcField,
                reducers: [calc],
            })[calc];
        }
        var processor = getDisplayProcessor({
            config: __assign(__assign({}, fieldInfo.field.config), { unit: panel.format, decimals: panel.decimals, mappings: convertOldAngularValueMapping(panel) }),
            theme: config.theme,
            isUtc: dashboard.isTimezoneUtc && dashboard.isTimezoneUtc(),
        });
        var sparkline = [];
        var data = {
            field: fieldInfo.field,
            value: val,
            display: processor(val),
            scopedVars: _.extend({}, panel.scopedVars),
            sparkline: sparkline,
        };
        data.scopedVars['__name'] = { value: name };
        panel.tableColumn = this.fieldNames.length > 1 ? name : '';
        // Get the fields for a sparkline
        if (panel.sparkline && panel.sparkline.show && fieldInfo.frame.firstTimeField) {
            data.sparkline = getFlotPairs({
                xField: fieldInfo.frame.firstTimeField,
                yField: fieldInfo.field,
                nullValueMode: panel.nullPointMode,
            });
        }
        return data;
    };
    SingleStatCtrl.prototype.canModifyText = function () {
        return !this.panel.gauge.show;
    };
    SingleStatCtrl.prototype.setColoring = function (options) {
        if (options.background) {
            this.panel.colorValue = false;
            this.panel.colors = ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'];
        }
        else {
            this.panel.colorBackground = false;
            this.panel.colors = ['rgba(50, 172, 45, 0.97)', 'rgba(237, 129, 40, 0.89)', 'rgba(245, 54, 54, 0.9)'];
        }
        this.render();
    };
    SingleStatCtrl.prototype.invertColorOrder = function () {
        var tmp = this.panel.colors[0];
        this.panel.colors[0] = this.panel.colors[2];
        this.panel.colors[2] = tmp;
        this.render();
    };
    SingleStatCtrl.prototype.onColorChange = function (panelColorIndex) {
        var _this = this;
        return function (color) {
            _this.panel.colors[panelColorIndex] = color;
            _this.render();
        };
    };
    SingleStatCtrl.prototype.onSparklineColorChange = function (newColor) {
        this.panel.sparkline.lineColor = newColor;
        this.render();
    };
    SingleStatCtrl.prototype.onSparklineFillChange = function (newColor) {
        this.panel.sparkline.fillColor = newColor;
        this.render();
    };
    SingleStatCtrl.prototype.removeValueMap = function (map) {
        var index = _.indexOf(this.panel.valueMaps, map);
        this.panel.valueMaps.splice(index, 1);
        this.render();
    };
    SingleStatCtrl.prototype.addValueMap = function () {
        this.panel.valueMaps.push({ value: '', op: '=', text: '' });
    };
    SingleStatCtrl.prototype.removeRangeMap = function (rangeMap) {
        var index = _.indexOf(this.panel.rangeMaps, rangeMap);
        this.panel.rangeMaps.splice(index, 1);
        this.render();
    };
    SingleStatCtrl.prototype.addRangeMap = function () {
        this.panel.rangeMaps.push({ from: '', to: '', text: '' });
    };
    SingleStatCtrl.prototype.link = function (scope, elem, attrs, ctrl) {
        var $location = this.$location;
        var linkSrv = this.linkSrv;
        var $timeout = this.$timeout;
        var $sanitize = this.$sanitize;
        var panel = ctrl.panel;
        var templateSrv = this.templateSrv;
        var linkInfo = null;
        var $panelContainer = elem.find('.panel-container');
        elem = elem.find('.singlestat-panel');
        function applyColoringThresholds(valueString) {
            var data = ctrl.data;
            var color = getColorForValue(data, data.value);
            if (color) {
                return '<span style="color:' + color + '">' + valueString + '</span>';
            }
            return valueString;
        }
        function getSpan(className, fontSizePercent, applyColoring, value) {
            value = $sanitize(templateSrv.replace(value, ctrl.data.scopedVars));
            value = applyColoring ? applyColoringThresholds(value) : value;
            var pixelSize = (parseInt(fontSizePercent, 10) / 100) * BASE_FONT_SIZE;
            return '<span class="' + className + '" style="font-size:' + pixelSize + 'px">' + value + '</span>';
        }
        function getBigValueHtml() {
            var data = ctrl.data;
            var body = '<div class="singlestat-panel-value-container">';
            if (panel.prefix) {
                body += getSpan('singlestat-panel-prefix', panel.prefixFontSize, panel.colorPrefix, panel.prefix);
            }
            body += getSpan('singlestat-panel-value', panel.valueFontSize, panel.colorValue, data.display.text);
            if (panel.postfix) {
                body += getSpan('singlestat-panel-postfix', panel.postfixFontSize, panel.colorPostfix, panel.postfix);
            }
            body += '</div>';
            return body;
        }
        function getValueText() {
            var data = ctrl.data;
            var result = panel.prefix ? templateSrv.replace(panel.prefix, data.scopedVars) : '';
            result += data.display.text;
            result += panel.postfix ? templateSrv.replace(panel.postfix, data.scopedVars) : '';
            return result;
        }
        function addGauge() {
            var data = ctrl.data;
            var width = elem.width();
            var height = elem.height();
            // Allow to use a bit more space for wide gauges
            var dimension = Math.min(width, height * 1.3);
            ctrl.invalidGaugeRange = false;
            if (panel.gauge.minValue > panel.gauge.maxValue) {
                ctrl.invalidGaugeRange = true;
                return;
            }
            var plotCanvas = $('<div></div>');
            var plotCss = {
                top: '5px',
                margin: 'auto',
                position: 'relative',
                height: height * 0.9 + 'px',
                width: dimension + 'px',
            };
            plotCanvas.css(plotCss);
            var thresholds = [];
            for (var i = 0; i < data.thresholds.length; i++) {
                thresholds.push({
                    value: data.thresholds[i],
                    color: data.colorMap[i],
                });
            }
            thresholds.push({
                value: panel.gauge.maxValue,
                color: data.colorMap[data.colorMap.length - 1],
            });
            var bgColor = config.bootData.user.lightTheme ? 'rgb(230,230,230)' : 'rgb(38,38,38)';
            var fontScale = parseInt(panel.valueFontSize, 10) / 100;
            var fontSize = Math.min(dimension / 5, 100) * fontScale;
            // Reduce gauge width if threshold labels enabled
            var gaugeWidthReduceRatio = panel.gauge.thresholdLabels ? 1.5 : 1;
            var gaugeWidth = Math.min(dimension / 6, 60) / gaugeWidthReduceRatio;
            var thresholdMarkersWidth = gaugeWidth / 5;
            var thresholdLabelFontSize = fontSize / 2.5;
            var options = {
                series: {
                    gauges: {
                        gauge: {
                            min: panel.gauge.minValue,
                            max: panel.gauge.maxValue,
                            background: { color: bgColor },
                            border: { color: null },
                            shadow: { show: false },
                            width: gaugeWidth,
                        },
                        frame: { show: false },
                        label: { show: false },
                        layout: { margin: 0, thresholdWidth: 0 },
                        cell: { border: { width: 0 } },
                        threshold: {
                            values: thresholds,
                            label: {
                                show: panel.gauge.thresholdLabels,
                                margin: thresholdMarkersWidth + 1,
                                font: { size: thresholdLabelFontSize },
                            },
                            show: panel.gauge.thresholdMarkers,
                            width: thresholdMarkersWidth,
                        },
                        value: {
                            color: panel.colorValue ? getColorForValue(data, data.display.numeric) : null,
                            formatter: function () {
                                return getValueText();
                            },
                            font: {
                                size: fontSize,
                                family: config.theme.typography.fontFamily.sansSerif,
                            },
                        },
                        show: true,
                    },
                },
            };
            elem.append(plotCanvas);
            var plotSeries = {
                data: [[0, data.value]],
            };
            $.plot(plotCanvas, [plotSeries], options);
        }
        function addSparkline() {
            var data = ctrl.data;
            var width = elem.width();
            if (width < 30) {
                // element has not gotten it's width yet
                // delay sparkline render
                setTimeout(addSparkline, 30);
                return;
            }
            if (!data.sparkline || !data.sparkline.length) {
                // no sparkline data
                return;
            }
            var height = ctrl.height;
            var plotCanvas = $('<div></div>');
            var plotCss = {};
            plotCss.position = 'absolute';
            plotCss.bottom = '0px';
            if (panel.sparkline.full) {
                plotCss.left = '0px';
                plotCss.width = width + 'px';
                var dynamicHeightMargin = height <= 100 ? 5 : Math.round(height / 100) * 15 + 5;
                plotCss.height = height - dynamicHeightMargin + 'px';
            }
            else {
                plotCss.left = '0px';
                plotCss.width = width + 'px';
                plotCss.height = Math.floor(height * 0.25) + 'px';
            }
            plotCanvas.css(plotCss);
            var options = {
                legend: { show: false },
                series: {
                    lines: {
                        show: true,
                        fill: 1,
                        lineWidth: 1,
                        fillColor: getColorFromHexRgbOrName(panel.sparkline.fillColor, config.theme.type),
                        zero: false,
                    },
                },
                yaxis: {
                    show: false,
                    min: panel.sparkline.ymin,
                    max: panel.sparkline.ymax,
                },
                xaxis: {
                    show: false,
                    mode: 'time',
                    min: ctrl.range.from.valueOf(),
                    max: ctrl.range.to.valueOf(),
                },
                grid: { hoverable: false, show: false },
            };
            elem.append(plotCanvas);
            var plotSeries = {
                data: data.sparkline,
                color: getColorFromHexRgbOrName(panel.sparkline.lineColor, config.theme.type),
            };
            $.plot(plotCanvas, [plotSeries], options);
        }
        function render() {
            if (!ctrl.data) {
                return;
            }
            var data = ctrl.data, panel = ctrl.panel;
            // get thresholds
            data.thresholds = panel.thresholds
                ? panel.thresholds.split(',').map(function (strVale) {
                    return Number(strVale.trim());
                })
                : [];
            // Map panel colors to hex or rgb/a values
            if (panel.colors) {
                data.colorMap = panel.colors.map(function (color) { return getColorFromHexRgbOrName(color, config.theme.type); });
            }
            var body = panel.gauge.show ? '' : getBigValueHtml();
            if (panel.colorBackground) {
                var color = getColorForValue(data, data.display.numeric);
                if (color) {
                    $panelContainer.css('background-color', color);
                    if (scope.fullscreen) {
                        elem.css('background-color', color);
                    }
                    else {
                        elem.css('background-color', '');
                    }
                }
                else {
                    $panelContainer.css('background-color', '');
                    elem.css('background-color', '');
                }
            }
            else {
                $panelContainer.css('background-color', '');
                elem.css('background-color', '');
            }
            elem.html(body);
            if (panel.sparkline.show) {
                addSparkline();
            }
            if (panel.gauge.show) {
                addGauge();
            }
            elem.toggleClass('pointer', panel.links.length > 0);
            if (panel.links.length > 0) {
                linkInfo = linkSrv.getDataLinkUIModel(panel.links[0], data.scopedVars, {});
            }
            else {
                linkInfo = null;
            }
        }
        function hookupDrilldownLinkTooltip() {
            // drilldown link tooltip
            var drilldownTooltip = $('<div id="tooltip" class="">hello</div>"');
            elem.mouseleave(function () {
                if (panel.links.length === 0) {
                    return;
                }
                $timeout(function () {
                    drilldownTooltip.detach();
                });
            });
            elem.click(function (evt) {
                if (!linkInfo) {
                    return;
                }
                // ignore title clicks in title
                if ($(evt).parents('.panel-header').length > 0) {
                    return;
                }
                if (linkInfo.target === '_blank') {
                    window.open(linkInfo.href, '_blank');
                    return;
                }
                if (linkInfo.href.indexOf('http') === 0) {
                    window.location.href = linkInfo.href;
                }
                else {
                    $timeout(function () {
                        $location.url(linkInfo.href);
                    });
                }
                drilldownTooltip.detach();
            });
            elem.mousemove(function (e) {
                if (!linkInfo) {
                    return;
                }
                drilldownTooltip.text('click to go to: ' + linkInfo.title);
                drilldownTooltip.place_tt(e.pageX, e.pageY - 50);
            });
        }
        hookupDrilldownLinkTooltip();
        this.events.on('render', function () {
            render();
            ctrl.renderingCompleted();
        });
    };
    SingleStatCtrl.templateUrl = 'module.html';
    return SingleStatCtrl;
}(MetricsPanelCtrl));
function getColorForValue(data, value) {
    if (!_.isFinite(value)) {
        return null;
    }
    for (var i = data.thresholds.length; i > 0; i--) {
        if (value >= data.thresholds[i - 1]) {
            return data.colorMap[i];
        }
    }
    return _.first(data.colorMap);
}
function getDistinctNames(data) {
    var e_1, _a, e_2, _b;
    var distinct = {
        byName: {},
        names: [],
    };
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var frame = data_1_1.value;
            var info = { frame: frame };
            try {
                for (var _c = (e_2 = void 0, __values(frame.fields)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var field = _d.value;
                    if (field.type === FieldType.time) {
                        if (!info.firstTimeField) {
                            info.firstTimeField = field;
                        }
                    }
                    else {
                        var f = { field: field, frame: info };
                        if (!distinct.first) {
                            distinct.first = f;
                        }
                        var t = field.config.title;
                        if (t && !distinct.byName[t]) {
                            distinct.byName[t] = f;
                            distinct.names.push(t);
                        }
                        t = field.name;
                        if (t && !distinct.byName[t]) {
                            distinct.byName[t] = f;
                            distinct.names.push(t);
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return distinct;
}
export { SingleStatCtrl, SingleStatCtrl as PanelCtrl, getColorForValue };
//# sourceMappingURL=module.js.map
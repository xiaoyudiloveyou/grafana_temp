import * as tslib_1 from "tslib";
jest.mock('app/features/annotations/all', function () { return ({
    EventManager: function () {
        return {
            on: function () { },
            addFlotEvents: function () { },
        };
    },
}); });
jest.mock('app/core/core', function () { return ({
    coreModule: {
        directive: function () { },
    },
    appEvents: {
        on: function () { },
    },
}); });
import '../module';
import { GraphCtrl } from '../module';
import { MetricsPanelCtrl } from 'app/features/panel/metrics_panel_ctrl';
import { PanelCtrl } from 'app/features/panel/panel_ctrl';
import config from 'app/core/config';
import TimeSeries from 'app/core/time_series2';
import $ from 'jquery';
import { graphDirective } from '../graph';
import { dateTime } from '@grafana/data';
var ctx = {};
var ctrl;
var scope = {
    ctrl: {},
    range: {
        from: dateTime([2015, 1, 1]),
        to: dateTime([2015, 11, 20]),
    },
    $on: function () { },
};
var link;
describe('grafanaGraph', function () {
    var setupCtx = function (beforeRender) {
        config.bootData = {
            user: {
                lightTheme: false,
            },
        };
        GraphCtrl.prototype = tslib_1.__assign({}, MetricsPanelCtrl.prototype, PanelCtrl.prototype, GraphCtrl.prototype, { height: 200, panel: {
                events: {
                    on: function () { },
                },
                legend: {},
                grid: {},
                yaxes: [
                    {
                        min: null,
                        max: null,
                        format: 'short',
                        logBase: 1,
                    },
                    {
                        min: null,
                        max: null,
                        format: 'short',
                        logBase: 1,
                    },
                ],
                thresholds: [],
                xaxis: {},
                seriesOverrides: [],
                tooltip: {
                    shared: true,
                },
            }, renderingCompleted: jest.fn(), hiddenSeries: {}, dashboard: {
                getTimezone: function () { return 'browser'; },
            }, range: {
                from: dateTime([2015, 1, 1, 10]),
                to: dateTime([2015, 1, 1, 22]),
            }, annotationsSrv: {
                getAnnotations: function () { return Promise.resolve({}); },
            } });
        ctx.data = [];
        ctx.data.push(new TimeSeries({
            datapoints: [[1, 1], [2, 2]],
            alias: 'series1',
        }));
        ctx.data.push(new TimeSeries({
            datapoints: [[10, 1], [20, 2]],
            alias: 'series2',
        }));
        ctrl = new GraphCtrl({
            $on: function () { },
        }, {
            get: function () { },
        }, {});
        // @ts-ignore
        $.plot = ctrl.plot = jest.fn();
        scope.ctrl = ctrl;
        link = graphDirective({}, {}, {}).link(scope, {
            width: function () { return 500; },
            mouseleave: function () { },
            bind: function () { },
        });
        if (typeof beforeRender === 'function') {
            beforeRender();
        }
        link.data = ctx.data;
        //Emulate functions called by event listeners
        link.buildFlotPairs(link.data);
        link.renderPanel();
        ctx.plotData = ctrl.plot.mock.calls[0][1];
        ctx.plotOptions = ctrl.plot.mock.calls[0][2];
    };
    describe('simple lines options', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.lines = true;
                ctrl.panel.fill = 5;
                ctrl.panel.linewidth = 3;
                ctrl.panel.steppedLine = true;
            });
        });
        it('should configure plot with correct options', function () {
            expect(ctx.plotOptions.series.lines.show).toBe(true);
            expect(ctx.plotOptions.series.lines.fill).toBe(0.5);
            expect(ctx.plotOptions.series.lines.lineWidth).toBe(3);
            expect(ctx.plotOptions.series.lines.steps).toBe(true);
        });
    });
    describe('sorting stacked series as legend. disabled', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.legend.sort = undefined;
                ctrl.panel.stack = false;
            });
        });
        it('should not modify order of time series', function () {
            expect(ctx.plotData[0].alias).toBe('series1');
            expect(ctx.plotData[1].alias).toBe('series2');
        });
    });
    describe('sorting stacked series as legend. min descending order', function () {
        beforeEach(function () {
            setupCtx(function () {
                var sortKey = 'min';
                ctrl.panel.legend.sort = sortKey;
                ctrl.panel.legend.sortDesc = true;
                ctrl.panel.legend.alignAsTable = true;
                ctrl.panel.legend[sortKey] = true;
                ctrl.panel.stack = true;
            });
        });
        it('highest value should be first', function () {
            expect(ctx.plotData[0].alias).toBe('series2');
            expect(ctx.plotData[1].alias).toBe('series1');
        });
    });
    describe('sorting stacked series as legend. min ascending order', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.legend.sort = 'min';
                ctrl.panel.legend.sortDesc = false;
                ctrl.panel.stack = true;
            });
        });
        it('lowest value should be first', function () {
            expect(ctx.plotData[0].alias).toBe('series1');
            expect(ctx.plotData[1].alias).toBe('series2');
        });
    });
    describe('sorting stacked series as legend. stacking disabled', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.legend.sort = 'min';
                ctrl.panel.legend.sortDesc = true;
                ctrl.panel.stack = false;
            });
        });
        it('highest value should be first', function () {
            expect(ctx.plotData[0].alias).toBe('series1');
            expect(ctx.plotData[1].alias).toBe('series2');
        });
    });
    describe('sorting stacked series as legend. current descending order', function () {
        beforeEach(function () {
            setupCtx(function () {
                var sortKey = 'current';
                ctrl.panel.legend.sort = sortKey;
                ctrl.panel.legend.sortDesc = true;
                ctrl.panel.legend.alignAsTable = true;
                ctrl.panel.legend[sortKey] = true;
                ctrl.panel.stack = true;
            });
        });
        it('highest last value should be first', function () {
            expect(ctx.plotData[0].alias).toBe('series2');
            expect(ctx.plotData[1].alias).toBe('series1');
        });
    });
    describe('stacked series should not sort if legend is not as table or sort key column is not visible', function () {
        beforeEach(function () {
            setupCtx(function () {
                var sortKey = 'min';
                ctrl.panel.legend.sort = sortKey;
                ctrl.panel.legend.sortDesc = true;
                ctrl.panel.legend.alignAsTable = false;
                ctrl.panel.legend[sortKey] = false;
                ctrl.panel.stack = true;
            });
        });
        it('highest value should be first', function () {
            expect(ctx.plotData[0].alias).toBe('series1');
            expect(ctx.plotData[1].alias).toBe('series2');
        });
    });
    describe('when logBase is log 10', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctx.data[0] = new TimeSeries({
                    datapoints: [[2000, 1], [0.002, 2], [0, 3], [-1, 4]],
                    alias: 'seriesAutoscale',
                });
                ctx.data[0].yaxis = 1;
                ctx.data[1] = new TimeSeries({
                    datapoints: [[2000, 1], [0.002, 2], [0, 3], [-1, 4]],
                    alias: 'seriesFixedscale',
                });
                ctx.data[1].yaxis = 2;
                ctrl.panel.yaxes[0].logBase = 10;
                ctrl.panel.yaxes[1].logBase = 10;
                ctrl.panel.yaxes[1].min = '0.05';
                ctrl.panel.yaxes[1].max = '1500';
            });
        });
        it('should apply axis transform, autoscaling (if necessary) and ticks', function () {
            var axisAutoscale = ctx.plotOptions.yaxes[0];
            expect(axisAutoscale.transform(100)).toBe(2);
            expect(axisAutoscale.inverseTransform(-3)).toBeCloseTo(0.001);
            expect(axisAutoscale.min).toBeCloseTo(0.001);
            expect(axisAutoscale.max).toBe(10000);
            expect(axisAutoscale.ticks.length).toBeCloseTo(8);
            expect(axisAutoscale.ticks[0]).toBeCloseTo(0.001);
            if (axisAutoscale.ticks.length === 7) {
                expect(axisAutoscale.ticks[axisAutoscale.ticks.length - 1]).toBeCloseTo(1000);
            }
            else {
                expect(axisAutoscale.ticks[axisAutoscale.ticks.length - 1]).toBe(10000);
            }
            var axisFixedscale = ctx.plotOptions.yaxes[1];
            expect(axisFixedscale.min).toBe(0.05);
            expect(axisFixedscale.max).toBe(1500);
            expect(axisFixedscale.ticks.length).toBe(5);
            expect(axisFixedscale.ticks[0]).toBe(0.1);
            expect(axisFixedscale.ticks[4]).toBe(1000);
        });
    });
    describe('when logBase is log 10 and data points contain only zeroes', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.yaxes[0].logBase = 10;
                ctx.data[0] = new TimeSeries({
                    datapoints: [[0, 1], [0, 2], [0, 3], [0, 4]],
                    alias: 'seriesAutoscale',
                });
                ctx.data[0].yaxis = 1;
            });
        });
        it('should not set min and max and should create some fake ticks', function () {
            var axisAutoscale = ctx.plotOptions.yaxes[0];
            expect(axisAutoscale.transform(100)).toBe(2);
            expect(axisAutoscale.inverseTransform(-3)).toBeCloseTo(0.001);
            expect(axisAutoscale.min).toBe(undefined);
            expect(axisAutoscale.max).toBe(undefined);
            expect(axisAutoscale.ticks.length).toBe(2);
            expect(axisAutoscale.ticks[0]).toBe(1);
            expect(axisAutoscale.ticks[1]).toBe(2);
        });
    });
    // y-min set 0 is a special case for log scale,
    // this approximates it by setting min to 0.1
    describe('when logBase is log 10 and y-min is set to 0 and auto min is > 0.1', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.yaxes[0].logBase = 10;
                ctrl.panel.yaxes[0].min = '0';
                ctx.data[0] = new TimeSeries({
                    datapoints: [[2000, 1], [4, 2], [500, 3], [3000, 4]],
                    alias: 'seriesAutoscale',
                });
                ctx.data[0].yaxis = 1;
            });
        });
        it('should set min to 0.1 and add a tick for 0.1', function () {
            var axisAutoscale = ctx.plotOptions.yaxes[0];
            expect(axisAutoscale.transform(100)).toBe(2);
            expect(axisAutoscale.inverseTransform(-3)).toBeCloseTo(0.001);
            expect(axisAutoscale.min).toBe(0.1);
            expect(axisAutoscale.max).toBe(10000);
            expect(axisAutoscale.ticks.length).toBe(6);
            expect(axisAutoscale.ticks[0]).toBe(0.1);
            expect(axisAutoscale.ticks[5]).toBe(10000);
        });
    });
    describe('when logBase is log 2 and y-min is set to 0 and num of ticks exceeds max', function () {
        beforeEach(function () {
            setupCtx(function () {
                var heightForApprox5Ticks = 125;
                ctrl.height = heightForApprox5Ticks;
                ctrl.panel.yaxes[0].logBase = 2;
                ctrl.panel.yaxes[0].min = '0';
                ctx.data[0] = new TimeSeries({
                    datapoints: [[2000, 1], [4, 2], [500, 3], [3000, 4], [10000, 5], [100000, 6]],
                    alias: 'seriesAutoscale',
                });
                ctx.data[0].yaxis = 1;
            });
        });
        it('should regenerate ticks so that if fits on the y-axis', function () {
            var axisAutoscale = ctx.plotOptions.yaxes[0];
            expect(axisAutoscale.min).toBe(0.1);
            expect(axisAutoscale.ticks.length).toBe(8);
            expect(axisAutoscale.ticks[0]).toBe(0.1);
            expect(axisAutoscale.ticks[7]).toBe(262144);
            expect(axisAutoscale.max).toBe(262144);
        });
        it('should set axis max to be max tick value', function () {
            expect(ctx.plotOptions.yaxes[0].max).toBe(262144);
        });
    });
    describe('dashed lines options', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.lines = true;
                ctrl.panel.linewidth = 2;
                ctrl.panel.dashes = true;
            });
        });
        it('should configure dashed plot with correct options', function () {
            expect(ctx.plotOptions.series.lines.show).toBe(true);
            expect(ctx.plotOptions.series.dashes.lineWidth).toBe(2);
            expect(ctx.plotOptions.series.dashes.show).toBe(true);
        });
    });
    describe('should use timeStep for barWidth', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.bars = true;
                ctx.data[0] = new TimeSeries({
                    datapoints: [[1, 10], [2, 20]],
                    alias: 'series1',
                });
            });
        });
        it('should set barWidth', function () {
            expect(ctx.plotOptions.series.bars.barWidth).toBe(1 / 1.5);
        });
    });
    describe('series option overrides, fill & points', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.lines = true;
                ctrl.panel.fill = 5;
                ctx.data[0].zindex = 10;
                ctx.data[1].alias = 'test';
                ctx.data[1].lines = { fill: 0.001 };
                ctx.data[1].points = { show: true };
            });
        });
        it('should match second series and fill zero, and enable points', function () {
            expect(ctx.plotOptions.series.lines.fill).toBe(0.5);
            expect(ctx.plotData[1].lines.fill).toBe(0.001);
            expect(ctx.plotData[1].points.show).toBe(true);
        });
    });
    describe('should order series order according to zindex', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctx.data[1].zindex = 1;
                ctx.data[0].zindex = 10;
            });
        });
        it('should move zindex 2 last', function () {
            expect(ctx.plotData[0].alias).toBe('series2');
            expect(ctx.plotData[1].alias).toBe('series1');
        });
    });
    describe('when series is hidden', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.hiddenSeries = { series2: true };
            });
        });
        it('should remove datapoints and disable stack', function () {
            expect(ctx.plotData[0].alias).toBe('series1');
            expect(ctx.plotData[1].data.length).toBe(0);
            expect(ctx.plotData[1].stack).toBe(false);
        });
    });
    describe('when stack and percent', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.percentage = true;
                ctrl.panel.stack = true;
            });
        });
        it('should show percentage', function () {
            var axis = ctx.plotOptions.yaxes[0];
            expect(axis.tickFormatter(100, axis)).toBe('100%');
        });
    });
    describe('when panel too narrow to show x-axis dates in same granularity as wide panels', function () {
        //Set width to 10px
        describe('and the range is less than 24 hours', function () {
            beforeEach(function () {
                setupCtx(function () {
                    ctrl.range.from = dateTime([2015, 1, 1, 10]);
                    ctrl.range.to = dateTime([2015, 1, 1, 22]);
                });
            });
            it('should format dates as hours minutes', function () {
                var axis = ctx.plotOptions.xaxis;
                expect(axis.timeformat).toBe('%H:%M');
            });
        });
        describe('and the range is less than one year', function () {
            beforeEach(function () {
                setupCtx(function () {
                    ctrl.range.from = dateTime([2015, 1, 1]);
                    ctrl.range.to = dateTime([2015, 11, 20]);
                });
            });
            it('should format dates as month days', function () {
                var axis = ctx.plotOptions.xaxis;
                expect(axis.timeformat).toBe('%m/%d');
            });
        });
    });
    describe('when graph is histogram, and enable stack', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.stack = true;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
                ctx.data[1] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series2',
                });
            });
        });
        it('should calculate correct histogram', function () {
            expect(ctx.plotData[0].data[0][0]).toBe(100);
            expect(ctx.plotData[0].data[0][1]).toBe(2);
            expect(ctx.plotData[1].data[0][0]).toBe(100);
            expect(ctx.plotData[1].data[0][1]).toBe(2);
        });
    });
    describe('when graph is histogram, and some series are hidden', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = { series2: true };
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
                ctx.data[1] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series2',
                });
            });
        });
        it('should calculate correct histogram', function () {
            expect(ctx.plotData[0].data[0][0]).toBe(100);
            expect(ctx.plotData[0].data[0][1]).toBe(2);
        });
    });
    describe('when graph is histogram, and xaxis min is set', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 150;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should not contain values lower than min', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(200);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is zero', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 0;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should not contain values lower than zero', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is null', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = null;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is undefined', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = undefined;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis max is set', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = 250;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should not contain values greater than max', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(200);
        });
    });
    describe('when graph is histogram, and xaxis max is zero', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = 0;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should not contain values greater than zero', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
        });
    });
    describe('when graph is histogram, and xaxis max is null', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = null;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis max should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis max is undefined', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = undefined;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis max should not should node affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(-100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min and max are set', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 150;
                ctrl.panel.xaxis.max = 250;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should not contain values lower than min and greater than max', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(200);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(200);
        });
    });
    describe('when graph is histogram, and xaxis min and max are zero', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 0;
                ctrl.panel.xaxis.max = 0;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[-100, 1], [100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis max should be ignored otherwise the bucketSize is zero', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min and max are null', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = null;
                ctrl.panel.xaxis.max = null;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min and max should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min and max are undefined', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = undefined;
                ctrl.panel.xaxis.max = undefined;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min and max should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is greater than xaxis max', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 150;
                ctrl.panel.xaxis.max = 100;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis max should be ignored otherwise the bucketSize is negative', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(200);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    // aaa
    describe('when graph is histogram, and xaxis min is greater than the maximum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 301;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min should be ignored otherwise the bucketSize is negative', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is equal to the maximum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 300;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min should be ignored otherwise the bucketSize is zero', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis min is lower than the minimum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.min = 99;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('xaxis min should not affect the histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
    describe('when graph is histogram, and xaxis max is equal to the minimum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = 100;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should calculate correct histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
        });
    });
    describe('when graph is histogram, and xaxis max is a lower than the minimum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = 99;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should calculate empty histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(nonZero.length).toBe(0);
        });
    });
    describe('when graph is histogram, and xaxis max is greater than the maximum value', function () {
        beforeEach(function () {
            setupCtx(function () {
                ctrl.panel.xaxis.mode = 'histogram';
                ctrl.panel.xaxis.max = 301;
                ctrl.panel.stack = false;
                ctrl.hiddenSeries = {};
                ctx.data[0] = new TimeSeries({
                    datapoints: [[100, 1], [100, 2], [200, 3], [300, 4]],
                    alias: 'series1',
                });
            });
        });
        it('should calculate correct histogram', function () {
            var nonZero = ctx.plotData[0].data.filter(function (t) { return t[1] > 0; });
            expect(Math.min.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(100);
            expect(Math.max.apply(Math, nonZero.map(function (t) { return t[0]; }))).toBe(300);
        });
    });
});
//# sourceMappingURL=graph.test.js.map
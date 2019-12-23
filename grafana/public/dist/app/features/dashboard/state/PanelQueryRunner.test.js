var _this = this;
import * as tslib_1 from "tslib";
import { PanelQueryRunner } from './PanelQueryRunner';
import { dateTime } from '@grafana/data';
jest.mock('app/core/services/backend_srv');
// Defined within setup functions
var panelsForCurrentDashboardMock = {};
jest.mock('app/features/dashboard/services/DashboardSrv', function () { return ({
    getDashboardSrv: function () {
        return {
            getCurrent: function () {
                return {
                    getPanelById: function (id) {
                        return panelsForCurrentDashboardMock[id];
                    },
                };
            },
        };
    },
}); });
function describeQueryRunnerScenario(description, scenarioFn) {
    var _this = this;
    describe(description, function () {
        var setupFn = function () { };
        var ctx = {
            widthPixels: 200,
            scopedVars: {
                server: { text: 'Server1', value: 'server-1' },
            },
            runner: new PanelQueryRunner(),
            setup: function (fn) {
                setupFn = fn;
            },
        };
        var response = {
            data: [{ target: 'hello', datapoints: [[1, 1000], [2, 2000]] }],
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, args;
            return tslib_1.__generator(this, function (_a) {
                setupFn();
                datasource = {
                    name: 'TestDB',
                    interval: ctx.dsInterval,
                    query: function (options) {
                        ctx.queryCalledWith = options;
                        return Promise.resolve(response);
                    },
                    testDatasource: jest.fn(),
                };
                args = {
                    datasource: datasource,
                    scopedVars: ctx.scopedVars,
                    minInterval: ctx.minInterval,
                    widthPixels: ctx.widthPixels,
                    maxDataPoints: ctx.maxDataPoints,
                    timeRange: {
                        from: dateTime().subtract(1, 'days'),
                        to: dateTime(),
                        raw: { from: '1h', to: 'now' },
                    },
                    panelId: 1,
                    queries: [{ refId: 'A', test: 1 }],
                };
                ctx.runner = new PanelQueryRunner();
                ctx.runner.getData().subscribe({
                    next: function (data) {
                        ctx.res = data;
                        ctx.events.push(data);
                    },
                });
                panelsForCurrentDashboardMock[1] = {
                    id: 1,
                    getQueryRunner: function () {
                        return ctx.runner;
                    },
                };
                ctx.events = [];
                ctx.runner.run(args);
                return [2 /*return*/];
            });
        }); });
        scenarioFn(ctx);
    });
}
describe('PanelQueryRunner', function () {
    describeQueryRunnerScenario('simple scenario', function (ctx) {
        it('should set requestId on request', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.requestId).toBe('Q100');
                return [2 /*return*/];
            });
        }); });
        it('should set datasource name on request', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.targets[0].datasource).toBe('TestDB');
                return [2 /*return*/];
            });
        }); });
        it('should pass scopedVars to datasource with interval props', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.scopedVars.server.text).toBe('Server1');
                expect(ctx.queryCalledWith.scopedVars.__interval.text).toBe('5m');
                expect(ctx.queryCalledWith.scopedVars.__interval_ms.text).toBe('300000');
                return [2 /*return*/];
            });
        }); });
    });
    describeQueryRunnerScenario('with no maxDataPoints or minInterval', function (ctx) {
        ctx.setup(function () {
            ctx.maxDataPoints = null;
            ctx.widthPixels = 200;
        });
        it('should return data', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.res.error).toBeUndefined();
                expect(ctx.res.series.length).toBe(1);
                return [2 /*return*/];
            });
        }); });
        it('should use widthPixels as maxDataPoints', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.maxDataPoints).toBe(200);
                return [2 /*return*/];
            });
        }); });
        it('should calculate interval based on width', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.interval).toBe('5m');
                return [2 /*return*/];
            });
        }); });
        it('fast query should only publish 1 data events', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.events.length).toBe(1);
                return [2 /*return*/];
            });
        }); });
    });
    describeQueryRunnerScenario('with no panel min interval but datasource min interval', function (ctx) {
        ctx.setup(function () {
            ctx.widthPixels = 20000;
            ctx.dsInterval = '15s';
        });
        it('should limit interval to data source min interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.interval).toBe('15s');
                return [2 /*return*/];
            });
        }); });
    });
    describeQueryRunnerScenario('with panel min interval and data source min interval', function (ctx) {
        ctx.setup(function () {
            ctx.widthPixels = 20000;
            ctx.dsInterval = '15s';
            ctx.minInterval = '30s';
        });
        it('should limit interval to panel min interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.interval).toBe('30s');
                return [2 /*return*/];
            });
        }); });
    });
    describeQueryRunnerScenario('with maxDataPoints', function (ctx) {
        ctx.setup(function () {
            ctx.maxDataPoints = 10;
        });
        it('should pass maxDataPoints if specified', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                expect(ctx.queryCalledWith.maxDataPoints).toBe(10);
                return [2 /*return*/];
            });
        }); });
    });
});
//# sourceMappingURL=PanelQueryRunner.test.js.map
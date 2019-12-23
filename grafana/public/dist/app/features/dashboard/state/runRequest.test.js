var _this = this;
import * as tslib_1 from "tslib";
import { LoadingState, dateTime } from '@grafana/data';
import { Observable } from 'rxjs';
import { runRequest } from './runRequest';
import { deepFreeze } from '../../../../test/core/redux/reducerTester';
jest.mock('app/core/services/backend_srv');
var ScenarioCtx = /** @class */ (function () {
    function ScenarioCtx() {
        this.isUnsubbed = false;
        this.setupFn = function () { };
        this.wasStarted = false;
        this.error = null;
        this.toStartTime = dateTime();
        this.fromStartTime = dateTime();
    }
    ScenarioCtx.prototype.reset = function () {
        var _this = this;
        this.wasStarted = false;
        this.isUnsubbed = false;
        this.results = [];
        this.request = {
            range: {
                from: this.toStartTime,
                to: this.fromStartTime,
                raw: { from: '1h', to: 'now' },
            },
            targets: [
                {
                    refId: 'A',
                },
            ],
        };
        this.ds = {
            query: function (request) {
                return new Observable(function (subscriber) {
                    _this.subscriber = subscriber;
                    _this.wasStarted = true;
                    if (_this.error) {
                        throw _this.error;
                    }
                    return function () {
                        _this.isUnsubbed = true;
                    };
                });
            },
        };
    };
    ScenarioCtx.prototype.start = function () {
        var _this = this;
        this.subscription = runRequest(this.ds, this.request).subscribe({
            next: function (data) {
                _this.results.push(data);
            },
        });
    };
    ScenarioCtx.prototype.emitPacket = function (packet) {
        this.subscriber.next(packet);
    };
    ScenarioCtx.prototype.setup = function (fn) {
        this.setupFn = fn;
    };
    return ScenarioCtx;
}());
function runRequestScenario(desc, fn) {
    describe(desc, function () {
        var ctx = new ScenarioCtx();
        beforeEach(function () {
            ctx.reset();
            return ctx.setupFn();
        });
        fn(ctx);
    });
}
describe('runRequest', function () {
    runRequestScenario('with no queries', function (ctx) {
        ctx.setup(function () {
            ctx.request.targets = [];
            ctx.start();
        });
        it('should emit empty result with loading state done', function () {
            expect(ctx.wasStarted).toBe(false);
            expect(ctx.results[0].state).toBe(LoadingState.Done);
        });
    });
    runRequestScenario('After first response', function (ctx) {
        ctx.setup(function () {
            ctx.start();
            ctx.emitPacket({
                data: [{ name: 'Data' }],
            });
        });
        it('should emit single result with loading state done', function () {
            expect(ctx.wasStarted).toBe(true);
            expect(ctx.results.length).toBe(1);
        });
    });
    runRequestScenario('After tree responses, 2 with different keys', function (ctx) {
        ctx.setup(function () {
            ctx.start();
            ctx.emitPacket({
                data: [{ name: 'DataA-1' }],
                key: 'A',
            });
            ctx.emitPacket({
                data: [{ name: 'DataA-2' }],
                key: 'A',
            });
            ctx.emitPacket({
                data: [{ name: 'DataB-1' }],
                key: 'B',
            });
        });
        it('should emit 3 seperate results', function () {
            expect(ctx.results.length).toBe(3);
        });
        it('should combine results and return latest data for key A', function () {
            expect(ctx.results[2].series).toEqual([{ name: 'DataA-2' }, { name: 'DataB-1' }]);
        });
        it('should have loading state Done', function () {
            expect(ctx.results[2].state).toEqual(LoadingState.Done);
        });
    });
    runRequestScenario('After response with state Streaming', function (ctx) {
        ctx.setup(function () {
            ctx.start();
            ctx.emitPacket({
                data: [{ name: 'DataA-1' }],
                key: 'A',
            });
            ctx.emitPacket({
                data: [{ name: 'DataA-2' }],
                key: 'A',
                state: LoadingState.Streaming,
            });
        });
        it('should have loading state Streaming', function () {
            expect(ctx.results[1].state).toEqual(LoadingState.Streaming);
        });
    });
    runRequestScenario('If no response after 250ms', function (ctx) {
        ctx.setup(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.start();
                        return [4 /*yield*/, sleep(250)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit 1 result with loading state', function () {
            expect(ctx.results.length).toBe(1);
            expect(ctx.results[0].state).toBe(LoadingState.Loading);
        });
    });
    runRequestScenario('on thrown error', function (ctx) {
        ctx.setup(function () {
            ctx.error = new Error('Ohh no');
            ctx.start();
        });
        it('should emit 1 error result', function () {
            expect(ctx.results[0].error.message).toBe('Ohh no');
            expect(ctx.results[0].state).toBe(LoadingState.Error);
        });
    });
    runRequestScenario('If time range is relative', function (ctx) {
        ctx.setup(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // any changes to ctx.request.range will throw and state would become LoadingState.Error
                        deepFreeze(ctx.request.range);
                        ctx.start();
                        // wait a bit
                        return [4 /*yield*/, sleep(20)];
                    case 1:
                        // wait a bit
                        _a.sent();
                        ctx.emitPacket({ data: [{ name: 'DataB-1' }] });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add the correct timeRange property and the request range should not be mutated', function () {
            expect(ctx.results[0].timeRange.to.valueOf()).toBeDefined();
            expect(ctx.results[0].timeRange.to.valueOf()).not.toBe(ctx.toStartTime.valueOf());
            expect(ctx.results[0].timeRange.to.valueOf()).not.toBe(ctx.results[0].request.range.to.valueOf());
            expectThatRangeHasNotMutated(ctx);
        });
    });
    runRequestScenario('If time range is not relative', function (ctx) {
        ctx.setup(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.request.range.raw.from = ctx.fromStartTime;
                        ctx.request.range.raw.to = ctx.toStartTime;
                        // any changes to ctx.request.range will throw and state would become LoadingState.Error
                        deepFreeze(ctx.request.range);
                        ctx.start();
                        // wait a bit
                        return [4 /*yield*/, sleep(20)];
                    case 1:
                        // wait a bit
                        _a.sent();
                        ctx.emitPacket({ data: [{ name: 'DataB-1' }] });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add the correct timeRange property and the request range should not be mutated', function () {
            expect(ctx.results[0].timeRange).toBeDefined();
            expect(ctx.results[0].timeRange.to.valueOf()).toBe(ctx.toStartTime.valueOf());
            expect(ctx.results[0].timeRange.to.valueOf()).toBe(ctx.results[0].request.range.to.valueOf());
            expectThatRangeHasNotMutated(ctx);
        });
    });
});
var expectThatRangeHasNotMutated = function (ctx) {
    // Make sure that the range for request is not changed and that deepfreeze hasn't thrown
    expect(ctx.results[0].request.range.to.valueOf()).toBe(ctx.toStartTime.valueOf());
    expect(ctx.results[0].error).not.toBeDefined();
    expect(ctx.results[0].state).toBe(LoadingState.Done);
};
function sleep(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
//# sourceMappingURL=runRequest.test.js.map
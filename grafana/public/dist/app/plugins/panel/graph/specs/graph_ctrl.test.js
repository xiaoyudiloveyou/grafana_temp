import { GraphCtrl } from '../module';
import { dateTime } from '@grafana/data';
jest.mock('../graph', function () { return ({}); });
describe('GraphCtrl', function () {
    var injector = {
        get: function () {
            return {
                timeRange: function () {
                    return {
                        from: '',
                        to: '',
                    };
                },
            };
        },
    };
    var scope = {
        $on: function () { },
    };
    GraphCtrl.prototype.panel = {
        events: {
            on: function () { },
        },
        gridPos: {
            w: 100,
        },
    };
    var ctx = {};
    beforeEach(function () {
        ctx.ctrl = new GraphCtrl(scope, injector, {});
        ctx.ctrl.events = {
            emit: function () { },
        };
        ctx.ctrl.annotationsSrv = {
            getAnnotations: function () { return Promise.resolve({}); },
        };
        ctx.ctrl.annotationsPromise = Promise.resolve({});
        ctx.ctrl.updateTimeRange();
    });
    describe('when time series are outside range', function () {
        beforeEach(function () {
            var data = [
                {
                    target: 'test.cpu1',
                    datapoints: [[45, 1234567890], [60, 1234567899]],
                },
            ];
            ctx.ctrl.range = { from: dateTime().valueOf(), to: dateTime().valueOf() };
            ctx.ctrl.onDataSnapshotLoad(data);
        });
        it('should set datapointsOutside', function () {
            expect(ctx.ctrl.dataWarning.title).toBe('Data outside time range');
        });
    });
    describe('when time series are inside range', function () {
        beforeEach(function () {
            var range = {
                from: dateTime()
                    .subtract(1, 'days')
                    .valueOf(),
                to: dateTime().valueOf(),
            };
            var data = [
                {
                    target: 'test.cpu1',
                    datapoints: [[45, range.from + 1000], [60, range.from + 10000]],
                },
            ];
            ctx.ctrl.range = range;
            ctx.ctrl.onDataSnapshotLoad(data);
        });
        it('should set datapointsOutside', function () {
            expect(ctx.ctrl.dataWarning).toBe(null);
        });
    });
    describe('datapointsCount given 2 series', function () {
        beforeEach(function () {
            var data = [{ target: 'test.cpu1', datapoints: [] }, { target: 'test.cpu2', datapoints: [] }];
            ctx.ctrl.onDataSnapshotLoad(data);
        });
        it('should set datapointsCount warning', function () {
            expect(ctx.ctrl.dataWarning.title).toBe('No data');
        });
    });
});
//# sourceMappingURL=graph_ctrl.test.js.map
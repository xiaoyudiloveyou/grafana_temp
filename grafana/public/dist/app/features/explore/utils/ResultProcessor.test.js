import * as tslib_1 from "tslib";
jest.mock('@grafana/data/src/datetime/moment_wrapper', function () { return ({
    dateTime: function (ts) {
        return {
            valueOf: function () { return ts; },
            fromNow: function () { return 'fromNow() jest mocked'; },
            format: function (fmt) { return 'format() jest mocked'; },
        };
    },
    toUtc: function (ts) {
        return {
            format: function (fmt) { return 'format() jest mocked'; },
        };
    },
}); });
import { ResultProcessor } from './ResultProcessor';
import { ExploreMode } from 'app/types/explore';
import TableModel from 'app/core/table_model';
import { toDataFrame, FieldType } from '@grafana/data';
var testContext = function (options) {
    if (options === void 0) { options = {}; }
    var timeSeries = toDataFrame({
        name: 'A-series',
        refId: 'A',
        fields: [
            { name: 'A-series', type: FieldType.number, values: [4, 5, 6] },
            { name: 'time', type: FieldType.time, values: [100, 200, 300] },
        ],
    });
    var table = toDataFrame({
        name: 'table-res',
        refId: 'A',
        fields: [
            { name: 'value', type: FieldType.number, values: [4, 5, 6] },
            { name: 'time', type: FieldType.time, values: [100, 200, 300] },
            { name: 'message', type: FieldType.string, values: ['this is a message', 'second message', 'third'] },
        ],
    });
    var emptyTable = toDataFrame({ name: 'empty-table', refId: 'A', fields: [] });
    var defaultOptions = {
        mode: ExploreMode.Metrics,
        dataFrames: [timeSeries, table, emptyTable],
        graphResult: [],
        tableResult: new TableModel(),
        logsResult: { hasUniqueLabels: false, rows: [] },
    };
    var combinedOptions = tslib_1.__assign({}, defaultOptions, options);
    var state = {
        mode: combinedOptions.mode,
        graphResult: combinedOptions.graphResult,
        tableResult: combinedOptions.tableResult,
        logsResult: combinedOptions.logsResult,
        queryIntervals: { intervalMs: 10 },
    };
    var resultProcessor = new ResultProcessor(state, combinedOptions.dataFrames, 60000);
    return {
        dataFrames: combinedOptions.dataFrames,
        resultProcessor: resultProcessor,
    };
};
describe('ResultProcessor', function () {
    describe('constructed without result', function () {
        describe('when calling getGraphResult', function () {
            it('then it should return null', function () {
                var resultProcessor = testContext({ dataFrames: [] }).resultProcessor;
                var theResult = resultProcessor.getGraphResult();
                expect(theResult).toEqual(null);
            });
        });
        describe('when calling getTableResult', function () {
            it('then it should return null', function () {
                var resultProcessor = testContext({ dataFrames: [] }).resultProcessor;
                var theResult = resultProcessor.getTableResult();
                expect(theResult).toEqual(null);
            });
        });
        describe('when calling getLogsResult', function () {
            it('then it should return null', function () {
                var resultProcessor = testContext({ dataFrames: [] }).resultProcessor;
                var theResult = resultProcessor.getLogsResult();
                expect(theResult).toBeNull();
            });
        });
    });
    describe('constructed with a result that is a DataQueryResponse', function () {
        describe('when calling getGraphResult', function () {
            it('then it should return correct graph result', function () {
                var resultProcessor = testContext().resultProcessor;
                var theResult = resultProcessor.getGraphResult();
                expect(theResult).toEqual([
                    {
                        label: 'A-series',
                        color: '#7EB26D',
                        data: [[100, 4], [200, 5], [300, 6]],
                        info: undefined,
                        isVisible: true,
                        yAxis: {
                            index: 1,
                        },
                    },
                ]);
            });
        });
        describe('when calling getTableResult', function () {
            it('then it should return correct table result', function () {
                var resultProcessor = testContext().resultProcessor;
                var theResult = resultProcessor.getTableResult();
                expect(theResult).toEqual({
                    columnMap: {},
                    columns: [
                        { text: 'value', type: 'number', filterable: undefined },
                        { text: 'time', type: 'time', filterable: undefined },
                        { text: 'message', type: 'string', filterable: undefined },
                    ],
                    rows: [[4, 100, 'this is a message'], [5, 200, 'second message'], [6, 300, 'third']],
                    type: 'table',
                });
            });
        });
        describe('when calling getLogsResult', function () {
            it('then it should return correct logs result', function () {
                var resultProcessor = testContext({ mode: ExploreMode.Logs }).resultProcessor;
                var theResult = resultProcessor.getLogsResult();
                expect(theResult).toEqual({
                    hasUniqueLabels: false,
                    meta: [],
                    rows: [
                        {
                            entry: 'third',
                            hasAnsi: false,
                            labels: undefined,
                            logLevel: 'unknown',
                            raw: 'third',
                            searchWords: [],
                            timeEpochMs: 300,
                            timeFromNow: 'fromNow() jest mocked',
                            timeLocal: 'format() jest mocked',
                            timeUtc: 'format() jest mocked',
                            timestamp: 300,
                            uniqueLabels: {},
                        },
                        {
                            entry: 'second message',
                            hasAnsi: false,
                            labels: undefined,
                            logLevel: 'unknown',
                            raw: 'second message',
                            searchWords: [],
                            timeEpochMs: 200,
                            timeFromNow: 'fromNow() jest mocked',
                            timeLocal: 'format() jest mocked',
                            timeUtc: 'format() jest mocked',
                            timestamp: 200,
                            uniqueLabels: {},
                        },
                        {
                            entry: 'this is a message',
                            hasAnsi: false,
                            labels: undefined,
                            logLevel: 'unknown',
                            raw: 'this is a message',
                            searchWords: [],
                            timeEpochMs: 100,
                            timeFromNow: 'fromNow() jest mocked',
                            timeLocal: 'format() jest mocked',
                            timeUtc: 'format() jest mocked',
                            timestamp: 100,
                            uniqueLabels: {},
                        },
                    ],
                    series: [
                        {
                            label: 'A-series',
                            color: '#7EB26D',
                            data: [[100, 4], [200, 5], [300, 6]],
                            info: undefined,
                            isVisible: true,
                            yAxis: {
                                index: 1,
                            },
                        },
                    ],
                });
            });
        });
    });
});
//# sourceMappingURL=ResultProcessor.test.js.map
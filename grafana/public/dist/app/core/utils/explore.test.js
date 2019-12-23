import * as tslib_1 from "tslib";
import { DEFAULT_RANGE, serializeStateToUrlParam, parseUrlState, updateHistory, clearHistory, hasNonEmptyQuery, getValueWithRefId, getFirstQueryErrorWithoutRefId, getRefIds, refreshIntervalToSortOrder, SortOrder, sortLogsResult, buildQueryTransaction, } from './explore';
import { ExploreMode } from 'app/types/explore';
import store from 'app/core/store';
import { LogsDedupStrategy, LogLevel, dateTime } from '@grafana/data';
import { liveOption, offOption } from '@grafana/ui/src/components/RefreshPicker/RefreshPicker';
var DEFAULT_EXPLORE_STATE = {
    datasource: null,
    queries: [],
    range: DEFAULT_RANGE,
    mode: ExploreMode.Metrics,
    ui: {
        showingGraph: true,
        showingTable: true,
        showingLogs: true,
        dedupStrategy: LogsDedupStrategy.none,
    },
    originPanelId: undefined,
};
describe('state functions', function () {
    describe('parseUrlState', function () {
        it('returns default state on empty string', function () {
            expect(parseUrlState('')).toMatchObject({
                datasource: null,
                queries: [],
                range: DEFAULT_RANGE,
            });
        });
        it('returns a valid Explore state from URL parameter', function () {
            var paramValue = '%7B"datasource":"Local","queries":%5B%7B"expr":"metric"%7D%5D,"range":%7B"from":"now-1h","to":"now"%7D%7D';
            expect(parseUrlState(paramValue)).toMatchObject({
                datasource: 'Local',
                queries: [{ expr: 'metric' }],
                range: {
                    from: 'now-1h',
                    to: 'now',
                },
            });
        });
        it('returns a valid Explore state from a compact URL parameter', function () {
            var paramValue = '%5B"now-1h","now","Local","5m",%7B"expr":"metric"%7D,"ui"%5D';
            expect(parseUrlState(paramValue)).toMatchObject({
                datasource: 'Local',
                queries: [{ expr: 'metric' }],
                range: {
                    from: 'now-1h',
                    to: 'now',
                },
            });
        });
    });
    describe('serializeStateToUrlParam', function () {
        it('returns url parameter value for a state object', function () {
            var state = tslib_1.__assign({}, DEFAULT_EXPLORE_STATE, { datasource: 'foo', queries: [
                    {
                        expr: 'metric{test="a/b"}',
                    },
                    {
                        expr: 'super{foo="x/z"}',
                    },
                ], range: {
                    from: 'now-5h',
                    to: 'now',
                } });
            expect(serializeStateToUrlParam(state)).toBe('{"datasource":"foo","queries":[{"expr":"metric{test=\\"a/b\\"}"},' +
                '{"expr":"super{foo=\\"x/z\\"}"}],"range":{"from":"now-5h","to":"now"},' +
                '"mode":"Metrics",' +
                '"ui":{"showingGraph":true,"showingTable":true,"showingLogs":true,"dedupStrategy":"none"}}');
        });
        it('returns url parameter value for a state object', function () {
            var state = tslib_1.__assign({}, DEFAULT_EXPLORE_STATE, { datasource: 'foo', queries: [
                    {
                        expr: 'metric{test="a/b"}',
                    },
                    {
                        expr: 'super{foo="x/z"}',
                    },
                ], range: {
                    from: 'now-5h',
                    to: 'now',
                } });
            expect(serializeStateToUrlParam(state, true)).toBe('["now-5h","now","foo",{"expr":"metric{test=\\"a/b\\"}"},{"expr":"super{foo=\\"x/z\\"}"},{"mode":"Metrics"},{"ui":[true,true,true,"none"]}]');
        });
    });
    describe('interplay', function () {
        it('can parse the serialized state into the original state', function () {
            var state = tslib_1.__assign({}, DEFAULT_EXPLORE_STATE, { datasource: 'foo', queries: [
                    {
                        expr: 'metric{test="a/b"}',
                    },
                    {
                        expr: 'super{foo="x/z"}',
                    },
                ], range: {
                    from: 'now - 5h',
                    to: 'now',
                } });
            var serialized = serializeStateToUrlParam(state);
            var parsed = parseUrlState(serialized);
            expect(state).toMatchObject(parsed);
        });
        it('can parse the compact serialized state into the original state', function () {
            var state = tslib_1.__assign({}, DEFAULT_EXPLORE_STATE, { datasource: 'foo', queries: [
                    {
                        expr: 'metric{test="a/b"}',
                    },
                    {
                        expr: 'super{foo="x/z"}',
                    },
                ], range: {
                    from: 'now - 5h',
                    to: 'now',
                } });
            var serialized = serializeStateToUrlParam(state, true);
            var parsed = parseUrlState(serialized);
            expect(state).toMatchObject(parsed);
        });
    });
});
describe('updateHistory()', function () {
    var datasourceId = 'myDatasource';
    var key = "grafana.explore.history." + datasourceId;
    beforeEach(function () {
        clearHistory(datasourceId);
        expect(store.exists(key)).toBeFalsy();
    });
    test('should save history item to localStorage', function () {
        var expected = [
            {
                query: { refId: '1', expr: 'metric' },
            },
        ];
        expect(updateHistory([], datasourceId, [{ refId: '1', expr: 'metric' }])).toMatchObject(expected);
        expect(store.exists(key)).toBeTruthy();
        expect(store.getObject(key)).toMatchObject(expected);
    });
});
describe('hasNonEmptyQuery', function () {
    test('should return true if one query is non-empty', function () {
        expect(hasNonEmptyQuery([{ refId: '1', key: '2', context: 'explore', expr: 'foo' }])).toBeTruthy();
    });
    test('should return false if query is empty', function () {
        expect(hasNonEmptyQuery([{ refId: '1', key: '2', context: 'panel' }])).toBeFalsy();
    });
    test('should return false if no queries exist', function () {
        expect(hasNonEmptyQuery([])).toBeFalsy();
    });
});
describe('hasRefId', function () {
    describe('when called with a null value', function () {
        it('then it should return null', function () {
            var input = null;
            var result = getValueWithRefId(input);
            expect(result).toBeNull();
        });
    });
    describe('when called with a non object value', function () {
        it('then it should return null', function () {
            var input = 123;
            var result = getValueWithRefId(input);
            expect(result).toBeNull();
        });
    });
    describe('when called with an object that has refId', function () {
        it('then it should return the object', function () {
            var input = { refId: 'A' };
            var result = getValueWithRefId(input);
            expect(result).toBe(input);
        });
    });
    describe('when called with an array that has refId', function () {
        it('then it should return the object', function () {
            var input = [123, null, {}, { refId: 'A' }];
            var result = getValueWithRefId(input);
            expect(result).toBe(input[3]);
        });
    });
    describe('when called with an object that has refId somewhere in the object tree', function () {
        it('then it should return the object', function () {
            var input = { data: [123, null, {}, { series: [123, null, {}, { refId: 'A' }] }] };
            var result = getValueWithRefId(input);
            expect(result).toBe(input.data[3].series[3]);
        });
    });
});
describe('getFirstQueryErrorWithoutRefId', function () {
    describe('when called with a null value', function () {
        it('then it should return null', function () {
            var errors = null;
            var result = getFirstQueryErrorWithoutRefId(errors);
            expect(result).toBeNull();
        });
    });
    describe('when called with an array with only refIds', function () {
        it('then it should return undefined', function () {
            var errors = [{ refId: 'A' }, { refId: 'B' }];
            var result = getFirstQueryErrorWithoutRefId(errors);
            expect(result).toBeUndefined();
        });
    });
    describe('when called with an array with and without refIds', function () {
        it('then it should return undefined', function () {
            var errors = [
                { refId: 'A' },
                { message: 'A message' },
                { refId: 'B' },
                { message: 'B message' },
            ];
            var result = getFirstQueryErrorWithoutRefId(errors);
            expect(result).toBe(errors[1]);
        });
    });
});
describe('getRefIds', function () {
    describe('when called with a null value', function () {
        it('then it should return empty array', function () {
            var input = null;
            var result = getRefIds(input);
            expect(result).toEqual([]);
        });
    });
    describe('when called with a non object value', function () {
        it('then it should return empty array', function () {
            var input = 123;
            var result = getRefIds(input);
            expect(result).toEqual([]);
        });
    });
    describe('when called with an object that has refId', function () {
        it('then it should return an array with that refId', function () {
            var input = { refId: 'A' };
            var result = getRefIds(input);
            expect(result).toEqual(['A']);
        });
    });
    describe('when called with an array that has refIds', function () {
        it('then it should return an array with unique refIds', function () {
            var input = [123, null, {}, { refId: 'A' }, { refId: 'A' }, { refId: 'B' }];
            var result = getRefIds(input);
            expect(result).toEqual(['A', 'B']);
        });
    });
    describe('when called with an object that has refIds somewhere in the object tree', function () {
        it('then it should return return an array with unique refIds', function () {
            var input = {
                data: [
                    123,
                    null,
                    { refId: 'B', series: [{ refId: 'X' }] },
                    { refId: 'B' },
                    {},
                    { series: [123, null, {}, { refId: 'A' }] },
                ],
            };
            var result = getRefIds(input);
            expect(result).toEqual(['B', 'X', 'A']);
        });
    });
});
describe('refreshIntervalToSortOrder', function () {
    describe('when called with live option', function () {
        it('then it should return ascending', function () {
            var result = refreshIntervalToSortOrder(liveOption.value);
            expect(result).toBe(SortOrder.Ascending);
        });
    });
    describe('when called with off option', function () {
        it('then it should return descending', function () {
            var result = refreshIntervalToSortOrder(offOption.value);
            expect(result).toBe(SortOrder.Descending);
        });
    });
    describe('when called with 5s option', function () {
        it('then it should return descending', function () {
            var result = refreshIntervalToSortOrder('5s');
            expect(result).toBe(SortOrder.Descending);
        });
    });
    describe('when called with undefined', function () {
        it('then it should return descending', function () {
            var result = refreshIntervalToSortOrder(undefined);
            expect(result).toBe(SortOrder.Descending);
        });
    });
});
describe('sortLogsResult', function () {
    var firstRow = {
        timestamp: '2019-01-01T21:00:0.0000000Z',
        entry: '',
        hasAnsi: false,
        labels: {},
        logLevel: LogLevel.info,
        raw: '',
        timeEpochMs: 0,
        timeFromNow: '',
        timeLocal: '',
        timeUtc: '',
    };
    var sameAsFirstRow = firstRow;
    var secondRow = {
        timestamp: '2019-01-01T22:00:0.0000000Z',
        entry: '',
        hasAnsi: false,
        labels: {},
        logLevel: LogLevel.info,
        raw: '',
        timeEpochMs: 0,
        timeFromNow: '',
        timeLocal: '',
        timeUtc: '',
    };
    describe('when called with SortOrder.Descending', function () {
        it('then it should sort descending', function () {
            var logsResult = {
                rows: [firstRow, sameAsFirstRow, secondRow],
                hasUniqueLabels: false,
            };
            var result = sortLogsResult(logsResult, SortOrder.Descending);
            expect(result).toEqual({
                rows: [secondRow, firstRow, sameAsFirstRow],
                hasUniqueLabels: false,
            });
        });
    });
    describe('when called with SortOrder.Ascending', function () {
        it('then it should sort ascending', function () {
            var logsResult = {
                rows: [secondRow, firstRow, sameAsFirstRow],
                hasUniqueLabels: false,
            };
            var result = sortLogsResult(logsResult, SortOrder.Ascending);
            expect(result).toEqual({
                rows: [firstRow, sameAsFirstRow, secondRow],
                hasUniqueLabels: false,
            });
        });
    });
    describe('when buildQueryTransaction', function () {
        it('it should calculate interval based on time range', function () {
            var queries = [{ refId: 'A' }];
            var queryOptions = { maxDataPoints: 1000, minInterval: '15s' };
            var range = { from: dateTime().subtract(1, 'd'), to: dateTime(), raw: { from: '1h', to: '1h' } };
            var transaction = buildQueryTransaction(queries, queryOptions, range, false);
            expect(transaction.request.intervalMs).toEqual(60000);
        });
        it('it should calculate interval taking minInterval into account', function () {
            var queries = [{ refId: 'A' }];
            var queryOptions = { maxDataPoints: 1000, minInterval: '15s' };
            var range = { from: dateTime().subtract(1, 'm'), to: dateTime(), raw: { from: '1h', to: '1h' } };
            var transaction = buildQueryTransaction(queries, queryOptions, range, false);
            expect(transaction.request.intervalMs).toEqual(15000);
        });
        it('it should calculate interval taking maxDataPoints into account', function () {
            var queries = [{ refId: 'A' }];
            var queryOptions = { maxDataPoints: 10, minInterval: '15s' };
            var range = { from: dateTime().subtract(1, 'd'), to: dateTime(), raw: { from: '1h', to: '1h' } };
            var transaction = buildQueryTransaction(queries, queryOptions, range, false);
            expect(transaction.request.interval).toEqual('2h');
        });
    });
});
//# sourceMappingURL=explore.test.js.map
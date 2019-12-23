import * as tslib_1 from "tslib";
import { PrometheusDatasource } from './datasource';
import { PromContext } from './types';
import { dateTime, LoadingState } from '@grafana/data';
var defaultInstanceSettings = {
    url: 'test_prom',
    jsonData: {},
};
var backendSrvMock = {
    datasourceRequest: jest.fn(),
};
var templateSrvMock = {
    replace: function () {
        return null;
    },
    getAdhocFilters: function () {
        return [];
    },
};
var timeSrvMock = {
    timeRange: function () {
        return {
            from: dateTime(),
            to: dateTime(),
        };
    },
};
describe('datasource', function () {
    describe('query', function () {
        var ds = new PrometheusDatasource(defaultInstanceSettings, {}, backendSrvMock, templateSrvMock, timeSrvMock);
        it('returns empty array when no queries', function (done) {
            expect.assertions(2);
            ds.query(makeQuery([])).subscribe({
                next: function (next) {
                    expect(next.data).toEqual([]);
                    expect(next.state).toBe(LoadingState.Done);
                },
                complete: function () {
                    done();
                },
            });
        });
        it('performs time series queries', function (done) {
            expect.assertions(2);
            backendSrvMock.datasourceRequest.mockReturnValueOnce(Promise.resolve(makePromResponse()));
            ds.query(makeQuery([{}])).subscribe({
                next: function (next) {
                    expect(next.data.length).not.toBe(0);
                    expect(next.state).toBe(LoadingState.Done);
                },
                complete: function () {
                    done();
                },
            });
        });
        it('with 2 queries and used from Explore, sends results as they arrive', function (done) {
            expect.assertions(4);
            backendSrvMock.datasourceRequest.mockReturnValue(Promise.resolve(makePromResponse()));
            var responseStatus = [LoadingState.Loading, LoadingState.Done];
            ds.query(makeQuery([{ context: PromContext.Explore }, { context: PromContext.Explore }])).subscribe({
                next: function (next) {
                    expect(next.data.length).not.toBe(0);
                    expect(next.state).toBe(responseStatus.shift());
                },
                complete: function () {
                    done();
                },
            });
        });
        it('with 2 queries and used from Panel, waits for all to finish until sending Done status', function (done) {
            expect.assertions(2);
            backendSrvMock.datasourceRequest.mockReturnValue(Promise.resolve(makePromResponse()));
            ds.query(makeQuery([{ context: PromContext.Panel }, { context: PromContext.Panel }])).subscribe({
                next: function (next) {
                    expect(next.data.length).not.toBe(0);
                    expect(next.state).toBe(LoadingState.Done);
                },
                complete: function () {
                    done();
                },
            });
        });
    });
});
function makeQuery(targets) {
    return {
        targets: targets.map(function (t) {
            return tslib_1.__assign({ instant: false, start: dateTime().subtract(5, 'minutes'), end: dateTime(), expr: 'test', showingGraph: true }, t);
        }),
        range: {
            from: dateTime(),
            to: dateTime(),
        },
        interval: '15s',
    };
}
/**
 * Creates a pretty bogus prom response. Definitelly needs more work but right now we do not test the contents of the
 * messages anyway.
 */
function makePromResponse() {
    return {
        data: {
            data: {
                result: [
                    {
                        metric: {
                            __name__: 'test_metric',
                        },
                        values: [[1568369640, 1]],
                    },
                ],
                resultType: 'matrix',
            },
        },
    };
}
//# sourceMappingURL=datasource.test.js.map
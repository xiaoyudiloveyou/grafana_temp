var _this = this;
import * as tslib_1 from "tslib";
import LokiDatasource from './datasource';
import { getQueryOptions } from 'test/helpers/getQueryOptions';
import { dateTime } from '@grafana/data';
describe('LokiDatasource', function () {
    var instanceSettings = {
        url: 'myloggingurl',
    };
    var testResp = {
        data: {
            streams: [
                {
                    entries: [{ ts: '2019-02-01T10:27:37.498180581Z', line: 'hello' }],
                    labels: '{}',
                },
            ],
        },
    };
    var backendSrvMock = { datasourceRequest: jest.fn() };
    var backendSrv = backendSrvMock;
    var templateSrvMock = {
        getAdhocFilters: function () { return []; },
        replace: function (a) { return a; },
    };
    describe('when querying', function () {
        var testLimit = makeLimitTest(instanceSettings, backendSrvMock, backendSrv, templateSrvMock, testResp);
        test('should use default max lines when no limit given', function () {
            testLimit({
                expectedLimit: 1000,
            });
        });
        test('should use custom max lines if limit is set', function () {
            testLimit({
                maxLines: 20,
                expectedLimit: 20,
            });
        });
        test('should use custom maxDataPoints if set in request', function () {
            testLimit({
                maxDataPoints: 500,
                expectedLimit: 500,
            });
        });
        test('should use datasource maxLimit if maxDataPoints is higher', function () {
            testLimit({
                maxLines: 20,
                maxDataPoints: 500,
                expectedLimit: 20,
            });
        });
        test('should return series data', function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var customData, customSettings, ds, options, res, dataFrame;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customData = tslib_1.__assign({}, (instanceSettings.jsonData || {}), { maxLines: 20 });
                        customSettings = tslib_1.__assign({}, instanceSettings, { jsonData: customData });
                        ds = new LokiDatasource(customSettings, backendSrv, templateSrvMock);
                        backendSrvMock.datasourceRequest = jest.fn(function () { return Promise.resolve(testResp); });
                        options = getQueryOptions({
                            targets: [{ expr: '{} foo', refId: 'B' }],
                        });
                        return [4 /*yield*/, ds.query(options).toPromise()];
                    case 1:
                        res = _a.sent();
                        dataFrame = res.data[0];
                        expect(dataFrame.fields[1].values.get(0)).toBe('hello');
                        expect(dataFrame.meta.limit).toBe(20);
                        expect(dataFrame.meta.searchWords).toEqual(['(?i)foo']);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when performing testDataSource', function () {
        var ds;
        var result;
        describe('and call succeeds', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var backendSrv;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            backendSrv = {
                                datasourceRequest: function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, Promise.resolve({
                                                    status: 200,
                                                    data: {
                                                        values: ['avalue'],
                                                    },
                                                })];
                                        });
                                    });
                                },
                            };
                            ds = new LokiDatasource(instanceSettings, backendSrv, {});
                            return [4 /*yield*/, ds.testDatasource()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return successfully', function () {
                expect(result.status).toBe('success');
            });
        });
        describe('and call fails with 401 error', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var backendSrv;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            backendSrv = {
                                datasourceRequest: function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, Promise.reject({
                                                    statusText: 'Unauthorized',
                                                    status: 401,
                                                    data: {
                                                        message: 'Unauthorized',
                                                    },
                                                })];
                                        });
                                    });
                                },
                            };
                            ds = new LokiDatasource(instanceSettings, backendSrv, {});
                            return [4 /*yield*/, ds.testDatasource()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error status and a detailed error message', function () {
                expect(result.status).toEqual('error');
                expect(result.message).toBe('Loki: Unauthorized. 401. Unauthorized');
            });
        });
        describe('and call fails with 404 error', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var backendSrv;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            backendSrv = {
                                datasourceRequest: function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, Promise.reject({
                                                    statusText: 'Not found',
                                                    status: 404,
                                                    data: '404 page not found',
                                                })];
                                        });
                                    });
                                },
                            };
                            ds = new LokiDatasource(instanceSettings, backendSrv, {});
                            return [4 /*yield*/, ds.testDatasource()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error status and a detailed error message', function () {
                expect(result.status).toEqual('error');
                expect(result.message).toBe('Loki: Not found. 404. 404 page not found');
            });
        });
        describe('and call fails with 502 error', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var backendSrv;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            backendSrv = {
                                datasourceRequest: function () {
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            return [2 /*return*/, Promise.reject({
                                                    statusText: 'Bad Gateway',
                                                    status: 502,
                                                    data: '',
                                                })];
                                        });
                                    });
                                },
                            };
                            ds = new LokiDatasource(instanceSettings, backendSrv, {});
                            return [4 /*yield*/, ds.testDatasource()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error status and a detailed error message', function () {
                expect(result.status).toEqual('error');
                expect(result.message).toBe('Loki: Bad Gateway. 502');
            });
        });
    });
    describe('annotationQuery', function () {
        it('should transform the loki data to annototion response', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var ds, query, res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ds = new LokiDatasource(instanceSettings, backendSrv, templateSrvMock);
                        backendSrvMock.datasourceRequest = jest.fn(function () {
                            return Promise.resolve({
                                data: {
                                    streams: [
                                        {
                                            entries: [{ ts: '2019-02-01T10:27:37.498180581Z', line: 'hello' }],
                                            labels: '{label="value"}',
                                        },
                                        {
                                            entries: [{ ts: '2019-02-01T12:27:37.498180581Z', line: 'hello 2' }],
                                            labels: '{label2="value2"}',
                                        },
                                    ],
                                },
                            });
                        });
                        query = makeAnnotationQueryRequest();
                        return [4 /*yield*/, ds.annotationQuery(query)];
                    case 1:
                        res = _a.sent();
                        expect(res.length).toBe(2);
                        expect(res[0].text).toBe('hello');
                        expect(res[0].tags).toEqual(['value']);
                        expect(res[1].text).toBe('hello 2');
                        expect(res[1].tags).toEqual(['value2']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
function makeLimitTest(instanceSettings, backendSrvMock, backendSrv, templateSrvMock, testResp) {
    return function (_a) {
        var maxDataPoints = _a.maxDataPoints, maxLines = _a.maxLines, expectedLimit = _a.expectedLimit;
        var settings = instanceSettings;
        if (Number.isFinite(maxLines)) {
            var customData = tslib_1.__assign({}, (instanceSettings.jsonData || {}), { maxLines: 20 });
            settings = tslib_1.__assign({}, instanceSettings, { jsonData: customData });
        }
        var ds = new LokiDatasource(settings, backendSrv, templateSrvMock);
        backendSrvMock.datasourceRequest = jest.fn(function () { return Promise.resolve(testResp); });
        var options = getQueryOptions({ targets: [{ expr: 'foo', refId: 'B' }] });
        if (Number.isFinite(maxDataPoints)) {
            options.maxDataPoints = maxDataPoints;
        }
        else {
            // By default is 500
            delete options.maxDataPoints;
        }
        ds.query(options);
        expect(backendSrvMock.datasourceRequest.mock.calls.length).toBe(1);
        expect(backendSrvMock.datasourceRequest.mock.calls[0][0].url).toContain("limit=" + expectedLimit);
    };
}
function makeAnnotationQueryRequest() {
    var timeRange = {
        from: dateTime(),
        to: dateTime(),
    };
    return {
        annotation: {
            expr: '{test=test}',
            refId: '',
            datasource: 'loki',
            enable: true,
            name: 'test-annotation',
        },
        dashboard: {
            id: 1,
        },
        range: tslib_1.__assign({}, timeRange, { raw: timeRange }),
        rangeRaw: timeRange,
    };
}
//# sourceMappingURL=datasource.test.js.map
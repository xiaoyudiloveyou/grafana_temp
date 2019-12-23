var _this = this;
import * as tslib_1 from "tslib";
import InfluxDatasource from '../datasource';
//@ts-ignore
import $q from 'q';
import { TemplateSrvStub } from 'test/specs/helpers';
describe('InfluxDataSource', function () {
    var ctx = {
        backendSrv: {},
        $q: $q,
        //@ts-ignore
        templateSrv: new TemplateSrvStub(),
        instanceSettings: { url: 'url', name: 'influxDb', jsonData: { httpMode: 'GET' } },
    };
    beforeEach(function () {
        ctx.instanceSettings.url = '/api/datasources/proxy/1';
        ctx.ds = new InfluxDatasource(ctx.instanceSettings, ctx.$q, ctx.backendSrv, ctx.templateSrv);
    });
    describe('When issuing metricFindQuery', function () {
        var query = 'SELECT max(value) FROM measurement WHERE $timeFilter';
        var queryOptions = {
            range: {
                from: '2018-01-01T00:00:00Z',
                to: '2018-01-02T00:00:00Z',
            },
        };
        var requestQuery, requestMethod, requestData;
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.backendSrv.datasourceRequest = function (req) {
                            requestMethod = req.method;
                            requestQuery = req.params.q;
                            requestData = req.data;
                            return ctx.$q.when({
                                results: [
                                    {
                                        series: [
                                            {
                                                name: 'measurement',
                                                columns: ['max'],
                                                values: [[1]],
                                            },
                                        ],
                                    },
                                ],
                            });
                        };
                        return [4 /*yield*/, ctx.ds.metricFindQuery(query, queryOptions).then(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should replace $timefilter', function () {
            expect(requestQuery).toMatch('time >= 1514764800000ms and time <= 1514851200000ms');
        });
        it('should use the HTTP GET method', function () {
            expect(requestMethod).toBe('GET');
        });
        it('should not have any data in request body', function () {
            expect(requestData).toBeNull();
        });
    });
});
describe('InfluxDataSource in POST query mode', function () {
    var ctx = {
        backendSrv: {},
        $q: $q,
        //@ts-ignore
        templateSrv: new TemplateSrvStub(),
        instanceSettings: { url: 'url', name: 'influxDb', jsonData: { httpMode: 'POST' } },
    };
    beforeEach(function () {
        ctx.instanceSettings.url = '/api/datasources/proxy/1';
        ctx.ds = new InfluxDatasource(ctx.instanceSettings, ctx.$q, ctx.backendSrv, ctx.templateSrv);
    });
    describe('When issuing metricFindQuery', function () {
        var query = 'SELECT max(value) FROM measurement';
        var queryOptions = {};
        var requestMethod, requestQueryParameter, queryEncoded, requestQuery;
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.backendSrv.datasourceRequest = function (req) {
                            requestMethod = req.method;
                            requestQueryParameter = req.params;
                            requestQuery = req.data;
                            return ctx.$q.when({
                                results: [
                                    {
                                        series: [
                                            {
                                                name: 'measurement',
                                                columns: ['max'],
                                                values: [[1]],
                                            },
                                        ],
                                    },
                                ],
                            });
                        };
                        return [4 /*yield*/, ctx.ds.serializeParams({ q: query })];
                    case 1:
                        queryEncoded = _a.sent();
                        return [4 /*yield*/, ctx.ds.metricFindQuery(query, queryOptions).then(function () { })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have the query form urlencoded', function () {
            expect(requestQuery).toBe(queryEncoded);
        });
        it('should use the HTTP POST method', function () {
            expect(requestMethod).toBe('POST');
        });
        it('should not have q as a query parameter', function () {
            expect(requestQueryParameter).not.toHaveProperty('q');
        });
    });
});
//# sourceMappingURL=datasource.test.js.map
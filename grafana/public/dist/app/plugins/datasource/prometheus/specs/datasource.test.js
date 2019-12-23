var _this = this;
import * as tslib_1 from "tslib";
import _ from 'lodash';
// @ts-ignore
import q from 'q';
import { alignRange, extractRuleMappingFromGroups, PrometheusDatasource, prometheusRegularEscape, prometheusSpecialRegexEscape, } from '../datasource';
import { dateTime } from '@grafana/data';
import { PromContext } from '../types';
import { CustomVariable } from 'app/features/templating/custom_variable';
jest.mock('../metric_find_query');
var DEFAULT_TEMPLATE_SRV_MOCK = {
    getAdhocFilters: function () { return []; },
    replace: function (a) { return a; },
};
describe('PrometheusDatasource', function () {
    var ctx = {};
    var instanceSettings = {
        url: 'proxied',
        directUrl: 'direct',
        user: 'test',
        password: 'mupp',
        jsonData: {},
    };
    ctx.backendSrvMock = {};
    ctx.templateSrvMock = DEFAULT_TEMPLATE_SRV_MOCK;
    ctx.timeSrvMock = {
        timeRange: function () {
            return {
                from: dateTime(1531468681),
                to: dateTime(1531489712),
            };
        },
    };
    beforeEach(function () {
        ctx.ds = new PrometheusDatasource(instanceSettings, q, ctx.backendSrvMock, ctx.templateSrvMock, ctx.timeSrvMock);
    });
    describe('Datasource metadata requests', function () {
        it('should perform a GET request with the default config', function () {
            ctx.backendSrvMock.datasourceRequest = jest.fn();
            ctx.ds.metadataRequest('/foo');
            expect(ctx.backendSrvMock.datasourceRequest.mock.calls.length).toBe(1);
            expect(ctx.backendSrvMock.datasourceRequest.mock.calls[0][0].method).toBe('GET');
        });
        it('should still perform a GET request with the DS HTTP method set to POST', function () {
            ctx.backendSrvMock.datasourceRequest = jest.fn();
            var postSettings = _.cloneDeep(instanceSettings);
            postSettings.jsonData.httpMethod = 'POST';
            var ds = new PrometheusDatasource(postSettings, q, ctx.backendSrvMock, ctx.templateSrvMock, ctx.timeSrvMock);
            ds.metadataRequest('/foo');
            expect(ctx.backendSrvMock.datasourceRequest.mock.calls.length).toBe(1);
            expect(ctx.backendSrvMock.datasourceRequest.mock.calls[0][0].method).toBe('GET');
        });
    });
    describe('When using adhoc filters', function () {
        var DEFAULT_QUERY_EXPRESSION = 'metric{job="foo"} - metric';
        var target = { expr: DEFAULT_QUERY_EXPRESSION };
        afterEach(function () {
            ctx.templateSrvMock.getAdhocFilters = DEFAULT_TEMPLATE_SRV_MOCK.getAdhocFilters;
        });
        it('should not modify expression with no filters', function () {
            var result = ctx.ds.createQuery(target, { interval: '15s' });
            expect(result).toMatchObject({ expr: DEFAULT_QUERY_EXPRESSION });
        });
        it('should add filters to expression', function () {
            ctx.templateSrvMock.getAdhocFilters = function () { return [
                {
                    key: 'k1',
                    operator: '=',
                    value: 'v1',
                },
                {
                    key: 'k2',
                    operator: '!=',
                    value: 'v2',
                },
            ]; };
            var result = ctx.ds.createQuery(target, { interval: '15s' });
            expect(result).toMatchObject({ expr: 'metric{job="foo",k1="v1",k2!="v2"} - metric{k1="v1",k2!="v2"}' });
        });
        it('should add escaping if needed to regex filter expressions', function () {
            ctx.templateSrvMock.getAdhocFilters = function () { return [
                {
                    key: 'k1',
                    operator: '=~',
                    value: 'v.*',
                },
                {
                    key: 'k2',
                    operator: '=~',
                    value: "v'.*",
                },
            ]; };
            var result = ctx.ds.createQuery(target, { interval: '15s' });
            expect(result).toMatchObject({
                expr: "metric{job=\"foo\",k1=~\"v.*\",k2=~\"v\\\\'.*\"} - metric{k1=~\"v.*\",k2=~\"v\\\\'.*\"}",
            });
        });
    });
    describe('When performing performSuggestQuery', function () {
        it('should cache response', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.backendSrvMock.datasourceRequest.mockReturnValue(Promise.resolve({
                            status: 'success',
                            data: { data: ['value1', 'value2', 'value3'] },
                        }));
                        return [4 /*yield*/, ctx.ds.performSuggestQuery('value', true)];
                    case 1:
                        results = _a.sent();
                        expect(results).toHaveLength(3);
                        ctx.backendSrvMock.datasourceRequest.mockReset();
                        return [4 /*yield*/, ctx.ds.performSuggestQuery('value', true)];
                    case 2:
                        results = _a.sent();
                        expect(results).toHaveLength(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('When converting prometheus histogram to heatmap format', function () {
        beforeEach(function () {
            ctx.query = {
                range: { from: dateTime(1443454528000), to: dateTime(1443454528000) },
                targets: [{ expr: 'test{job="testjob"}', format: 'heatmap', legendFormat: '{{le}}' }],
                interval: '1s',
            };
        });
        it('should convert cumullative histogram to ordinary', function () {
            var resultMock = [
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '10' },
                    values: [[1443454528.0, '10'], [1443454528.0, '10']],
                },
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '20' },
                    values: [[1443454528.0, '20'], [1443454528.0, '10']],
                },
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '30' },
                    values: [[1443454528.0, '25'], [1443454528.0, '10']],
                },
            ];
            var responseMock = { data: { data: { result: resultMock } } };
            var expected = [
                {
                    target: '10',
                    datapoints: [[10, 1443454528000], [10, 1443454528000]],
                },
                {
                    target: '20',
                    datapoints: [[10, 1443454528000], [0, 1443454528000]],
                },
                {
                    target: '30',
                    datapoints: [[5, 1443454528000], [0, 1443454528000]],
                },
            ];
            ctx.ds.performTimeSeriesQuery = jest.fn().mockReturnValue([responseMock]);
            ctx.ds.query(ctx.query).subscribe(function (result) {
                var results = result.data;
                return expect(results).toMatchObject(expected);
            });
        });
        it('should sort series by label value', function () {
            var resultMock = [
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '2' },
                    values: [[1443454528.0, '10'], [1443454528.0, '10']],
                },
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '4' },
                    values: [[1443454528.0, '20'], [1443454528.0, '10']],
                },
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '+Inf' },
                    values: [[1443454528.0, '25'], [1443454528.0, '10']],
                },
                {
                    metric: { __name__: 'metric', job: 'testjob', le: '1' },
                    values: [[1443454528.0, '25'], [1443454528.0, '10']],
                },
            ];
            var responseMock = { data: { data: { result: resultMock } } };
            var expected = ['1', '2', '4', '+Inf'];
            ctx.ds.performTimeSeriesQuery = jest.fn().mockReturnValue([responseMock]);
            ctx.ds.query(ctx.query).subscribe(function (result) {
                var seriesLabels = _.map(result.data, 'target');
                return expect(seriesLabels).toEqual(expected);
            });
        });
    });
    describe('alignRange', function () {
        it('does not modify already aligned intervals with perfect step', function () {
            var range = alignRange(0, 3, 3, 0);
            expect(range.start).toEqual(0);
            expect(range.end).toEqual(3);
        });
        it('does modify end-aligned intervals to reflect number of steps possible', function () {
            var range = alignRange(1, 6, 3, 0);
            expect(range.start).toEqual(0);
            expect(range.end).toEqual(6);
        });
        it('does align intervals that are a multiple of steps', function () {
            var range = alignRange(1, 4, 3, 0);
            expect(range.start).toEqual(0);
            expect(range.end).toEqual(3);
        });
        it('does align intervals that are not a multiple of steps', function () {
            var range = alignRange(1, 5, 3, 0);
            expect(range.start).toEqual(0);
            expect(range.end).toEqual(3);
        });
        it('does align intervals with local midnight -UTC offset', function () {
            //week range, location 4+ hours UTC offset, 24h step time
            var range = alignRange(4 * 60 * 60, (7 * 24 + 4) * 60 * 60, 24 * 60 * 60, -4 * 60 * 60); //04:00 UTC, 7 day range
            expect(range.start).toEqual(4 * 60 * 60);
            expect(range.end).toEqual((7 * 24 + 4) * 60 * 60);
        });
        it('does align intervals with local midnight +UTC offset', function () {
            //week range, location 4- hours UTC offset, 24h step time
            var range = alignRange(20 * 60 * 60, (8 * 24 - 4) * 60 * 60, 24 * 60 * 60, 4 * 60 * 60); //20:00 UTC on day1, 7 days later is 20:00 on day8
            expect(range.start).toEqual(20 * 60 * 60);
            expect(range.end).toEqual((8 * 24 - 4) * 60 * 60);
        });
    });
    describe('extractRuleMappingFromGroups()', function () {
        it('returns empty mapping for no rule groups', function () {
            expect(extractRuleMappingFromGroups([])).toEqual({});
        });
        it('returns a mapping for recording rules only', function () {
            var groups = [
                {
                    rules: [
                        {
                            name: 'HighRequestLatency',
                            query: 'job:request_latency_seconds:mean5m{job="myjob"} > 0.5',
                            type: 'alerting',
                        },
                        {
                            name: 'job:http_inprogress_requests:sum',
                            query: 'sum(http_inprogress_requests) by (job)',
                            type: 'recording',
                        },
                    ],
                    file: '/rules.yaml',
                    interval: 60,
                    name: 'example',
                },
            ];
            var mapping = extractRuleMappingFromGroups(groups);
            expect(mapping).toEqual({ 'job:http_inprogress_requests:sum': 'sum(http_inprogress_requests) by (job)' });
        });
    });
    describe('Prometheus regular escaping', function () {
        it('should not escape non-string', function () {
            expect(prometheusRegularEscape(12)).toEqual(12);
        });
        it('should not escape simple string', function () {
            expect(prometheusRegularEscape('cryptodepression')).toEqual('cryptodepression');
        });
        it("should escape '", function () {
            expect(prometheusRegularEscape("looking'glass")).toEqual("looking\\\\'glass");
        });
        it('should escape multiple characters', function () {
            expect(prometheusRegularEscape("'looking'glass'")).toEqual("\\\\'looking\\\\'glass\\\\'");
        });
    });
    describe('Prometheus regexes escaping', function () {
        it('should not escape simple string', function () {
            expect(prometheusSpecialRegexEscape('cryptodepression')).toEqual('cryptodepression');
        });
        it('should escape $^*+?.()|\\', function () {
            expect(prometheusSpecialRegexEscape("looking'glass")).toEqual("looking\\\\'glass");
            expect(prometheusSpecialRegexEscape('looking{glass')).toEqual('looking\\\\{glass');
            expect(prometheusSpecialRegexEscape('looking}glass')).toEqual('looking\\\\}glass');
            expect(prometheusSpecialRegexEscape('looking[glass')).toEqual('looking\\\\[glass');
            expect(prometheusSpecialRegexEscape('looking]glass')).toEqual('looking\\\\]glass');
            expect(prometheusSpecialRegexEscape('looking$glass')).toEqual('looking\\\\$glass');
            expect(prometheusSpecialRegexEscape('looking^glass')).toEqual('looking\\\\^glass');
            expect(prometheusSpecialRegexEscape('looking*glass')).toEqual('looking\\\\*glass');
            expect(prometheusSpecialRegexEscape('looking+glass')).toEqual('looking\\\\+glass');
            expect(prometheusSpecialRegexEscape('looking?glass')).toEqual('looking\\\\?glass');
            expect(prometheusSpecialRegexEscape('looking.glass')).toEqual('looking\\\\.glass');
            expect(prometheusSpecialRegexEscape('looking(glass')).toEqual('looking\\\\(glass');
            expect(prometheusSpecialRegexEscape('looking)glass')).toEqual('looking\\\\)glass');
            expect(prometheusSpecialRegexEscape('looking\\glass')).toEqual('looking\\\\\\\\glass');
            expect(prometheusSpecialRegexEscape('looking|glass')).toEqual('looking\\\\|glass');
        });
        it('should escape multiple special characters', function () {
            expect(prometheusSpecialRegexEscape('+looking$glass?')).toEqual('\\\\+looking\\\\$glass\\\\?');
        });
    });
    describe('When interpolating variables', function () {
        beforeEach(function () {
            ctx.ds = new PrometheusDatasource(instanceSettings, q, ctx.backendSrvMock, ctx.templateSrvMock, ctx.timeSrvMock);
            ctx.variable = new CustomVariable({}, {});
        });
        describe('and value is a string', function () {
            it('should only escape single quotes', function () {
                expect(ctx.ds.interpolateQueryExpr("abc'$^*{}[]+?.()|", ctx.variable)).toEqual("abc\\\\'$^*{}[]+?.()|");
            });
        });
        describe('and value is a number', function () {
            it('should return a number', function () {
                expect(ctx.ds.interpolateQueryExpr(1000, ctx.variable)).toEqual(1000);
            });
        });
        describe('and variable allows multi-value', function () {
            beforeEach(function () {
                ctx.variable.multi = true;
            });
            it('should regex escape values if the value is a string', function () {
                expect(ctx.ds.interpolateQueryExpr('looking*glass', ctx.variable)).toEqual('looking\\\\*glass');
            });
            it('should return pipe separated values if the value is an array of strings', function () {
                expect(ctx.ds.interpolateQueryExpr(['a|bc', 'de|f'], ctx.variable)).toEqual('a\\\\|bc|de\\\\|f');
            });
        });
        describe('and variable allows all', function () {
            beforeEach(function () {
                ctx.variable.includeAll = true;
            });
            it('should regex escape values if the array is a string', function () {
                expect(ctx.ds.interpolateQueryExpr('looking*glass', ctx.variable)).toEqual('looking\\\\*glass');
            });
            it('should return pipe separated values if the value is an array of strings', function () {
                expect(ctx.ds.interpolateQueryExpr(['a|bc', 'de|f'], ctx.variable)).toEqual('a\\\\|bc|de\\\\|f');
            });
        });
    });
    describe('metricFindQuery', function () {
        beforeEach(function () {
            var query = 'query_result(topk(5,rate(http_request_duration_microseconds_count[$__interval])))';
            ctx.templateSrvMock.replace = jest.fn();
            ctx.timeSrvMock.timeRange = function () {
                return {
                    from: dateTime(1531468681),
                    to: dateTime(1531489712),
                };
            };
            ctx.ds = new PrometheusDatasource(instanceSettings, q, ctx.backendSrvMock, ctx.templateSrvMock, ctx.timeSrvMock);
            ctx.ds.metricFindQuery(query);
        });
        it('should call templateSrv.replace with scopedVars', function () {
            expect(ctx.templateSrvMock.replace.mock.calls[0][1]).toBeDefined();
        });
        it('should have the correct range and range_ms', function () {
            var range = ctx.templateSrvMock.replace.mock.calls[0][1].__range;
            var rangeMs = ctx.templateSrvMock.replace.mock.calls[0][1].__range_ms;
            var rangeS = ctx.templateSrvMock.replace.mock.calls[0][1].__range_s;
            expect(range).toEqual({ text: '21s', value: '21s' });
            expect(rangeMs).toEqual({ text: 21031, value: 21031 });
            expect(rangeS).toEqual({ text: 21, value: 21 });
        });
        it('should pass the default interval value', function () {
            var interval = ctx.templateSrvMock.replace.mock.calls[0][1].__interval;
            var intervalMs = ctx.templateSrvMock.replace.mock.calls[0][1].__interval_ms;
            expect(interval).toEqual({ text: '15s', value: '15s' });
            expect(intervalMs).toEqual({ text: 15000, value: 15000 });
        });
    });
});
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var time = function (_a) {
    var _b = _a.hours, hours = _b === void 0 ? 0 : _b, _c = _a.seconds, seconds = _c === void 0 ? 0 : _c, _d = _a.minutes, minutes = _d === void 0 ? 0 : _d;
    return dateTime(hours * HOUR + minutes * MINUTE + seconds * SECOND);
};
var ctx = {};
var instanceSettings = {
    url: 'proxied',
    directUrl: 'direct',
    user: 'test',
    password: 'mupp',
    jsonData: { httpMethod: 'GET' },
};
var backendSrv = {
    datasourceRequest: jest.fn(),
};
var templateSrv = {
    getAdhocFilters: function () { return []; },
    replace: jest.fn(function (str) { return str; }),
};
var timeSrv = {
    timeRange: function () {
        return {
            from: dateTime(1531468681),
            to: dateTime(1531468681 + 2000),
        };
    },
};
describe('PrometheusDatasource', function () {
    describe('When querying prometheus with one target using query editor target spec', function () {
        describe('and query syntax is valid', function () {
            var results;
            var query = {
                range: { from: time({ seconds: 63 }), to: time({ seconds: 183 }) },
                targets: [{ expr: 'test{job="testjob"}', format: 'time_series' }],
                interval: '60s',
            };
            // Interval alignment with step
            var urlExpected = 'proxied/api/v1/query_range?query=' + encodeURIComponent('test{job="testjob"}') + '&start=60&end=180&step=60';
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var response;
                return tslib_1.__generator(this, function (_a) {
                    response = {
                        data: {
                            status: 'success',
                            data: {
                                resultType: 'matrix',
                                result: [
                                    {
                                        metric: { __name__: 'test', job: 'testjob' },
                                        values: [[60, '3846']],
                                    },
                                ],
                            },
                        },
                    };
                    backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                    ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                    ctx.ds.query(query).subscribe(function (data) {
                        results = data;
                    });
                    return [2 /*return*/];
                });
            }); });
            it('should generate the correct query', function () {
                var res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
            });
            it('should return series list', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    expect(results.data.length).toBe(1);
                    expect(results.data[0].target).toBe('test{job="testjob"}');
                    return [2 /*return*/];
                });
            }); });
        });
        describe('and query syntax is invalid', function () {
            var results;
            var query = {
                range: { from: time({ seconds: 63 }), to: time({ seconds: 183 }) },
                targets: [{ expr: 'tes;;t{job="testjob"}', format: 'time_series' }],
                interval: '60s',
            };
            var errMessage = 'parse error at char 25: could not parse remaining input';
            var response = {
                data: {
                    status: 'error',
                    errorType: 'bad_data',
                    error: errMessage,
                },
            };
            it('should generate an error', function () {
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.reject(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query).subscribe(function (e) {
                    results = e.message;
                    expect(results).toBe("\"" + errMessage + "\"");
                });
            });
        });
    });
    describe('When querying prometheus with one target which returns multiple series', function () {
        var results;
        var start = 60;
        var end = 360;
        var step = 60;
        var query = {
            range: { from: time({ seconds: start }), to: time({ seconds: end }) },
            targets: [{ expr: 'test{job="testjob"}', format: 'time_series' }],
            interval: '60s',
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                response = {
                    status: 'success',
                    data: {
                        data: {
                            resultType: 'matrix',
                            result: [
                                {
                                    metric: { __name__: 'test', job: 'testjob', series: 'series 1' },
                                    values: [[start + step * 1, '3846'], [start + step * 3, '3847'], [end - step * 1, '3848']],
                                },
                                {
                                    metric: { __name__: 'test', job: 'testjob', series: 'series 2' },
                                    values: [[start + step * 2, '4846']],
                                },
                            ],
                        },
                    },
                };
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query).subscribe(function (data) {
                    results = data;
                });
                return [2 /*return*/];
            });
        }); });
        it('should be same length', function () {
            expect(results.data.length).toBe(2);
            expect(results.data[0].datapoints.length).toBe((end - start) / step + 1);
            expect(results.data[1].datapoints.length).toBe((end - start) / step + 1);
        });
        it('should fill null until first datapoint in response', function () {
            expect(results.data[0].datapoints[0][1]).toBe(start * 1000);
            expect(results.data[0].datapoints[0][0]).toBe(null);
            expect(results.data[0].datapoints[1][1]).toBe((start + step * 1) * 1000);
            expect(results.data[0].datapoints[1][0]).toBe(3846);
        });
        it('should fill null after last datapoint in response', function () {
            var length = (end - start) / step + 1;
            expect(results.data[0].datapoints[length - 2][1]).toBe((end - step * 1) * 1000);
            expect(results.data[0].datapoints[length - 2][0]).toBe(3848);
            expect(results.data[0].datapoints[length - 1][1]).toBe(end * 1000);
            expect(results.data[0].datapoints[length - 1][0]).toBe(null);
        });
        it('should fill null at gap between series', function () {
            expect(results.data[0].datapoints[2][1]).toBe((start + step * 2) * 1000);
            expect(results.data[0].datapoints[2][0]).toBe(null);
            expect(results.data[1].datapoints[1][1]).toBe((start + step * 1) * 1000);
            expect(results.data[1].datapoints[1][0]).toBe(null);
            expect(results.data[1].datapoints[3][1]).toBe((start + step * 3) * 1000);
            expect(results.data[1].datapoints[3][0]).toBe(null);
        });
    });
    describe('When querying prometheus with one target and instant = true', function () {
        var results;
        var urlExpected = 'proxied/api/v1/query?query=' + encodeURIComponent('test{job="testjob"}') + '&time=123';
        var query = {
            range: { from: time({ seconds: 63 }), to: time({ seconds: 123 }) },
            targets: [{ expr: 'test{job="testjob"}', format: 'time_series', instant: true }],
            interval: '60s',
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                response = {
                    status: 'success',
                    data: {
                        data: {
                            resultType: 'vector',
                            result: [
                                {
                                    metric: { __name__: 'test', job: 'testjob' },
                                    value: [123, '3846'],
                                },
                            ],
                        },
                    },
                };
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query).subscribe(function (data) {
                    results = data;
                });
                return [2 /*return*/];
            });
        }); });
        it('should generate the correct query', function () {
            var res = backendSrv.datasourceRequest.mock.calls[0][0];
            expect(res.method).toBe('GET');
            expect(res.url).toBe(urlExpected);
        });
        it('should return series list', function () {
            expect(results.data.length).toBe(1);
            expect(results.data[0].target).toBe('test{job="testjob"}');
        });
    });
    describe('When performing annotationQuery', function () {
        var results;
        var options = {
            annotation: {
                expr: 'ALERTS{alertstate="firing"}',
                tagKeys: 'job',
                titleFormat: '{{alertname}}',
                textFormat: '{{instance}}',
            },
            range: {
                from: time({ seconds: 63 }),
                to: time({ seconds: 123 }),
            },
        };
        var response = {
            status: 'success',
            data: {
                data: {
                    resultType: 'matrix',
                    result: [
                        {
                            metric: {
                                __name__: 'ALERTS',
                                alertname: 'InstanceDown',
                                alertstate: 'firing',
                                instance: 'testinstance',
                                job: 'testjob',
                            },
                            values: [[123, '1']],
                        },
                    ],
                },
            },
        };
        describe('when time series query is cancelled', function () {
            it('should return empty results', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve({ cancelled: true }); });
                            ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                            return [4 /*yield*/, ctx.ds.annotationQuery(options).then(function (data) {
                                    results = data;
                                })];
                        case 1:
                            _a.sent();
                            expect(results).toEqual([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('not use useValueForTime', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options.annotation.useValueForTime = false;
                            backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                            ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                            return [4 /*yield*/, ctx.ds.annotationQuery(options).then(function (data) {
                                    results = data;
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return annotation list', function () {
                expect(results.length).toBe(1);
                expect(results[0].tags).toContain('testjob');
                expect(results[0].title).toBe('InstanceDown');
                expect(results[0].text).toBe('testinstance');
                expect(results[0].time).toBe(123 * 1000);
            });
        });
        describe('use useValueForTime', function () {
            beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options.annotation.useValueForTime = true;
                            backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                            ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                            return [4 /*yield*/, ctx.ds.annotationQuery(options).then(function (data) {
                                    results = data;
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return annotation list', function () {
                expect(results[0].time).toEqual(1);
            });
        });
        describe('step parameter', function () {
            beforeEach(function () {
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
            });
            it('should use default step for short range if no interval is given', function () {
                var query = tslib_1.__assign({}, options, { range: {
                        from: time({ seconds: 63 }),
                        to: time({ seconds: 123 }),
                    } });
                ctx.ds.annotationQuery(query);
                var req = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(req.url).toContain('step=60');
            });
            it('should use custom step for short range', function () {
                var annotation = tslib_1.__assign({}, options.annotation, { step: '10s' });
                var query = tslib_1.__assign({}, options, { annotation: annotation, range: {
                        from: time({ seconds: 63 }),
                        to: time({ seconds: 123 }),
                    } });
                ctx.ds.annotationQuery(query);
                var req = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(req.url).toContain('step=10');
            });
            it('should use custom step for short range', function () {
                var annotation = tslib_1.__assign({}, options.annotation, { step: '10s' });
                var query = tslib_1.__assign({}, options, { annotation: annotation, range: {
                        from: time({ seconds: 63 }),
                        to: time({ seconds: 123 }),
                    } });
                ctx.ds.annotationQuery(query);
                var req = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(req.url).toContain('step=10');
            });
            it('should use dynamic step on long ranges if no option was given', function () {
                var query = tslib_1.__assign({}, options, { range: {
                        from: time({ seconds: 63 }),
                        to: time({ hours: 24 * 30, seconds: 63 }),
                    } });
                ctx.ds.annotationQuery(query);
                var req = backendSrv.datasourceRequest.mock.calls[0][0];
                // Range in seconds: (to - from) / 1000
                // Max_datapoints: 11000
                // Step: range / max_datapoints
                var step = 236;
                expect(req.url).toContain("step=" + step);
            });
        });
    });
    describe('When resultFormat is table and instant = true', function () {
        var results;
        var query = {
            range: { from: time({ seconds: 63 }), to: time({ seconds: 123 }) },
            targets: [{ expr: 'test{job="testjob"}', format: 'time_series', instant: true }],
            interval: '60s',
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                response = {
                    status: 'success',
                    data: {
                        data: {
                            resultType: 'vector',
                            result: [
                                {
                                    metric: { __name__: 'test', job: 'testjob' },
                                    value: [123, '3846'],
                                },
                            ],
                        },
                    },
                };
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query).subscribe(function (data) {
                    results = data;
                });
                return [2 /*return*/];
            });
        }); });
        it('should return result', function () {
            expect(results).not.toBe(null);
        });
    });
    describe('The "step" query parameter', function () {
        var response = {
            status: 'success',
            data: {
                data: {
                    resultType: 'matrix',
                    result: [],
                },
            },
        };
        it('should be min interval when greater than auto interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'test',
                            interval: '10s',
                        },
                    ],
                    interval: '5s',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test&start=60&end=420&step=10';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('step should never go below 1', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [{ expr: 'test' }],
                    interval: '100ms',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test&start=60&end=420&step=1';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should be auto interval when greater than min interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'test',
                            interval: '5s',
                        },
                    ],
                    interval: '10s',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test&start=60&end=420&step=10';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should result in querying fewer than 11000 data points', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, end, start, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 hour range
                    range: { from: time({ hours: 1 }), to: time({ hours: 7 }) },
                    targets: [{ expr: 'test' }],
                    interval: '1s',
                };
                end = 7 * 60 * 60;
                start = 60 * 60;
                urlExpected = 'proxied/api/v1/query_range?query=test&start=' + start + '&end=' + end + '&step=2';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should not apply min interval when interval * intervalFactor greater', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'test',
                            interval: '10s',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '5s',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test&start=50&end=400&step=50';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should apply min interval when interval * intervalFactor smaller', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'test',
                            interval: '15s',
                            intervalFactor: 2,
                        },
                    ],
                    interval: '5s',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test' + '&start=60&end=420&step=15';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should apply intervalFactor to auto interval when greater', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'test',
                            interval: '5s',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '10s',
                };
                urlExpected = 'proxied/api/v1/query_range?query=test' + '&start=0&end=400&step=100';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should not not be affected by the 11000 data points limit when large enough', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, end, start, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 1 week range
                    range: { from: time({}), to: time({ hours: 7 * 24 }) },
                    targets: [
                        {
                            expr: 'test',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '10s',
                };
                end = 7 * 24 * 60 * 60;
                start = 0;
                urlExpected = 'proxied/api/v1/query_range?query=test' + '&start=' + start + '&end=' + end + '&step=100';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
        it('should be determined by the 11000 data points limit when too small', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, end, start, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 1 week range
                    range: { from: time({}), to: time({ hours: 7 * 24 }) },
                    targets: [
                        {
                            expr: 'test',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '5s',
                };
                end = 7 * 24 * 60 * 60;
                start = 0;
                urlExpected = 'proxied/api/v1/query_range?query=test' + '&start=' + start + '&end=' + end + '&step=60';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                return [2 /*return*/];
            });
        }); });
    });
    describe('The __interval and __interval_ms template variables', function () {
        var response = {
            status: 'success',
            data: {
                data: {
                    resultType: 'matrix',
                    result: [],
                },
            },
        };
        it('should be unchanged when auto interval is greater than min interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            interval: '5s',
                        },
                    ],
                    interval: '10s',
                    scopedVars: {
                        __interval: { text: '10s', value: '10s' },
                        __interval_ms: { text: 10 * 1000, value: 10 * 1000 },
                    },
                };
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=60&end=420&step=10';
                templateSrv.replace = jest.fn(function (str) { return str; });
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '10s',
                        value: '10s',
                    },
                    __interval_ms: {
                        text: 10000,
                        value: 10000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
        it('should be min interval when it is greater than auto interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            interval: '10s',
                        },
                    ],
                    interval: '5s',
                    scopedVars: {
                        __interval: { text: '5s', value: '5s' },
                        __interval_ms: { text: 5 * 1000, value: 5 * 1000 },
                    },
                };
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=60&end=420&step=10';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                templateSrv.replace = jest.fn(function (str) { return str; });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '5s',
                        value: '5s',
                    },
                    __interval_ms: {
                        text: 5000,
                        value: 5000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
        it('should account for intervalFactor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            interval: '5s',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '10s',
                    scopedVars: {
                        __interval: { text: '10s', value: '10s' },
                        __interval_ms: { text: 10 * 1000, value: 10 * 1000 },
                    },
                };
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=0&end=400&step=100';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                templateSrv.replace = jest.fn(function (str) { return str; });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '10s',
                        value: '10s',
                    },
                    __interval_ms: {
                        text: 10000,
                        value: 10000,
                    },
                });
                expect(query.scopedVars.__interval.text).toBe('10s');
                expect(query.scopedVars.__interval.value).toBe('10s');
                expect(query.scopedVars.__interval_ms.text).toBe(10 * 1000);
                expect(query.scopedVars.__interval_ms.value).toBe(10 * 1000);
                return [2 /*return*/];
            });
        }); });
        it('should be interval * intervalFactor when greater than min interval', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            interval: '10s',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '5s',
                    scopedVars: {
                        __interval: { text: '5s', value: '5s' },
                        __interval_ms: { text: 5 * 1000, value: 5 * 1000 },
                    },
                };
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=50&end=400&step=50';
                templateSrv.replace = jest.fn(function (str) { return str; });
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '5s',
                        value: '5s',
                    },
                    __interval_ms: {
                        text: 5000,
                        value: 5000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
        it('should be min interval when greater than interval * intervalFactor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 6 minute range
                    range: { from: time({ minutes: 1 }), to: time({ minutes: 7 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            interval: '15s',
                            intervalFactor: 2,
                        },
                    ],
                    interval: '5s',
                    scopedVars: {
                        __interval: { text: '5s', value: '5s' },
                        __interval_ms: { text: 5 * 1000, value: 5 * 1000 },
                    },
                };
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=60&end=420&step=15';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '5s',
                        value: '5s',
                    },
                    __interval_ms: {
                        text: 5000,
                        value: 5000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
        it('should be determined by the 11000 data points limit, accounting for intervalFactor', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var query, end, start, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                query = {
                    // 1 week range
                    range: { from: time({}), to: time({ hours: 7 * 24 }) },
                    targets: [
                        {
                            expr: 'rate(test[$__interval])',
                            intervalFactor: 10,
                        },
                    ],
                    interval: '5s',
                    scopedVars: {
                        __interval: { text: '5s', value: '5s' },
                        __interval_ms: { text: 5 * 1000, value: 5 * 1000 },
                    },
                };
                end = 7 * 24 * 60 * 60;
                start = 0;
                urlExpected = 'proxied/api/v1/query_range?query=' +
                    encodeURIComponent('rate(test[$__interval])') +
                    '&start=' +
                    start +
                    '&end=' +
                    end +
                    '&step=60';
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                templateSrv.replace = jest.fn(function (str) { return str; });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.method).toBe('GET');
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[0][1]).toEqual({
                    __interval: {
                        text: '5s',
                        value: '5s',
                    },
                    __interval_ms: {
                        text: 5000,
                        value: 5000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
    });
    describe('The __range, __range_s and __range_ms variables', function () {
        var response = {
            status: 'success',
            data: {
                data: {
                    resultType: 'matrix',
                    result: [],
                },
            },
        };
        it('should use overridden ranges, not dashboard ranges', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var expectedRangeSecond, expectedRangeString, query, urlExpected, res;
            return tslib_1.__generator(this, function (_a) {
                expectedRangeSecond = 3600;
                expectedRangeString = '1h';
                query = {
                    range: {
                        from: time({}),
                        to: time({ hours: 1 }),
                    },
                    targets: [
                        {
                            expr: 'test[${__range_s}s]',
                        },
                    ],
                    interval: '60s',
                };
                urlExpected = "proxied/api/v1/query_range?query=" + encodeURIComponent(query.targets[0].expr) + "&start=0&end=3600&step=60";
                templateSrv.replace = jest.fn(function (str) { return str; });
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query);
                res = backendSrv.datasourceRequest.mock.calls[0][0];
                expect(res.url).toBe(urlExpected);
                // @ts-ignore
                expect(templateSrv.replace.mock.calls[1][1]).toEqual({
                    __range_s: {
                        text: expectedRangeSecond,
                        value: expectedRangeSecond,
                    },
                    __range: {
                        text: expectedRangeString,
                        value: expectedRangeString,
                    },
                    __range_ms: {
                        text: expectedRangeSecond * 1000,
                        value: expectedRangeSecond * 1000,
                    },
                });
                return [2 /*return*/];
            });
        }); });
    });
});
describe('PrometheusDatasource for POST', function () {
    //   const ctx = new helpers.ServiceTestContext();
    var instanceSettings = {
        url: 'proxied',
        directUrl: 'direct',
        user: 'test',
        password: 'mupp',
        jsonData: { httpMethod: 'POST' },
    };
    describe('When querying prometheus with one target using query editor target spec', function () {
        var results;
        var urlExpected = 'proxied/api/v1/query_range';
        var dataExpected = {
            query: 'test{job="testjob"}',
            start: 1 * 60,
            end: 2 * 60,
            step: 60,
        };
        var query = {
            range: { from: time({ minutes: 1, seconds: 3 }), to: time({ minutes: 2, seconds: 3 }) },
            targets: [{ expr: 'test{job="testjob"}', format: 'time_series' }],
            interval: '60s',
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                response = {
                    status: 'success',
                    data: {
                        data: {
                            resultType: 'matrix',
                            result: [
                                {
                                    metric: { __name__: 'test', job: 'testjob' },
                                    values: [[2 * 60, '3846']],
                                },
                            ],
                        },
                    },
                };
                backendSrv.datasourceRequest = jest.fn(function () { return Promise.resolve(response); });
                ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
                ctx.ds.query(query).subscribe(function (data) {
                    results = data;
                });
                return [2 /*return*/];
            });
        }); });
        it('should generate the correct query', function () {
            var res = backendSrv.datasourceRequest.mock.calls[0][0];
            expect(res.method).toBe('POST');
            expect(res.url).toBe(urlExpected);
            expect(res.data).toEqual(dataExpected);
        });
        it('should return series list', function () {
            expect(results.data.length).toBe(1);
            expect(results.data[0].target).toBe('test{job="testjob"}');
        });
    });
    describe('When querying prometheus via check headers X-Dashboard-Id and X-Panel-Id', function () {
        var options = { dashboardId: 1, panelId: 2 };
        var httpOptions = {
            headers: {},
        };
        it('with proxy access tracing headers should be added', function () {
            ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
            ctx.ds._addTracingHeaders(httpOptions, options);
            expect(httpOptions.headers['X-Dashboard-Id']).toBe(1);
            expect(httpOptions.headers['X-Panel-Id']).toBe(2);
        });
        it('with direct access tracing headers should not be added', function () {
            instanceSettings.url = 'http://127.0.0.1:8000';
            ctx.ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
            ctx.ds._addTracingHeaders(httpOptions, options);
            expect(httpOptions.headers['X-Dashboard-Id']).toBe(undefined);
            expect(httpOptions.headers['X-Panel-Id']).toBe(undefined);
        });
    });
});
var getPrepareTargetsContext = function (target) {
    var instanceSettings = {
        url: 'proxied',
        directUrl: 'direct',
        user: 'test',
        password: 'mupp',
        jsonData: { httpMethod: 'POST' },
    };
    var start = 0;
    var end = 1;
    var panelId = '2';
    var options = { targets: [target], interval: '1s', panelId: panelId };
    var ds = new PrometheusDatasource(instanceSettings, q, backendSrv, templateSrv, timeSrv);
    var _a = ds.prepareTargets(options, start, end), queries = _a.queries, activeTargets = _a.activeTargets;
    return {
        queries: queries,
        activeTargets: activeTargets,
        start: start,
        end: end,
        panelId: panelId,
    };
};
describe('prepareTargets', function () {
    describe('when run from a Panel', function () {
        it('then it should just add targets', function () {
            var target = {
                refId: 'A',
                expr: 'up',
                context: PromContext.Panel,
            };
            var _a = getPrepareTargetsContext(target), queries = _a.queries, activeTargets = _a.activeTargets, panelId = _a.panelId, end = _a.end, start = _a.start;
            expect(queries.length).toBe(1);
            expect(activeTargets.length).toBe(1);
            expect(queries[0]).toEqual({
                end: end,
                expr: 'up',
                headers: {
                    'X-Dashboard-Id': undefined,
                    'X-Panel-Id': panelId,
                },
                hinting: undefined,
                instant: undefined,
                refId: target.refId,
                requestId: panelId + target.refId,
                start: start,
                step: 1,
            });
            expect(activeTargets[0]).toEqual(target);
        });
    });
    describe('when run from Explore', function () {
        describe('and both Graph and Table are shown', function () {
            it('then it should return both instant and time series related objects', function () {
                var target = {
                    refId: 'A',
                    expr: 'up',
                    context: PromContext.Explore,
                    showingGraph: true,
                    showingTable: true,
                };
                var _a = getPrepareTargetsContext(target), queries = _a.queries, activeTargets = _a.activeTargets, panelId = _a.panelId, end = _a.end, start = _a.start;
                expect(queries.length).toBe(2);
                expect(activeTargets.length).toBe(2);
                expect(queries[0]).toEqual({
                    end: end,
                    expr: 'up',
                    headers: {
                        'X-Dashboard-Id': undefined,
                        'X-Panel-Id': panelId,
                    },
                    hinting: undefined,
                    instant: true,
                    refId: target.refId,
                    requestId: panelId + target.refId + '_instant',
                    start: start,
                    step: 1,
                });
                expect(activeTargets[0]).toEqual(tslib_1.__assign({}, target, { format: 'table', instant: true, requestId: panelId + target.refId + '_instant', valueWithRefId: true }));
                expect(queries[1]).toEqual({
                    end: end,
                    expr: 'up',
                    headers: {
                        'X-Dashboard-Id': undefined,
                        'X-Panel-Id': panelId,
                    },
                    hinting: undefined,
                    instant: false,
                    refId: target.refId,
                    requestId: panelId + target.refId,
                    start: start,
                    step: 1,
                });
                expect(activeTargets[1]).toEqual(tslib_1.__assign({}, target, { format: 'time_series', instant: false, requestId: panelId + target.refId }));
            });
        });
        describe('and both Graph and Table are hidden', function () {
            it('then it should return empty arrays', function () {
                var target = {
                    refId: 'A',
                    expr: 'up',
                    context: PromContext.Explore,
                    showingGraph: false,
                    showingTable: false,
                };
                var _a = getPrepareTargetsContext(target), queries = _a.queries, activeTargets = _a.activeTargets;
                expect(queries.length).toBe(0);
                expect(activeTargets.length).toBe(0);
            });
        });
        describe('and Graph is hidden', function () {
            it('then it should return only intant related objects', function () {
                var target = {
                    refId: 'A',
                    expr: 'up',
                    context: PromContext.Explore,
                    showingGraph: false,
                    showingTable: true,
                };
                var _a = getPrepareTargetsContext(target), queries = _a.queries, activeTargets = _a.activeTargets, panelId = _a.panelId, end = _a.end, start = _a.start;
                expect(queries.length).toBe(1);
                expect(activeTargets.length).toBe(1);
                expect(queries[0]).toEqual({
                    end: end,
                    expr: 'up',
                    headers: {
                        'X-Dashboard-Id': undefined,
                        'X-Panel-Id': panelId,
                    },
                    hinting: undefined,
                    instant: true,
                    refId: target.refId,
                    requestId: panelId + target.refId + '_instant',
                    start: start,
                    step: 1,
                });
                expect(activeTargets[0]).toEqual(tslib_1.__assign({}, target, { format: 'table', instant: true, requestId: panelId + target.refId + '_instant', valueWithRefId: true }));
            });
        });
        describe('and Table is hidden', function () {
            it('then it should return only time series related objects', function () {
                var target = {
                    refId: 'A',
                    expr: 'up',
                    context: PromContext.Explore,
                    showingGraph: true,
                    showingTable: false,
                };
                var _a = getPrepareTargetsContext(target), queries = _a.queries, activeTargets = _a.activeTargets, panelId = _a.panelId, end = _a.end, start = _a.start;
                expect(queries.length).toBe(1);
                expect(activeTargets.length).toBe(1);
                expect(queries[0]).toEqual({
                    end: end,
                    expr: 'up',
                    headers: {
                        'X-Dashboard-Id': undefined,
                        'X-Panel-Id': panelId,
                    },
                    hinting: undefined,
                    instant: false,
                    refId: target.refId,
                    requestId: panelId + target.refId,
                    start: start,
                    step: 1,
                });
                expect(activeTargets[0]).toEqual(tslib_1.__assign({}, target, { format: 'time_series', instant: false, requestId: panelId + target.refId }));
            });
        });
    });
});
//# sourceMappingURL=datasource.test.js.map
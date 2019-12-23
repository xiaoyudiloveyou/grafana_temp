import * as tslib_1 from "tslib";
import angular from 'angular';
import { dateMath } from '@grafana/data';
import _ from 'lodash';
import { ElasticDatasource, getMaxConcurrenShardRequestOrDefault } from '../datasource';
import { toUtc, dateTime } from '@grafana/data';
describe('ElasticDatasource', function () {
    var _this = this;
    var backendSrv = {
        datasourceRequest: jest.fn(),
    };
    var $rootScope = {
        $on: jest.fn(),
        appEvent: jest.fn(),
    };
    var templateSrv = {
        replace: jest.fn(function (text) {
            if (text.startsWith('$')) {
                return "resolvedVariable";
            }
            else {
                return text;
            }
        }),
        getAdhocFilters: jest.fn(function () { return []; }),
    };
    var timeSrv = {
        time: { from: 'now-1h', to: 'now' },
        timeRange: jest.fn(function () {
            return {
                from: dateMath.parse(timeSrv.time.from, false),
                to: dateMath.parse(timeSrv.time.to, true),
            };
        }),
        setTime: jest.fn(function (time) {
            _this.time = time;
        }),
    };
    var ctx = {
        $rootScope: $rootScope,
        backendSrv: backendSrv,
    };
    function createDatasource(instanceSettings) {
        instanceSettings.jsonData = instanceSettings.jsonData || {};
        ctx.ds = new ElasticDatasource(instanceSettings, {}, backendSrv, templateSrv, timeSrv);
    }
    describe('When testing datasource with index pattern', function () {
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: '[asd-]YYYY.MM.DD',
                jsonData: { interval: 'Daily', esVersion: 2 },
            });
        });
        it('should translate index pattern to current day', function () {
            var requestOptions;
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                requestOptions = options;
                return Promise.resolve({ data: {} });
            });
            ctx.ds.testDatasource();
            var today = toUtc().format('YYYY.MM.DD');
            expect(requestOptions.url).toBe('http://es.com/asd-' + today + '/_mapping');
        });
    });
    describe('When issuing metric query with interval pattern', function () {
        var requestOptions, parts, header, query, result;
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createDatasource({
                            url: 'http://es.com',
                            database: '[asd-]YYYY.MM.DD',
                            jsonData: { interval: 'Daily', esVersion: 2 },
                        });
                        ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                            requestOptions = options;
                            return Promise.resolve({
                                data: {
                                    responses: [
                                        {
                                            aggregations: {
                                                '1': {
                                                    buckets: [
                                                        {
                                                            doc_count: 10,
                                                            key: 1000,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    ],
                                },
                            });
                        });
                        query = {
                            range: {
                                from: toUtc([2015, 4, 30, 10]),
                                to: toUtc([2015, 5, 1, 10]),
                            },
                            targets: [
                                {
                                    alias: '$varAlias',
                                    bucketAggs: [{ type: 'date_histogram', field: '@timestamp', id: '1' }],
                                    metrics: [{ type: 'count', id: '1' }],
                                    query: 'escape\\:test',
                                },
                            ],
                        };
                        return [4 /*yield*/, ctx.ds.query(query)];
                    case 1:
                        result = _a.sent();
                        parts = requestOptions.data.split('\n');
                        header = angular.fromJson(parts[0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should translate index pattern to current day', function () {
            expect(header.index).toEqual(['asd-2015.05.30', 'asd-2015.05.31', 'asd-2015.06.01']);
        });
        it('should not resolve the variable in the original alias field in the query', function () {
            expect(query.targets[0].alias).toEqual('$varAlias');
        });
        it('should resolve the alias variable for the alias/target in the result', function () {
            expect(result.data[0].target).toEqual('resolvedVariable');
        });
        it('should json escape lucene query', function () {
            var body = angular.fromJson(parts[1]);
            expect(body.query.bool.filter[1].query_string.query).toBe('escape\\:test');
        });
    });
    describe('When issuing logs query with interval pattern', function () {
        var query, queryBuilderSpy;
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createDatasource({
                            url: 'http://es.com',
                            database: 'mock-index',
                            jsonData: { interval: 'Daily', esVersion: 2, timeField: '@timestamp' },
                        });
                        ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                            return Promise.resolve({
                                data: {
                                    responses: [
                                        {
                                            aggregations: {
                                                '2': {
                                                    buckets: [
                                                        {
                                                            doc_count: 10,
                                                            key: 1000,
                                                        },
                                                        {
                                                            doc_count: 15,
                                                            key: 2000,
                                                        },
                                                    ],
                                                },
                                            },
                                            hits: {
                                                hits: [
                                                    {
                                                        '@timestamp': ['2019-06-24T09:51:19.765Z'],
                                                        _id: 'fdsfs',
                                                        _type: '_doc',
                                                        _index: 'mock-index',
                                                        _source: {
                                                            '@timestamp': '2019-06-24T09:51:19.765Z',
                                                            host: 'djisaodjsoad',
                                                            message: 'hello, i am a message',
                                                        },
                                                        fields: {
                                                            '@timestamp': ['2019-06-24T09:51:19.765Z'],
                                                        },
                                                    },
                                                    {
                                                        '@timestamp': ['2019-06-24T09:52:19.765Z'],
                                                        _id: 'kdospaidopa',
                                                        _type: '_doc',
                                                        _index: 'mock-index',
                                                        _source: {
                                                            '@timestamp': '2019-06-24T09:52:19.765Z',
                                                            host: 'dsalkdakdop',
                                                            message: 'hello, i am also message',
                                                        },
                                                        fields: {
                                                            '@timestamp': ['2019-06-24T09:52:19.765Z'],
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            });
                        });
                        query = {
                            range: {
                                from: toUtc([2015, 4, 30, 10]),
                                to: toUtc([2019, 7, 1, 10]),
                            },
                            targets: [
                                {
                                    alias: '$varAlias',
                                    refId: 'A',
                                    bucketAggs: [{ type: 'date_histogram', settings: { interval: 'auto' }, id: '2' }],
                                    metrics: [{ type: 'count', id: '1' }],
                                    query: 'escape\\:test',
                                    interval: '10s',
                                    isLogsQuery: true,
                                    timeField: '@timestamp',
                                },
                            ],
                        };
                        queryBuilderSpy = jest.spyOn(ctx.ds.queryBuilder, 'getLogsQuery');
                        return [4 /*yield*/, ctx.ds.query(query)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call getLogsQuery()', function () {
            expect(queryBuilderSpy).toHaveBeenCalled();
        });
    });
    describe('When issuing document query', function () {
        var requestOptions, parts, header;
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: 'test',
                jsonData: { esVersion: 2 },
            });
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                requestOptions = options;
                return Promise.resolve({ data: { responses: [] } });
            });
            ctx.ds.query({
                range: {
                    from: dateTime([2015, 4, 30, 10]),
                    to: dateTime([2015, 5, 1, 10]),
                },
                targets: [
                    {
                        bucketAggs: [],
                        metrics: [{ type: 'raw_document' }],
                        query: 'test',
                    },
                ],
            });
            parts = requestOptions.data.split('\n');
            header = angular.fromJson(parts[0]);
        });
        it('should set search type to query_then_fetch', function () {
            expect(header.search_type).toEqual('query_then_fetch');
        });
        it('should set size', function () {
            var body = angular.fromJson(parts[1]);
            expect(body.size).toBe(500);
        });
    });
    describe('When getting fields', function () {
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: 'metricbeat',
                jsonData: { esVersion: 50 },
            });
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({
                    data: {
                        metricbeat: {
                            mappings: {
                                metricsets: {
                                    _all: {},
                                    properties: {
                                        '@timestamp': { type: 'date' },
                                        beat: {
                                            properties: {
                                                name: {
                                                    fields: { raw: { type: 'keyword' } },
                                                    type: 'string',
                                                },
                                                hostname: { type: 'string' },
                                            },
                                        },
                                        system: {
                                            properties: {
                                                cpu: {
                                                    properties: {
                                                        system: { type: 'float' },
                                                        user: { type: 'float' },
                                                    },
                                                },
                                                process: {
                                                    properties: {
                                                        cpu: {
                                                            properties: {
                                                                total: { type: 'float' },
                                                            },
                                                        },
                                                        name: { type: 'string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            });
        });
        it('should return nested fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual([
                            '@timestamp',
                            'beat.name.raw',
                            'beat.name',
                            'beat.hostname',
                            'system.cpu.system',
                            'system.cpu.user',
                            'system.process.cpu.total',
                            'system.process.name',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return number fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                            type: 'number',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual(['system.cpu.system', 'system.cpu.user', 'system.process.cpu.total']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return date fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                            type: 'date',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual(['@timestamp']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('When getting fields from ES 7.0', function () {
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: 'genuine.es7._mapping.response',
                jsonData: { esVersion: 70 },
            });
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({
                    data: {
                        'genuine.es7._mapping.response': {
                            mappings: {
                                properties: {
                                    '@timestamp_millis': {
                                        type: 'date',
                                        format: 'epoch_millis',
                                    },
                                    classification_terms: {
                                        type: 'keyword',
                                    },
                                    domains: {
                                        type: 'keyword',
                                    },
                                    ip_address: {
                                        type: 'ip',
                                    },
                                    justification_blob: {
                                        properties: {
                                            criterion: {
                                                type: 'text',
                                                fields: {
                                                    keyword: {
                                                        type: 'keyword',
                                                        ignore_above: 256,
                                                    },
                                                },
                                            },
                                            overall_vote_score: {
                                                type: 'float',
                                            },
                                            shallow: {
                                                properties: {
                                                    jsi: {
                                                        properties: {
                                                            sdb: {
                                                                properties: {
                                                                    dsel2: {
                                                                        properties: {
                                                                            'bootlegged-gille': {
                                                                                properties: {
                                                                                    botness: {
                                                                                        type: 'float',
                                                                                    },
                                                                                    general_algorithm_score: {
                                                                                        type: 'float',
                                                                                    },
                                                                                },
                                                                            },
                                                                            'uncombed-boris': {
                                                                                properties: {
                                                                                    botness: {
                                                                                        type: 'float',
                                                                                    },
                                                                                    general_algorithm_score: {
                                                                                        type: 'float',
                                                                                    },
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    overall_vote_score: {
                                        type: 'float',
                                    },
                                    ua_terms_long: {
                                        type: 'keyword',
                                    },
                                    ua_terms_short: {
                                        type: 'keyword',
                                    },
                                },
                            },
                        },
                    },
                });
            });
        });
        it('should return nested fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual([
                            '@timestamp_millis',
                            'classification_terms',
                            'domains',
                            'ip_address',
                            'justification_blob.criterion.keyword',
                            'justification_blob.criterion',
                            'justification_blob.overall_vote_score',
                            'justification_blob.shallow.jsi.sdb.dsel2.bootlegged-gille.botness',
                            'justification_blob.shallow.jsi.sdb.dsel2.bootlegged-gille.general_algorithm_score',
                            'justification_blob.shallow.jsi.sdb.dsel2.uncombed-boris.botness',
                            'justification_blob.shallow.jsi.sdb.dsel2.uncombed-boris.general_algorithm_score',
                            'overall_vote_score',
                            'ua_terms_long',
                            'ua_terms_short',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return number fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                            type: 'number',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual([
                            'justification_blob.overall_vote_score',
                            'justification_blob.shallow.jsi.sdb.dsel2.bootlegged-gille.botness',
                            'justification_blob.shallow.jsi.sdb.dsel2.bootlegged-gille.general_algorithm_score',
                            'justification_blob.shallow.jsi.sdb.dsel2.uncombed-boris.botness',
                            'justification_blob.shallow.jsi.sdb.dsel2.uncombed-boris.general_algorithm_score',
                            'overall_vote_score',
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return date fields', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var fieldObjects, fields;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.ds.getFields({
                            find: 'fields',
                            query: '*',
                            type: 'date',
                        })];
                    case 1:
                        fieldObjects = _a.sent();
                        fields = _.map(fieldObjects, 'text');
                        expect(fields).toEqual(['@timestamp_millis']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('When issuing aggregation query on es5.x', function () {
        var requestOptions, parts, header;
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: 'test',
                jsonData: { esVersion: 5 },
            });
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                requestOptions = options;
                return Promise.resolve({ data: { responses: [] } });
            });
            ctx.ds.query({
                range: {
                    from: dateTime([2015, 4, 30, 10]),
                    to: dateTime([2015, 5, 1, 10]),
                },
                targets: [
                    {
                        bucketAggs: [{ type: 'date_histogram', field: '@timestamp', id: '2' }],
                        metrics: [{ type: 'count' }],
                        query: 'test',
                    },
                ],
            });
            parts = requestOptions.data.split('\n');
            header = angular.fromJson(parts[0]);
        });
        it('should not set search type to count', function () {
            expect(header.search_type).not.toEqual('count');
        });
        it('should set size to 0', function () {
            var body = angular.fromJson(parts[1]);
            expect(body.size).toBe(0);
        });
    });
    describe('When issuing metricFind query on es5.x', function () {
        var requestOptions, parts, header, body, results;
        beforeEach(function () {
            createDatasource({
                url: 'http://es.com',
                database: 'test',
                jsonData: { esVersion: 5 },
            });
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                requestOptions = options;
                return Promise.resolve({
                    data: {
                        responses: [
                            {
                                aggregations: {
                                    '1': {
                                        buckets: [
                                            { doc_count: 1, key: 'test' },
                                            {
                                                doc_count: 2,
                                                key: 'test2',
                                                key_as_string: 'test2_as_string',
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                });
            });
            ctx.ds.metricFindQuery('{"find": "terms", "field": "test"}').then(function (res) {
                results = res;
            });
            parts = requestOptions.data.split('\n');
            header = angular.fromJson(parts[0]);
            body = angular.fromJson(parts[1]);
        });
        it('should get results', function () {
            expect(results.length).toEqual(2);
        });
        it('should use key or key_as_string', function () {
            expect(results[0].text).toEqual('test');
            expect(results[1].text).toEqual('test2_as_string');
        });
        it('should not set search type to count', function () {
            expect(header.search_type).not.toEqual('count');
        });
        it('should set size to 0', function () {
            expect(body.size).toBe(0);
        });
        it('should not set terms aggregation size to 0', function () {
            expect(body['aggs']['1']['terms'].size).not.toBe(0);
        });
    });
});
describe('getMaxConcurrenShardRequestOrDefault', function () {
    var testCases = [
        { version: 50, expectedMaxConcurrentShardRequests: 256 },
        { version: 50, maxConcurrentShardRequests: 50, expectedMaxConcurrentShardRequests: 50 },
        { version: 56, expectedMaxConcurrentShardRequests: 256 },
        { version: 56, maxConcurrentShardRequests: 256, expectedMaxConcurrentShardRequests: 256 },
        { version: 56, maxConcurrentShardRequests: 5, expectedMaxConcurrentShardRequests: 256 },
        { version: 56, maxConcurrentShardRequests: 200, expectedMaxConcurrentShardRequests: 200 },
        { version: 70, expectedMaxConcurrentShardRequests: 5 },
        { version: 70, maxConcurrentShardRequests: 256, expectedMaxConcurrentShardRequests: 5 },
        { version: 70, maxConcurrentShardRequests: 5, expectedMaxConcurrentShardRequests: 5 },
        { version: 70, maxConcurrentShardRequests: 6, expectedMaxConcurrentShardRequests: 6 },
    ];
    testCases.forEach(function (tc) {
        it("version = " + tc.version + ", maxConcurrentShardRequests = " + tc.maxConcurrentShardRequests, function () {
            var options = { esVersion: tc.version, maxConcurrentShardRequests: tc.maxConcurrentShardRequests };
            expect(getMaxConcurrenShardRequestOrDefault(options)).toBe(tc.expectedMaxConcurrentShardRequests);
        });
    });
});
//# sourceMappingURL=datasource.test.js.map
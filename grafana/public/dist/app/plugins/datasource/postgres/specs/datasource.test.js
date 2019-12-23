import { PostgresDatasource } from '../datasource';
import { CustomVariable } from 'app/features/templating/custom_variable';
import { toUtc, dateTime } from '@grafana/data';
import { TemplateSrv } from 'app/features/templating/template_srv';
describe('PostgreSQLDatasource', function () {
    var instanceSettings = { name: 'postgresql' };
    var backendSrv = {};
    var templateSrv = new TemplateSrv();
    var raw = {
        from: toUtc('2018-04-25 10:00'),
        to: toUtc('2018-04-25 11:00'),
    };
    var ctx = {
        backendSrv: backendSrv,
        timeSrvMock: {
            timeRange: function () { return ({
                from: raw.from,
                to: raw.to,
                raw: raw,
            }); },
        },
    };
    beforeEach(function () {
        ctx.ds = new PostgresDatasource(instanceSettings, backendSrv, {}, templateSrv, ctx.timeSrvMock);
    });
    describe('When performing annotationQuery', function () {
        var results;
        var annotationName = 'MyAnno';
        var options = {
            annotation: {
                name: annotationName,
                rawQuery: 'select time, title, text, tags from table;',
            },
            range: {
                from: dateTime(1432288354),
                to: dateTime(1432288401),
            },
        };
        var response = {
            results: {
                MyAnno: {
                    refId: annotationName,
                    tables: [
                        {
                            columns: [{ text: 'time' }, { text: 'text' }, { text: 'tags' }],
                            rows: [
                                [1432288355, 'some text', 'TagA,TagB'],
                                [1432288390, 'some text2', ' TagB , TagC'],
                                [1432288400, 'some text3'],
                            ],
                        },
                    ],
                },
            },
        };
        beforeEach(function () {
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({ data: response, status: 200 });
            });
            ctx.ds.annotationQuery(options).then(function (data) {
                results = data;
            });
        });
        it('should return annotation list', function () {
            expect(results.length).toBe(3);
            expect(results[0].text).toBe('some text');
            expect(results[0].tags[0]).toBe('TagA');
            expect(results[0].tags[1]).toBe('TagB');
            expect(results[1].tags[0]).toBe('TagB');
            expect(results[1].tags[1]).toBe('TagC');
            expect(results[2].tags.length).toBe(0);
        });
    });
    describe('When performing metricFindQuery', function () {
        var results;
        var query = 'select * from atable';
        var response = {
            results: {
                tempvar: {
                    meta: {
                        rowCount: 3,
                    },
                    refId: 'tempvar',
                    tables: [
                        {
                            columns: [{ text: 'title' }, { text: 'text' }],
                            rows: [['aTitle', 'some text'], ['aTitle2', 'some text2'], ['aTitle3', 'some text3']],
                        },
                    ],
                },
            },
        };
        beforeEach(function () {
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({ data: response, status: 200 });
            });
            ctx.ds.metricFindQuery(query).then(function (data) {
                results = data;
            });
        });
        it('should return list of all column values', function () {
            expect(results.length).toBe(6);
            expect(results[0].text).toBe('aTitle');
            expect(results[5].text).toBe('some text3');
        });
    });
    describe('When performing metricFindQuery with key, value columns', function () {
        var results;
        var query = 'select * from atable';
        var response = {
            results: {
                tempvar: {
                    meta: {
                        rowCount: 3,
                    },
                    refId: 'tempvar',
                    tables: [
                        {
                            columns: [{ text: '__value' }, { text: '__text' }],
                            rows: [['value1', 'aTitle'], ['value2', 'aTitle2'], ['value3', 'aTitle3']],
                        },
                    ],
                },
            },
        };
        beforeEach(function () {
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({ data: response, status: 200 });
            });
            ctx.ds.metricFindQuery(query).then(function (data) {
                results = data;
            });
        });
        it('should return list of as text, value', function () {
            expect(results.length).toBe(3);
            expect(results[0].text).toBe('aTitle');
            expect(results[0].value).toBe('value1');
            expect(results[2].text).toBe('aTitle3');
            expect(results[2].value).toBe('value3');
        });
    });
    describe('When performing metricFindQuery with key, value columns and with duplicate keys', function () {
        var results;
        var query = 'select * from atable';
        var response = {
            results: {
                tempvar: {
                    meta: {
                        rowCount: 3,
                    },
                    refId: 'tempvar',
                    tables: [
                        {
                            columns: [{ text: '__text' }, { text: '__value' }],
                            rows: [['aTitle', 'same'], ['aTitle', 'same'], ['aTitle', 'diff']],
                        },
                    ],
                },
            },
        };
        beforeEach(function () {
            ctx.backendSrv.datasourceRequest = jest.fn(function (options) {
                return Promise.resolve({ data: response, status: 200 });
            });
            ctx.ds.metricFindQuery(query).then(function (data) {
                results = data;
            });
            //ctx.$rootScope.$apply();
        });
        it('should return list of unique keys', function () {
            expect(results.length).toBe(1);
            expect(results[0].text).toBe('aTitle');
            expect(results[0].value).toBe('same');
        });
    });
    describe('When interpolating variables', function () {
        beforeEach(function () {
            ctx.variable = new CustomVariable({}, {});
        });
        describe('and value is a string', function () {
            it('should return an unquoted value', function () {
                expect(ctx.ds.interpolateVariable('abc', ctx.variable)).toEqual('abc');
            });
        });
        describe('and value is a number', function () {
            it('should return an unquoted value', function () {
                expect(ctx.ds.interpolateVariable(1000, ctx.variable)).toEqual(1000);
            });
        });
        describe('and value is an array of strings', function () {
            it('should return comma separated quoted values', function () {
                expect(ctx.ds.interpolateVariable(['a', 'b', 'c'], ctx.variable)).toEqual("'a','b','c'");
            });
        });
        describe('and variable allows multi-value and is a string', function () {
            it('should return a quoted value', function () {
                ctx.variable.multi = true;
                expect(ctx.ds.interpolateVariable('abc', ctx.variable)).toEqual("'abc'");
            });
        });
        describe('and variable contains single quote', function () {
            it('should return a quoted value', function () {
                ctx.variable.multi = true;
                expect(ctx.ds.interpolateVariable("a'bc", ctx.variable)).toEqual("'a''bc'");
                expect(ctx.ds.interpolateVariable("a'b'c", ctx.variable)).toEqual("'a''b''c'");
            });
        });
        describe('and variable allows all and is a string', function () {
            it('should return a quoted value', function () {
                ctx.variable.includeAll = true;
                expect(ctx.ds.interpolateVariable('abc', ctx.variable)).toEqual("'abc'");
            });
        });
    });
    describe('targetContainsTemplate', function () {
        it('given query that contains template variable it should return true', function () {
            var rawSql = "SELECT\n      $__timeGroup(\"createdAt\",'$summarize'),\n      avg(value) as \"value\",\n      hostname as \"metric\"\n    FROM\n      grafana_metric\n    WHERE\n      $__timeFilter(\"createdAt\") AND\n      measurement = 'logins.count' AND\n      hostname IN($host)\n    GROUP BY time, metric\n    ORDER BY time";
            var query = {
                rawSql: rawSql,
                rawQuery: true,
            };
            templateSrv.init([
                { type: 'query', name: 'summarize', current: { value: '1m' } },
                { type: 'query', name: 'host', current: { value: 'a' } },
            ]);
            expect(ctx.ds.targetContainsTemplate(query)).toBeTruthy();
        });
        it('given query that only contains global template variable it should return false', function () {
            var rawSql = "SELECT\n      $__timeGroup(\"createdAt\",'$__interval'),\n      avg(value) as \"value\",\n      hostname as \"metric\"\n    FROM\n      grafana_metric\n    WHERE\n      $__timeFilter(\"createdAt\") AND\n      measurement = 'logins.count'\n    GROUP BY time, metric\n    ORDER BY time";
            var query = {
                rawSql: rawSql,
                rawQuery: true,
            };
            templateSrv.init([
                { type: 'query', name: 'summarize', current: { value: '1m' } },
                { type: 'query', name: 'host', current: { value: 'a' } },
            ]);
            expect(ctx.ds.targetContainsTemplate(query)).toBeFalsy();
        });
    });
});
//# sourceMappingURL=datasource.test.js.map
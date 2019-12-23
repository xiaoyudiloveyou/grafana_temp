import { MssqlDatasource } from '../datasource';
import { TimeSrvStub } from 'test/specs/helpers';
import { CustomVariable } from 'app/features/templating/custom_variable';
// @ts-ignore
import q from 'q';
import { dateTime } from '@grafana/data';
import { TemplateSrv } from 'app/features/templating/template_srv';
describe('MSSQLDatasource', function () {
    var templateSrv = new TemplateSrv();
    var ctx = {
        backendSrv: {},
        timeSrv: new TimeSrvStub(),
    };
    beforeEach(function () {
        ctx.$q = q;
        ctx.instanceSettings = { name: 'mssql' };
        ctx.ds = new MssqlDatasource(ctx.instanceSettings, ctx.backendSrv, ctx.$q, templateSrv, ctx.timeSrv);
    });
    describe('When performing annotationQuery', function () {
        var results;
        var annotationName = 'MyAnno';
        var options = {
            annotation: {
                name: annotationName,
                rawQuery: 'select time, text, tags from table;',
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
                                [1521545610656, 'some text', 'TagA,TagB'],
                                [1521546251185, 'some text2', ' TagB , TagC'],
                                [1521546501378, 'some text3'],
                            ],
                        },
                    ],
                },
            },
        };
        beforeEach(function () {
            ctx.backendSrv.datasourceRequest = function (options) {
                return ctx.$q.when({ data: response, status: 200 });
            };
            return ctx.ds.annotationQuery(options).then(function (data) {
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
            ctx.backendSrv.datasourceRequest = function (options) {
                return ctx.$q.when({ data: response, status: 200 });
            };
            return ctx.ds.metricFindQuery(query).then(function (data) {
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
            ctx.backendSrv.datasourceRequest = function (options) {
                return ctx.$q.when({ data: response, status: 200 });
            };
            return ctx.ds.metricFindQuery(query).then(function (data) {
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
            ctx.backendSrv.datasourceRequest = function (options) {
                return ctx.$q.when({ data: response, status: 200 });
            };
            return ctx.ds.metricFindQuery(query).then(function (data) {
                results = data;
            });
        });
        it('should return list of unique keys', function () {
            expect(results.length).toBe(1);
            expect(results[0].text).toBe('aTitle');
            expect(results[0].value).toBe('same');
        });
    });
    describe('When performing metricFindQuery', function () {
        var results;
        var query = 'select * from atable';
        var response = {
            results: {
                tempvar: {
                    meta: {
                        rowCount: 1,
                    },
                    refId: 'tempvar',
                    tables: [
                        {
                            columns: [{ text: 'title' }],
                            rows: [['aTitle']],
                        },
                    ],
                },
            },
        };
        var time = {
            from: dateTime(1521545610656),
            to: dateTime(1521546251185),
        };
        beforeEach(function () {
            ctx.timeSrv.setTime(time);
            ctx.backendSrv.datasourceRequest = function (options) {
                results = options.data;
                return ctx.$q.when({ data: response, status: 200 });
            };
            return ctx.ds.metricFindQuery(query);
        });
        it('should pass timerange to datasourceRequest', function () {
            expect(results.from).toBe(time.from.valueOf().toString());
            expect(results.to).toBe(time.to.valueOf().toString());
            expect(results.queries.length).toBe(1);
            expect(results.queries[0].rawSql).toBe(query);
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
        describe('and variable allows multi-value and value is a string', function () {
            it('should return a quoted value', function () {
                ctx.variable.multi = true;
                expect(ctx.ds.interpolateVariable('abc', ctx.variable)).toEqual("'abc'");
            });
        });
        describe('and variable contains single quote', function () {
            it('should return a quoted value', function () {
                ctx.variable.multi = true;
                expect(ctx.ds.interpolateVariable("a'bc", ctx.variable)).toEqual("'a''bc'");
            });
        });
        describe('and variable allows all and value is a string', function () {
            it('should return a quoted value', function () {
                ctx.variable.includeAll = true;
                expect(ctx.ds.interpolateVariable('abc', ctx.variable)).toEqual("'abc'");
            });
        });
    });
    describe('targetContainsTemplate', function () {
        it('given query that contains template variable it should return true', function () {
            var rawSql = "SELECT\n      $__timeGroup(createdAt,'$summarize') as time,\n      avg(value) as value,\n      hostname as metric\n    FROM\n      grafana_metric\n    WHERE\n      $__timeFilter(createdAt) AND\n      measurement = 'logins.count' AND\n      hostname IN($host)\n    GROUP BY $__timeGroup(createdAt,'$summarize'), hostname\n    ORDER BY 1";
            var query = {
                rawSql: rawSql,
            };
            templateSrv.init([
                { type: 'query', name: 'summarize', current: { value: '1m' } },
                { type: 'query', name: 'host', current: { value: 'a' } },
            ]);
            expect(ctx.ds.targetContainsTemplate(query)).toBeTruthy();
        });
        it('given query that only contains global template variable it should return false', function () {
            var rawSql = "SELECT\n      $__timeGroup(createdAt,'$__interval') as time,\n      avg(value) as value,\n      hostname as metric\n    FROM\n      grafana_metric\n    WHERE\n      $__timeFilter(createdAt) AND\n      measurement = 'logins.count'\n    GROUP BY $__timeGroup(createdAt,'$summarize'), hostname\n    ORDER BY 1";
            var query = {
                rawSql: rawSql,
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
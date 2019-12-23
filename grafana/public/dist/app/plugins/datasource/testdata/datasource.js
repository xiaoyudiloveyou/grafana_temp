import * as tslib_1 from "tslib";
import { DataSourceApi, } from '@grafana/ui';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { queryMetricTree } from './metricTree';
import { from, merge } from 'rxjs';
import { runStream } from './runStreams';
import templateSrv from 'app/features/templating/template_srv';
var TestDataDataSource = /** @class */ (function (_super) {
    tslib_1.__extends(TestDataDataSource, _super);
    function TestDataDataSource(instanceSettings) {
        return _super.call(this, instanceSettings) || this;
    }
    TestDataDataSource.prototype.query = function (options) {
        var e_1, _a;
        var _this = this;
        var queries = [];
        var streams = [];
        try {
            // Start streams and prepare queries
            for (var _b = tslib_1.__values(options.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                var target = _c.value;
                if (target.scenarioId === 'streaming_client') {
                    streams.push(runStream(target, options));
                }
                else {
                    queries.push(tslib_1.__assign({}, target, { intervalMs: options.intervalMs, maxDataPoints: options.maxDataPoints, datasourceId: this.id, alias: templateSrv.replace(target.alias || '') }));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (queries.length) {
            var req = getBackendSrv()
                .datasourceRequest({
                method: 'POST',
                url: '/api/tsdb/query',
                data: {
                    from: options.range.from.valueOf().toString(),
                    to: options.range.to.valueOf().toString(),
                    queries: queries,
                },
                // This sets up a cancel token
                requestId: options.requestId,
            })
                .then(function (res) { return _this.processQueryResult(queries, res); });
            streams.push(from(req));
        }
        return merge.apply(void 0, tslib_1.__spread(streams));
    };
    TestDataDataSource.prototype.processQueryResult = function (queries, res) {
        var e_2, _a, e_3, _b, e_4, _c;
        var data = [];
        try {
            for (var queries_1 = tslib_1.__values(queries), queries_1_1 = queries_1.next(); !queries_1_1.done; queries_1_1 = queries_1.next()) {
                var query = queries_1_1.value;
                var results = res.data.results[query.refId];
                try {
                    for (var _d = (e_3 = void 0, tslib_1.__values(results.tables || [])), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var t = _e.value;
                        var table = t;
                        table.refId = query.refId;
                        table.name = query.alias;
                        data.push(table);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    for (var _f = (e_4 = void 0, tslib_1.__values(results.series || [])), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var series = _g.value;
                        data.push({ target: series.name, datapoints: series.points, refId: query.refId, tags: series.tags });
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (queries_1_1 && !queries_1_1.done && (_a = queries_1.return)) _a.call(queries_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return { data: data };
    };
    TestDataDataSource.prototype.annotationQuery = function (options) {
        var timeWalker = options.range.from.valueOf();
        var to = options.range.to.valueOf();
        var events = [];
        var eventCount = 10;
        var step = (to - timeWalker) / eventCount;
        for (var i = 0; i < eventCount; i++) {
            events.push({
                annotation: options.annotation,
                time: timeWalker,
                text: 'This is the text, <a href="https://grafana.com">Grafana.com</a>',
                tags: ['text', 'server'],
            });
            timeWalker += step;
        }
        return Promise.resolve(events);
    };
    TestDataDataSource.prototype.getQueryDisplayText = function (query) {
        if (query.alias) {
            return query.scenarioId + ' as ' + query.alias;
        }
        return query.scenarioId;
    };
    TestDataDataSource.prototype.testDatasource = function () {
        return Promise.resolve({
            status: 'success',
            message: 'Data source is working',
        });
    };
    TestDataDataSource.prototype.getScenarios = function () {
        return getBackendSrv().get('/api/tsdb/testdata/scenarios');
    };
    TestDataDataSource.prototype.metricFindQuery = function (query) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var children = queryMetricTree(templateSrv.replace(query));
                var items = children.map(function (item) { return ({ value: item.name, text: item.name }); });
                resolve(items);
            }, 100);
        });
    };
    return TestDataDataSource;
}(DataSourceApi));
export { TestDataDataSource };
//# sourceMappingURL=datasource.js.map
import * as tslib_1 from "tslib";
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import { from, of, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingState } from '@grafana/data';
import { DataSourceApi } from '@grafana/ui';
import { getDataSourceSrv } from '@grafana/runtime';
import { mergeMap, map } from 'rxjs/operators';
export var MIXED_DATASOURCE_NAME = '-- Mixed --';
var MixedDatasource = /** @class */ (function (_super) {
    tslib_1.__extends(MixedDatasource, _super);
    function MixedDatasource(instanceSettings) {
        return _super.call(this, instanceSettings) || this;
    }
    MixedDatasource.prototype.query = function (request) {
        // Remove any invalid queries
        var queries = request.targets.filter(function (t) {
            return t.datasource !== MIXED_DATASOURCE_NAME;
        });
        if (!queries.length) {
            return of({ data: [] }); // nothing
        }
        var sets = groupBy(queries, 'datasource');
        var observables = [];
        var runningSubRequests = 0;
        var _loop_1 = function (key) {
            var targets = sets[key];
            var dsName = targets[0].datasource;
            var observable = from(getDataSourceSrv().get(dsName)).pipe(mergeMap(function (dataSourceApi) {
                var datasourceRequest = cloneDeep(request);
                // Remove any unused hidden queries
                var newTargets = targets.slice();
                if (!dataSourceApi.meta.hiddenQueries) {
                    newTargets = newTargets.filter(function (t) { return !t.hide; });
                }
                datasourceRequest.targets = newTargets;
                datasourceRequest.requestId = "" + dsName + (datasourceRequest.requestId || '');
                // all queries hidden return empty result for for this requestId
                if (datasourceRequest.targets.length === 0) {
                    return of({ data: [], key: datasourceRequest.requestId });
                }
                runningSubRequests++;
                var hasCountedAsDone = false;
                return from(dataSourceApi.query(datasourceRequest)).pipe(tap(function (response) {
                    if (hasCountedAsDone ||
                        response.state === LoadingState.Streaming ||
                        response.state === LoadingState.Loading) {
                        return;
                    }
                    runningSubRequests--;
                    hasCountedAsDone = true;
                }, function () {
                    if (hasCountedAsDone) {
                        return;
                    }
                    hasCountedAsDone = true;
                    runningSubRequests--;
                }), map(function (response) {
                    return tslib_1.__assign({}, response, { data: response.data || [], state: runningSubRequests === 0 ? LoadingState.Done : LoadingState.Loading, key: "" + dsName + (response.key || '') });
                }));
            }));
            observables.push(observable);
        };
        for (var key in sets) {
            _loop_1(key);
        }
        return merge.apply(void 0, tslib_1.__spread(observables));
    };
    MixedDatasource.prototype.testDatasource = function () {
        return Promise.resolve({});
    };
    return MixedDatasource;
}(DataSourceApi));
export { MixedDatasource };
//# sourceMappingURL=MixedDataSource.js.map
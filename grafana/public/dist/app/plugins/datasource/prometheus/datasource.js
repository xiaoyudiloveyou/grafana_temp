import * as tslib_1 from "tslib";
// Libraries
import _ from 'lodash';
import $ from 'jquery';
// Services & Utils
import kbn from 'app/core/utils/kbn';
import { dateMath, LoadingState } from '@grafana/data';
import { from, merge, of, forkJoin } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import PrometheusMetricFindQuery from './metric_find_query';
import { ResultTransformer } from './result_transformer';
import PrometheusLanguageProvider from './language_provider';
import addLabelToQuery from './add_label_to_query';
import { getQueryHints } from './query_hints';
import { expandRecordingRules } from './language_utils';
// Types
import { PromContext } from './types';
import { DataSourceApi, } from '@grafana/ui';
import { safeStringifyValue } from 'app/core/utils/explore';
var PrometheusDatasource = /** @class */ (function (_super) {
    tslib_1.__extends(PrometheusDatasource, _super);
    /** @ngInject */
    function PrometheusDatasource(instanceSettings, $q, backendSrv, templateSrv, timeSrv) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.$q = $q;
        _this.backendSrv = backendSrv;
        _this.templateSrv = templateSrv;
        _this.timeSrv = timeSrv;
        _this.init = function () {
            _this.loadRules();
        };
        _this.processResult = function (response, query, target, responseListLength) {
            // Keeping original start/end for transformers
            var transformerOptions = {
                format: target.format,
                step: query.step,
                legendFormat: target.legendFormat,
                start: query.start,
                end: query.end,
                query: query.expr,
                responseListLength: responseListLength,
                refId: target.refId,
                valueWithRefId: target.valueWithRefId,
            };
            var series = _this.resultTransformer.transform(response, transformerOptions);
            return series;
        };
        _this.prepareTargets = function (options, start, end) {
            var e_1, _a;
            var queries = [];
            var activeTargets = [];
            try {
                for (var _b = tslib_1.__values(options.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var target = _c.value;
                    if (!target.expr || target.hide) {
                        continue;
                    }
                    target.requestId = options.panelId + target.refId;
                    if (target.context !== PromContext.Explore) {
                        activeTargets.push(target);
                        queries.push(_this.createQuery(target, options, start, end));
                        continue;
                    }
                    if (target.showingTable) {
                        // create instant target only if Table is showed in Explore
                        var instantTarget = _.cloneDeep(target);
                        instantTarget.format = 'table';
                        instantTarget.instant = true;
                        instantTarget.valueWithRefId = true;
                        delete instantTarget.maxDataPoints;
                        instantTarget.requestId += '_instant';
                        activeTargets.push(instantTarget);
                        queries.push(_this.createQuery(instantTarget, options, start, end));
                    }
                    if (target.showingGraph) {
                        // create time series target only if Graph is showed in Explore
                        target.format = 'time_series';
                        target.instant = false;
                        activeTargets.push(target);
                        queries.push(_this.createQuery(target, options, start, end));
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
            return {
                queries: queries,
                activeTargets: activeTargets,
            };
        };
        _this.calledFromExplore = function (options) {
            var exploreTargets = 0;
            for (var index = 0; index < options.targets.length; index++) {
                var target = options.targets[index];
                if (target.context === PromContext.Explore) {
                    exploreTargets++;
                }
            }
            return exploreTargets === options.targets.length;
        };
        _this.handleErrors = function (err, target) {
            var error = {
                message: 'Unknown error during query transaction. Please check JS console logs.',
                refId: target.refId,
            };
            if (err.data) {
                if (typeof err.data === 'string') {
                    error.message = err.data;
                }
                else if (err.data.error) {
                    error.message = safeStringifyValue(err.data.error);
                }
            }
            else if (err.message) {
                error.message = err.message;
            }
            else if (typeof err === 'string') {
                error.message = err;
            }
            error.status = err.status;
            error.statusText = err.statusText;
            return error;
        };
        _this.type = 'prometheus';
        _this.editorSrc = 'app/features/prometheus/partials/query.editor.html';
        _this.url = instanceSettings.url;
        _this.basicAuth = instanceSettings.basicAuth;
        _this.withCredentials = instanceSettings.withCredentials;
        _this.interval = instanceSettings.jsonData.timeInterval || '15s';
        _this.queryTimeout = instanceSettings.jsonData.queryTimeout;
        _this.httpMethod = instanceSettings.jsonData.httpMethod || 'GET';
        _this.directUrl = instanceSettings.jsonData.directUrl;
        _this.resultTransformer = new ResultTransformer(templateSrv);
        _this.ruleMappings = {};
        _this.languageProvider = new PrometheusLanguageProvider(_this);
        return _this;
    }
    PrometheusDatasource.prototype.getQueryDisplayText = function (query) {
        return query.expr;
    };
    PrometheusDatasource.prototype._addTracingHeaders = function (httpOptions, options) {
        httpOptions.headers = options.headers || {};
        var proxyMode = !this.url.match(/^http/);
        if (proxyMode) {
            httpOptions.headers['X-Dashboard-Id'] = options.dashboardId;
            httpOptions.headers['X-Panel-Id'] = options.panelId;
        }
    };
    PrometheusDatasource.prototype._request = function (url, data, options) {
        options = _.defaults(options || {}, {
            url: this.url + url,
            method: this.httpMethod,
            headers: {},
        });
        if (options.method === 'GET') {
            if (!_.isEmpty(data)) {
                options.url =
                    options.url +
                        '?' +
                        _.map(data, function (v, k) {
                            return encodeURIComponent(k) + '=' + encodeURIComponent(v);
                        }).join('&');
            }
        }
        else {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.transformRequest = function (data) {
                return $.param(data);
            };
            options.data = data;
        }
        if (this.basicAuth || this.withCredentials) {
            options.withCredentials = true;
        }
        if (this.basicAuth) {
            options.headers.Authorization = this.basicAuth;
        }
        return this.backendSrv.datasourceRequest(options);
    };
    // Use this for tab completion features, wont publish response to other components
    PrometheusDatasource.prototype.metadataRequest = function (url) {
        return this._request(url, null, { method: 'GET', silent: true });
    };
    PrometheusDatasource.prototype.interpolateQueryExpr = function (value, variable, defaultFormatFn) {
        // if no multi or include all do not regexEscape
        if (!variable.multi && !variable.includeAll) {
            return prometheusRegularEscape(value);
        }
        if (typeof value === 'string') {
            return prometheusSpecialRegexEscape(value);
        }
        var escapedValues = _.map(value, prometheusSpecialRegexEscape);
        return escapedValues.join('|');
    };
    PrometheusDatasource.prototype.targetContainsTemplate = function (target) {
        return this.templateSrv.variableExists(target.expr);
    };
    PrometheusDatasource.prototype.query = function (options) {
        var start = this.getPrometheusTime(options.range.from, false);
        var end = this.getPrometheusTime(options.range.to, true);
        var _a = this.prepareTargets(options, start, end), queries = _a.queries, activeTargets = _a.activeTargets;
        // No valid targets, return the empty result to save a round trip.
        if (_.isEmpty(queries)) {
            return of({
                data: [],
                state: LoadingState.Done,
            });
        }
        if (this.calledFromExplore(options)) {
            return this.exploreQuery(queries, activeTargets, end);
        }
        return this.panelsQuery(queries, activeTargets, end, options.requestId);
    };
    PrometheusDatasource.prototype.exploreQuery = function (queries, activeTargets, end) {
        var _this = this;
        var runningQueriesCount = queries.length;
        var subQueries = queries.map(function (query, index) {
            var target = activeTargets[index];
            var observable = null;
            if (query.instant) {
                observable = from(_this.performInstantQuery(query, end));
            }
            else {
                observable = from(_this.performTimeSeriesQuery(query, query.start, query.end));
            }
            return observable.pipe(
            // Decrease the counter here. We assume that each request returns only single value and then completes
            // (should hold until there is some streaming requests involved).
            tap(function () { return runningQueriesCount--; }), filter(function (response) { return (response.cancelled ? false : true); }), map(function (response) {
                var data = _this.processResult(response, query, target, queries.length);
                return {
                    data: data,
                    key: query.requestId,
                    state: runningQueriesCount === 0 ? LoadingState.Done : LoadingState.Loading,
                };
            }));
        });
        return merge.apply(void 0, tslib_1.__spread(subQueries));
    };
    PrometheusDatasource.prototype.panelsQuery = function (queries, activeTargets, end, requestId) {
        var _this = this;
        var observables = queries.map(function (query, index) {
            var target = activeTargets[index];
            var observable = null;
            if (query.instant) {
                observable = from(_this.performInstantQuery(query, end));
            }
            else {
                observable = from(_this.performTimeSeriesQuery(query, query.start, query.end));
            }
            return observable.pipe(filter(function (response) { return (response.cancelled ? false : true); }), map(function (response) {
                var data = _this.processResult(response, query, target, queries.length);
                return data;
            }));
        });
        return forkJoin(observables).pipe(map(function (results) {
            var data = results.reduce(function (result, current) {
                return tslib_1.__spread(result, current);
            }, []);
            return {
                data: data,
                key: requestId,
                state: LoadingState.Done,
            };
        }));
    };
    PrometheusDatasource.prototype.createQuery = function (target, options, start, end) {
        var query = {
            hinting: target.hinting,
            instant: target.instant,
            step: 0,
            expr: '',
            requestId: target.requestId,
            refId: target.refId,
            start: 0,
            end: 0,
        };
        var range = Math.ceil(end - start);
        // options.interval is the dynamically calculated interval
        var interval = kbn.interval_to_seconds(options.interval);
        // Minimum interval ("Min step"), if specified for the query or datasource. or same as interval otherwise
        var minInterval = kbn.interval_to_seconds(this.templateSrv.replace(target.interval, options.scopedVars) || options.interval);
        var intervalFactor = target.intervalFactor || 1;
        // Adjust the interval to take into account any specified minimum and interval factor plus Prometheus limits
        var adjustedInterval = this.adjustInterval(interval, minInterval, range, intervalFactor);
        var scopedVars = tslib_1.__assign({}, options.scopedVars, this.getRangeScopedVars(options.range));
        // If the interval was adjusted, make a shallow copy of scopedVars with updated interval vars
        if (interval !== adjustedInterval) {
            interval = adjustedInterval;
            scopedVars = Object.assign({}, options.scopedVars, tslib_1.__assign({ __interval: { text: interval + 's', value: interval + 's' }, __interval_ms: { text: interval * 1000, value: interval * 1000 } }, this.getRangeScopedVars(options.range)));
        }
        query.step = interval;
        var expr = target.expr;
        // Apply adhoc filters
        var adhocFilters = this.templateSrv.getAdhocFilters(this.name);
        expr = adhocFilters.reduce(function (acc, filter) {
            var key = filter.key, operator = filter.operator;
            var value = filter.value;
            if (operator === '=~' || operator === '!~') {
                value = prometheusRegularEscape(value);
            }
            return addLabelToQuery(acc, key, value, operator);
        }, expr);
        // Only replace vars in expression after having (possibly) updated interval vars
        query.expr = this.templateSrv.replace(expr, scopedVars, this.interpolateQueryExpr);
        // Align query interval with step to allow query caching and to ensure
        // that about-same-time query results look the same.
        var adjusted = alignRange(start, end, query.step, this.timeSrv.timeRange().to.utcOffset() * 60);
        query.start = adjusted.start;
        query.end = adjusted.end;
        this._addTracingHeaders(query, options);
        return query;
    };
    PrometheusDatasource.prototype.adjustInterval = function (interval, minInterval, range, intervalFactor) {
        // Prometheus will drop queries that might return more than 11000 data points.
        // Calibrate interval if it is too small.
        if (interval !== 0 && range / intervalFactor / interval > 11000) {
            interval = Math.ceil(range / intervalFactor / 11000);
        }
        return Math.max(interval * intervalFactor, minInterval, 1);
    };
    PrometheusDatasource.prototype.performTimeSeriesQuery = function (query, start, end) {
        var _this = this;
        if (start > end) {
            throw { message: 'Invalid time range' };
        }
        var url = '/api/v1/query_range';
        var data = {
            query: query.expr,
            start: start,
            end: end,
            step: query.step,
        };
        if (this.queryTimeout) {
            data['timeout'] = this.queryTimeout;
        }
        return this._request(url, data, { requestId: query.requestId, headers: query.headers }).catch(function (err) {
            if (err.cancelled) {
                return err;
            }
            throw _this.handleErrors(err, query);
        });
    };
    PrometheusDatasource.prototype.performInstantQuery = function (query, time) {
        var _this = this;
        var url = '/api/v1/query';
        var data = {
            query: query.expr,
            time: time,
        };
        if (this.queryTimeout) {
            data['timeout'] = this.queryTimeout;
        }
        return this._request(url, data, { requestId: query.requestId, headers: query.headers }).catch(function (err) {
            if (err.cancelled) {
                return err;
            }
            throw _this.handleErrors(err, query);
        });
    };
    PrometheusDatasource.prototype.performSuggestQuery = function (query, cache) {
        var _this = this;
        if (cache === void 0) { cache = false; }
        var url = '/api/v1/label/__name__/values';
        if (cache && this.metricsNameCache && this.metricsNameCache.expire > Date.now()) {
            return this.$q.when(_.filter(this.metricsNameCache.data, function (metricName) {
                return metricName.indexOf(query) !== 1;
            }));
        }
        return this.metadataRequest(url).then(function (result) {
            _this.metricsNameCache = {
                data: result.data.data,
                expire: Date.now() + 60 * 1000,
            };
            return _.filter(result.data.data, function (metricName) {
                return metricName.indexOf(query) !== 1;
            });
        });
    };
    PrometheusDatasource.prototype.metricFindQuery = function (query) {
        if (!query) {
            return this.$q.when([]);
        }
        var scopedVars = tslib_1.__assign({ __interval: { text: this.interval, value: this.interval }, __interval_ms: { text: kbn.interval_to_ms(this.interval), value: kbn.interval_to_ms(this.interval) } }, this.getRangeScopedVars(this.timeSrv.timeRange()));
        var interpolated = this.templateSrv.replace(query, scopedVars, this.interpolateQueryExpr);
        var metricFindQuery = new PrometheusMetricFindQuery(this, interpolated, this.timeSrv);
        return metricFindQuery.process();
    };
    PrometheusDatasource.prototype.getRangeScopedVars = function (range) {
        range = range || this.timeSrv.timeRange();
        var msRange = range.to.diff(range.from);
        var sRange = Math.round(msRange / 1000);
        var regularRange = kbn.secondsToHms(msRange / 1000);
        return {
            __range_ms: { text: msRange, value: msRange },
            __range_s: { text: sRange, value: sRange },
            __range: { text: regularRange, value: regularRange },
        };
    };
    PrometheusDatasource.prototype.annotationQuery = function (options) {
        var annotation = options.annotation;
        var expr = annotation.expr || '';
        var tagKeys = annotation.tagKeys || '';
        var titleFormat = annotation.titleFormat || '';
        var textFormat = annotation.textFormat || '';
        if (!expr) {
            return this.$q.when([]);
        }
        var step = annotation.step || '60s';
        var start = this.getPrometheusTime(options.range.from, false);
        var end = this.getPrometheusTime(options.range.to, true);
        var queryOptions = tslib_1.__assign({}, options, { interval: step });
        // Unsetting min interval for accurate event resolution
        var minStep = '1s';
        var queryModel = {
            expr: expr,
            interval: minStep,
            refId: 'X',
            requestId: "prom-query-" + annotation.name,
        };
        var query = this.createQuery(queryModel, queryOptions, start, end);
        var self = this;
        return this.performTimeSeriesQuery(query, query.start, query.end).then(function (results) {
            var eventList = [];
            tagKeys = tagKeys.split(',');
            if (results.cancelled) {
                return [];
            }
            _.each(results.data.data.result, function (series) {
                var e_2, _a;
                var tags = _.chain(series.metric)
                    .filter(function (v, k) {
                    return _.includes(tagKeys, k);
                })
                    .value();
                var dupCheck = {};
                try {
                    for (var _b = tslib_1.__values(series.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var value = _c.value;
                        var valueIsTrue = value[1] === '1'; // e.g. ALERTS
                        if (valueIsTrue || annotation.useValueForTime) {
                            var event_1 = {
                                annotation: annotation,
                                title: self.resultTransformer.renderTemplate(titleFormat, series.metric),
                                tags: tags,
                                text: self.resultTransformer.renderTemplate(textFormat, series.metric),
                            };
                            if (annotation.useValueForTime) {
                                var timestampValue = Math.floor(parseFloat(value[1]));
                                if (dupCheck[timestampValue]) {
                                    continue;
                                }
                                dupCheck[timestampValue] = true;
                                event_1.time = timestampValue;
                            }
                            else {
                                event_1.time = Math.floor(parseFloat(value[0])) * 1000;
                            }
                            eventList.push(event_1);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
            return eventList;
        });
    };
    PrometheusDatasource.prototype.getTagKeys = function (options) {
        if (options === void 0) { options = {}; }
        var url = '/api/v1/labels';
        return this.metadataRequest(url).then(function (result) {
            return _.map(result.data.data, function (value) {
                return { text: value };
            });
        });
    };
    PrometheusDatasource.prototype.getTagValues = function (options) {
        if (options === void 0) { options = {}; }
        var url = '/api/v1/label/' + options.key + '/values';
        return this.metadataRequest(url).then(function (result) {
            return _.map(result.data.data, function (value) {
                return { text: value };
            });
        });
    };
    PrometheusDatasource.prototype.testDatasource = function () {
        var now = new Date().getTime();
        var query = { expr: '1+1' };
        return this.performInstantQuery(query, now / 1000).then(function (response) {
            if (response.data.status === 'success') {
                return { status: 'success', message: 'Data source is working' };
            }
            else {
                return { status: 'error', message: response.error };
            }
        });
    };
    PrometheusDatasource.prototype.getExploreState = function (queries) {
        var _this = this;
        var state = { datasource: this.name };
        if (queries && queries.length > 0) {
            var expandedQueries = queries.map(function (query) {
                var expandedQuery = tslib_1.__assign({}, query, { expr: _this.templateSrv.replace(query.expr, {}, _this.interpolateQueryExpr), context: 'explore' });
                return expandedQuery;
            });
            state = tslib_1.__assign({}, state, { queries: expandedQueries });
        }
        return state;
    };
    PrometheusDatasource.prototype.getQueryHints = function (query, result) {
        return getQueryHints(query.expr || '', result, this);
    };
    PrometheusDatasource.prototype.loadRules = function () {
        var _this = this;
        this.metadataRequest('/api/v1/rules')
            .then(function (res) { return res.data || res.json(); })
            .then(function (body) {
            var groups = _.get(body, ['data', 'groups']);
            if (groups) {
                _this.ruleMappings = extractRuleMappingFromGroups(groups);
            }
        })
            .catch(function (e) {
            console.log('Rules API is experimental. Ignore next error.');
            console.error(e);
        });
    };
    PrometheusDatasource.prototype.modifyQuery = function (query, action) {
        var expression = query.expr || '';
        switch (action.type) {
            case 'ADD_FILTER': {
                expression = addLabelToQuery(expression, action.key, action.value);
                break;
            }
            case 'ADD_HISTOGRAM_QUANTILE': {
                expression = "histogram_quantile(0.95, sum(rate(" + expression + "[5m])) by (le))";
                break;
            }
            case 'ADD_RATE': {
                expression = "rate(" + expression + "[5m])";
                break;
            }
            case 'ADD_SUM': {
                expression = "sum(" + expression.trim() + ") by ($1)";
                break;
            }
            case 'EXPAND_RULES': {
                if (action.mapping) {
                    expression = expandRecordingRules(expression, action.mapping);
                }
                break;
            }
            default:
                break;
        }
        return tslib_1.__assign({}, query, { expr: expression });
    };
    PrometheusDatasource.prototype.getPrometheusTime = function (date, roundUp) {
        if (_.isString(date)) {
            date = dateMath.parse(date, roundUp);
        }
        return Math.ceil(date.valueOf() / 1000);
    };
    PrometheusDatasource.prototype.getTimeRange = function () {
        var range = this.timeSrv.timeRange();
        return {
            start: this.getPrometheusTime(range.from, false),
            end: this.getPrometheusTime(range.to, true),
        };
    };
    PrometheusDatasource.prototype.getOriginalMetricName = function (labelData) {
        return this.resultTransformer.getOriginalMetricName(labelData);
    };
    return PrometheusDatasource;
}(DataSourceApi));
export { PrometheusDatasource };
/**
 * Align query range to step.
 * Rounds start and end down to a multiple of step.
 * @param start Timestamp marking the beginning of the range.
 * @param end Timestamp marking the end of the range.
 * @param step Interval to align start and end with.
 * @param utcOffsetSec Number of seconds current timezone is offset from UTC
 */
export function alignRange(start, end, step, utcOffsetSec) {
    var alignedEnd = Math.floor((end + utcOffsetSec) / step) * step - utcOffsetSec;
    var alignedStart = Math.floor((start + utcOffsetSec) / step) * step - utcOffsetSec;
    return {
        end: alignedEnd,
        start: alignedStart,
    };
}
export function extractRuleMappingFromGroups(groups) {
    return groups.reduce(function (mapping, group) {
        return group.rules
            .filter(function (rule) { return rule.type === 'recording'; })
            .reduce(function (acc, rule) {
            var _a;
            return (tslib_1.__assign({}, acc, (_a = {}, _a[rule.name] = rule.query, _a)));
        }, mapping);
    }, {});
}
export function prometheusRegularEscape(value) {
    if (typeof value === 'string') {
        return value.replace(/'/g, "\\\\'");
    }
    return value;
}
export function prometheusSpecialRegexEscape(value) {
    if (typeof value === 'string') {
        return prometheusRegularEscape(value.replace(/\\/g, '\\\\\\\\').replace(/[$^*{}\[\]+?.()|]/g, '\\\\$&'));
    }
    return value;
}
//# sourceMappingURL=datasource.js.map
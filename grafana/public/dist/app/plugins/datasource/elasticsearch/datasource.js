import * as tslib_1 from "tslib";
import angular from 'angular';
import _ from 'lodash';
import { DataSourceApi } from '@grafana/ui';
import { ElasticResponse } from './elastic_response';
import { IndexPattern } from './index_pattern';
import { ElasticQueryBuilder } from './query_builder';
import { toUtc } from '@grafana/data';
import * as queryDef from './query_def';
var ElasticDatasource = /** @class */ (function (_super) {
    tslib_1.__extends(ElasticDatasource, _super);
    /** @ngInject */
    function ElasticDatasource(instanceSettings, $q, backendSrv, templateSrv, timeSrv) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.$q = $q;
        _this.backendSrv = backendSrv;
        _this.templateSrv = templateSrv;
        _this.timeSrv = timeSrv;
        _this.basicAuth = instanceSettings.basicAuth;
        _this.withCredentials = instanceSettings.withCredentials;
        _this.url = instanceSettings.url;
        _this.name = instanceSettings.name;
        _this.index = instanceSettings.database;
        var settingsData = instanceSettings.jsonData || {};
        _this.timeField = settingsData.timeField;
        _this.esVersion = settingsData.esVersion;
        _this.indexPattern = new IndexPattern(_this.index, settingsData.interval);
        _this.interval = settingsData.timeInterval;
        _this.maxConcurrentShardRequests = settingsData.maxConcurrentShardRequests;
        _this.queryBuilder = new ElasticQueryBuilder({
            timeField: _this.timeField,
            esVersion: _this.esVersion,
        });
        _this.logMessageField = settingsData.logMessageField || '';
        _this.logLevelField = settingsData.logLevelField || '';
        if (_this.logMessageField === '') {
            _this.logMessageField = null;
        }
        if (_this.logLevelField === '') {
            _this.logLevelField = null;
        }
        return _this;
    }
    ElasticDatasource.prototype.request = function (method, url, data) {
        var options = {
            url: this.url + '/' + url,
            method: method,
            data: data,
        };
        if (this.basicAuth || this.withCredentials) {
            options.withCredentials = true;
        }
        if (this.basicAuth) {
            options.headers = {
                Authorization: this.basicAuth,
            };
        }
        return this.backendSrv.datasourceRequest(options);
    };
    ElasticDatasource.prototype.get = function (url) {
        var range = this.timeSrv.timeRange();
        var indexList = this.indexPattern.getIndexList(range.from.valueOf(), range.to.valueOf());
        if (_.isArray(indexList) && indexList.length) {
            return this.request('GET', indexList[0] + url).then(function (results) {
                results.data.$$config = results.config;
                return results.data;
            });
        }
        else {
            return this.request('GET', this.indexPattern.getIndexForToday() + url).then(function (results) {
                results.data.$$config = results.config;
                return results.data;
            });
        }
    };
    ElasticDatasource.prototype.post = function (url, data) {
        return this.request('POST', url, data)
            .then(function (results) {
            results.data.$$config = results.config;
            return results.data;
        })
            .catch(function (err) {
            if (err.data && err.data.error) {
                throw {
                    message: 'Elasticsearch error: ' + err.data.error.reason,
                    error: err.data.error,
                };
            }
            throw err;
        });
    };
    ElasticDatasource.prototype.annotationQuery = function (options) {
        var annotation = options.annotation;
        var timeField = annotation.timeField || '@timestamp';
        var queryString = annotation.query || '*';
        var tagsField = annotation.tagsField || 'tags';
        var textField = annotation.textField || null;
        var range = {};
        range[timeField] = {
            from: options.range.from.valueOf(),
            to: options.range.to.valueOf(),
            format: 'epoch_millis',
        };
        var queryInterpolated = this.templateSrv.replace(queryString, {}, 'lucene');
        var query = {
            bool: {
                filter: [
                    { range: range },
                    {
                        query_string: {
                            query: queryInterpolated,
                        },
                    },
                ],
            },
        };
        var data = {
            query: query,
            size: 10000,
        };
        // fields field not supported on ES 5.x
        if (this.esVersion < 5) {
            data['fields'] = [timeField, '_source'];
        }
        var header = {
            search_type: 'query_then_fetch',
            ignore_unavailable: true,
        };
        // old elastic annotations had index specified on them
        if (annotation.index) {
            header.index = annotation.index;
        }
        else {
            header.index = this.indexPattern.getIndexList(options.range.from, options.range.to);
        }
        var payload = angular.toJson(header) + '\n' + angular.toJson(data) + '\n';
        return this.post('_msearch', payload).then(function (res) {
            var list = [];
            var hits = res.responses[0].hits.hits;
            var getFieldFromSource = function (source, fieldName) {
                if (!fieldName) {
                    return;
                }
                var fieldNames = fieldName.split('.');
                var fieldValue = source;
                for (var i = 0; i < fieldNames.length; i++) {
                    fieldValue = fieldValue[fieldNames[i]];
                    if (!fieldValue) {
                        console.log('could not find field in annotation: ', fieldName);
                        return '';
                    }
                }
                return fieldValue;
            };
            for (var i = 0; i < hits.length; i++) {
                var source = hits[i]._source;
                var time = getFieldFromSource(source, timeField);
                if (typeof hits[i].fields !== 'undefined') {
                    var fields = hits[i].fields;
                    if (_.isString(fields[timeField]) || _.isNumber(fields[timeField])) {
                        time = fields[timeField];
                    }
                }
                var event_1 = {
                    annotation: annotation,
                    time: toUtc(time).valueOf(),
                    text: getFieldFromSource(source, textField),
                    tags: getFieldFromSource(source, tagsField),
                };
                // legacy support for title tield
                if (annotation.titleField) {
                    var title = getFieldFromSource(source, annotation.titleField);
                    if (title) {
                        event_1.text = title + '\n' + event_1.text;
                    }
                }
                if (typeof event_1.tags === 'string') {
                    event_1.tags = event_1.tags.split(',');
                }
                list.push(event_1);
            }
            return list;
        });
    };
    ElasticDatasource.prototype.testDatasource = function () {
        var _this = this;
        // validate that the index exist and has date field
        return this.getFields({ type: 'date' }).then(function (dateFields) {
            var timeField = _.find(dateFields, { text: _this.timeField });
            if (!timeField) {
                return {
                    status: 'error',
                    message: 'No date field named ' + _this.timeField + ' found',
                };
            }
            return { status: 'success', message: 'Index OK. Time field name OK.' };
        }, function (err) {
            console.log(err);
            if (err.data && err.data.error) {
                var message = angular.toJson(err.data.error);
                if (err.data.error.reason) {
                    message = err.data.error.reason;
                }
                return { status: 'error', message: message };
            }
            else {
                return { status: 'error', message: err.status };
            }
        });
    };
    ElasticDatasource.prototype.getQueryHeader = function (searchType, timeFrom, timeTo) {
        var queryHeader = {
            search_type: searchType,
            ignore_unavailable: true,
            index: this.indexPattern.getIndexList(timeFrom, timeTo),
        };
        if (this.esVersion >= 56 && this.esVersion < 70) {
            queryHeader['max_concurrent_shard_requests'] = this.maxConcurrentShardRequests;
        }
        return angular.toJson(queryHeader);
    };
    ElasticDatasource.prototype.query = function (options) {
        var e_1, _a;
        var _this = this;
        var payload = '';
        var targets = _.cloneDeep(options.targets);
        var sentTargets = [];
        // add global adhoc filters to timeFilter
        var adhocFilters = this.templateSrv.getAdhocFilters(this.name);
        try {
            for (var targets_1 = tslib_1.__values(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                var target = targets_1_1.value;
                if (target.hide) {
                    continue;
                }
                var queryString = this.templateSrv.replace(target.query, options.scopedVars, 'lucene');
                // Elasticsearch queryString should always be '*' if empty string
                if (!queryString || queryString === '') {
                    queryString = '*';
                }
                var queryObj = void 0;
                if (target.isLogsQuery) {
                    target.bucketAggs = [queryDef.defaultBucketAgg()];
                    target.metrics = [queryDef.defaultMetricAgg()];
                    queryObj = this.queryBuilder.getLogsQuery(target, queryString);
                }
                else {
                    if (target.alias) {
                        target.alias = this.templateSrv.replace(target.alias, options.scopedVars, 'lucene');
                    }
                    queryObj = this.queryBuilder.build(target, adhocFilters, queryString);
                }
                var esQuery = angular.toJson(queryObj);
                var searchType = queryObj.size === 0 && this.esVersion < 5 ? 'count' : 'query_then_fetch';
                var header = this.getQueryHeader(searchType, options.range.from, options.range.to);
                payload += header + '\n';
                payload += esQuery + '\n';
                sentTargets.push(target);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (targets_1_1 && !targets_1_1.done && (_a = targets_1.return)) _a.call(targets_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (sentTargets.length === 0) {
            return Promise.resolve({ data: [] });
        }
        payload = payload.replace(/\$timeFrom/g, options.range.from.valueOf().toString());
        payload = payload.replace(/\$timeTo/g, options.range.to.valueOf().toString());
        payload = this.templateSrv.replace(payload, options.scopedVars);
        var url = this.getMultiSearchUrl();
        return this.post(url, payload).then(function (res) {
            var er = new ElasticResponse(sentTargets, res);
            if (sentTargets.some(function (target) { return target.isLogsQuery; })) {
                return er.getLogs(_this.logMessageField, _this.logLevelField);
            }
            return er.getTimeSeries();
        });
    };
    ElasticDatasource.prototype.getFields = function (query) {
        var configuredEsVersion = this.esVersion;
        return this.get('/_mapping').then(function (result) {
            var typeMap = {
                float: 'number',
                double: 'number',
                integer: 'number',
                long: 'number',
                date: 'date',
                string: 'string',
                text: 'string',
                scaled_float: 'number',
                nested: 'nested',
            };
            function shouldAddField(obj, key, query) {
                if (key[0] === '_') {
                    return false;
                }
                if (!query.type) {
                    return true;
                }
                // equal query type filter, or via typemap translation
                return query.type === obj.type || query.type === typeMap[obj.type];
            }
            // Store subfield names: [system, process, cpu, total] -> system.process.cpu.total
            var fieldNameParts = [];
            var fields = {};
            function getFieldsRecursively(obj) {
                for (var key in obj) {
                    var subObj = obj[key];
                    // Check mapping field for nested fields
                    if (_.isObject(subObj.properties)) {
                        fieldNameParts.push(key);
                        getFieldsRecursively(subObj.properties);
                    }
                    if (_.isObject(subObj.fields)) {
                        fieldNameParts.push(key);
                        getFieldsRecursively(subObj.fields);
                    }
                    if (_.isString(subObj.type)) {
                        var fieldName = fieldNameParts.concat(key).join('.');
                        // Hide meta-fields and check field type
                        if (shouldAddField(subObj, key, query)) {
                            fields[fieldName] = {
                                text: fieldName,
                                type: subObj.type,
                            };
                        }
                    }
                }
                fieldNameParts.pop();
            }
            for (var indexName in result) {
                var index = result[indexName];
                if (index && index.mappings) {
                    var mappings = index.mappings;
                    if (configuredEsVersion < 70) {
                        for (var typeName in mappings) {
                            var properties = mappings[typeName].properties;
                            getFieldsRecursively(properties);
                        }
                    }
                    else {
                        var properties = mappings.properties;
                        getFieldsRecursively(properties);
                    }
                }
            }
            // transform to array
            return _.map(fields, function (value) {
                return value;
            });
        });
    };
    ElasticDatasource.prototype.getTerms = function (queryDef) {
        var range = this.timeSrv.timeRange();
        var searchType = this.esVersion >= 5 ? 'query_then_fetch' : 'count';
        var header = this.getQueryHeader(searchType, range.from, range.to);
        var esQuery = angular.toJson(this.queryBuilder.getTermsQuery(queryDef));
        esQuery = esQuery.replace(/\$timeFrom/g, range.from.valueOf().toString());
        esQuery = esQuery.replace(/\$timeTo/g, range.to.valueOf().toString());
        esQuery = header + '\n' + esQuery + '\n';
        var url = this.getMultiSearchUrl();
        return this.post(url, esQuery).then(function (res) {
            if (!res.responses[0].aggregations) {
                return [];
            }
            var buckets = res.responses[0].aggregations['1'].buckets;
            return _.map(buckets, function (bucket) {
                return {
                    text: bucket.key_as_string || bucket.key,
                    value: bucket.key,
                };
            });
        });
    };
    ElasticDatasource.prototype.getMultiSearchUrl = function () {
        if (this.esVersion >= 70 && this.maxConcurrentShardRequests) {
            return "_msearch?max_concurrent_shard_requests=" + this.maxConcurrentShardRequests;
        }
        return '_msearch';
    };
    ElasticDatasource.prototype.metricFindQuery = function (query) {
        query = angular.fromJson(query);
        if (!query) {
            return this.$q.when([]);
        }
        if (query.find === 'fields') {
            query.field = this.templateSrv.replace(query.field, {}, 'lucene');
            return this.getFields(query);
        }
        if (query.find === 'terms') {
            query.field = this.templateSrv.replace(query.field, {}, 'lucene');
            query.query = this.templateSrv.replace(query.query || '*', {}, 'lucene');
            return this.getTerms(query);
        }
    };
    ElasticDatasource.prototype.getTagKeys = function () {
        return this.getFields({});
    };
    ElasticDatasource.prototype.getTagValues = function (options) {
        return this.getTerms({ field: options.key, query: '*' });
    };
    ElasticDatasource.prototype.targetContainsTemplate = function (target) {
        var e_2, _a, e_3, _b;
        if (this.templateSrv.variableExists(target.query) || this.templateSrv.variableExists(target.alias)) {
            return true;
        }
        try {
            for (var _c = tslib_1.__values(target.bucketAggs), _d = _c.next(); !_d.done; _d = _c.next()) {
                var bucketAgg = _d.value;
                if (this.templateSrv.variableExists(bucketAgg.field) || this.objectContainsTemplate(bucketAgg.settings)) {
                    return true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _e = tslib_1.__values(target.metrics), _f = _e.next(); !_f.done; _f = _e.next()) {
                var metric = _f.value;
                if (this.templateSrv.variableExists(metric.field) ||
                    this.objectContainsTemplate(metric.settings) ||
                    this.objectContainsTemplate(metric.meta)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    ElasticDatasource.prototype.isPrimitive = function (obj) {
        if (obj === null || obj === undefined) {
            return true;
        }
        if (['string', 'number', 'boolean'].some(function (type) { return type === typeof true; })) {
            return true;
        }
        return false;
    };
    ElasticDatasource.prototype.objectContainsTemplate = function (obj) {
        var e_4, _a, e_5, _b;
        if (!obj) {
            return false;
        }
        try {
            for (var _c = tslib_1.__values(Object.keys(obj)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var key = _d.value;
                if (this.isPrimitive(obj[key])) {
                    if (this.templateSrv.variableExists(obj[key])) {
                        return true;
                    }
                }
                else if (Array.isArray(obj[key])) {
                    try {
                        for (var _e = (e_5 = void 0, tslib_1.__values(obj[key])), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var item = _f.value;
                            if (this.objectContainsTemplate(item)) {
                                return true;
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
                else {
                    if (this.objectContainsTemplate(obj[key])) {
                        return true;
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    return ElasticDatasource;
}(DataSourceApi));
export { ElasticDatasource };
export function getMaxConcurrenShardRequestOrDefault(options) {
    if (options.maxConcurrentShardRequests === 5 && options.esVersion < 70) {
        return 256;
    }
    if (options.maxConcurrentShardRequests === 256 && options.esVersion >= 70) {
        return 5;
    }
    var defaultMaxConcurrentShardRequests = options.esVersion >= 70 ? 5 : 256;
    return options.maxConcurrentShardRequests || defaultMaxConcurrentShardRequests;
}
//# sourceMappingURL=datasource.js.map
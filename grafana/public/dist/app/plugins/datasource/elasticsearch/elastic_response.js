import * as tslib_1 from "tslib";
import _ from 'lodash';
import flatten from 'app/core/utils/flatten';
import * as queryDef from './query_def';
import TableModel from 'app/core/table_model';
import { toDataFrame, FieldType, MutableDataFrame } from '@grafana/data';
var ElasticResponse = /** @class */ (function () {
    function ElasticResponse(targets, response) {
        this.targets = targets;
        this.response = response;
        this.targets = targets;
        this.response = response;
    }
    ElasticResponse.prototype.processMetrics = function (esAgg, target, seriesList, props) {
        var metric, y, i, newSeries, bucket, value;
        for (y = 0; y < target.metrics.length; y++) {
            metric = target.metrics[y];
            if (metric.hide) {
                continue;
            }
            switch (metric.type) {
                case 'count': {
                    newSeries = { datapoints: [], metric: 'count', props: props };
                    for (i = 0; i < esAgg.buckets.length; i++) {
                        bucket = esAgg.buckets[i];
                        value = bucket.doc_count;
                        newSeries.datapoints.push([value, bucket.key]);
                    }
                    seriesList.push(newSeries);
                    break;
                }
                case 'percentiles': {
                    if (esAgg.buckets.length === 0) {
                        break;
                    }
                    var firstBucket = esAgg.buckets[0];
                    var percentiles = firstBucket[metric.id].values;
                    for (var percentileName in percentiles) {
                        newSeries = {
                            datapoints: [],
                            metric: 'p' + percentileName,
                            props: props,
                            field: metric.field,
                        };
                        for (i = 0; i < esAgg.buckets.length; i++) {
                            bucket = esAgg.buckets[i];
                            var values = bucket[metric.id].values;
                            newSeries.datapoints.push([values[percentileName], bucket.key]);
                        }
                        seriesList.push(newSeries);
                    }
                    break;
                }
                case 'extended_stats': {
                    for (var statName in metric.meta) {
                        if (!metric.meta[statName]) {
                            continue;
                        }
                        newSeries = {
                            datapoints: [],
                            metric: statName,
                            props: props,
                            field: metric.field,
                        };
                        for (i = 0; i < esAgg.buckets.length; i++) {
                            bucket = esAgg.buckets[i];
                            var stats = bucket[metric.id];
                            // add stats that are in nested obj to top level obj
                            stats.std_deviation_bounds_upper = stats.std_deviation_bounds.upper;
                            stats.std_deviation_bounds_lower = stats.std_deviation_bounds.lower;
                            newSeries.datapoints.push([stats[statName], bucket.key]);
                        }
                        seriesList.push(newSeries);
                    }
                    break;
                }
                default: {
                    newSeries = {
                        datapoints: [],
                        metric: metric.type,
                        field: metric.field,
                        metricId: metric.id,
                        props: props,
                    };
                    for (i = 0; i < esAgg.buckets.length; i++) {
                        bucket = esAgg.buckets[i];
                        value = bucket[metric.id];
                        if (value !== undefined) {
                            if (value.normalized_value) {
                                newSeries.datapoints.push([value.normalized_value, bucket.key]);
                            }
                            else {
                                newSeries.datapoints.push([value.value, bucket.key]);
                            }
                        }
                    }
                    seriesList.push(newSeries);
                    break;
                }
            }
        }
    };
    ElasticResponse.prototype.processAggregationDocs = function (esAgg, aggDef, target, table, props) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        // add columns
        if (table.columns.length === 0) {
            try {
                for (var _e = tslib_1.__values(_.keys(props)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var propKey = _f.value;
                    table.addColumn({ text: propKey, filterable: true });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            table.addColumn({ text: aggDef.field, filterable: true });
        }
        // helper func to add values to value array
        var addMetricValue = function (values, metricName, value) {
            table.addColumn({ text: metricName });
            values.push(value);
        };
        try {
            for (var _g = tslib_1.__values(esAgg.buckets), _h = _g.next(); !_h.done; _h = _g.next()) {
                var bucket = _h.value;
                var values = [];
                try {
                    for (var _j = (e_3 = void 0, tslib_1.__values(_.values(props))), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var propValues = _k.value;
                        values.push(propValues);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                // add bucket key (value)
                values.push(bucket.key);
                try {
                    for (var _l = (e_4 = void 0, tslib_1.__values(target.metrics)), _m = _l.next(); !_m.done; _m = _l.next()) {
                        var metric = _m.value;
                        switch (metric.type) {
                            case 'count': {
                                addMetricValue(values, this.getMetricName(metric.type), bucket.doc_count);
                                break;
                            }
                            case 'extended_stats': {
                                for (var statName in metric.meta) {
                                    if (!metric.meta[statName]) {
                                        continue;
                                    }
                                    var stats = bucket[metric.id];
                                    // add stats that are in nested obj to top level obj
                                    stats.std_deviation_bounds_upper = stats.std_deviation_bounds.upper;
                                    stats.std_deviation_bounds_lower = stats.std_deviation_bounds.lower;
                                    addMetricValue(values, this.getMetricName(statName), stats[statName]);
                                }
                                break;
                            }
                            case 'percentiles': {
                                var percentiles = bucket[metric.id].values;
                                for (var percentileName in percentiles) {
                                    addMetricValue(values, "p" + percentileName + " " + metric.field, percentiles[percentileName]);
                                }
                                break;
                            }
                            default: {
                                var metricName = this.getMetricName(metric.type);
                                var otherMetrics = _.filter(target.metrics, { type: metric.type });
                                // if more of the same metric type include field field name in property
                                if (otherMetrics.length > 1) {
                                    metricName += ' ' + metric.field;
                                }
                                addMetricValue(values, metricName, bucket[metric.id].value);
                                break;
                            }
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                table.rows.push(values);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    // This is quite complex
    // need to recurse down the nested buckets to build series
    ElasticResponse.prototype.processBuckets = function (aggs, target, seriesList, table, props, depth) {
        var bucket, aggDef, esAgg, aggId;
        var maxDepth = target.bucketAggs.length - 1;
        for (aggId in aggs) {
            aggDef = _.find(target.bucketAggs, { id: aggId });
            esAgg = aggs[aggId];
            if (!aggDef) {
                continue;
            }
            if (depth === maxDepth) {
                if (aggDef.type === 'date_histogram') {
                    this.processMetrics(esAgg, target, seriesList, props);
                }
                else {
                    this.processAggregationDocs(esAgg, aggDef, target, table, props);
                }
            }
            else {
                for (var nameIndex in esAgg.buckets) {
                    bucket = esAgg.buckets[nameIndex];
                    props = _.clone(props);
                    if (bucket.key !== void 0) {
                        props[aggDef.field] = bucket.key;
                    }
                    else {
                        props['filter'] = nameIndex;
                    }
                    if (bucket.key_as_string) {
                        props[aggDef.field] = bucket.key_as_string;
                    }
                    this.processBuckets(bucket, target, seriesList, table, props, depth + 1);
                }
            }
        }
    };
    ElasticResponse.prototype.getMetricName = function (metric) {
        var metricDef = _.find(queryDef.metricAggTypes, { value: metric });
        if (!metricDef) {
            metricDef = _.find(queryDef.extendedStats, { value: metric });
        }
        return metricDef ? metricDef.text : metric;
    };
    ElasticResponse.prototype.getSeriesName = function (series, target, metricTypeCount) {
        var e_5, _a;
        var metricName = this.getMetricName(series.metric);
        if (target.alias) {
            var regex = /\{\{([\s\S]+?)\}\}/g;
            return target.alias.replace(regex, function (match, g1, g2) {
                var group = g1 || g2;
                if (group.indexOf('term ') === 0) {
                    return series.props[group.substring(5)];
                }
                if (series.props[group] !== void 0) {
                    return series.props[group];
                }
                if (group === 'metric') {
                    return metricName;
                }
                if (group === 'field') {
                    return series.field || '';
                }
                return match;
            });
        }
        if (series.field && queryDef.isPipelineAgg(series.metric)) {
            if (series.metric && queryDef.isPipelineAggWithMultipleBucketPaths(series.metric)) {
                var agg = _.find(target.metrics, { id: series.metricId });
                if (agg && agg.settings.script) {
                    metricName = agg.settings.script;
                    try {
                        for (var _b = tslib_1.__values(agg.pipelineVariables), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var pv = _c.value;
                            var appliedAgg = _.find(target.metrics, { id: pv.pipelineAgg });
                            if (appliedAgg) {
                                metricName = metricName.replace('params.' + pv.name, queryDef.describeMetric(appliedAgg));
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
                else {
                    metricName = 'Unset';
                }
            }
            else {
                var appliedAgg = _.find(target.metrics, { id: series.field });
                if (appliedAgg) {
                    metricName += ' ' + queryDef.describeMetric(appliedAgg);
                }
                else {
                    metricName = 'Unset';
                }
            }
        }
        else if (series.field) {
            metricName += ' ' + series.field;
        }
        var propKeys = _.keys(series.props);
        if (propKeys.length === 0) {
            return metricName;
        }
        var name = '';
        for (var propName in series.props) {
            name += series.props[propName] + ' ';
        }
        if (metricTypeCount === 1) {
            return name.trim();
        }
        return name.trim() + ' ' + metricName;
    };
    ElasticResponse.prototype.nameSeries = function (seriesList, target) {
        var metricTypeCount = _.uniq(_.map(seriesList, 'metric')).length;
        for (var i = 0; i < seriesList.length; i++) {
            var series = seriesList[i];
            series.target = this.getSeriesName(series, target, metricTypeCount);
        }
    };
    ElasticResponse.prototype.processHits = function (hits, seriesList) {
        var hitsTotal = typeof hits.total === 'number' ? hits.total : hits.total.value; // <- Works with Elasticsearch 7.0+
        var series = {
            target: 'docs',
            type: 'docs',
            datapoints: [],
            total: hitsTotal,
            filterable: true,
        };
        var propName, hit, doc, i;
        for (i = 0; i < hits.hits.length; i++) {
            hit = hits.hits[i];
            doc = {
                _id: hit._id,
                _type: hit._type,
                _index: hit._index,
            };
            if (hit._source) {
                for (propName in hit._source) {
                    doc[propName] = hit._source[propName];
                }
            }
            for (propName in hit.fields) {
                doc[propName] = hit.fields[propName];
            }
            series.datapoints.push(doc);
        }
        seriesList.push(series);
    };
    ElasticResponse.prototype.trimDatapoints = function (aggregations, target) {
        var histogram = _.find(target.bucketAggs, { type: 'date_histogram' });
        var shouldDropFirstAndLast = histogram && histogram.settings && histogram.settings.trimEdges;
        if (shouldDropFirstAndLast) {
            var trim = histogram.settings.trimEdges;
            for (var prop in aggregations) {
                var points = aggregations[prop];
                if (points.datapoints.length > trim * 2) {
                    points.datapoints = points.datapoints.slice(trim, points.datapoints.length - trim);
                }
            }
        }
    };
    ElasticResponse.prototype.getErrorFromElasticResponse = function (response, err) {
        var result = {};
        result.data = JSON.stringify(err, null, 4);
        if (err.root_cause && err.root_cause.length > 0 && err.root_cause[0].reason) {
            result.message = err.root_cause[0].reason;
        }
        else {
            result.message = err.reason || 'Unkown elastic error response';
        }
        if (response.$$config) {
            result.config = response.$$config;
        }
        return result;
    };
    ElasticResponse.prototype.getTimeSeries = function () {
        var seriesList = [];
        for (var i = 0; i < this.response.responses.length; i++) {
            var response = this.response.responses[i];
            if (response.error) {
                throw this.getErrorFromElasticResponse(this.response, response.error);
            }
            if (response.hits && response.hits.hits.length > 0) {
                this.processHits(response.hits, seriesList);
            }
            if (response.aggregations) {
                var aggregations = response.aggregations;
                var target = this.targets[i];
                var tmpSeriesList = [];
                var table = new TableModel();
                this.processBuckets(aggregations, target, tmpSeriesList, table, {}, 0);
                this.trimDatapoints(tmpSeriesList, target);
                this.nameSeries(tmpSeriesList, target);
                for (var y = 0; y < tmpSeriesList.length; y++) {
                    seriesList.push(tmpSeriesList[y]);
                }
                if (table.rows.length > 0) {
                    seriesList.push(table);
                }
            }
        }
        return { data: seriesList };
    };
    ElasticResponse.prototype.getLogs = function (logMessageField, logLevelField) {
        var e_6, _a, e_7, _b;
        var dataFrame = [];
        var docs = [];
        for (var n = 0; n < this.response.responses.length; n++) {
            var response = this.response.responses[n];
            if (response.error) {
                throw this.getErrorFromElasticResponse(this.response, response.error);
            }
            var hits = response.hits;
            var propNames = [];
            var propName = void 0, hit = void 0, doc = void 0, i = void 0;
            for (i = 0; i < hits.hits.length; i++) {
                hit = hits.hits[i];
                var flattened = hit._source ? flatten(hit._source, null) : {};
                doc = {};
                doc[this.targets[0].timeField] = null;
                doc = tslib_1.__assign({}, doc, { _id: hit._id, _type: hit._type, _index: hit._index }, flattened);
                // Note: the order of for...in is arbitrary amd implementation dependant
                // and should probably not be relied upon.
                for (propName in hit.fields) {
                    if (propNames.indexOf(propName) === -1) {
                        propNames.push(propName);
                    }
                    doc[propName] = hit.fields[propName];
                }
                for (propName in doc) {
                    if (propNames.indexOf(propName) === -1) {
                        propNames.push(propName);
                    }
                }
                doc._source = tslib_1.__assign({}, flattened);
                docs.push(doc);
            }
            if (docs.length > 0) {
                propNames = propNames.sort();
                var series = new MutableDataFrame({ fields: [] });
                series.addField({
                    name: this.targets[0].timeField,
                    type: FieldType.time,
                }).parse = function (v) {
                    return v[0] || '';
                };
                if (logMessageField) {
                    series.addField({
                        name: logMessageField,
                        type: FieldType.string,
                    }).parse = function (v) {
                        return v || '';
                    };
                }
                else {
                    series.addField({
                        name: '_source',
                        type: FieldType.string,
                    }).parse = function (v) {
                        return JSON.stringify(v, null, 2);
                    };
                }
                if (logLevelField) {
                    series.addField({
                        name: 'level',
                        type: FieldType.string,
                    }).parse = function (v) {
                        return v || '';
                    };
                }
                try {
                    for (var propNames_1 = (e_6 = void 0, tslib_1.__values(propNames)), propNames_1_1 = propNames_1.next(); !propNames_1_1.done; propNames_1_1 = propNames_1.next()) {
                        var propName_1 = propNames_1_1.value;
                        if (propName_1 === this.targets[0].timeField || propName_1 === '_source') {
                            continue;
                        }
                        series.addField({
                            name: propName_1,
                            type: FieldType.string,
                        }).parse = function (v) {
                            return v || '';
                        };
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (propNames_1_1 && !propNames_1_1.done && (_a = propNames_1.return)) _a.call(propNames_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                try {
                    // Add a row for each document
                    for (var docs_1 = (e_7 = void 0, tslib_1.__values(docs)), docs_1_1 = docs_1.next(); !docs_1_1.done; docs_1_1 = docs_1.next()) {
                        var doc_1 = docs_1_1.value;
                        series.add(doc_1);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (docs_1_1 && !docs_1_1.done && (_b = docs_1.return)) _b.call(docs_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                dataFrame.push(series);
            }
            if (response.aggregations) {
                var aggregations = response.aggregations;
                var target = this.targets[n];
                var tmpSeriesList = [];
                var table = new TableModel();
                this.processBuckets(aggregations, target, tmpSeriesList, table, {}, 0);
                this.trimDatapoints(tmpSeriesList, target);
                this.nameSeries(tmpSeriesList, target);
                for (var y = 0; y < tmpSeriesList.length; y++) {
                    var series = toDataFrame(tmpSeriesList[y]);
                    series.labels = {};
                    dataFrame.push(series);
                }
            }
        }
        return { data: dataFrame };
    };
    return ElasticResponse;
}());
export { ElasticResponse };
//# sourceMappingURL=elastic_response.js.map
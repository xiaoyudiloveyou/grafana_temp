var _a;
import * as tslib_1 from "tslib";
import _ from 'lodash';
import { colors, getFlotPairs, ansicolor } from '@grafana/ui';
import { LogLevel, findCommonLabels, findUniqueLabels, getLogLevel, FieldType, getLogLevelFromKey, LogsMetaKind, LogsDedupStrategy, dateTime, toUtc, NullValueMode, toDataFrame, FieldCache, } from '@grafana/data';
import { getThemeColor } from 'app/core/utils/colors';
import { hasAnsiCodes } from 'app/core/utils/text';
import { sortInAscendingOrder } from 'app/core/utils/explore';
import { getGraphSeriesModel } from 'app/plugins/panel/graph2/getGraphSeriesModel';
export var LogLevelColor = (_a = {},
    _a[LogLevel.critical] = colors[7],
    _a[LogLevel.warning] = colors[1],
    _a[LogLevel.error] = colors[4],
    _a[LogLevel.info] = colors[0],
    _a[LogLevel.debug] = colors[5],
    _a[LogLevel.trace] = colors[2],
    _a[LogLevel.unknown] = getThemeColor('#8e8e8e', '#dde4ed'),
    _a);
var isoDateRegexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-6]\d[,\.]\d+([+-][0-2]\d:[0-5]\d|Z)/g;
function isDuplicateRow(row, other, strategy) {
    switch (strategy) {
        case LogsDedupStrategy.exact:
            // Exact still strips dates
            return row.entry.replace(isoDateRegexp, '') === other.entry.replace(isoDateRegexp, '');
        case LogsDedupStrategy.numbers:
            return row.entry.replace(/\d/g, '') === other.entry.replace(/\d/g, '');
        case LogsDedupStrategy.signature:
            return row.entry.replace(/\w/g, '') === other.entry.replace(/\w/g, '');
        default:
            return false;
    }
}
export function dedupLogRows(logs, strategy) {
    if (strategy === LogsDedupStrategy.none) {
        return logs;
    }
    var dedupedRows = logs.rows.reduce(function (result, row, index, list) {
        var rowCopy = tslib_1.__assign({}, row);
        var previous = result[result.length - 1];
        if (index > 0 && isDuplicateRow(row, previous, strategy)) {
            previous.duplicates++;
        }
        else {
            rowCopy.duplicates = 0;
            result.push(rowCopy);
        }
        return result;
    }, []);
    return tslib_1.__assign({}, logs, { rows: dedupedRows });
}
export function filterLogLevels(logs, hiddenLogLevels) {
    if (hiddenLogLevels.size === 0) {
        return logs;
    }
    var filteredRows = logs.rows.reduce(function (result, row, index, list) {
        if (!hiddenLogLevels.has(row.logLevel)) {
            result.push(row);
        }
        return result;
    }, []);
    return tslib_1.__assign({}, logs, { rows: filteredRows });
}
export function makeSeriesForLogs(rows, intervalMs) {
    // currently interval is rangeMs / resolution, which is too low for showing series as bars.
    // need at least 10px per bucket, so we multiply interval by 10. Should be solved higher up the chain
    // when executing queries & interval calculated and not here but this is a temporary fix.
    // intervalMs = intervalMs * 10;
    var e_1, _a, e_2, _b;
    // Graph time series by log level
    var seriesByLevel = {};
    var bucketSize = intervalMs * 10;
    var seriesList = [];
    var sortedRows = rows.sort(sortInAscendingOrder);
    try {
        for (var sortedRows_1 = tslib_1.__values(sortedRows), sortedRows_1_1 = sortedRows_1.next(); !sortedRows_1_1.done; sortedRows_1_1 = sortedRows_1.next()) {
            var row = sortedRows_1_1.value;
            var series = seriesByLevel[row.logLevel];
            if (!series) {
                seriesByLevel[row.logLevel] = series = {
                    lastTs: null,
                    datapoints: [],
                    alias: row.logLevel,
                    color: LogLevelColor[row.logLevel],
                };
                seriesList.push(series);
            }
            // align time to bucket size - used Math.floor for calculation as time of the bucket
            // must be in the past (before Date.now()) to be displayed on the graph
            var time = Math.floor(row.timeEpochMs / bucketSize) * bucketSize;
            // Entry for time
            if (time === series.lastTs) {
                series.datapoints[series.datapoints.length - 1][0]++;
            }
            else {
                series.datapoints.push([1, time]);
                series.lastTs = time;
            }
            try {
                // add zero to other levels to aid stacking so each level series has same number of points
                for (var seriesList_1 = (e_2 = void 0, tslib_1.__values(seriesList)), seriesList_1_1 = seriesList_1.next(); !seriesList_1_1.done; seriesList_1_1 = seriesList_1.next()) {
                    var other = seriesList_1_1.value;
                    if (other !== series && other.lastTs !== time) {
                        other.datapoints.push([0, time]);
                        other.lastTs = time;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (seriesList_1_1 && !seriesList_1_1.done && (_b = seriesList_1.return)) _b.call(seriesList_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sortedRows_1_1 && !sortedRows_1_1.done && (_a = sortedRows_1.return)) _a.call(sortedRows_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return seriesList.map(function (series) {
        series.datapoints.sort(function (a, b) {
            return a[1] - b[1];
        });
        // EEEP: converts GraphSeriesXY to DataFrame and back again!
        var data = toDataFrame(series);
        var points = getFlotPairs({
            xField: data.fields[1],
            yField: data.fields[0],
            nullValueMode: NullValueMode.Null,
        });
        var graphSeries = {
            color: series.color,
            label: series.alias,
            data: points,
            isVisible: true,
            yAxis: {
                index: 1,
                min: 0,
                tickDecimals: 0,
            },
        };
        return graphSeries;
    });
}
function isLogsData(series) {
    return series.fields.some(function (f) { return f.type === FieldType.time; }) && series.fields.some(function (f) { return f.type === FieldType.string; });
}
export function dataFrameToLogsModel(dataFrame, intervalMs) {
    var e_3, _a;
    var metricSeries = [];
    var logSeries = [];
    try {
        for (var dataFrame_1 = tslib_1.__values(dataFrame), dataFrame_1_1 = dataFrame_1.next(); !dataFrame_1_1.done; dataFrame_1_1 = dataFrame_1.next()) {
            var series = dataFrame_1_1.value;
            if (isLogsData(series)) {
                logSeries.push(series);
                continue;
            }
            metricSeries.push(series);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (dataFrame_1_1 && !dataFrame_1_1.done && (_a = dataFrame_1.return)) _a.call(dataFrame_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var logsModel = logSeriesToLogsModel(logSeries);
    if (logsModel) {
        if (metricSeries.length === 0) {
            logsModel.series = makeSeriesForLogs(logsModel.rows, intervalMs);
        }
        else {
            logsModel.series = getGraphSeriesModel(metricSeries, {}, { showBars: true, showLines: false, showPoints: false }, {
                asTable: false,
                isVisible: true,
                placement: 'under',
            });
        }
        return logsModel;
    }
    return {
        hasUniqueLabels: false,
        rows: [],
        meta: [],
        series: [],
    };
}
export function logSeriesToLogsModel(logSeries) {
    if (logSeries.length === 0) {
        return undefined;
    }
    var allLabels = [];
    for (var n = 0; n < logSeries.length; n++) {
        var series = logSeries[n];
        if (series.labels) {
            allLabels.push(series.labels);
        }
    }
    var commonLabels = {};
    if (allLabels.length > 0) {
        commonLabels = findCommonLabels(allLabels);
    }
    var rows = [];
    var hasUniqueLabels = false;
    for (var i = 0; i < logSeries.length; i++) {
        var series = logSeries[i];
        var fieldCache = new FieldCache(series);
        var uniqueLabels = findUniqueLabels(series.labels, commonLabels);
        if (Object.keys(uniqueLabels).length > 0) {
            hasUniqueLabels = true;
        }
        var timeField = fieldCache.getFirstFieldOfType(FieldType.time);
        var stringField = fieldCache.getFirstFieldOfType(FieldType.string);
        var logLevelField = fieldCache.getFieldByName('level');
        var seriesLogLevel = undefined;
        if (series.labels && Object.keys(series.labels).indexOf('level') !== -1) {
            seriesLogLevel = getLogLevelFromKey(series.labels['level']);
        }
        for (var j = 0; j < series.length; j++) {
            var ts = timeField.values.get(j);
            var time = dateTime(ts);
            var timeEpochMs = time.valueOf();
            var timeFromNow = time.fromNow();
            var timeLocal = time.format('YYYY-MM-DD HH:mm:ss');
            var timeUtc = toUtc(ts).format('YYYY-MM-DD HH:mm:ss');
            var message = stringField.values.get(j);
            // This should be string but sometimes isn't (eg elastic) because the dataFrame is not strongly typed.
            message = typeof message === 'string' ? message : JSON.stringify(message);
            var logLevel = LogLevel.unknown;
            if (logLevelField) {
                logLevel = getLogLevelFromKey(logLevelField.values.get(j));
            }
            else if (seriesLogLevel) {
                logLevel = seriesLogLevel;
            }
            else {
                logLevel = getLogLevel(message);
            }
            var hasAnsi = hasAnsiCodes(message);
            var searchWords = series.meta && series.meta.searchWords ? series.meta.searchWords : [];
            rows.push({
                logLevel: logLevel,
                timeFromNow: timeFromNow,
                timeEpochMs: timeEpochMs,
                timeLocal: timeLocal,
                timeUtc: timeUtc,
                uniqueLabels: uniqueLabels,
                hasAnsi: hasAnsi,
                searchWords: searchWords,
                entry: hasAnsi ? ansicolor.strip(message) : message,
                raw: message,
                labels: series.labels,
                timestamp: ts,
            });
        }
    }
    // Meta data to display in status
    var meta = [];
    if (_.size(commonLabels) > 0) {
        meta.push({
            label: 'Common labels',
            value: commonLabels,
            kind: LogsMetaKind.LabelsMap,
        });
    }
    var limits = logSeries.filter(function (series) { return series.meta && series.meta.limit; });
    if (limits.length > 0) {
        meta.push({
            label: 'Limit',
            value: limits[0].meta.limit + " (" + rows.length + " returned)",
            kind: LogsMetaKind.String,
        });
    }
    return {
        hasUniqueLabels: hasUniqueLabels,
        meta: meta,
        rows: rows,
    };
}
//# sourceMappingURL=logs_model.js.map
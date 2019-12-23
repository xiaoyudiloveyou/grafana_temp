import * as tslib_1 from "tslib";
import { FieldType } from '@grafana/data';
import { ExploreMode } from 'app/types/explore';
import TableModel, { mergeTablesIntoModel } from 'app/core/table_model';
import { sortLogsResult, refreshIntervalToSortOrder } from 'app/core/utils/explore';
import { dataFrameToLogsModel } from 'app/core/logs_model';
import { getGraphSeriesModel } from 'app/plugins/panel/graph2/getGraphSeriesModel';
var ResultProcessor = /** @class */ (function () {
    function ResultProcessor(state, dataFrames, intervalMs) {
        this.state = state;
        this.dataFrames = dataFrames;
        this.intervalMs = intervalMs;
    }
    ResultProcessor.prototype.getGraphResult = function () {
        if (this.state.mode !== ExploreMode.Metrics) {
            return null;
        }
        var onlyTimeSeries = this.dataFrames.filter(isTimeSeries);
        if (onlyTimeSeries.length === 0) {
            return null;
        }
        return getGraphSeriesModel(onlyTimeSeries, {}, { showBars: false, showLines: true, showPoints: false }, { asTable: false, isVisible: true, placement: 'under' });
    };
    ResultProcessor.prototype.getTableResult = function () {
        if (this.state.mode !== ExploreMode.Metrics) {
            return null;
        }
        // For now ignore time series
        // We can change this later, just need to figure out how to
        // Ignore time series only for prometheus
        var onlyTables = this.dataFrames.filter(function (frame) { return !isTimeSeries(frame); });
        if (onlyTables.length === 0) {
            return null;
        }
        var tables = onlyTables.map(function (frame) {
            var fields = frame.fields;
            var fieldCount = fields.length;
            var rowCount = frame.length;
            var columns = fields.map(function (field) { return ({
                text: field.name,
                type: field.type,
                filterable: field.config.filterable,
            }); });
            var rows = [];
            for (var i = 0; i < rowCount; i++) {
                var row = [];
                for (var j = 0; j < fieldCount; j++) {
                    row.push(frame.fields[j].values.get(i));
                }
                rows.push(row);
            }
            return new TableModel({
                columns: columns,
                rows: rows,
                meta: frame.meta,
            });
        });
        return mergeTablesIntoModel.apply(void 0, tslib_1.__spread([new TableModel()], tables));
    };
    ResultProcessor.prototype.getLogsResult = function () {
        if (this.state.mode !== ExploreMode.Logs) {
            return null;
        }
        var newResults = dataFrameToLogsModel(this.dataFrames, this.intervalMs);
        var sortOrder = refreshIntervalToSortOrder(this.state.refreshInterval);
        var sortedNewResults = sortLogsResult(newResults, sortOrder);
        var rows = sortedNewResults.rows;
        var series = sortedNewResults.series;
        return tslib_1.__assign({}, sortedNewResults, { rows: rows, series: series });
    };
    return ResultProcessor;
}());
export { ResultProcessor };
export function isTimeSeries(frame) {
    if (frame.fields.length === 2) {
        if (frame.fields[1].type === FieldType.time) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=ResultProcessor.js.map
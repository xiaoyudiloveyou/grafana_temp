import { __assign, __values } from "tslib";
import { colors, getFlotPairs, getColorFromHexRgbOrName, getDisplayProcessor } from '@grafana/ui';
import { NullValueMode, reduceField, FieldType, getTimeField, } from '@grafana/data';
export var getGraphSeriesModel = function (dataFrames, seriesOptions, graphOptions, legendOptions) {
    var e_1, _a, e_2, _b;
    var graphs = [];
    var displayProcessor = getDisplayProcessor({
        config: {
            decimals: legendOptions.decimals,
        },
    });
    try {
        for (var dataFrames_1 = __values(dataFrames), dataFrames_1_1 = dataFrames_1.next(); !dataFrames_1_1.done; dataFrames_1_1 = dataFrames_1.next()) {
            var series = dataFrames_1_1.value;
            var timeField = getTimeField(series).timeField;
            if (!timeField) {
                continue;
            }
            var _loop_1 = function (field) {
                if (field.type !== FieldType.number) {
                    return "continue";
                }
                // Use external calculator just to make sure it works :)
                var points = getFlotPairs({
                    xField: timeField,
                    yField: field,
                    nullValueMode: NullValueMode.Null,
                });
                if (points.length > 0) {
                    var seriesStats_1 = reduceField({ field: field, reducers: legendOptions.stats });
                    var statsDisplayValues = void 0;
                    if (legendOptions.stats) {
                        statsDisplayValues = legendOptions.stats.map(function (stat) {
                            var statDisplayValue = displayProcessor(seriesStats_1[stat]);
                            return __assign(__assign({}, statDisplayValue), { text: statDisplayValue.text, title: stat });
                        });
                    }
                    var seriesColor = seriesOptions[field.name] && seriesOptions[field.name].color
                        ? getColorFromHexRgbOrName(seriesOptions[field.name].color)
                        : colors[graphs.length % colors.length];
                    graphs.push({
                        label: field.name,
                        data: points,
                        color: seriesColor,
                        info: statsDisplayValues,
                        isVisible: true,
                        yAxis: {
                            index: (seriesOptions[field.name] && seriesOptions[field.name].yAxis) || 1,
                        },
                    });
                }
            };
            try {
                for (var _c = (e_2 = void 0, __values(series.fields)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var field = _d.value;
                    _loop_1(field);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dataFrames_1_1 && !dataFrames_1_1.done && (_a = dataFrames_1.return)) _a.call(dataFrames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return graphs;
};
//# sourceMappingURL=getGraphSeriesModel.js.map
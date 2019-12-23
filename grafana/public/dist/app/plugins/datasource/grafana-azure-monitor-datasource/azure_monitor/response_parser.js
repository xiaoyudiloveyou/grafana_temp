import _ from 'lodash';
import TimeGrainConverter from '../time_grain_converter';
var ResponseParser = /** @class */ (function () {
    function ResponseParser() {
    }
    ResponseParser.parseResponseValues = function (result, textFieldName, valueFieldName) {
        var list = [];
        if (!result) {
            return list;
        }
        for (var i = 0; i < result.data.value.length; i++) {
            if (!_.find(list, ['value', _.get(result.data.value[i], valueFieldName)])) {
                var value = _.get(result.data.value[i], valueFieldName);
                var text = _.get(result.data.value[i], textFieldName, value);
                list.push({
                    text: text,
                    value: value,
                });
            }
        }
        return list;
    };
    ResponseParser.parseResourceNames = function (result, metricDefinition) {
        var list = [];
        if (!result) {
            return list;
        }
        for (var i = 0; i < result.data.value.length; i++) {
            if (result.data.value[i].type === metricDefinition) {
                list.push({
                    text: result.data.value[i].name,
                    value: result.data.value[i].name,
                });
            }
        }
        return list;
    };
    ResponseParser.parseMetadata = function (result, metricName) {
        var defaultAggTypes = ['None', 'Average', 'Minimum', 'Maximum', 'Total', 'Count'];
        if (!result) {
            return {
                primaryAggType: '',
                supportedAggTypes: defaultAggTypes,
                supportedTimeGrains: [],
                dimensions: [],
            };
        }
        var metricData = _.find(result.data.value, function (o) {
            return _.get(o, 'name.value') === metricName;
        });
        return {
            primaryAggType: metricData.primaryAggregationType,
            supportedAggTypes: metricData.supportedAggregationTypes || defaultAggTypes,
            supportedTimeGrains: ResponseParser.parseTimeGrains(metricData.metricAvailabilities || []),
            dimensions: ResponseParser.parseDimensions(metricData),
        };
    };
    ResponseParser.parseTimeGrains = function (metricAvailabilities) {
        var timeGrains = [];
        if (!metricAvailabilities) {
            return timeGrains;
        }
        metricAvailabilities.forEach(function (avail) {
            if (avail.timeGrain) {
                timeGrains.push({
                    text: TimeGrainConverter.createTimeGrainFromISO8601Duration(avail.timeGrain),
                    value: avail.timeGrain,
                });
            }
        });
        return timeGrains;
    };
    ResponseParser.parseDimensions = function (metricData) {
        var dimensions = [];
        if (!metricData.dimensions || metricData.dimensions.length === 0) {
            return dimensions;
        }
        if (!metricData.isDimensionRequired) {
            dimensions.push({ text: 'None', value: 'None' });
        }
        for (var i = 0; i < metricData.dimensions.length; i++) {
            var text = metricData.dimensions[i].localizedValue;
            var value = metricData.dimensions[i].value;
            dimensions.push({
                text: !text ? value : text,
                value: value,
            });
        }
        return dimensions;
    };
    ResponseParser.parseSubscriptions = function (result) {
        var list = [];
        if (!result) {
            return list;
        }
        var valueFieldName = 'subscriptionId';
        var textFieldName = 'displayName';
        for (var i = 0; i < result.data.value.length; i++) {
            if (!_.find(list, ['value', _.get(result.data.value[i], valueFieldName)])) {
                list.push({
                    text: _.get(result.data.value[i], textFieldName) + " - " + _.get(result.data.value[i], valueFieldName),
                    value: _.get(result.data.value[i], valueFieldName),
                });
            }
        }
        return list;
    };
    return ResponseParser;
}());
export default ResponseParser;
//# sourceMappingURL=response_parser.js.map
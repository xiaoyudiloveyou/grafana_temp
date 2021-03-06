import _ from 'lodash';
var ResponseParser = /** @class */ (function () {
    function ResponseParser() {
    }
    ResponseParser.prototype.parse = function (query, results) {
        if (!results || results.results.length === 0) {
            return [];
        }
        var influxResults = results.results[0];
        if (!influxResults.series) {
            return [];
        }
        var normalizedQuery = query.toLowerCase();
        var isValueFirst = normalizedQuery.indexOf('show field keys') >= 0 || normalizedQuery.indexOf('show retention policies') >= 0;
        var res = {};
        _.each(influxResults.series, function (serie) {
            _.each(serie.values, function (value) {
                if (_.isArray(value)) {
                    // In general, there are 2 possible shapes for the returned value.
                    // The first one is a two-element array,
                    // where the first element is somewhat a metadata value:
                    // the tag name for SHOW TAG VALUES queries,
                    // the time field for SELECT queries, etc.
                    // The second shape is an one-element array,
                    // that is containing an immediate value.
                    // For example, SHOW FIELD KEYS queries return such shape.
                    // Note, pre-0.11 versions return
                    // the second shape for SHOW TAG VALUES queries
                    // (while the newer versions—first).
                    if (isValueFirst) {
                        addUnique(res, value[0]);
                    }
                    else if (value[1] !== undefined) {
                        addUnique(res, value[1]);
                    }
                    else {
                        addUnique(res, value[0]);
                    }
                }
                else {
                    addUnique(res, value);
                }
            });
        });
        // @ts-ignore problems with typings for this _.map only accepts [] but this needs to be object
        return _.map(res, function (value) {
            // @ts-ignore
            return { text: value.toString() };
        });
    };
    return ResponseParser;
}());
export default ResponseParser;
function addUnique(arr, value) {
    arr[value] = value;
}
//# sourceMappingURL=response_parser.js.map
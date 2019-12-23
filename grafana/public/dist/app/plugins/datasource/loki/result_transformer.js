import { __values } from "tslib";
import { parseLabels, FieldType, ArrayVector, findUniqueLabels, } from '@grafana/data';
/**
 * Transforms LokiLogStream structure into a dataFrame. Used when doing standard queries.
 */
export function logStreamToDataFrame(stream, reverse, refId) {
    var e_1, _a;
    var labels = stream.parsedLabels;
    if (!labels && stream.labels) {
        labels = parseLabels(stream.labels);
    }
    var times = new ArrayVector([]);
    var lines = new ArrayVector([]);
    try {
        for (var _b = __values(stream.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
            var entry = _c.value;
            times.add(entry.ts || entry.timestamp);
            lines.add(entry.line);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (reverse) {
        times.buffer = times.buffer.reverse();
        lines.buffer = lines.buffer.reverse();
    }
    return {
        refId: refId,
        labels: labels,
        fields: [
            { name: 'ts', type: FieldType.time, config: { title: 'Time' }, values: times },
            { name: 'line', type: FieldType.string, config: {}, values: lines },
        ],
        length: times.length,
    };
}
/**
 * Transform LokiResponse data and appends it to MutableDataFrame. Used for streaming where the dataFrame can be
 * a CircularDataFrame creating a fixed size rolling buffer.
 * TODO: Probably could be unified with the logStreamToDataFrame function.
 */
export function appendResponseToBufferedData(response, data) {
    // Should we do anythign with: response.dropped_entries?
    var e_2, _a, e_3, _b;
    var streams = response.streams;
    if (streams && streams.length) {
        try {
            for (var streams_1 = __values(streams), streams_1_1 = streams_1.next(); !streams_1_1.done; streams_1_1 = streams_1.next()) {
                var stream = streams_1_1.value;
                // Find unique labels
                var labels = parseLabels(stream.labels);
                var unique = findUniqueLabels(labels, data.labels);
                try {
                    // Add each line
                    for (var _c = (e_3 = void 0, __values(stream.entries)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var entry = _d.value;
                        data.values.ts.add(entry.ts || entry.timestamp);
                        data.values.line.add(entry.line);
                        data.values.labels.add(unique);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (streams_1_1 && !streams_1_1.done && (_a = streams_1.return)) _a.call(streams_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
//# sourceMappingURL=result_transformer.js.map
import * as tslib_1 from "tslib";
import { defaults } from 'lodash';
import { Observable } from 'rxjs';
import { FieldType, CircularDataFrame, CSVReader, LoadingState } from '@grafana/data';
import { getRandomLine } from './LogIpsum';
export var defaultQuery = {
    type: 'signal',
    speed: 250,
    spread: 3.5,
    noise: 2.2,
    bands: 1,
};
export function runStream(target, req) {
    var query = defaults(target.stream, defaultQuery);
    if ('signal' === query.type) {
        return runSignalStream(target, query, req);
    }
    if ('logs' === query.type) {
        return runLogsStream(target, query, req);
    }
    if ('fetch' === query.type) {
        return runFetchStream(target, query, req);
    }
    throw new Error("Unknown Stream Type: " + query.type);
}
export function runSignalStream(target, query, req) {
    return new Observable(function (subscriber) {
        var streamId = "signal-" + req.panelId + "-" + target.refId;
        var maxDataPoints = req.maxDataPoints || 1000;
        var data = new CircularDataFrame({
            append: 'tail',
            capacity: maxDataPoints,
        });
        data.refId = target.refId;
        data.name = target.alias || 'Signal ' + target.refId;
        data.addField({ name: 'time', type: FieldType.time });
        data.addField({ name: 'value', type: FieldType.number });
        var spread = query.spread, speed = query.speed, bands = query.bands, noise = query.noise;
        for (var i = 0; i < bands; i++) {
            var suffix = bands > 1 ? " " + (i + 1) : '';
            data.addField({ name: 'Min' + suffix, type: FieldType.number });
            data.addField({ name: 'Max' + suffix, type: FieldType.number });
        }
        var value = Math.random() * 100;
        var timeoutId = null;
        var addNextRow = function (time) {
            value += (Math.random() - 0.5) * spread;
            var idx = 0;
            data.fields[idx++].values.add(time);
            data.fields[idx++].values.add(value);
            var min = value;
            var max = value;
            for (var i = 0; i < bands; i++) {
                min = min - Math.random() * noise;
                max = max + Math.random() * noise;
                data.fields[idx++].values.add(min);
                data.fields[idx++].values.add(max);
            }
        };
        // Fill the buffer on init
        if (true) {
            var time = Date.now() - maxDataPoints * speed;
            for (var i = 0; i < maxDataPoints; i++) {
                addNextRow(time);
                time += speed;
            }
        }
        var pushNextEvent = function () {
            addNextRow(Date.now());
            subscriber.next({
                data: [data],
                key: streamId,
            });
            timeoutId = setTimeout(pushNextEvent, speed);
        };
        // Send first event in 5ms
        setTimeout(pushNextEvent, 5);
        return function () {
            console.log('unsubscribing to stream ' + streamId);
            clearTimeout(timeoutId);
        };
    });
}
export function runLogsStream(target, query, req) {
    return new Observable(function (subscriber) {
        var streamId = "logs-" + req.panelId + "-" + target.refId;
        var maxDataPoints = req.maxDataPoints || 1000;
        var data = new CircularDataFrame({
            append: 'tail',
            capacity: maxDataPoints,
        });
        data.refId = target.refId;
        data.name = target.alias || 'Logs ' + target.refId;
        data.addField({ name: 'time', type: FieldType.time });
        data.addField({ name: 'line', type: FieldType.string });
        var speed = query.speed;
        var timeoutId = null;
        var pushNextEvent = function () {
            data.values.time.add(Date.now());
            data.values.line.add(getRandomLine());
            subscriber.next({
                data: [data],
                key: streamId,
            });
            timeoutId = setTimeout(pushNextEvent, speed);
        };
        // Send first event in 5ms
        setTimeout(pushNextEvent, 5);
        return function () {
            console.log('unsubscribing to stream ' + streamId);
            clearTimeout(timeoutId);
        };
    });
}
export function runFetchStream(target, query, req) {
    return new Observable(function (subscriber) {
        var streamId = "fetch-" + req.panelId + "-" + target.refId;
        var maxDataPoints = req.maxDataPoints || 1000;
        var data = new CircularDataFrame({
            append: 'tail',
            capacity: maxDataPoints,
        });
        data.refId = target.refId;
        data.name = target.alias || 'Fetch ' + target.refId;
        var reader;
        var csv = new CSVReader({
            callback: {
                onHeader: function (fields) {
                    var e_1, _a;
                    // Clear any existing fields
                    if (data.fields.length) {
                        data = new CircularDataFrame({
                            append: 'tail',
                            capacity: maxDataPoints,
                        });
                        data.refId = target.refId;
                        data.name = 'Fetch ' + target.refId;
                    }
                    try {
                        for (var fields_1 = tslib_1.__values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                            var field = fields_1_1.value;
                            data.addField(field);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                },
                onRow: function (row) {
                    data.add(row);
                },
            },
        });
        var processChunk = function (value) {
            if (value.value) {
                var text = new TextDecoder().decode(value.value);
                csv.readCSV(text);
            }
            subscriber.next({
                data: [data],
                key: streamId,
                state: value.done ? LoadingState.Done : LoadingState.Streaming,
            });
            if (value.done) {
                console.log('Finished stream');
                subscriber.complete(); // necessary?
                return;
            }
            return reader.read().then(processChunk);
        };
        fetch(new Request(query.url)).then(function (response) {
            reader = response.body.getReader();
            reader.read().then(processChunk);
        });
        return function () {
            // Cancel fetch?
            console.log('unsubscribing to stream ' + streamId);
        };
    });
}
//# sourceMappingURL=runStreams.js.map
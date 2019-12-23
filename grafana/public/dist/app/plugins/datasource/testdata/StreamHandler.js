import * as tslib_1 from "tslib";
import defaults from 'lodash/defaults';
import { FieldType, LoadingState, LogLevel, CSVReader, MutableDataFrame, CircularVector, } from '@grafana/data';
export var defaultQuery = {
    type: 'signal',
    speed: 250,
    spread: 3.5,
    noise: 2.2,
    bands: 1,
};
var StreamHandler = /** @class */ (function () {
    function StreamHandler() {
        this.workers = {};
    }
    StreamHandler.prototype.process = function (req, observer) {
        var e_1, _a;
        var resp;
        try {
            for (var _b = tslib_1.__values(req.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                var query = _c.value;
                if ('streaming_client' !== query.scenarioId) {
                    continue;
                }
                if (!resp) {
                    resp = { data: [] };
                }
                // set stream option defaults
                query.stream = defaults(query.stream, defaultQuery);
                // create stream key
                var key = req.dashboardId + '/' + req.panelId + '/' + query.refId + '@' + query.stream.bands;
                if (this.workers[key]) {
                    var existing = this.workers[key];
                    if (existing.update(query, req)) {
                        continue;
                    }
                    existing.unsubscribe();
                    delete this.workers[key];
                }
                var type = query.stream.type;
                if (type === 'signal') {
                    this.workers[key] = new SignalWorker(key, query, req, observer);
                }
                else if (type === 'logs') {
                    this.workers[key] = new LogsWorker(key, query, req, observer);
                }
                else if (type === 'fetch') {
                    this.workers[key] = new FetchWorker(key, query, req, observer);
                }
                else {
                    throw {
                        message: 'Unknown Stream type: ' + type,
                        refId: query.refId,
                    };
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
        return resp;
    };
    return StreamHandler;
}());
export { StreamHandler };
/**
 * Manages a single stream request
 */
var StreamWorker = /** @class */ (function () {
    function StreamWorker(key, query, request, observer) {
        var _this = this;
        this.last = -1;
        this.timeoutId = 0;
        // The values within
        this.values = [];
        this.data = { fields: [], length: 0 };
        this.unsubscribe = function () {
            _this.observer = null;
            if (_this.timeoutId) {
                clearTimeout(_this.timeoutId);
                _this.timeoutId = 0;
            }
        };
        this.stream = {
            key: key,
            state: LoadingState.Streaming,
            request: request,
            unsubscribe: this.unsubscribe,
        };
        this.refId = query.refId;
        this.query = query.stream;
        this.last = Date.now();
        this.observer = observer;
        console.log('Creating Test Stream: ', this);
    }
    StreamWorker.prototype.update = function (query, request) {
        // Check if stream has been unsubscribed or query changed type
        if (this.observer === null || this.query.type !== query.stream.type) {
            return false;
        }
        this.query = query.stream;
        this.stream.request = request; // OK?
        return true;
    };
    StreamWorker.prototype.appendRows = function (append) {
        // Trim the maximum row count
        var _a = this, stream = _a.stream, values = _a.values, data = _a.data;
        // Append all rows
        for (var i = 0; i < append.length; i++) {
            var row = append[i];
            for (var j = 0; j < values.length; j++) {
                values[j].add(row[j]); // Circular buffer will kick out old entries
            }
        }
        // Clear any cached values
        for (var j = 0; j < data.fields.length; j++) {
            data.fields[j].calcs = undefined;
        }
        stream.data = [data];
        // Broadcast the changes
        if (this.observer) {
            this.observer(stream);
        }
        else {
            console.log('StreamWorker working without any observer');
        }
        this.last = Date.now();
    };
    return StreamWorker;
}());
export { StreamWorker };
var SignalWorker = /** @class */ (function (_super) {
    tslib_1.__extends(SignalWorker, _super);
    function SignalWorker(key, query, request, observer) {
        var _this = _super.call(this, key, query, request, observer) || this;
        _this.bands = 1;
        _this.nextRow = function (time) {
            var _a = _this.query, spread = _a.spread, noise = _a.noise;
            _this.value += (Math.random() - 0.5) * spread;
            var row = [time, _this.value];
            for (var i = 0; i < _this.bands; i++) {
                var v = row[row.length - 1];
                row.push(v - Math.random() * noise); // MIN
                row.push(v + Math.random() * noise); // MAX
            }
            return row;
        };
        _this.looper = function () {
            if (!_this.observer) {
                var request = _this.stream.request;
                var elapsed = request.startTime - Date.now();
                if (elapsed > 1000) {
                    console.log('Stop looping');
                    return;
                }
            }
            // Make sure it has a minimum speed
            var query = _this.query;
            if (query.speed < 5) {
                query.speed = 5;
            }
            _this.appendRows([_this.nextRow(Date.now())]);
            _this.timeoutId = window.setTimeout(_this.looper, query.speed);
        };
        setTimeout(function () {
            _this.initBuffer(query.refId);
            _this.looper();
        }, 10);
        _this.bands = query.stream.bands ? query.stream.bands : 0;
        return _this;
    }
    SignalWorker.prototype.initBuffer = function (refId) {
        var speed = this.query.speed;
        var request = this.stream.request;
        var maxRows = request.maxDataPoints || 1000;
        var times = new CircularVector({ capacity: maxRows });
        var vals = new CircularVector({ capacity: maxRows });
        this.values = [times, vals];
        var data = new MutableDataFrame({
            fields: [
                { name: 'Time', type: FieldType.time, values: times },
                { name: 'Value', type: FieldType.number, values: vals },
            ],
            refId: refId,
            name: 'Signal ' + refId,
        });
        for (var i = 0; i < this.bands; i++) {
            var suffix = this.bands > 1 ? " " + (i + 1) : '';
            var min = new CircularVector({ capacity: maxRows });
            var max = new CircularVector({ capacity: maxRows });
            this.values.push(min);
            this.values.push(max);
            data.addField({ name: 'Min' + suffix, type: FieldType.number, values: min });
            data.addField({ name: 'Max' + suffix, type: FieldType.number, values: max });
        }
        console.log('START', data);
        this.value = Math.random() * 100;
        var time = Date.now() - maxRows * speed;
        for (var i = 0; i < maxRows; i++) {
            var row = this.nextRow(time);
            for (var j = 0; j < this.values.length; j++) {
                this.values[j].add(row[j]);
            }
            time += speed;
        }
        this.data = data;
    };
    return SignalWorker;
}(StreamWorker));
export { SignalWorker };
var FetchWorker = /** @class */ (function (_super) {
    tslib_1.__extends(FetchWorker, _super);
    function FetchWorker(key, query, request, observer) {
        var _this = _super.call(this, key, query, request, observer) || this;
        _this.processChunk = function (value) {
            if (_this.observer == null) {
                return; // Nothing more to do
            }
            if (value.value) {
                var text = new TextDecoder().decode(value.value);
                _this.csv.readCSV(text);
            }
            if (value.done) {
                console.log('Finished stream');
                _this.stream.state = LoadingState.Done;
                return;
            }
            return _this.reader.read().then(_this.processChunk);
        };
        _this.onHeader = function (fields) {
            console.warn('TODO!!!', fields);
            // series.refId = this.refId;
            // this.stream.data = [series];
        };
        _this.onRow = function (row) {
            // TODO?? this will send an event for each row, even if the chunk passed a bunch of them
            _this.appendRows([row]);
        };
        if (!query.stream.url) {
            throw new Error('Missing Fetch URL');
        }
        if (!query.stream.url.startsWith('http')) {
            throw new Error('Fetch URL must be absolute');
        }
        _this.csv = new CSVReader({ callback: _this });
        fetch(new Request(query.stream.url)).then(function (response) {
            _this.reader = response.body.getReader();
            _this.reader.read().then(_this.processChunk);
        });
        return _this;
    }
    return FetchWorker;
}(StreamWorker));
export { FetchWorker };
var LogsWorker = /** @class */ (function (_super) {
    tslib_1.__extends(LogsWorker, _super);
    function LogsWorker(key, query, request, observer) {
        var _this = _super.call(this, key, query, request, observer) || this;
        _this.index = 0;
        _this.nextRow = function (time) {
            return [time, '[' + _this.getRandomLogLevel() + '] ' + _this.getRandomLine()];
        };
        _this.looper = function () {
            if (!_this.observer) {
                var request = _this.stream.request;
                var elapsed = request.startTime - Date.now();
                if (elapsed > 1000) {
                    console.log('Stop looping');
                    return;
                }
            }
            // Make sure it has a minimum speed
            var query = _this.query;
            if (query.speed < 5) {
                query.speed = 5;
            }
            var variance = query.speed * 0.2 * (Math.random() - 0.5); // +-10%
            _this.appendRows([_this.nextRow(Date.now())]);
            _this.timeoutId = window.setTimeout(_this.looper, query.speed + variance);
        };
        window.setTimeout(function () {
            _this.initBuffer(query.refId);
            _this.looper();
        }, 10);
        return _this;
    }
    LogsWorker.prototype.getRandomLogLevel = function () {
        var v = Math.random();
        if (v > 0.9) {
            return LogLevel.critical;
        }
        if (v > 0.8) {
            return LogLevel.error;
        }
        if (v > 0.7) {
            return LogLevel.warning;
        }
        if (v > 0.4) {
            return LogLevel.info;
        }
        if (v > 0.3) {
            return LogLevel.debug;
        }
        if (v > 0.1) {
            return LogLevel.trace;
        }
        return LogLevel.unknown;
    };
    LogsWorker.prototype.getNextWord = function () {
        this.index = (this.index + Math.floor(Math.random() * 5)) % words.length;
        return words[this.index];
    };
    LogsWorker.prototype.getRandomLine = function (length) {
        if (length === void 0) { length = 60; }
        var line = this.getNextWord();
        while (line.length < length) {
            line += ' ' + this.getNextWord();
        }
        return line;
    };
    LogsWorker.prototype.initBuffer = function (refId) {
        var speed = this.query.speed;
        var request = this.stream.request;
        var maxRows = request.maxDataPoints || 1000;
        var times = new CircularVector({ capacity: maxRows });
        var lines = new CircularVector({ capacity: maxRows });
        this.values = [times, lines];
        this.data = new MutableDataFrame({
            fields: [
                { name: 'Time', type: FieldType.time, values: times },
                { name: 'Line', type: FieldType.string, values: lines },
            ],
            refId: refId,
            name: 'Logs ' + refId,
        });
        // Fill up the buffer
        var time = Date.now() - maxRows * speed;
        for (var i = 0; i < maxRows; i++) {
            var row = this.nextRow(time);
            times.add(row[0]);
            lines.add(row[1]);
            time += speed;
        }
    };
    return LogsWorker;
}(StreamWorker));
export { LogsWorker };
var words = [
    'At',
    'vero',
    'eos',
    'et',
    'accusamus',
    'et',
    'iusto',
    'odio',
    'dignissimos',
    'ducimus',
    'qui',
    'blanditiis',
    'praesentium',
    'voluptatum',
    'deleniti',
    'atque',
    'corrupti',
    'quos',
    'dolores',
    'et',
    'quas',
    'molestias',
    'excepturi',
    'sint',
    'occaecati',
    'cupiditate',
    'non',
    'provident',
    'similique',
    'sunt',
    'in',
    'culpa',
    'qui',
    'officia',
    'deserunt',
    'mollitia',
    'animi',
    'id',
    'est',
    'laborum',
    'et',
    'dolorum',
    'fuga',
    'Et',
    'harum',
    'quidem',
    'rerum',
    'facilis',
    'est',
    'et',
    'expedita',
    'distinctio',
    'Nam',
    'libero',
    'tempore',
    'cum',
    'soluta',
    'nobis',
    'est',
    'eligendi',
    'optio',
    'cumque',
    'nihil',
    'impedit',
    'quo',
    'minus',
    'id',
    'quod',
    'maxime',
    'placeat',
    'facere',
    'possimus',
    'omnis',
    'voluptas',
    'assumenda',
    'est',
    'omnis',
    'dolor',
    'repellendus',
    'Temporibus',
    'autem',
    'quibusdam',
    'et',
    'aut',
    'officiis',
    'debitis',
    'aut',
    'rerum',
    'necessitatibus',
    'saepe',
    'eveniet',
    'ut',
    'et',
    'voluptates',
    'repudiandae',
    'sint',
    'et',
    'molestiae',
    'non',
    'recusandae',
    'Itaque',
    'earum',
    'rerum',
    'hic',
    'tenetur',
    'a',
    'sapiente',
    'delectus',
    'ut',
    'aut',
    'reiciendis',
    'voluptatibus',
    'maiores',
    'alias',
    'consequatur',
    'aut',
    'perferendis',
    'doloribus',
    'asperiores',
    'repellat',
];
//# sourceMappingURL=StreamHandler.js.map
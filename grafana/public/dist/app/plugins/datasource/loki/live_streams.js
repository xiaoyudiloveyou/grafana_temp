import { FieldType, parseLabels, CircularDataFrame } from '@grafana/data';
import { webSocket } from 'rxjs/webSocket';
import { finalize, map } from 'rxjs/operators';
import { appendResponseToBufferedData } from './result_transformer';
/**
 * Cache of websocket streams that can be returned as observable. In case there already is a stream for particular
 * target it is returned and on subscription returns the latest dataFrame.
 */
var LiveStreams = /** @class */ (function () {
    function LiveStreams() {
        this.streams = {};
    }
    LiveStreams.prototype.getStream = function (target) {
        var _this = this;
        var stream = this.streams[target.url];
        if (!stream) {
            var data_1 = new CircularDataFrame({ capacity: target.size });
            data_1.labels = parseLabels(target.query);
            data_1.addField({ name: 'ts', type: FieldType.time, config: { title: 'Time' } });
            data_1.addField({ name: 'line', type: FieldType.string });
            data_1.addField({ name: 'labels', type: FieldType.other });
            stream = webSocket(target.url).pipe(finalize(function () {
                delete _this.streams[target.url];
            }), map(function (response) {
                appendResponseToBufferedData(response, data_1);
                return [data_1];
            }));
            this.streams[target.url] = stream;
        }
        return stream;
    };
    return LiveStreams;
}());
export { LiveStreams };
//# sourceMappingURL=live_streams.js.map
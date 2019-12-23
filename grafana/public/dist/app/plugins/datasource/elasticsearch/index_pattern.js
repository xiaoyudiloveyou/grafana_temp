import { toUtc, dateTime } from '@grafana/data';
var intervalMap = {
    Hourly: { startOf: 'hour', amount: 'hours' },
    Daily: { startOf: 'day', amount: 'days' },
    Weekly: { startOf: 'isoWeek', amount: 'weeks' },
    Monthly: { startOf: 'month', amount: 'months' },
    Yearly: { startOf: 'year', amount: 'years' },
};
var IndexPattern = /** @class */ (function () {
    function IndexPattern(pattern, interval) {
        this.pattern = pattern;
        this.interval = interval;
    }
    IndexPattern.prototype.getIndexForToday = function () {
        if (this.interval) {
            return toUtc().format(this.pattern);
        }
        else {
            return this.pattern;
        }
    };
    IndexPattern.prototype.getIndexList = function (from, to) {
        if (!this.interval) {
            return this.pattern;
        }
        var intervalInfo = intervalMap[this.interval];
        var start = dateTime(from)
            .utc()
            .startOf(intervalInfo.startOf);
        var endEpoch = dateTime(to)
            .utc()
            .startOf(intervalInfo.startOf)
            .valueOf();
        var indexList = [];
        while (start.valueOf() <= endEpoch) {
            indexList.push(start.format(this.pattern));
            start.add(1, intervalInfo.amount);
        }
        return indexList;
    };
    return IndexPattern;
}());
export { IndexPattern };
//# sourceMappingURL=index_pattern.js.map
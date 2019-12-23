import { dateTime } from '@grafana/data';
export function getQueryOptions(options) {
    var raw = { from: 'now', to: 'now-1h' };
    var range = { from: dateTime(), to: dateTime(), raw: raw };
    var defaults = {
        requestId: 'TEST',
        range: range,
        targets: [],
        scopedVars: {},
        timezone: 'browser',
        panelId: 1,
        dashboardId: 1,
        interval: '60s',
        intervalMs: 60000,
        maxDataPoints: 500,
        startTime: 0,
    };
    Object.assign(defaults, options);
    return defaults;
}
//# sourceMappingURL=getQueryOptions.js.map
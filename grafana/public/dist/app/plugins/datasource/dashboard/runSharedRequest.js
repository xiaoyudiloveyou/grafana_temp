import { __assign } from "tslib";
import { Observable } from 'rxjs';
import { SHARED_DASHBODARD_QUERY } from './types';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
import { LoadingState, DefaultTimeRange } from '@grafana/data';
export function isSharedDashboardQuery(datasource) {
    if (!datasource) {
        // default datasource
        return false;
    }
    if (datasource === SHARED_DASHBODARD_QUERY) {
        return true;
    }
    var ds = datasource;
    return ds.meta && ds.meta.name === SHARED_DASHBODARD_QUERY;
}
export function runSharedRequest(options) {
    return new Observable(function (subscriber) {
        var dashboard = getDashboardSrv().getCurrent();
        var listenToPanelId = getPanelIdFromQuery(options.queries);
        if (!listenToPanelId) {
            subscriber.next(getQueryError('Missing panel reference ID'));
            return null;
        }
        var currentPanel = dashboard.getPanelById(options.panelId);
        var listenToPanel = dashboard.getPanelById(listenToPanelId);
        if (!listenToPanel) {
            subscriber.next(getQueryError('Unknown Panel: ' + listenToPanelId));
            return null;
        }
        var listenToRunner = listenToPanel.getQueryRunner();
        var subscription = listenToRunner.getData(false).subscribe({
            next: function (data) {
                console.log('got data from other panel', data);
                subscriber.next(data);
            },
        });
        // If we are in fullscreen the other panel will not execute any queries
        // So we have to trigger it from here
        if (currentPanel.fullscreen) {
            var datasource = listenToPanel.datasource, targets = listenToPanel.targets;
            var modified = __assign(__assign({}, options), { datasource: datasource, panelId: listenToPanelId, queries: targets });
            listenToRunner.run(modified);
        }
        return function () {
            console.log('runSharedRequest unsubscribe');
            subscription.unsubscribe();
        };
    });
}
function getPanelIdFromQuery(queries) {
    if (!queries || !queries.length) {
        return undefined;
    }
    return queries[0].panelId;
}
function getQueryError(msg) {
    return {
        state: LoadingState.Error,
        series: [],
        error: { message: msg },
        timeRange: DefaultTimeRange,
    };
}
//# sourceMappingURL=runSharedRequest.js.map
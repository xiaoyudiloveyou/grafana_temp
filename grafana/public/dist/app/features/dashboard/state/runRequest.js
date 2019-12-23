import { __assign, __values } from "tslib";
// Libraries
import { of, timer, merge, from } from 'rxjs';
import { flatten, map as lodashMap, isArray, isString } from 'lodash';
import { map, catchError, takeUntil, mapTo, share, finalize } from 'rxjs/operators';
// Utils & Services
import { getBackendSrv } from 'app/core/services/backend_srv';
import { LoadingState, dateMath, toDataFrame, guessFieldTypes } from '@grafana/data';
/*
 * This function should handle composing a PanelData from multiple responses
 */
export function processResponsePacket(packet, state) {
    var request = state.panelData.request;
    var packets = __assign({}, state.packets);
    packets[packet.key || 'A'] = packet;
    // Update the time range
    var range = __assign({}, request.range);
    var timeRange = isString(range.raw.from)
        ? {
            from: dateMath.parse(range.raw.from, false),
            to: dateMath.parse(range.raw.to, true),
            raw: range.raw,
        }
        : range;
    var combinedData = flatten(lodashMap(packets, function (packet) {
        return packet.data;
    }));
    var panelData = {
        state: packet.state || LoadingState.Done,
        series: combinedData,
        request: request,
        timeRange: timeRange,
    };
    return { packets: packets, panelData: panelData };
}
/**
 * This function handles the excecution of requests & and processes the single or multiple response packets into
 * a combined PanelData response.
 * It will
 *  * Merge multiple responses into a single DataFrame array based on the packet key
 *  * Will emit a loading state if no response after 50ms
 *  * Cancel any still runnning network requests on unsubscribe (using request.requestId)
 */
export function runRequest(datasource, request) {
    var state = {
        panelData: {
            state: LoadingState.Loading,
            series: [],
            request: request,
            timeRange: request.range,
        },
        packets: {},
    };
    // Return early if there are no queries to run
    if (!request.targets.length) {
        request.endTime = Date.now();
        state.panelData.state = LoadingState.Done;
        return of(state.panelData);
    }
    var dataObservable = callQueryMethod(datasource, request).pipe(
    // Transform response packets into PanelData with merged results
    map(function (packet) {
        if (!isArray(packet.data)) {
            throw new Error("Expected response data to be array, got " + typeof packet.data + ".");
        }
        request.endTime = Date.now();
        state = processResponsePacket(packet, state);
        return state.panelData;
    }), 
    // handle errors
    catchError(function (err) {
        return of(__assign(__assign({}, state.panelData), { state: LoadingState.Error, error: processQueryError(err) }));
    }), 
    // finalize is triggered when subscriber unsubscribes
    // This makes sure any still running network requests are cancelled
    finalize(cancelNetworkRequestsOnUnsubscribe(request)), 
    // this makes it possible to share this observable in takeUntil
    share());
    // If 50ms without a response emit a loading state
    // mapTo will translate the timer event into state.panelData (which has state set to loading)
    // takeUntil will cancel the timer emit when first response packet is received on the dataObservable
    return merge(timer(200).pipe(mapTo(state.panelData), takeUntil(dataObservable)), dataObservable);
}
function cancelNetworkRequestsOnUnsubscribe(req) {
    return function () {
        getBackendSrv().resolveCancelerIfExists(req.requestId);
    };
}
export function callQueryMethod(datasource, request) {
    var returnVal = datasource.query(request);
    return from(returnVal);
}
export function processQueryError(err) {
    var error = (err || {});
    if (!error.message) {
        if (typeof err === 'string' || err instanceof String) {
            return { message: err };
        }
        var message = 'Query error';
        if (error.message) {
            message = error.message;
        }
        else if (error.data && error.data.message) {
            message = error.data.message;
        }
        else if (error.data && error.data.error) {
            message = error.data.error;
        }
        else if (error.status) {
            message = "Query error: " + error.status + " " + error.statusText;
        }
        error.message = message;
    }
    return error;
}
/**
 * All panels will be passed tables that have our best guess at colum type set
 *
 * This is also used by PanelChrome for snapshot support
 */
export function getProcessedDataFrames(results) {
    var e_1, _a, e_2, _b;
    if (!isArray(results)) {
        return [];
    }
    var dataFrames = [];
    try {
        for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
            var result = results_1_1.value;
            var dataFrame = guessFieldTypes(toDataFrame(result));
            try {
                // clear out any cached calcs
                for (var _c = (e_2 = void 0, __values(dataFrame.fields)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var field = _d.value;
                    field.calcs = null;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            dataFrames.push(dataFrame);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return dataFrames;
}
export function preProcessPanelData(data, lastResult) {
    var series = data.series;
    //  for loading states with no data, use last result
    if (data.state === LoadingState.Loading && series.length === 0) {
        if (!lastResult) {
            lastResult = data;
        }
        return __assign(__assign({}, lastResult), { state: LoadingState.Loading });
    }
    // Make sure the data frames are properly formatted
    return __assign(__assign({}, data), { series: getProcessedDataFrames(series) });
}
//# sourceMappingURL=runRequest.js.map
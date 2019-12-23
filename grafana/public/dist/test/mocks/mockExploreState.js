import * as tslib_1 from "tslib";
import { ExploreId } from 'app/types/explore';
import { makeExploreItemState } from 'app/features/explore/state/reducers';
import { dateTime } from '@grafana/data';
export var mockExploreState = function (options) {
    if (options === void 0) { options = {}; }
    var isLive = options.isLive || false;
    var history = [];
    var eventBridge = {
        emit: jest.fn(),
    };
    var streaming = options.streaming || undefined;
    var datasourceInterval = options.datasourceInterval || '';
    var refreshInterval = options.refreshInterval || '';
    var containerWidth = options.containerWidth || 1980;
    var queries = options.queries || [];
    var datasourceError = options.datasourceError || null;
    var scanner = options.scanner || jest.fn();
    var scanning = options.scanning || false;
    var datasourceId = options.datasourceId || '1337';
    var exploreId = ExploreId.left;
    var datasourceInstance = options.datasourceInstance || {
        id: 1337,
        query: jest.fn(),
        name: 'test',
        testDatasource: jest.fn(),
        meta: {
            id: datasourceId,
            streaming: streaming,
        },
        interval: datasourceInterval,
    };
    var range = options.range || {
        from: dateTime('2019-01-01 10:00:00.000Z'),
        to: dateTime('2019-01-01 16:00:00.000Z'),
        raw: {
            from: 'now-6h',
            to: 'now',
        },
    };
    var urlReplaced = options.urlReplaced || false;
    var left = options.left || tslib_1.__assign({}, makeExploreItemState(), { containerWidth: containerWidth,
        datasourceError: datasourceError,
        datasourceInstance: datasourceInstance,
        eventBridge: eventBridge,
        history: history,
        isLive: isLive,
        queries: queries,
        refreshInterval: refreshInterval,
        scanner: scanner,
        scanning: scanning,
        urlReplaced: urlReplaced,
        range: range });
    var right = options.right || tslib_1.__assign({}, makeExploreItemState(), { containerWidth: containerWidth,
        datasourceError: datasourceError,
        datasourceInstance: datasourceInstance,
        eventBridge: eventBridge,
        history: history,
        isLive: isLive,
        queries: queries,
        refreshInterval: refreshInterval,
        scanner: scanner,
        scanning: scanning,
        urlReplaced: urlReplaced,
        range: range });
    var split = options.split || false;
    var explore = {
        left: left,
        right: right,
        split: split,
    };
    var user = {
        orgId: 1,
        timeZone: 'browser',
    };
    var state = {
        explore: explore,
        user: user,
    };
    return {
        containerWidth: containerWidth,
        datasourceId: datasourceId,
        datasourceInstance: datasourceInstance,
        datasourceInterval: datasourceInterval,
        eventBridge: eventBridge,
        exploreId: exploreId,
        history: history,
        queries: queries,
        refreshInterval: refreshInterval,
        state: state,
        scanner: scanner,
        range: range,
    };
};
//# sourceMappingURL=mockExploreState.js.map
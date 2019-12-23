import { createLodashMemoizedSelector } from 'app/core/utils/reselect';
import { filterLogLevels, dedupLogRows } from 'app/core/logs_model';
export var exploreItemUIStateSelector = function (itemState) {
    var showingGraph = itemState.showingGraph, showingTable = itemState.showingTable, showingStartPage = itemState.showingStartPage, dedupStrategy = itemState.dedupStrategy;
    return {
        showingGraph: showingGraph,
        showingTable: showingTable,
        showingStartPage: showingStartPage,
        dedupStrategy: dedupStrategy,
    };
};
var logsSelector = function (state) { return state.logsResult; };
var hiddenLogLevelsSelector = function (state) { return state.hiddenLogLevels; };
var dedupStrategySelector = function (state) { return state.dedupStrategy; };
export var deduplicatedLogsSelector = createLodashMemoizedSelector(logsSelector, hiddenLogLevelsSelector, dedupStrategySelector, function (logs, hiddenLogLevels, dedupStrategy) {
    if (!logs) {
        return null;
    }
    var filteredData = filterLogLevels(logs, new Set(hiddenLogLevels));
    return dedupLogRows(filteredData, dedupStrategy);
});
//# sourceMappingURL=selectors.js.map
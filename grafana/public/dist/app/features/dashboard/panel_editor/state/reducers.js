var _a;
import { __assign } from "tslib";
import { reducerFactory } from '../../../../core/redux';
import { panelEditorCleanUp, panelEditorInitCompleted } from './actions';
export var PanelEditorTabIds;
(function (PanelEditorTabIds) {
    PanelEditorTabIds["Queries"] = "queries";
    PanelEditorTabIds["Visualization"] = "visualization";
    PanelEditorTabIds["Advanced"] = "advanced";
    PanelEditorTabIds["Alert"] = "alert";
})(PanelEditorTabIds || (PanelEditorTabIds = {}));
export var panelEditorTabTexts = (_a = {},
    _a[PanelEditorTabIds.Queries] = 'Queries',
    _a[PanelEditorTabIds.Visualization] = 'Visualization',
    _a[PanelEditorTabIds.Advanced] = 'General',
    _a[PanelEditorTabIds.Alert] = 'Alert',
    _a);
export var getPanelEditorTab = function (tabId) {
    return {
        id: tabId,
        text: panelEditorTabTexts[tabId],
    };
};
export var initialState = {
    activeTab: null,
    tabs: [],
};
export var panelEditorReducer = reducerFactory(initialState)
    .addMapper({
    filter: panelEditorInitCompleted,
    mapper: function (state, action) {
        var _a = action.payload, activeTab = _a.activeTab, tabs = _a.tabs;
        return __assign(__assign({}, state), { activeTab: activeTab,
            tabs: tabs });
    },
})
    .addMapper({
    filter: panelEditorCleanUp,
    mapper: function () { return initialState; },
})
    .create();
//# sourceMappingURL=reducers.js.map
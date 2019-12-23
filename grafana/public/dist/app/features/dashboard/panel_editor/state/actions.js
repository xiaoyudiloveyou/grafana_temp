import { __awaiter, __generator } from "tslib";
import { actionCreatorFactory, noPayloadActionCreatorFactory } from '../../../../core/redux';
import { PanelEditorTabIds, getPanelEditorTab } from './reducers';
import { updateLocation } from '../../../../core/actions';
export var panelEditorInitCompleted = actionCreatorFactory('PANEL_EDITOR_INIT_COMPLETED').create();
export var panelEditorCleanUp = noPayloadActionCreatorFactory('PANEL_EDITOR_CLEAN_UP').create();
export var refreshPanelEditor = function (props) {
    return function (dispatch, getState) { return __awaiter(void 0, void 0, void 0, function () {
        var activeTab, hasQueriesTab, usesGraphPlugin, alertingEnabled, tabs;
        return __generator(this, function (_a) {
            activeTab = getState().panelEditor.activeTab || PanelEditorTabIds.Queries;
            hasQueriesTab = props.hasQueriesTab, usesGraphPlugin = props.usesGraphPlugin, alertingEnabled = props.alertingEnabled;
            tabs = [
                getPanelEditorTab(PanelEditorTabIds.Queries),
                getPanelEditorTab(PanelEditorTabIds.Visualization),
                getPanelEditorTab(PanelEditorTabIds.Advanced),
            ];
            // handle panels that do not have queries tab
            if (!hasQueriesTab) {
                // remove queries tab
                tabs.shift();
                // switch tab
                if (activeTab === PanelEditorTabIds.Queries) {
                    activeTab = PanelEditorTabIds.Visualization;
                }
            }
            if (alertingEnabled && usesGraphPlugin) {
                tabs.push(getPanelEditorTab(PanelEditorTabIds.Alert));
            }
            dispatch(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
            return [2 /*return*/];
        });
    }); };
};
export var changePanelEditorTab = function (activeTab) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch(updateLocation({ query: { tab: activeTab.id, openVizPicker: null }, partial: true }));
            return [2 /*return*/];
        });
    }); };
};
//# sourceMappingURL=actions.js.map
var _this = this;
import * as tslib_1 from "tslib";
import { thunkTester } from '../../../../../test/core/thunk/thunkTester';
import { initialState, getPanelEditorTab, PanelEditorTabIds } from './reducers';
import { refreshPanelEditor, panelEditorInitCompleted, changePanelEditorTab } from './actions';
import { updateLocation } from '../../../../core/actions';
describe('refreshPanelEditor', function () {
    describe('when called and there is no activeTab in state', function () {
        it('then the dispatched action should default the activeTab to PanelEditorTabIds.Queries', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Queries;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Queries),
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                            getPanelEditorTab(PanelEditorTabIds.Alert),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState, { activeTab: null }) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: true, alertingEnabled: true, usesGraphPlugin: true })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called and there is already an activeTab in state', function () {
        it('then the dispatched action should include activeTab from state', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Visualization;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Queries),
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                            getPanelEditorTab(PanelEditorTabIds.Alert),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState, { activeTab: activeTab }) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: true, alertingEnabled: true, usesGraphPlugin: true })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called and plugin has no queries tab', function () {
        it('then the dispatched action should not include Queries tab and default the activeTab to PanelEditorTabIds.Visualization', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Visualization;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                            getPanelEditorTab(PanelEditorTabIds.Alert),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: false, alertingEnabled: true, usesGraphPlugin: true })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called and alerting is enabled and the visualization is the graph plugin', function () {
        it('then the dispatched action should include the alert tab', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Queries;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Queries),
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                            getPanelEditorTab(PanelEditorTabIds.Alert),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: true, alertingEnabled: true, usesGraphPlugin: true })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called and alerting is not enabled', function () {
        it('then the dispatched action should not include the alert tab', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Queries;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Queries),
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: true, alertingEnabled: false, usesGraphPlugin: true })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called  and the visualization is not the graph plugin', function () {
        it('then the dispatched action should not include the alert tab', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, tabs, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = PanelEditorTabIds.Queries;
                        tabs = [
                            getPanelEditorTab(PanelEditorTabIds.Queries),
                            getPanelEditorTab(PanelEditorTabIds.Visualization),
                            getPanelEditorTab(PanelEditorTabIds.Advanced),
                        ];
                        return [4 /*yield*/, thunkTester({ panelEditor: tslib_1.__assign({}, initialState) })
                                .givenThunk(refreshPanelEditor)
                                .whenThunkIsDispatched({ hasQueriesTab: true, alertingEnabled: true, usesGraphPlugin: false })];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions[0]).toEqual(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('changePanelEditorTab', function () {
    describe('when called', function () {
        it('then it should dispatch correct actions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var activeTab, dispatchedActions;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTab = getPanelEditorTab(PanelEditorTabIds.Visualization);
                        return [4 /*yield*/, thunkTester({})
                                .givenThunk(changePanelEditorTab)
                                .whenThunkIsDispatched(activeTab)];
                    case 1:
                        dispatchedActions = _a.sent();
                        expect(dispatchedActions.length).toBe(1);
                        expect(dispatchedActions).toEqual([
                            updateLocation({ query: { tab: activeTab.id, openVizPicker: null }, partial: true }),
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=actions.test.js.map
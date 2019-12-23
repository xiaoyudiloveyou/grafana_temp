import { reducerTester } from '../../../../../test/core/redux/reducerTester';
import { initialState, panelEditorReducer, PanelEditorTabIds, getPanelEditorTab } from './reducers';
import { panelEditorInitCompleted, panelEditorCleanUp } from './actions';
describe('panelEditorReducer', function () {
    describe('when panelEditorInitCompleted is dispatched', function () {
        it('then state should be correct', function () {
            var activeTab = PanelEditorTabIds.Alert;
            var tabs = [
                getPanelEditorTab(PanelEditorTabIds.Queries),
                getPanelEditorTab(PanelEditorTabIds.Visualization),
                getPanelEditorTab(PanelEditorTabIds.Advanced),
            ];
            reducerTester()
                .givenReducer(panelEditorReducer, initialState)
                .whenActionIsDispatched(panelEditorInitCompleted({ activeTab: activeTab, tabs: tabs }))
                .thenStateShouldEqual({ activeTab: activeTab, tabs: tabs });
        });
    });
    describe('when panelEditorCleanUp is dispatched', function () {
        it('then state should be intialState', function () {
            var activeTab = PanelEditorTabIds.Alert;
            var tabs = [
                getPanelEditorTab(PanelEditorTabIds.Queries),
                getPanelEditorTab(PanelEditorTabIds.Visualization),
                getPanelEditorTab(PanelEditorTabIds.Advanced),
            ];
            reducerTester()
                .givenReducer(panelEditorReducer, { activeTab: activeTab, tabs: tabs })
                .whenActionIsDispatched(panelEditorCleanUp())
                .thenStateShouldEqual(initialState);
        });
    });
});
//# sourceMappingURL=reducers.test.js.map
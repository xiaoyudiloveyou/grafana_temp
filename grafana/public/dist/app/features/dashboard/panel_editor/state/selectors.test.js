import { getActiveTabAndTabs } from './selectors';
import { getPanelEditorTab, PanelEditorTabIds } from './reducers';
describe('getActiveTabAndTabs', function () {
    describe('when called and location state contains tab', function () {
        it('then it should return location state', function () {
            var activeTabId = 1337;
            var location = {
                path: 'a path',
                lastUpdated: 1,
                replace: false,
                routeParams: {},
                query: {
                    tab: activeTabId,
                },
                url: 'an url',
            };
            var panelEditor = {
                activeTab: PanelEditorTabIds.Queries,
                tabs: [],
            };
            var result = getActiveTabAndTabs(location, panelEditor);
            expect(result).toEqual({
                activeTab: activeTabId,
                tabs: [],
            });
        });
    });
    describe('when called without location state and PanelEditor state contains tabs', function () {
        it('then it should return the id for the first tab in PanelEditor state', function () {
            var activeTabId = PanelEditorTabIds.Visualization;
            var tabs = [getPanelEditorTab(PanelEditorTabIds.Visualization), getPanelEditorTab(PanelEditorTabIds.Advanced)];
            var location = {
                path: 'a path',
                lastUpdated: 1,
                replace: false,
                routeParams: {},
                query: {
                    tab: undefined,
                },
                url: 'an url',
            };
            var panelEditor = {
                activeTab: PanelEditorTabIds.Advanced,
                tabs: tabs,
            };
            var result = getActiveTabAndTabs(location, panelEditor);
            expect(result).toEqual({
                activeTab: activeTabId,
                tabs: tabs,
            });
        });
    });
    describe('when called without location state and PanelEditor state does not contain tabs', function () {
        it('then it should return PanelEditorTabIds.Queries', function () {
            var activeTabId = PanelEditorTabIds.Queries;
            var tabs = [];
            var location = {
                path: 'a path',
                lastUpdated: 1,
                replace: false,
                routeParams: {},
                query: {
                    tab: undefined,
                },
                url: 'an url',
            };
            var panelEditor = {
                activeTab: PanelEditorTabIds.Advanced,
                tabs: tabs,
            };
            var result = getActiveTabAndTabs(location, panelEditor);
            expect(result).toEqual({
                activeTab: activeTabId,
                tabs: tabs,
            });
        });
    });
});
//# sourceMappingURL=selectors.test.js.map
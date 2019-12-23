import memoizeOne from 'memoize-one';
import { PanelEditorTabIds } from './reducers';
export var getActiveTabAndTabs = memoizeOne(function (location, panelEditor) {
    var panelEditorTab = panelEditor.tabs.length > 0 ? panelEditor.tabs[0].id : PanelEditorTabIds.Queries;
    return {
        activeTab: location.query.tab || panelEditorTab,
        tabs: panelEditor.tabs,
    };
});
//# sourceMappingURL=selectors.js.map
import { TestPage, SelectPageObject, Selector, ClickablePageObject, } from '@grafana/toolkit/src/e2e';
export var editPanelPage = new TestPage({
    pageObjects: {
        queriesTab: new ClickablePageObject(Selector.fromAriaLabel('Queries tab button')),
        saveDashboard: new ClickablePageObject(Selector.fromAriaLabel('Save dashboard navbar button')),
        scenarioSelect: new SelectPageObject(Selector.fromAriaLabel('Scenario Select')),
        showXAxis: new ClickablePageObject(Selector.fromSelector('[aria-label="X-Axis section"] [label=Show] .gf-form-switch')),
        visualizationTab: new ClickablePageObject(Selector.fromAriaLabel('Visualization tab button')),
    },
});
//# sourceMappingURL=editPanel.js.map
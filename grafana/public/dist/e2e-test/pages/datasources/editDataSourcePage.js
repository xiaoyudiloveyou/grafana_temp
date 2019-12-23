import { TestPage, ClickablePageObject, PageObject, Selector, } from '@grafana/toolkit/src/e2e';
export var editDataSourcePage = new TestPage({
    pageObjects: {
        saveAndTest: new ClickablePageObject(Selector.fromAriaLabel('Save and Test button')),
        alert: new PageObject(Selector.fromAriaLabel('Datasource settings page Alert')),
        alertMessage: new PageObject(Selector.fromAriaLabel('Datasource settings page Alert message')),
    },
});
//# sourceMappingURL=editDataSourcePage.js.map
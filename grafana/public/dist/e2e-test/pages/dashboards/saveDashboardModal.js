import { TestPage, ClickablePageObject, Selector, InputPageObject, PageObject, } from '@grafana/toolkit/src/e2e';
export var saveDashboardModal = new TestPage({
    pageObjects: {
        name: new InputPageObject(Selector.fromAriaLabel('Save dashboard title field')),
        save: new ClickablePageObject(Selector.fromAriaLabel('Save dashboard button')),
        success: new PageObject(Selector.fromSelector('.alert-success')),
    },
});
//# sourceMappingURL=saveDashboardModal.js.map
import { TestPage, ClickablePageObject, Selector } from '@grafana/toolkit/src/e2e';
export var createDashboardPage = new TestPage({
    url: '/dashboard/new',
    pageObjects: {
        addQuery: new ClickablePageObject(Selector.fromAriaLabel('Add Query CTA button')),
    },
});
//# sourceMappingURL=createDashboardPage.js.map
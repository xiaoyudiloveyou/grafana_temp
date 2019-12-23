import { TestPage, ClickablePageObject, Selector } from '@grafana/toolkit/src/e2e';
export var dashboardsPageFactory = function (dashboardTitle) {
    return new TestPage({
        url: '/dashboards',
        pageObjects: {
            dashboard: new ClickablePageObject(Selector.fromAriaLabel(dashboardTitle)),
        },
    });
};
//# sourceMappingURL=dashboardsPage.js.map
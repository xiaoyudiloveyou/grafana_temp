import { TestPage, ClickablePageObject, Selector } from '@grafana/toolkit/src/e2e';
export var addDataSourcePage = new TestPage({
    url: '/datasources/new',
    pageObjects: {
        testDataDB: new ClickablePageObject(Selector.fromAriaLabel('TestData DB datasource plugin')),
    },
});
//# sourceMappingURL=addDataSourcePage.js.map
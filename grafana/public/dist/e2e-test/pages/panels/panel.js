import { TestPage, ClickablePageObject, Selector } from '@grafana/toolkit/src/e2e';
export var panel = new TestPage({
    pageObjects: {
        panelTitle: new ClickablePageObject(Selector.fromAriaLabel('Panel Title')),
        share: new ClickablePageObject(Selector.fromAriaLabel('Share panel menu item')),
    },
});
//# sourceMappingURL=panel.js.map
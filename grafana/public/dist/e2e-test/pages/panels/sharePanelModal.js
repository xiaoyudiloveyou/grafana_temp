import { TestPage, ClickablePageObject, Selector } from '@grafana/toolkit/src/e2e';
export var sharePanelModal = new TestPage({
    pageObjects: {
        directLinkRenderedImage: new ClickablePageObject(Selector.fromAriaLabel('Link to rendered image')),
    },
});
//# sourceMappingURL=sharePanelModal.js.map
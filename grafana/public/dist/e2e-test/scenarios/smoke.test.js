var _this = this;
import * as tslib_1 from "tslib";
import { e2eScenario, constants, takeScreenShot, compareScreenShots } from '@grafana/toolkit/src/e2e';
import { addDataSourcePage } from 'e2e-test/pages/datasources/addDataSourcePage';
import { editDataSourcePage } from 'e2e-test/pages/datasources/editDataSourcePage';
import { dataSourcesPage } from 'e2e-test/pages/datasources/dataSources';
import { createDashboardPage } from 'e2e-test/pages/dashboards/createDashboardPage';
import { saveDashboardModal } from 'e2e-test/pages/dashboards/saveDashboardModal';
import { dashboardsPageFactory } from 'e2e-test/pages/dashboards/dashboardsPage';
import { panel } from 'e2e-test/pages/panels/panel';
import { editPanelPage } from 'e2e-test/pages/panels/editPanel';
import { sharePanelModal } from 'e2e-test/pages/panels/sharePanelModal';
e2eScenario('Login scenario, create test data source, dashboard, panel, and export scenario', 'should pass', function (browser, page) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var url, expectedUrl, selector, dashboardTitle, dashboardsPage, targetPromise, newTarget, newPage, fileName;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Add TestData DB
            return [4 /*yield*/, addDataSourcePage.init(page)];
            case 1:
                // Add TestData DB
                _a.sent();
                return [4 /*yield*/, addDataSourcePage.navigateTo()];
            case 2:
                _a.sent();
                return [4 /*yield*/, addDataSourcePage.pageObjects.testDataDB.exists()];
            case 3:
                _a.sent();
                return [4 /*yield*/, addDataSourcePage.pageObjects.testDataDB.click()];
            case 4:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.init(page)];
            case 5:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.waitForNavigation()];
            case 6:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.pageObjects.saveAndTest.click()];
            case 7:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.pageObjects.alert.exists()];
            case 8:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.pageObjects.alertMessage.containsText('Data source is working')];
            case 9:
                _a.sent();
                return [4 /*yield*/, editDataSourcePage.getUrlWithoutBaseUrl()];
            case 10:
                url = _a.sent();
                expectedUrl = url.substring(1, url.length - 1);
                selector = "a[href=\"" + expectedUrl + "\"]";
                return [4 /*yield*/, dataSourcesPage.init(page)];
            case 11:
                _a.sent();
                return [4 /*yield*/, dataSourcesPage.navigateTo()];
            case 12:
                _a.sent();
                return [4 /*yield*/, dataSourcesPage.expectSelector({ selector: selector })];
            case 13:
                _a.sent();
                // Create a new Dashboard
                return [4 /*yield*/, createDashboardPage.init(page)];
            case 14:
                // Create a new Dashboard
                _a.sent();
                return [4 /*yield*/, createDashboardPage.navigateTo()];
            case 15:
                _a.sent();
                return [4 /*yield*/, createDashboardPage.pageObjects.addQuery.click()];
            case 16:
                _a.sent();
                return [4 /*yield*/, editPanelPage.init(page)];
            case 17:
                _a.sent();
                return [4 /*yield*/, editPanelPage.waitForNavigation()];
            case 18:
                _a.sent();
                return [4 /*yield*/, editPanelPage.pageObjects.queriesTab.click()];
            case 19:
                _a.sent();
                return [4 /*yield*/, editPanelPage.pageObjects.scenarioSelect.select('string:csv_metric_values')];
            case 20:
                _a.sent();
                return [4 /*yield*/, editPanelPage.pageObjects.visualizationTab.click()];
            case 21:
                _a.sent();
                return [4 /*yield*/, editPanelPage.pageObjects.showXAxis.click()];
            case 22:
                _a.sent();
                return [4 /*yield*/, editPanelPage.pageObjects.saveDashboard.click()];
            case 23:
                _a.sent();
                // Confirm save modal
                return [4 /*yield*/, saveDashboardModal.init(page)];
            case 24:
                // Confirm save modal
                _a.sent();
                return [4 /*yield*/, saveDashboardModal.expectSelector({ selector: 'save-dashboard-as-modal' })];
            case 25:
                _a.sent();
                dashboardTitle = new Date().toISOString();
                return [4 /*yield*/, saveDashboardModal.pageObjects.name.enter(dashboardTitle)];
            case 26:
                _a.sent();
                return [4 /*yield*/, saveDashboardModal.pageObjects.save.click()];
            case 27:
                _a.sent();
                return [4 /*yield*/, saveDashboardModal.pageObjects.success.exists()];
            case 28:
                _a.sent();
                dashboardsPage = dashboardsPageFactory(dashboardTitle);
                return [4 /*yield*/, dashboardsPage.init(page)];
            case 29:
                _a.sent();
                return [4 /*yield*/, dashboardsPage.navigateTo()];
            case 30:
                _a.sent();
                return [4 /*yield*/, dashboardsPage.pageObjects.dashboard.exists()];
            case 31:
                _a.sent();
                return [4 /*yield*/, dashboardsPage.pageObjects.dashboard.click()];
            case 32:
                _a.sent();
                return [4 /*yield*/, panel.init(page)];
            case 33:
                _a.sent();
                return [4 /*yield*/, panel.pageObjects.panelTitle.click()];
            case 34:
                _a.sent();
                return [4 /*yield*/, panel.pageObjects.share.click()];
            case 35:
                _a.sent();
                targetPromise = new Promise(function (resolve) { return browser.once('targetcreated', resolve); });
                return [4 /*yield*/, sharePanelModal.init(page)];
            case 36:
                _a.sent();
                return [4 /*yield*/, sharePanelModal.pageObjects.directLinkRenderedImage.click()];
            case 37:
                _a.sent();
                return [4 /*yield*/, targetPromise];
            case 38:
                newTarget = (_a.sent());
                expect(newTarget.url()).toContain(constants.baseUrl + "/render/d-solo");
                return [4 /*yield*/, newTarget.page()];
            case 39:
                newPage = _a.sent();
                fileName = 'smoke-test-scenario';
                return [4 /*yield*/, takeScreenShot(newPage, fileName)];
            case 40:
                _a.sent();
                return [4 /*yield*/, compareScreenShots(fileName)];
            case 41:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=smoke.test.js.map
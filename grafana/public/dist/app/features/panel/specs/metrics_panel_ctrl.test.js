var _this = this;
import * as tslib_1 from "tslib";
jest.mock('app/core/core', function () { return ({}); });
jest.mock('app/core/config', function () {
    return {
        bootData: {
            user: {},
        },
        panels: {
            test: {
                id: 'test',
                name: 'test',
            },
        },
        config: {
            appSubUrl: 'test',
        },
    };
});
// @ts-ignore
import q from 'q';
import { PanelModel } from 'app/features/dashboard/state/PanelModel';
import { MetricsPanelCtrl } from '../metrics_panel_ctrl';
describe('MetricsPanelCtrl', function () {
    describe('when getting additional menu items', function () {
        describe('and has no datasource set but user has access to explore', function () {
            it('should not return any items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var ctrl, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ctrl = setupController({ hasAccessToExplore: true });
                            _a = expect;
                            return [4 /*yield*/, ctrl.getAdditionalMenuItems()];
                        case 1:
                            _a.apply(void 0, [(_b.sent()).length]).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and has datasource set that supports explore and user does not have access to explore', function () {
            it('should not return any items', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var ctrl, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ctrl = setupController({ hasAccessToExplore: false });
                            ctrl.datasource = { meta: { explore: true } };
                            _a = expect;
                            return [4 /*yield*/, ctrl.getAdditionalMenuItems()];
                        case 1:
                            _a.apply(void 0, [(_b.sent()).length]).toBe(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and has datasource set that supports explore and user has access to explore', function () {
            it('should return one item', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var ctrl, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ctrl = setupController({ hasAccessToExplore: true });
                            ctrl.datasource = { meta: { explore: true } };
                            _a = expect;
                            return [4 /*yield*/, ctrl.getAdditionalMenuItems()];
                        case 1:
                            _a.apply(void 0, [(_b.sent()).length]).toBe(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
function setupController(_a) {
    var hasAccessToExplore = (_a === void 0 ? { hasAccessToExplore: false } : _a).hasAccessToExplore;
    var injectorStub = {
        get: function (type) {
            switch (type) {
                case '$q': {
                    return q;
                }
                case 'contextSrv': {
                    return { hasAccessToExplore: function () { return hasAccessToExplore; } };
                }
                case 'timeSrv': {
                    return { timeRangeForUrl: function () { } };
                }
                default: {
                    return jest.fn();
                }
            }
        },
    };
    var scope = {
        panel: { events: [] },
        appEvent: jest.fn(),
        onAppEvent: jest.fn(),
        $on: jest.fn(),
        colors: [],
    };
    MetricsPanelCtrl.prototype.panel = new PanelModel({ type: 'test' });
    return new MetricsPanelCtrl(scope, injectorStub);
}
//# sourceMappingURL=metrics_panel_ctrl.test.js.map
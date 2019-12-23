var _this = this;
import * as tslib_1 from "tslib";
// Use the real plugin_loader (stubbed by default)
jest.unmock('app/features/plugins/plugin_loader');
global.ace = {
    define: jest.fn(),
};
jest.mock('app/core/core', function () {
    return {
        coreModule: {
            directive: jest.fn(),
        },
    };
});
import { SystemJS } from '@grafana/runtime';
import { PluginType, PluginIncludeType, AppPlugin } from '@grafana/ui';
import { importAppPlugin } from './plugin_loader';
var MyCustomApp = /** @class */ (function (_super) {
    tslib_1.__extends(MyCustomApp, _super);
    function MyCustomApp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.initWasCalled = false;
        _this.calledTwice = false;
        return _this;
    }
    MyCustomApp.prototype.init = function (meta) {
        this.initWasCalled = true;
        this.calledTwice = this.meta === meta;
    };
    return MyCustomApp;
}(AppPlugin));
describe('Load App', function () {
    var app = new MyCustomApp();
    var modulePath = 'my/custom/plugin/module';
    beforeAll(function () {
        SystemJS.set(modulePath, SystemJS.newModule({ plugin: app }));
    });
    afterAll(function () {
        SystemJS.delete(modulePath);
    });
    it('should call init and set meta', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var meta, m, loaded, again;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = {
                        id: 'test-app',
                        module: modulePath,
                        baseUrl: 'xxx',
                        info: {},
                        type: PluginType.app,
                        name: 'test',
                    };
                    return [4 /*yield*/, SystemJS.import(modulePath)];
                case 1:
                    m = _a.sent();
                    expect(m.plugin).toBe(app);
                    return [4 /*yield*/, importAppPlugin(meta)];
                case 2:
                    loaded = _a.sent();
                    expect(loaded).toBe(app);
                    expect(app.meta).toBe(meta);
                    expect(app.initWasCalled).toBeTruthy();
                    expect(app.calledTwice).toBeFalsy();
                    return [4 /*yield*/, importAppPlugin(meta)];
                case 3:
                    again = _a.sent();
                    expect(again).toBe(app);
                    expect(app.calledTwice).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
import { ExampleConfigCtrl as ConfigCtrl } from 'app/plugins/app/example-app/legacy/config';
import { AngularExamplePageCtrl } from 'app/plugins/app/example-app/legacy/angular_example_page';
describe('Load Legacy App', function () {
    var app = {
        ConfigCtrl: ConfigCtrl,
        AngularExamplePageCtrl: AngularExamplePageCtrl,
    };
    var modulePath = 'my/custom/legacy/plugin/module';
    beforeAll(function () {
        SystemJS.set(modulePath, SystemJS.newModule(app));
    });
    afterAll(function () {
        SystemJS.delete(modulePath);
    });
    it('should call init and set meta for legacy app', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var meta, loaded;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = {
                        id: 'test-app',
                        module: modulePath,
                        baseUrl: 'xxx',
                        info: {},
                        type: PluginType.app,
                        name: 'test',
                        includes: [
                            {
                                type: PluginIncludeType.page,
                                name: 'Example Page',
                                component: 'AngularExamplePageCtrl',
                                role: 'Viewer',
                                addToNav: false,
                            },
                        ],
                    };
                    return [4 /*yield*/, importAppPlugin(meta)];
                case 1:
                    loaded = _a.sent();
                    expect(loaded).toHaveProperty('angularPages');
                    expect(loaded.angularPages).toHaveProperty('AngularExamplePageCtrl', AngularExamplePageCtrl);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=plugin_loader.test.js.map
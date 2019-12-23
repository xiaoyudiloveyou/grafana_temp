import * as tslib_1 from "tslib";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initDashboard } from './initDashboard';
import { DashboardRouteInfo } from 'app/types';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { dashboardInitFetching, dashboardInitCompleted, dashboardInitServices } from './actions';
import { resetExploreAction } from 'app/features/explore/state/actionTypes';
jest.mock('app/core/services/backend_srv');
var mockStore = configureMockStore([thunk]);
function describeInitScenario(description, scenarioFn) {
    var _this = this;
    describe(description, function () {
        var timeSrv = { init: jest.fn() };
        var annotationsSrv = { init: jest.fn() };
        var unsavedChangesSrv = { init: jest.fn() };
        var variableSrv = { init: jest.fn() };
        var dashboardSrv = { setCurrent: jest.fn() };
        var keybindingSrv = { setupDashboardBindings: jest.fn() };
        var loaderSrv = {
            loadDashboard: jest.fn(function () { return ({
                meta: {
                    canStar: false,
                    canShare: false,
                    isNew: true,
                    folderId: 0,
                },
                dashboard: {
                    title: 'My cool dashboard',
                    panels: [
                        {
                            type: 'add-panel',
                            gridPos: { x: 0, y: 0, w: 12, h: 9 },
                            title: 'Panel Title',
                            id: 2,
                            targets: [
                                {
                                    refId: 'A',
                                    expr: 'old expr',
                                },
                            ],
                        },
                    ],
                },
            }); }),
        };
        var injectorMock = {
            get: function (name) {
                switch (name) {
                    case 'timeSrv':
                        return timeSrv;
                    case 'annotationsSrv':
                        return annotationsSrv;
                    case 'dashboardLoaderSrv':
                        return loaderSrv;
                    case 'unsavedChangesSrv':
                        return unsavedChangesSrv;
                    case 'dashboardSrv':
                        return dashboardSrv;
                    case 'variableSrv':
                        return variableSrv;
                    case 'keybindingSrv':
                        return keybindingSrv;
                    default:
                        throw { message: 'Unknown service ' + name };
                }
            },
        };
        var setupFn = function () { };
        var ctx = {
            args: {
                $injector: injectorMock,
                $scope: {},
                fixUrl: false,
                routeInfo: DashboardRouteInfo.Normal,
            },
            backendSrv: getBackendSrv(),
            timeSrv: timeSrv,
            annotationsSrv: annotationsSrv,
            unsavedChangesSrv: unsavedChangesSrv,
            variableSrv: variableSrv,
            dashboardSrv: dashboardSrv,
            keybindingSrv: keybindingSrv,
            loaderSrv: loaderSrv,
            actions: [],
            storeState: {
                location: {
                    query: {},
                },
                user: {},
                explore: {
                    left: {
                        originPanelId: undefined,
                        queries: [],
                    },
                },
            },
            setup: function (fn) {
                setupFn = fn;
            },
        };
        beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var store;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setupFn();
                        store = mockStore(ctx.storeState);
                        // @ts-ignore
                        return [4 /*yield*/, store.dispatch(initDashboard(ctx.args))];
                    case 1:
                        // @ts-ignore
                        _a.sent();
                        ctx.actions = store.getActions();
                        return [2 /*return*/];
                }
            });
        }); });
        scenarioFn(ctx);
    });
}
describeInitScenario('Initializing new dashboard', function (ctx) {
    ctx.setup(function () {
        ctx.storeState.user.orgId = 12;
        ctx.args.routeInfo = DashboardRouteInfo.New;
    });
    it('Should send action dashboardInitFetching', function () {
        expect(ctx.actions[0].type).toBe(dashboardInitFetching.type);
    });
    it('Should send action dashboardInitServices ', function () {
        expect(ctx.actions[1].type).toBe(dashboardInitServices.type);
    });
    it('Should update location with orgId query param', function () {
        expect(ctx.actions[2].type).toBe('UPDATE_LOCATION');
        expect(ctx.actions[2].payload.query.orgId).toBe(12);
    });
    it('Should send action dashboardInitCompleted', function () {
        expect(ctx.actions[3].type).toBe(dashboardInitCompleted.type);
        expect(ctx.actions[3].payload.title).toBe('New dashboard');
    });
    it('Should initialize services', function () {
        expect(ctx.timeSrv.init).toBeCalled();
        expect(ctx.annotationsSrv.init).toBeCalled();
        expect(ctx.variableSrv.init).toBeCalled();
        expect(ctx.unsavedChangesSrv.init).toBeCalled();
        expect(ctx.keybindingSrv.setupDashboardBindings).toBeCalled();
        expect(ctx.dashboardSrv.setCurrent).toBeCalled();
    });
});
describeInitScenario('Initializing home dashboard', function (ctx) {
    ctx.setup(function () {
        ctx.args.routeInfo = DashboardRouteInfo.Home;
        ctx.backendSrv.get.mockReturnValue(Promise.resolve({
            redirectUri: '/u/123/my-home',
        }));
    });
    it('Should redirect to custom home dashboard', function () {
        expect(ctx.actions[1].type).toBe('UPDATE_LOCATION');
        expect(ctx.actions[1].payload.path).toBe('/u/123/my-home');
    });
});
describeInitScenario('Initializing existing dashboard', function (ctx) {
    var mockQueries = [
        {
            context: 'explore',
            key: 'jdasldsa98dsa9',
            refId: 'A',
            expr: 'new expr',
        },
        {
            context: 'explore',
            key: 'fdsjkfds78fd',
            refId: 'B',
        },
    ];
    var expectedQueries = mockQueries.map(function (query) { return ({ refId: query.refId, expr: query.expr }); });
    ctx.setup(function () {
        ctx.storeState.user.orgId = 12;
        ctx.storeState.explore.left.originPanelId = 2;
        ctx.storeState.explore.left.queries = mockQueries;
    });
    it('Should send action dashboardInitFetching', function () {
        expect(ctx.actions[0].type).toBe(dashboardInitFetching.type);
    });
    it('Should send action dashboardInitServices ', function () {
        expect(ctx.actions[1].type).toBe(dashboardInitServices.type);
    });
    it('Should update location with orgId query param', function () {
        expect(ctx.actions[2].type).toBe('UPDATE_LOCATION');
        expect(ctx.actions[2].payload.query.orgId).toBe(12);
    });
    it('Should send resetExploreAction when coming from explore', function () {
        expect(ctx.actions[3].type).toBe(resetExploreAction.type);
        expect(ctx.actions[3].payload.force).toBe(true);
        expect(ctx.dashboardSrv.setCurrent).lastCalledWith(expect.objectContaining({
            panels: expect.arrayContaining([
                expect.objectContaining({
                    targets: expectedQueries,
                }),
            ]),
        }));
    });
    it('Should send action dashboardInitCompleted', function () {
        expect(ctx.actions[4].type).toBe(dashboardInitCompleted.type);
        expect(ctx.actions[4].payload.title).toBe('My cool dashboard');
    });
    it('Should initialize services', function () {
        expect(ctx.timeSrv.init).toBeCalled();
        expect(ctx.annotationsSrv.init).toBeCalled();
        expect(ctx.variableSrv.init).toBeCalled();
        expect(ctx.unsavedChangesSrv.init).toBeCalled();
        expect(ctx.keybindingSrv.setupDashboardBindings).toBeCalled();
        expect(ctx.dashboardSrv.setCurrent).toBeCalled();
    });
});
//# sourceMappingURL=initDashboard.test.js.map
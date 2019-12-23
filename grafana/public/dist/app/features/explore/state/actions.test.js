var _this = this;
import * as tslib_1 from "tslib";
import { refreshExplore, testDatasource, loadDatasource } from './actions';
import { ExploreId, ExploreMode } from 'app/types';
import { thunkTester } from 'test/core/thunk/thunkTester';
import { initializeExploreAction, updateUIStateAction, setQueriesAction, testDataSourcePendingAction, testDataSourceSuccessAction, testDataSourceFailureAction, loadDatasourcePendingAction, loadDatasourceReadyAction, } from './actionTypes';
import { makeInitialUpdateState } from './reducers';
import { DefaultTimeZone, LogsDedupStrategy, toUtc } from '@grafana/data';
jest.mock('app/features/plugins/datasource_srv', function () { return ({
    getDatasourceSrv: function () { return ({
        getExternal: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue({
            testDatasource: jest.fn(),
            init: jest.fn(),
        }),
    }); },
}); });
jest.mock('../../dashboard/services/TimeSrv', function () { return ({
    getTimeSrv: jest.fn().mockReturnValue({
        init: jest.fn(),
    }),
}); });
var t = toUtc();
var testRange = {
    from: t,
    to: t,
    raw: {
        from: t,
        to: t,
    },
};
jest.mock('app/core/utils/explore', function () { return (tslib_1.__assign({}, jest.requireActual('app/core/utils/explore'), { getTimeRangeFromUrl: function (range) { return testRange; } })); });
var setup = function (updateOverides) {
    var _a;
    var exploreId = ExploreId.left;
    var containerWidth = 1920;
    var eventBridge = {};
    var ui = { dedupStrategy: LogsDedupStrategy.none, showingGraph: false, showingLogs: false, showingTable: false };
    var timeZone = DefaultTimeZone;
    var range = testRange;
    var urlState = {
        datasource: 'some-datasource',
        queries: [],
        range: range.raw,
        mode: ExploreMode.Metrics,
        ui: ui,
    };
    var updateDefaults = makeInitialUpdateState();
    var update = tslib_1.__assign({}, updateDefaults, updateOverides);
    var initialState = {
        user: {
            orgId: '1',
            timeZone: timeZone,
        },
        explore: (_a = {},
            _a[exploreId] = {
                initialized: true,
                urlState: urlState,
                containerWidth: containerWidth,
                eventBridge: eventBridge,
                update: update,
                datasourceInstance: { name: 'some-datasource' },
                queries: [],
                range: range,
                ui: ui,
                refreshInterval: {
                    label: 'Off',
                    value: 0,
                },
            },
            _a),
    };
    return {
        initialState: initialState,
        exploreId: exploreId,
        range: range,
        ui: ui,
        containerWidth: containerWidth,
        eventBridge: eventBridge,
    };
};
describe('refreshExplore', function () {
    describe('when explore is initialized', function () {
        describe('and update datasource is set', function () {
            it('then it should dispatch initializeExplore', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, exploreId, ui, initialState, containerWidth, eventBridge, dispatchedActions, initializeExplore, type, payload;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({ datasource: true }), exploreId = _a.exploreId, ui = _a.ui, initialState = _a.initialState, containerWidth = _a.containerWidth, eventBridge = _a.eventBridge;
                            return [4 /*yield*/, thunkTester(initialState)
                                    .givenThunk(refreshExplore)
                                    .whenThunkIsDispatched(exploreId)];
                        case 1:
                            dispatchedActions = _b.sent();
                            initializeExplore = dispatchedActions[2];
                            type = initializeExplore.type, payload = initializeExplore.payload;
                            expect(type).toEqual(initializeExploreAction.type);
                            expect(payload.containerWidth).toEqual(containerWidth);
                            expect(payload.eventBridge).toEqual(eventBridge);
                            expect(payload.queries.length).toBe(1); // Queries have generated keys hard to expect on
                            expect(payload.range.from).toEqual(testRange.from);
                            expect(payload.range.to).toEqual(testRange.to);
                            expect(payload.range.raw.from).toEqual(testRange.raw.from);
                            expect(payload.range.raw.to).toEqual(testRange.raw.to);
                            expect(payload.ui).toEqual(ui);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and update ui is set', function () {
            it('then it should dispatch updateUIStateAction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, exploreId, initialState, ui, dispatchedActions;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({ ui: true }), exploreId = _a.exploreId, initialState = _a.initialState, ui = _a.ui;
                            return [4 /*yield*/, thunkTester(initialState)
                                    .givenThunk(refreshExplore)
                                    .whenThunkIsDispatched(exploreId)];
                        case 1:
                            dispatchedActions = _b.sent();
                            expect(dispatchedActions[0].type).toEqual(updateUIStateAction.type);
                            expect(dispatchedActions[0].payload).toEqual(tslib_1.__assign({}, ui, { exploreId: exploreId }));
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and update queries is set', function () {
            it('then it should dispatch setQueriesAction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, exploreId, initialState, dispatchedActions;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({ queries: true }), exploreId = _a.exploreId, initialState = _a.initialState;
                            return [4 /*yield*/, thunkTester(initialState)
                                    .givenThunk(refreshExplore)
                                    .whenThunkIsDispatched(exploreId)];
                        case 1:
                            dispatchedActions = _b.sent();
                            expect(dispatchedActions[0].type).toEqual(setQueriesAction.type);
                            expect(dispatchedActions[0].payload).toEqual({ exploreId: exploreId, queries: [] });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('when update is not initialized', function () {
        it('then it should not dispatch any actions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var exploreId, initialState, dispatchedActions;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        exploreId = ExploreId.left;
                        initialState = { explore: (_a = {}, _a[exploreId] = { initialized: false }, _a) };
                        return [4 /*yield*/, thunkTester(initialState)
                                .givenThunk(refreshExplore)
                                .whenThunkIsDispatched(exploreId)];
                    case 1:
                        dispatchedActions = _b.sent();
                        expect(dispatchedActions).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('test datasource', function () {
    describe('when testDatasource thunk is dispatched', function () {
        describe('and testDatasource call on instance is successful', function () {
            it('then it should dispatch testDataSourceSuccessAction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var exploreId, mockDatasourceInstance, dispatchedActions;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            exploreId = ExploreId.left;
                            mockDatasourceInstance = {
                                testDatasource: function () {
                                    return Promise.resolve({ status: 'success' });
                                },
                            };
                            return [4 /*yield*/, thunkTester({})
                                    .givenThunk(testDatasource)
                                    .whenThunkIsDispatched(exploreId, mockDatasourceInstance)];
                        case 1:
                            dispatchedActions = _a.sent();
                            expect(dispatchedActions).toEqual([
                                testDataSourcePendingAction({ exploreId: exploreId }),
                                testDataSourceSuccessAction({ exploreId: exploreId }),
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and testDatasource call on instance is not successful', function () {
            it('then it should dispatch testDataSourceFailureAction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var exploreId, error, mockDatasourceInstance, dispatchedActions;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            exploreId = ExploreId.left;
                            error = 'something went wrong';
                            mockDatasourceInstance = {
                                testDatasource: function () {
                                    return Promise.resolve({ status: 'fail', message: error });
                                },
                            };
                            return [4 /*yield*/, thunkTester({})
                                    .givenThunk(testDatasource)
                                    .whenThunkIsDispatched(exploreId, mockDatasourceInstance)];
                        case 1:
                            dispatchedActions = _a.sent();
                            expect(dispatchedActions).toEqual([
                                testDataSourcePendingAction({ exploreId: exploreId }),
                                testDataSourceFailureAction({ exploreId: exploreId, error: error }),
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and testDatasource call on instance throws', function () {
            it('then it should dispatch testDataSourceFailureAction', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var exploreId, error, mockDatasourceInstance, dispatchedActions;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            exploreId = ExploreId.left;
                            error = 'something went wrong';
                            mockDatasourceInstance = {
                                testDatasource: function () {
                                    throw { statusText: error };
                                },
                            };
                            return [4 /*yield*/, thunkTester({})
                                    .givenThunk(testDatasource)
                                    .whenThunkIsDispatched(exploreId, mockDatasourceInstance)];
                        case 1:
                            dispatchedActions = _a.sent();
                            expect(dispatchedActions).toEqual([
                                testDataSourcePendingAction({ exploreId: exploreId }),
                                testDataSourceFailureAction({ exploreId: exploreId, error: error }),
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
describe('loading datasource', function () {
    describe('when loadDatasource thunk is dispatched', function () {
        describe('and all goes fine', function () {
            it('then it should dispatch correct actions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var exploreId, name, initialState, mockDatasourceInstance, dispatchedActions;
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            exploreId = ExploreId.left;
                            name = 'some-datasource';
                            initialState = { explore: (_a = {}, _a[exploreId] = { requestedDatasourceName: name }, _a) };
                            mockDatasourceInstance = {
                                testDatasource: function () {
                                    return Promise.resolve({ status: 'success' });
                                },
                                name: name,
                                init: jest.fn(),
                                meta: { id: 'some id' },
                            };
                            return [4 /*yield*/, thunkTester(initialState)
                                    .givenThunk(loadDatasource)
                                    .whenThunkIsDispatched(exploreId, mockDatasourceInstance)];
                        case 1:
                            dispatchedActions = _b.sent();
                            expect(dispatchedActions).toEqual([
                                loadDatasourcePendingAction({
                                    exploreId: exploreId,
                                    requestedDatasourceName: mockDatasourceInstance.name,
                                }),
                                testDataSourcePendingAction({ exploreId: exploreId }),
                                testDataSourceSuccessAction({ exploreId: exploreId }),
                                loadDatasourceReadyAction({ exploreId: exploreId, history: [] }),
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('and user changes datasource during load', function () {
            it('then it should dispatch correct actions', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var exploreId, name, initialState, mockDatasourceInstance, dispatchedActions;
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            exploreId = ExploreId.left;
                            name = 'some-datasource';
                            initialState = { explore: (_a = {}, _a[exploreId] = { requestedDatasourceName: 'some-other-datasource' }, _a) };
                            mockDatasourceInstance = {
                                testDatasource: function () {
                                    return Promise.resolve({ status: 'success' });
                                },
                                name: name,
                                init: jest.fn(),
                                meta: { id: 'some id' },
                            };
                            return [4 /*yield*/, thunkTester(initialState)
                                    .givenThunk(loadDatasource)
                                    .whenThunkIsDispatched(exploreId, mockDatasourceInstance)];
                        case 1:
                            dispatchedActions = _b.sent();
                            expect(dispatchedActions).toEqual([
                                loadDatasourcePendingAction({
                                    exploreId: exploreId,
                                    requestedDatasourceName: mockDatasourceInstance.name,
                                }),
                                testDataSourcePendingAction({ exploreId: exploreId }),
                                testDataSourceSuccessAction({ exploreId: exploreId }),
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=actions.test.js.map
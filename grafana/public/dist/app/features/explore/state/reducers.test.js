import * as tslib_1 from "tslib";
import { itemReducer, makeExploreItemState, exploreReducer, makeInitialUpdateState, initialExploreState, createEmptyQueryResponse, } from './reducers';
import { ExploreId, ExploreMode } from 'app/types/explore';
import { reducerTester } from 'test/core/redux/reducerTester';
import { scanStartAction, testDataSourcePendingAction, testDataSourceSuccessAction, testDataSourceFailureAction, updateDatasourceInstanceAction, splitOpenAction, splitCloseAction, changeModeAction, scanStopAction, toggleGraphAction, toggleTableAction, changeRangeAction, } from './actionTypes';
import { updateLocation } from 'app/core/actions/location';
import { serializeStateToUrlParam } from 'app/core/utils/explore';
import TableModel from 'app/core/table_model';
import { LogsDedupStrategy, dateTime } from '@grafana/data';
describe('Explore item reducer', function () {
    describe('scanning', function () {
        it('should start scanning', function () {
            var initalState = tslib_1.__assign({}, makeExploreItemState(), { scanning: false });
            reducerTester()
                .givenReducer(itemReducer, initalState)
                .whenActionIsDispatched(scanStartAction({ exploreId: ExploreId.left }))
                .thenStateShouldEqual(tslib_1.__assign({}, initalState, { scanning: true }));
        });
        it('should stop scanning', function () {
            var initalState = tslib_1.__assign({}, makeExploreItemState(), { scanning: true, scanRange: {} });
            reducerTester()
                .givenReducer(itemReducer, initalState)
                .whenActionIsDispatched(scanStopAction({ exploreId: ExploreId.left }))
                .thenStateShouldEqual(tslib_1.__assign({}, initalState, { scanning: false, scanRange: undefined }));
        });
    });
    describe('testing datasource', function () {
        describe('when testDataSourcePendingAction is dispatched', function () {
            it('then it should set datasourceError', function () {
                reducerTester()
                    .givenReducer(itemReducer, { datasourceError: {} })
                    .whenActionIsDispatched(testDataSourcePendingAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ datasourceError: null });
            });
        });
        describe('when testDataSourceSuccessAction is dispatched', function () {
            it('then it should set datasourceError', function () {
                reducerTester()
                    .givenReducer(itemReducer, { datasourceError: {} })
                    .whenActionIsDispatched(testDataSourceSuccessAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ datasourceError: null });
            });
        });
        describe('when testDataSourceFailureAction is dispatched', function () {
            it('then it should set correct state', function () {
                var error = 'some error';
                var initalState = {
                    datasourceError: null,
                    graphResult: [],
                    tableResult: {},
                    logsResult: {},
                    update: {
                        datasource: true,
                        queries: true,
                        range: true,
                        mode: true,
                        ui: true,
                    },
                };
                var expectedState = {
                    datasourceError: error,
                    graphResult: undefined,
                    tableResult: undefined,
                    logsResult: undefined,
                    update: makeInitialUpdateState(),
                };
                reducerTester()
                    .givenReducer(itemReducer, initalState)
                    .whenActionIsDispatched(testDataSourceFailureAction({ exploreId: ExploreId.left, error: error }))
                    .thenStateShouldEqual(expectedState);
            });
        });
        describe('when changeDataType is dispatched', function () {
            it('then it should set correct state', function () {
                reducerTester()
                    .givenReducer(itemReducer, {})
                    .whenActionIsDispatched(changeModeAction({ exploreId: ExploreId.left, mode: ExploreMode.Logs }))
                    .thenStateShouldEqual({
                    mode: ExploreMode.Logs,
                });
            });
        });
    });
    describe('changing datasource', function () {
        describe('when updateDatasourceInstanceAction is dispatched', function () {
            describe('and datasourceInstance supports graph, logs, table and has a startpage', function () {
                it('then it should set correct state', function () {
                    var StartPage = {};
                    var datasourceInstance = {
                        meta: {
                            metrics: true,
                            logs: true,
                        },
                        components: {
                            ExploreStartPage: StartPage,
                        },
                    };
                    var queries = [];
                    var queryKeys = [];
                    var initalState = {
                        datasourceInstance: null,
                        StartPage: null,
                        showingStartPage: false,
                        queries: queries,
                        queryKeys: queryKeys,
                    };
                    var expectedState = {
                        datasourceInstance: datasourceInstance,
                        StartPage: StartPage,
                        showingStartPage: true,
                        queries: queries,
                        queryKeys: queryKeys,
                        graphResult: null,
                        logsResult: null,
                        tableResult: null,
                        supportedModes: [ExploreMode.Metrics, ExploreMode.Logs],
                        mode: ExploreMode.Metrics,
                        latency: 0,
                        loading: false,
                        queryResponse: createEmptyQueryResponse(),
                    };
                    reducerTester()
                        .givenReducer(itemReducer, initalState)
                        .whenActionIsDispatched(updateDatasourceInstanceAction({ exploreId: ExploreId.left, datasourceInstance: datasourceInstance }))
                        .thenStateShouldEqual(expectedState);
                });
            });
        });
    });
    describe('toggling panels', function () {
        describe('when toggleGraphAction is dispatched', function () {
            it('then it should set correct state', function () {
                reducerTester()
                    .givenReducer(itemReducer, { graphResult: [] })
                    .whenActionIsDispatched(toggleGraphAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ showingGraph: true, graphResult: [] })
                    .whenActionIsDispatched(toggleGraphAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ showingGraph: false, graphResult: null });
            });
        });
        describe('when toggleTableAction is dispatched', function () {
            it('then it should set correct state', function () {
                reducerTester()
                    .givenReducer(itemReducer, { tableResult: {} })
                    .whenActionIsDispatched(toggleTableAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ showingTable: true, tableResult: {} })
                    .whenActionIsDispatched(toggleTableAction({ exploreId: ExploreId.left }))
                    .thenStateShouldEqual({ showingTable: false, tableResult: new TableModel() });
            });
        });
    });
    describe('changing range', function () {
        describe('when changeRangeAction is dispatched', function () {
            it('then it should set correct state', function () {
                reducerTester()
                    .givenReducer(itemReducer, {
                    update: tslib_1.__assign({}, makeInitialUpdateState(), { range: true }),
                    range: null,
                    absoluteRange: null,
                })
                    .whenActionIsDispatched(changeRangeAction({
                    exploreId: ExploreId.left,
                    absoluteRange: { from: 1546297200000, to: 1546383600000 },
                    range: { from: dateTime('2019-01-01'), to: dateTime('2019-01-02'), raw: { from: 'now-1d', to: 'now' } },
                }))
                    .thenStateShouldEqual({
                    update: tslib_1.__assign({}, makeInitialUpdateState(), { range: false }),
                    absoluteRange: { from: 1546297200000, to: 1546383600000 },
                    range: { from: dateTime('2019-01-01'), to: dateTime('2019-01-02'), raw: { from: 'now-1d', to: 'now' } },
                });
            });
        });
    });
});
export var setup = function (urlStateOverrides) {
    var update = makeInitialUpdateState();
    var urlStateDefaults = {
        datasource: 'some-datasource',
        queries: [],
        range: {
            from: '',
            to: '',
        },
        mode: ExploreMode.Metrics,
        ui: {
            dedupStrategy: LogsDedupStrategy.none,
            showingGraph: false,
            showingTable: false,
            showingLogs: false,
        },
    };
    var urlState = tslib_1.__assign({}, urlStateDefaults, urlStateOverrides);
    var serializedUrlState = serializeStateToUrlParam(urlState);
    var initalState = { split: false, left: { urlState: urlState, update: update }, right: { urlState: urlState, update: update } };
    return {
        initalState: initalState,
        serializedUrlState: serializedUrlState,
    };
};
describe('Explore reducer', function () {
    describe('split view', function () {
        it("should make right pane a duplicate of the given item's state on split open", function () {
            var leftItemMock = {
                containerWidth: 100,
            };
            var initalState = {
                split: null,
                left: leftItemMock,
                right: makeExploreItemState(),
            };
            reducerTester()
                .givenReducer(exploreReducer, initalState)
                .whenActionIsDispatched(splitOpenAction({ itemState: leftItemMock }))
                .thenStateShouldEqual({
                split: true,
                left: leftItemMock,
                right: leftItemMock,
            });
        });
        describe('split close', function () {
            it('should keep right pane as left when left is closed', function () {
                var leftItemMock = {
                    containerWidth: 100,
                };
                var rightItemMock = {
                    containerWidth: 200,
                };
                var initalState = {
                    split: null,
                    left: leftItemMock,
                    right: rightItemMock,
                };
                // closing left item
                reducerTester()
                    .givenReducer(exploreReducer, initalState)
                    .whenActionIsDispatched(splitCloseAction({ itemId: ExploreId.left }))
                    .thenStateShouldEqual({
                    split: false,
                    left: rightItemMock,
                    right: initialExploreState.right,
                });
            });
            it('should reset right pane when it is closed ', function () {
                var leftItemMock = {
                    containerWidth: 100,
                };
                var rightItemMock = {
                    containerWidth: 200,
                };
                var initalState = {
                    split: null,
                    left: leftItemMock,
                    right: rightItemMock,
                };
                // closing left item
                reducerTester()
                    .givenReducer(exploreReducer, initalState)
                    .whenActionIsDispatched(splitCloseAction({ itemId: ExploreId.right }))
                    .thenStateShouldEqual({
                    split: false,
                    left: leftItemMock,
                    right: initialExploreState.right,
                });
            });
        });
    });
    describe('when updateLocation is dispatched', function () {
        describe('and payload does not contain a query', function () {
            it('then it should just return state', function () {
                reducerTester()
                    .givenReducer(exploreReducer, {})
                    .whenActionIsDispatched(updateLocation({ query: null }))
                    .thenStateShouldEqual({});
            });
        });
        describe('and payload contains a query', function () {
            describe("but does not contain 'left'", function () {
                it('then it should just return state', function () {
                    reducerTester()
                        .givenReducer(exploreReducer, {})
                        .whenActionIsDispatched(updateLocation({ query: {} }))
                        .thenStateShouldEqual({});
                });
            });
            describe("and query contains a 'right'", function () {
                it('then it should add split in state', function () {
                    var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                    var expectedState = tslib_1.__assign({}, initalState, { split: true });
                    reducerTester()
                        .givenReducer(exploreReducer, initalState)
                        .whenActionIsDispatched(updateLocation({
                        query: {
                            left: serializedUrlState,
                            right: serializedUrlState,
                        },
                    }))
                        .thenStateShouldEqual(expectedState);
                });
            });
            describe("and query contains a 'left'", function () {
                describe('but urlState is not set in state', function () {
                    it('then it should just add urlState and update in state', function () {
                        var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                        var urlState = null;
                        var stateWithoutUrlState = tslib_1.__assign({}, initalState, { left: { urlState: urlState } });
                        var expectedState = tslib_1.__assign({}, initalState);
                        reducerTester()
                            .givenReducer(exploreReducer, stateWithoutUrlState)
                            .whenActionIsDispatched(updateLocation({
                            query: {
                                left: serializedUrlState,
                            },
                            path: '/explore',
                        }))
                            .thenStateShouldEqual(expectedState);
                    });
                });
                describe("but '/explore' is missing in path", function () {
                    it('then it should just add urlState and update in state', function () {
                        var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                        var expectedState = tslib_1.__assign({}, initalState);
                        reducerTester()
                            .givenReducer(exploreReducer, initalState)
                            .whenActionIsDispatched(updateLocation({
                            query: {
                                left: serializedUrlState,
                            },
                            path: '/dashboard',
                        }))
                            .thenStateShouldEqual(expectedState);
                    });
                });
                describe("and '/explore' is in path", function () {
                    describe('and datasource differs', function () {
                        it('then it should return update datasource', function () {
                            var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                            var expectedState = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { update: tslib_1.__assign({}, initalState.left.update, { datasource: true }) }) });
                            var stateWithDifferentDataSource = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { urlState: tslib_1.__assign({}, initalState.left.urlState, { datasource: 'different datasource' }) }) });
                            reducerTester()
                                .givenReducer(exploreReducer, stateWithDifferentDataSource)
                                .whenActionIsDispatched(updateLocation({
                                query: {
                                    left: serializedUrlState,
                                },
                                path: '/explore',
                            }))
                                .thenStateShouldEqual(expectedState);
                        });
                    });
                    describe('and range differs', function () {
                        it('then it should return update range', function () {
                            var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                            var expectedState = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { update: tslib_1.__assign({}, initalState.left.update, { range: true }) }) });
                            var stateWithDifferentDataSource = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { urlState: tslib_1.__assign({}, initalState.left.urlState, { range: {
                                            from: 'now',
                                            to: 'now-6h',
                                        } }) }) });
                            reducerTester()
                                .givenReducer(exploreReducer, stateWithDifferentDataSource)
                                .whenActionIsDispatched(updateLocation({
                                query: {
                                    left: serializedUrlState,
                                },
                                path: '/explore',
                            }))
                                .thenStateShouldEqual(expectedState);
                        });
                    });
                    describe('and queries differs', function () {
                        it('then it should return update queries', function () {
                            var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                            var expectedState = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { update: tslib_1.__assign({}, initalState.left.update, { queries: true }) }) });
                            var stateWithDifferentDataSource = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { urlState: tslib_1.__assign({}, initalState.left.urlState, { queries: [{ expr: '{__filename__="some.log"}' }] }) }) });
                            reducerTester()
                                .givenReducer(exploreReducer, stateWithDifferentDataSource)
                                .whenActionIsDispatched(updateLocation({
                                query: {
                                    left: serializedUrlState,
                                },
                                path: '/explore',
                            }))
                                .thenStateShouldEqual(expectedState);
                        });
                    });
                    describe('and ui differs', function () {
                        it('then it should return update ui', function () {
                            var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                            var expectedState = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { update: tslib_1.__assign({}, initalState.left.update, { ui: true }) }) });
                            var stateWithDifferentDataSource = tslib_1.__assign({}, initalState, { left: tslib_1.__assign({}, initalState.left, { urlState: tslib_1.__assign({}, initalState.left.urlState, { ui: tslib_1.__assign({}, initalState.left.urlState.ui, { showingGraph: true }) }) }) });
                            reducerTester()
                                .givenReducer(exploreReducer, stateWithDifferentDataSource)
                                .whenActionIsDispatched(updateLocation({
                                query: {
                                    left: serializedUrlState,
                                },
                                path: '/explore',
                            }))
                                .thenStateShouldEqual(expectedState);
                        });
                    });
                    describe('and nothing differs', function () {
                        it('then it should return update ui', function () {
                            var _a = setup(), initalState = _a.initalState, serializedUrlState = _a.serializedUrlState;
                            var expectedState = tslib_1.__assign({}, initalState);
                            reducerTester()
                                .givenReducer(exploreReducer, initalState)
                                .whenActionIsDispatched(updateLocation({
                                query: {
                                    left: serializedUrlState,
                                },
                                path: '/explore',
                            }))
                                .thenStateShouldEqual(expectedState);
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=reducers.test.js.map
import { PanelModel } from './PanelModel';
import { getPanelPlugin } from '../../plugins/__mocks__/pluginMocks';
var TablePanelCtrl = /** @class */ (function () {
    function TablePanelCtrl() {
    }
    return TablePanelCtrl;
}());
describe('PanelModel', function () {
    describe('when creating new panel model', function () {
        var model;
        var modelJson;
        var persistedOptionsMock;
        var defaultOptionsMock = {
            fieldOptions: {
                thresholds: [
                    {
                        color: '#F2495C',
                        index: 1,
                        value: 50,
                    },
                    {
                        color: '#73BF69',
                        index: 0,
                        value: null,
                    },
                ],
            },
            showThresholds: true,
        };
        beforeEach(function () {
            persistedOptionsMock = {
                fieldOptions: {
                    thresholds: [
                        {
                            color: '#F2495C',
                            index: 1,
                            value: 50,
                        },
                        {
                            color: '#73BF69',
                            index: 0,
                            value: null,
                        },
                    ],
                },
            };
            modelJson = {
                type: 'table',
                showColumns: true,
                targets: [{ refId: 'A' }, { noRefId: true }],
                options: persistedOptionsMock,
            };
            model = new PanelModel(modelJson);
            var panelPlugin = getPanelPlugin({
                id: 'table',
            }, null, // react
            TablePanelCtrl // angular
            );
            panelPlugin.setDefaults(defaultOptionsMock);
            model.pluginLoaded(panelPlugin);
        });
        it('should apply defaults', function () {
            expect(model.gridPos.h).toBe(3);
        });
        it('should apply option defaults', function () {
            expect(model.getOptions().showThresholds).toBeTruthy();
        });
        it('should set model props on instance', function () {
            expect(model.showColumns).toBe(true);
        });
        it('should add missing refIds', function () {
            expect(model.targets[1].refId).toBe('B');
        });
        it("shouldn't break panel with non-array targets", function () {
            modelJson.targets = {
                0: { refId: 'A' },
                foo: { bar: 'baz' },
            };
            model = new PanelModel(modelJson);
            expect(model.targets[0].refId).toBe('A');
        });
        it('getSaveModel should remove defaults', function () {
            var saveModel = model.getSaveModel();
            expect(saveModel.gridPos).toBe(undefined);
        });
        it('getSaveModel should not remove datasource default', function () {
            var saveModel = model.getSaveModel();
            expect(saveModel.datasource).toBe(null);
        });
        it('getSaveModel should remove nonPersistedProperties', function () {
            var saveModel = model.getSaveModel();
            expect(saveModel.events).toBe(undefined);
        });
        describe('when changing panel type', function () {
            var newPanelPluginDefaults = {
                showThresholdLabels: false,
            };
            beforeEach(function () {
                var newPlugin = getPanelPlugin({ id: 'graph' });
                newPlugin.setDefaults(newPanelPluginDefaults);
                model.changePlugin(newPlugin);
                model.alert = { id: 2 };
            });
            it('should apply next panel option defaults', function () {
                expect(model.getOptions().showThresholdLabels).toBeFalsy();
                expect(model.getOptions().showThresholds).toBeUndefined();
            });
            it('should remove table properties but keep core props', function () {
                expect(model.showColumns).toBe(undefined);
            });
            it('should restore table properties when changing back', function () {
                model.changePlugin(getPanelPlugin({ id: 'table' }));
                expect(model.showColumns).toBe(true);
            });
            it('should remove alert rule when changing type that does not support it', function () {
                model.changePlugin(getPanelPlugin({ id: 'table' }));
                expect(model.alert).toBe(undefined);
            });
            it('panelQueryRunner should be cleared', function () {
                var panelQueryRunner = model.queryRunner;
                expect(panelQueryRunner).toBeFalsy();
            });
        });
        describe('when changing from angular panel', function () {
            var tearDownPublished = false;
            beforeEach(function () {
                model.events.on('panel-teardown', function () {
                    tearDownPublished = true;
                });
                model.changePlugin(getPanelPlugin({ id: 'graph' }));
            });
            it('should teardown / destroy panel so angular panels event subscriptions are removed', function () {
                expect(tearDownPublished).toBe(true);
                expect(model.events.getEventCount()).toBe(0);
            });
        });
        describe('when changing to react panel from angular panel', function () {
            var panelQueryRunner;
            var onPanelTypeChanged = jest.fn();
            var reactPlugin = getPanelPlugin({ id: 'react' }).setPanelChangeHandler(onPanelTypeChanged);
            beforeEach(function () {
                model.changePlugin(reactPlugin);
                panelQueryRunner = model.getQueryRunner();
            });
            it('should call react onPanelTypeChanged', function () {
                expect(onPanelTypeChanged.mock.calls.length).toBe(1);
                expect(onPanelTypeChanged.mock.calls[0][1]).toBe('table');
                expect(onPanelTypeChanged.mock.calls[0][2].angular).toBeDefined();
            });
            it('getQueryRunner() should return same instance after changing to another react panel', function () {
                model.changePlugin(getPanelPlugin({ id: 'react2' }));
                var sameQueryRunner = model.getQueryRunner();
                expect(panelQueryRunner).toBe(sameQueryRunner);
            });
        });
    });
});
//# sourceMappingURL=PanelModel.test.js.map
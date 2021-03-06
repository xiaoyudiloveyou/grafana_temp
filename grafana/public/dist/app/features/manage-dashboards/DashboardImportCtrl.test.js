import { DashboardImportCtrl } from './DashboardImportCtrl';
import config from 'app/core/config';
describe('DashboardImportCtrl', function () {
    var ctx = {};
    var navModelSrv;
    var backendSrv;
    var validationSrv;
    beforeEach(function () {
        navModelSrv = {
            getNav: function () { },
        };
        backendSrv = {
            search: jest.fn().mockReturnValue(Promise.resolve([])),
            getDashboardByUid: jest.fn().mockReturnValue(Promise.resolve([])),
            get: jest.fn(),
        };
        validationSrv = {
            validateNewDashboardName: jest.fn().mockReturnValue(Promise.resolve()),
        };
        ctx.ctrl = new DashboardImportCtrl(backendSrv, validationSrv, navModelSrv, {}, {});
    });
    describe('when uploading json', function () {
        beforeEach(function () {
            config.datasources = {
                ds: {
                    type: 'test-db',
                },
            };
            ctx.ctrl.onUpload({
                __inputs: [
                    {
                        name: 'ds',
                        pluginId: 'test-db',
                        type: 'datasource',
                        pluginName: 'Test DB',
                    },
                ],
            });
        });
        it('should build input model', function () {
            expect(ctx.ctrl.inputs.length).toBe(1);
            expect(ctx.ctrl.inputs[0].name).toBe('ds');
            expect(ctx.ctrl.inputs[0].info).toBe('Select a Test DB data source');
        });
        it('should set inputValid to false', function () {
            expect(ctx.ctrl.inputsValid).toBe(false);
        });
    });
    describe('when specifying grafana.com url', function () {
        beforeEach(function () {
            ctx.ctrl.gnetUrl = 'http://grafana.com/dashboards/123';
            // setup api mock
            backendSrv.get = jest.fn(function () {
                return Promise.resolve({
                    json: {},
                });
            });
            return ctx.ctrl.checkGnetDashboard();
        });
        it('should call gnet api with correct dashboard id', function () {
            expect(backendSrv.get.mock.calls[0][0]).toBe('api/gnet/dashboards/123');
        });
    });
    describe('when specifying dashboard id', function () {
        beforeEach(function () {
            ctx.ctrl.gnetUrl = '2342';
            // setup api mock
            backendSrv.get = jest.fn(function () {
                return Promise.resolve({
                    json: {},
                });
            });
            return ctx.ctrl.checkGnetDashboard();
        });
        it('should call gnet api with correct dashboard id', function () {
            expect(backendSrv.get.mock.calls[0][0]).toBe('api/gnet/dashboards/2342');
        });
    });
});
//# sourceMappingURL=DashboardImportCtrl.test.js.map
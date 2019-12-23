var _this = this;
import * as tslib_1 from "tslib";
import { getAlertingValidationMessage } from './getAlertingValidationMessage';
describe('getAlertingValidationMessage', function () {
    describe('when called with some targets containing template variables', function () {
        it('then it should return false', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var call, datasource, getMock, datasourceSrv, targets, transformations, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        call = 0;
                        datasource = {
                            meta: { alerting: true },
                            targetContainsTemplate: function () {
                                if (call === 0) {
                                    call++;
                                    return true;
                                }
                                return false;
                            },
                            name: 'some name',
                        };
                        getMock = jest.fn().mockResolvedValue(datasource);
                        datasourceSrv = {
                            get: getMock,
                        };
                        targets = [
                            { refId: 'A', query: '@hostname:$hostname', isLogsQuery: false },
                            { refId: 'B', query: '@instance:instance', isLogsQuery: false },
                        ];
                        transformations = [];
                        return [4 /*yield*/, getAlertingValidationMessage(transformations, targets, datasourceSrv, datasource.name)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('');
                        expect(getMock).toHaveBeenCalledTimes(2);
                        expect(getMock).toHaveBeenCalledWith(datasource.name);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called with some targets using a datasource that does not support alerting', function () {
        it('then it should return false', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var alertingDatasource, datasource, datasourceSrv, targets, transformations, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alertingDatasource = {
                            meta: { alerting: true },
                            targetContainsTemplate: function () { return false; },
                            name: 'alertingDatasource',
                        };
                        datasource = {
                            meta: { alerting: false },
                            targetContainsTemplate: function () { return false; },
                            name: 'datasource',
                        };
                        datasourceSrv = {
                            get: function (name) {
                                if (name === datasource.name) {
                                    return Promise.resolve(datasource);
                                }
                                return Promise.resolve(alertingDatasource);
                            },
                        };
                        targets = [
                            { refId: 'A', query: 'some query', datasource: 'alertingDatasource' },
                            { refId: 'B', query: 'some query', datasource: 'datasource' },
                        ];
                        transformations = [];
                        return [4 /*yield*/, getAlertingValidationMessage(transformations, targets, datasourceSrv, datasource.name)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called with all targets containing template variables', function () {
        it('then it should return false', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, getMock, datasourceSrv, targets, transformations, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = {
                            meta: { alerting: true },
                            targetContainsTemplate: function () { return true; },
                            name: 'some name',
                        };
                        getMock = jest.fn().mockResolvedValue(datasource);
                        datasourceSrv = {
                            get: getMock,
                        };
                        targets = [
                            { refId: 'A', query: '@hostname:$hostname', isLogsQuery: false },
                            { refId: 'B', query: '@instance:$instance', isLogsQuery: false },
                        ];
                        transformations = [];
                        return [4 /*yield*/, getAlertingValidationMessage(transformations, targets, datasourceSrv, datasource.name)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('Template variables are not supported in alert queries');
                        expect(getMock).toHaveBeenCalledTimes(2);
                        expect(getMock).toHaveBeenCalledWith(datasource.name);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called with all targets using a datasource that does not support alerting', function () {
        it('then it should return false', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, getMock, datasourceSrv, targets, transformations, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = {
                            meta: { alerting: false },
                            targetContainsTemplate: function () { return false; },
                            name: 'some name',
                        };
                        getMock = jest.fn().mockResolvedValue(datasource);
                        datasourceSrv = {
                            get: getMock,
                        };
                        targets = [
                            { refId: 'A', query: '@hostname:hostname', isLogsQuery: false },
                            { refId: 'B', query: '@instance:instance', isLogsQuery: false },
                        ];
                        transformations = [];
                        return [4 /*yield*/, getAlertingValidationMessage(transformations, targets, datasourceSrv, datasource.name)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('The datasource does not support alerting queries');
                        expect(getMock).toHaveBeenCalledTimes(2);
                        expect(getMock).toHaveBeenCalledWith(datasource.name);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when called with transformations', function () {
        it('then it should return false', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var datasource, getMock, datasourceSrv, targets, transformations, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datasource = {
                            meta: { alerting: true },
                            targetContainsTemplate: function () { return false; },
                            name: 'some name',
                        };
                        getMock = jest.fn().mockResolvedValue(datasource);
                        datasourceSrv = {
                            get: getMock,
                        };
                        targets = [
                            { refId: 'A', query: '@hostname:hostname', isLogsQuery: false },
                            { refId: 'B', query: '@instance:instance', isLogsQuery: false },
                        ];
                        transformations = [{ id: 'A', options: null }];
                        return [4 /*yield*/, getAlertingValidationMessage(transformations, targets, datasourceSrv, datasource.name)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('Transformations are not supported in alert queries');
                        expect(getMock).toHaveBeenCalledTimes(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=getAlertingValidationMessage.test.js.map
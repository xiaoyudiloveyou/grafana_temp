var _this = this;
import * as tslib_1 from "tslib";
import { renderHook, act } from 'react-hooks-testing-library';
import { DataSourceStatus } from '@grafana/ui/src/types/datasource';
import LanguageProvider from 'app/plugins/datasource/loki/language_provider';
import { useLokiSyntax } from './useLokiSyntax';
import { makeMockLokiDatasource } from '../mocks';
describe('useLokiSyntax hook', function () {
    var datasource = makeMockLokiDatasource({});
    var languageProvider = new LanguageProvider(datasource);
    var logLabelOptionsMock = ['Holy mock!'];
    var logLabelOptionsMock2 = ['Mock the hell?!'];
    var logLabelOptionsMock3 = ['Oh my mock!'];
    var rangeMock = {
        from: 1560153109000,
        to: 1560163909000,
    };
    languageProvider.refreshLogLabels = function () {
        languageProvider.logLabelOptions = logLabelOptionsMock;
        return Promise.resolve();
    };
    languageProvider.fetchLogLabels = function () {
        languageProvider.logLabelOptions = logLabelOptionsMock2;
        return Promise.resolve([]);
    };
    var activeOptionMock = {
        label: '',
        value: '',
    };
    it('should provide Loki syntax when used', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, result, waitForNextUpdate;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderHook(function () {
                        return useLokiSyntax(languageProvider, DataSourceStatus.Connected, rangeMock);
                    }), result = _a.result, waitForNextUpdate = _a.waitForNextUpdate;
                    expect(result.current.syntax).toEqual(null);
                    return [4 /*yield*/, waitForNextUpdate()];
                case 1:
                    _b.sent();
                    expect(result.current.syntax).toEqual(languageProvider.getSyntax());
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fetch labels on first call', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, result, waitForNextUpdate;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderHook(function () {
                        return useLokiSyntax(languageProvider, DataSourceStatus.Connected, rangeMock);
                    }), result = _a.result, waitForNextUpdate = _a.waitForNextUpdate;
                    expect(result.current.isSyntaxReady).toBeFalsy();
                    expect(result.current.logLabelOptions).toEqual([]);
                    return [4 /*yield*/, waitForNextUpdate()];
                case 1:
                    _b.sent();
                    expect(result.current.isSyntaxReady).toBeTruthy();
                    expect(result.current.logLabelOptions).toEqual(logLabelOptionsMock2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should try to fetch missing options when active option changes', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, result, waitForNextUpdate;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderHook(function () {
                        return useLokiSyntax(languageProvider, DataSourceStatus.Connected, rangeMock);
                    }), result = _a.result, waitForNextUpdate = _a.waitForNextUpdate;
                    return [4 /*yield*/, waitForNextUpdate()];
                case 1:
                    _b.sent();
                    expect(result.current.logLabelOptions).toEqual(logLabelOptionsMock2);
                    languageProvider.fetchLabelValues = function (key) {
                        languageProvider.logLabelOptions = logLabelOptionsMock3;
                        return Promise.resolve();
                    };
                    act(function () { return result.current.setActiveOption([activeOptionMock]); });
                    return [4 /*yield*/, waitForNextUpdate()];
                case 2:
                    _b.sent();
                    expect(result.current.logLabelOptions).toEqual(logLabelOptionsMock3);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=useLokiSyntax.test.js.map
var _this = this;
import * as tslib_1 from "tslib";
import { renderHook, act } from 'react-hooks-testing-library';
import LanguageProvider from 'app/plugins/datasource/loki/language_provider';
import { useLokiLabels } from './useLokiLabels';
import { DataSourceStatus } from '@grafana/ui/src/types/datasource';
import { makeMockLokiDatasource } from '../mocks';
describe('useLokiLabels hook', function () {
    it('should refresh labels', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var datasource, languageProvider, logLabelOptionsMock, rangeMock, _a, result, waitForNextUpdate;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    datasource = makeMockLokiDatasource({});
                    languageProvider = new LanguageProvider(datasource);
                    logLabelOptionsMock = ['Holy mock!'];
                    rangeMock = {
                        from: 1560153109000,
                        to: 1560153109000,
                    };
                    languageProvider.refreshLogLabels = function () {
                        languageProvider.logLabelOptions = logLabelOptionsMock;
                        return Promise.resolve();
                    };
                    _a = renderHook(function () {
                        return useLokiLabels(languageProvider, true, [], rangeMock, DataSourceStatus.Connected, DataSourceStatus.Connected);
                    }), result = _a.result, waitForNextUpdate = _a.waitForNextUpdate;
                    act(function () { return result.current.refreshLabels(); });
                    expect(result.current.logLabelOptions).toEqual([]);
                    return [4 /*yield*/, waitForNextUpdate()];
                case 1:
                    _b.sent();
                    expect(result.current.logLabelOptions).toEqual(logLabelOptionsMock);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should force refresh labels after a disconnect', function () {
        var datasource = makeMockLokiDatasource({});
        var rangeMock = {
            from: 1560153109000,
            to: 1560153109000,
        };
        var languageProvider = new LanguageProvider(datasource);
        languageProvider.refreshLogLabels = jest.fn();
        renderHook(function () {
            return useLokiLabels(languageProvider, true, [], rangeMock, DataSourceStatus.Connected, DataSourceStatus.Disconnected);
        });
        expect(languageProvider.refreshLogLabels).toBeCalledTimes(1);
        expect(languageProvider.refreshLogLabels).toBeCalledWith(rangeMock, true);
    });
    it('should not force refresh labels after a connect', function () {
        var datasource = makeMockLokiDatasource({});
        var rangeMock = {
            from: 1560153109000,
            to: 1560153109000,
        };
        var languageProvider = new LanguageProvider(datasource);
        languageProvider.refreshLogLabels = jest.fn();
        renderHook(function () {
            return useLokiLabels(languageProvider, true, [], rangeMock, DataSourceStatus.Disconnected, DataSourceStatus.Connected);
        });
        expect(languageProvider.refreshLogLabels).not.toBeCalled();
    });
});
//# sourceMappingURL=useLokiLabels.test.js.map
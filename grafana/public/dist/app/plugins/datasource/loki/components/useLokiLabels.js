import { __assign, __awaiter, __generator, __read } from "tslib";
import { useState, useEffect } from 'react';
import { DataSourceStatus } from '@grafana/ui/src/types/datasource';
import { useRefMounted } from 'app/core/hooks/useRefMounted';
/**
 *
 * @param languageProvider
 * @param languageProviderInitialised
 * @param activeOption rc-cascader provided option used to fetch option's values that hasn't been loaded yet
 *
 * @description Fetches missing labels and enables labels refresh
 */
export var useLokiLabels = function (languageProvider, languageProviderInitialised, activeOption, absoluteRange, datasourceStatus, initialDatasourceStatus // used for test purposes
) {
    var mounted = useRefMounted();
    // State
    var _a = __read(useState([]), 2), logLabelOptions = _a[0], setLogLabelOptions = _a[1];
    var _b = __read(useState(false), 2), shouldTryRefreshLabels = _b[0], setRefreshLabels = _b[1];
    var _c = __read(useState(initialDatasourceStatus || DataSourceStatus.Connected), 2), prevDatasourceStatus = _c[0], setPrevDatasourceStatus = _c[1];
    var _d = __read(useState(false), 2), shouldForceRefreshLabels = _d[0], setForceRefreshLabels = _d[1];
    // Async
    var fetchOptionValues = function (option) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, languageProvider.fetchLabelValues(option, absoluteRange)];
                case 1:
                    _a.sent();
                    if (mounted.current) {
                        setLogLabelOptions(languageProvider.logLabelOptions);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var tryLabelsRefresh = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, languageProvider.refreshLogLabels(absoluteRange, shouldForceRefreshLabels)];
                case 1:
                    _a.sent();
                    if (mounted.current) {
                        setRefreshLabels(false);
                        setForceRefreshLabels(false);
                        setLogLabelOptions(languageProvider.logLabelOptions);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // Effects
    // This effect performs loading of options that hasn't been loaded yet
    // It's a subject of activeOption state change only. This is because of specific behavior or rc-cascader
    // https://github.com/react-component/cascader/blob/master/src/Cascader.jsx#L165
    useEffect(function () {
        if (languageProviderInitialised) {
            var targetOption_1 = activeOption[activeOption.length - 1];
            if (targetOption_1) {
                var nextOptions = logLabelOptions.map(function (option) {
                    if (option.value === targetOption_1.value) {
                        return __assign(__assign({}, option), { loading: true });
                    }
                    return option;
                });
                setLogLabelOptions(nextOptions); // to set loading
                fetchOptionValues(targetOption_1.value);
            }
        }
    }, [activeOption]);
    // This effect is performed on shouldTryRefreshLabels or shouldForceRefreshLabels state change only.
    // Since shouldTryRefreshLabels is reset AFTER the labels are refreshed we are secured in case of trying to refresh
    // when previous refresh hasn't finished yet
    useEffect(function () {
        if (shouldTryRefreshLabels || shouldForceRefreshLabels) {
            tryLabelsRefresh();
        }
    }, [shouldTryRefreshLabels, shouldForceRefreshLabels]);
    // This effect is performed on datasourceStatus state change only.
    // We want to make sure to only force refresh AFTER a disconnected state thats why we store the previous datasourceStatus in state
    useEffect(function () {
        if (datasourceStatus === DataSourceStatus.Connected && prevDatasourceStatus === DataSourceStatus.Disconnected) {
            setForceRefreshLabels(true);
        }
        setPrevDatasourceStatus(datasourceStatus);
    }, [datasourceStatus]);
    return {
        logLabelOptions: logLabelOptions,
        setLogLabelOptions: setLogLabelOptions,
        refreshLabels: function () { return setRefreshLabels(true); },
    };
};
//# sourceMappingURL=useLokiLabels.js.map
import { __awaiter, __generator, __read } from "tslib";
import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import { useLokiLabels } from 'app/plugins/datasource/loki/components/useLokiLabels';
import { useRefMounted } from 'app/core/hooks/useRefMounted';
var PRISM_SYNTAX = 'promql';
/**
 *
 * @param languageProvider
 * @description Initializes given language provider, exposes Loki syntax and enables loading label option values
 */
export var useLokiSyntax = function (languageProvider, datasourceStatus, absoluteRange) {
    var mounted = useRefMounted();
    // State
    var _a = __read(useState(false), 2), languageProviderInitialized = _a[0], setLanguageProviderInitilized = _a[1];
    var _b = __read(useState(null), 2), syntax = _b[0], setSyntax = _b[1];
    /**
     * Holds information about currently selected option from rc-cascader to perform effect
     * that loads option values not fetched yet. Based on that useLokiLabels hook decides whether or not
     * the option requires additional data fetching
     */
    var _c = __read(useState(), 2), activeOption = _c[0], setActiveOption = _c[1];
    var _d = useLokiLabels(languageProvider, languageProviderInitialized, activeOption, absoluteRange, datasourceStatus), logLabelOptions = _d.logLabelOptions, setLogLabelOptions = _d.setLogLabelOptions, refreshLabels = _d.refreshLabels;
    // Async
    var initializeLanguageProvider = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    languageProvider.initialRange = absoluteRange;
                    return [4 /*yield*/, languageProvider.start()];
                case 1:
                    _a.sent();
                    Prism.languages[PRISM_SYNTAX] = languageProvider.getSyntax();
                    if (mounted.current) {
                        setLogLabelOptions(languageProvider.logLabelOptions);
                        setSyntax(languageProvider.getSyntax());
                        setLanguageProviderInitilized(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // Effects
    useEffect(function () {
        initializeLanguageProvider();
    }, []);
    return {
        isSyntaxReady: languageProviderInitialized,
        syntax: syntax,
        logLabelOptions: logLabelOptions,
        setActiveOption: setActiveOption,
        refreshLabels: refreshLabels,
    };
};
//# sourceMappingURL=useLokiSyntax.js.map
import React from 'react';
import { LoadingPlaceholder } from '@grafana/ui';
var PageLoader = function (_a) {
    var _b = _a.pageName, pageName = _b === void 0 ? '' : _b;
    var loadingText = "Loading " + pageName + "...";
    return (React.createElement("div", { className: "page-loader-wrapper" },
        React.createElement(LoadingPlaceholder, { text: loadingText })));
};
export default PageLoader;
//# sourceMappingURL=PageLoader.js.map
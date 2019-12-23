import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
var TestInfoTab = /** @class */ (function (_super) {
    tslib_1.__extends(TestInfoTab, _super);
    function TestInfoTab(props) {
        return _super.call(this, props) || this;
    }
    TestInfoTab.prototype.render = function () {
        return (React.createElement("div", null,
            "See github for more information about setting up a reproducable test environment.",
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("a", { className: "btn btn-inverse", href: "https://github.com/grafana/grafana/tree/master/devenv", target: "_blank", rel: "noopener" }, "Github"),
            React.createElement("br", null)));
    };
    return TestInfoTab;
}(PureComponent));
export { TestInfoTab };
//# sourceMappingURL=TestInfoTab.js.map
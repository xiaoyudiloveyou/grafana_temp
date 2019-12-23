import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
var ExamplePage2 = /** @class */ (function (_super) {
    tslib_1.__extends(ExamplePage2, _super);
    function ExamplePage2(props) {
        return _super.call(this, props) || this;
    }
    ExamplePage2.prototype.render = function () {
        var query = this.props.query;
        return (React.createElement("div", null,
            "22222222222222222222222222222222",
            React.createElement("pre", null, JSON.stringify(query)),
            "22222222222222222222222222222222"));
    };
    return ExamplePage2;
}(PureComponent));
export { ExamplePage2 };
//# sourceMappingURL=ExamplePage2.js.map
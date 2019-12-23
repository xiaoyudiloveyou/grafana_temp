import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
var ExamplePage1 = /** @class */ (function (_super) {
    tslib_1.__extends(ExamplePage1, _super);
    function ExamplePage1(props) {
        return _super.call(this, props) || this;
    }
    ExamplePage1.prototype.render = function () {
        var query = this.props.query;
        return (React.createElement("div", null,
            "11111111111111111111111111111111",
            React.createElement("pre", null, JSON.stringify(query)),
            "11111111111111111111111111111111"));
    };
    return ExamplePage1;
}(PureComponent));
export { ExamplePage1 };
//# sourceMappingURL=ExamplePage1.js.map
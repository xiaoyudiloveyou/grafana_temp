import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import InfluxCheatSheet from './InfluxCheatSheet';
var InfluxStartPage = /** @class */ (function (_super) {
    tslib_1.__extends(InfluxStartPage, _super);
    function InfluxStartPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InfluxStartPage.prototype.render = function () {
        return (React.createElement("div", { className: "grafana-info-box grafana-info-box--max-lg" },
            React.createElement(InfluxCheatSheet, { onClickExample: this.props.onClickExample })));
    };
    return InfluxStartPage;
}(PureComponent));
export default InfluxStartPage;
//# sourceMappingURL=InfluxStartPage.js.map
import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import ElapsedTime from './ElapsedTime';
import { LoadingState } from '@grafana/data';
function formatLatency(value) {
    return (value / 1000).toFixed(1) + "s";
}
var QueryStatusItem = /** @class */ (function (_super) {
    tslib_1.__extends(QueryStatusItem, _super);
    function QueryStatusItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QueryStatusItem.prototype.render = function () {
        var _a = this.props, queryResponse = _a.queryResponse, latency = _a.latency;
        var className = queryResponse.state === LoadingState.Done || LoadingState.Error
            ? 'query-transaction'
            : 'query-transaction query-transaction--loading';
        return (React.createElement("div", { className: className },
            React.createElement("div", { className: "query-transaction__duration" }, queryResponse.state === LoadingState.Done || LoadingState.Error ? formatLatency(latency) : React.createElement(ElapsedTime, null))));
    };
    return QueryStatusItem;
}(PureComponent));
var QueryStatus = /** @class */ (function (_super) {
    tslib_1.__extends(QueryStatus, _super);
    function QueryStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QueryStatus.prototype.render = function () {
        var _a = this.props, queryResponse = _a.queryResponse, latency = _a.latency;
        if (queryResponse.state === LoadingState.NotStarted) {
            return null;
        }
        return (React.createElement("div", { className: "query-transactions" },
            React.createElement(QueryStatusItem, { queryResponse: queryResponse, latency: latency })));
    };
    return QueryStatus;
}(PureComponent));
export default QueryStatus;
//# sourceMappingURL=QueryStatus.js.map
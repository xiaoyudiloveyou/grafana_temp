import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { toDuration } from '@grafana/data';
var INTERVAL = 150;
/**
 * Shows an incremental time ticker of elapsed time from some event.
 */
var ElapsedTime = /** @class */ (function (_super) {
    tslib_1.__extends(ElapsedTime, _super);
    function ElapsedTime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            elapsed: 0,
        };
        _this.tick = function () {
            var jetzt = Date.now();
            var elapsed = jetzt - _this.offset;
            _this.setState({ elapsed: elapsed });
        };
        return _this;
    }
    ElapsedTime.prototype.start = function () {
        this.offset = Date.now();
        this.timer = window.setInterval(this.tick, INTERVAL);
    };
    ElapsedTime.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        if (nextProps.time) {
            clearInterval(this.timer);
        }
        else if (this.props.time) {
            this.start();
        }
        if (nextProps.resetKey !== this.props.resetKey) {
            clearInterval(this.timer);
            this.start();
        }
    };
    ElapsedTime.prototype.componentDidMount = function () {
        this.start();
    };
    ElapsedTime.prototype.componentWillUnmount = function () {
        clearInterval(this.timer);
    };
    ElapsedTime.prototype.render = function () {
        var elapsed = this.state.elapsed;
        var _a = this.props, className = _a.className, time = _a.time, humanize = _a.humanize;
        var value = (time || elapsed) / 1000;
        var displayValue = value.toFixed(1) + "s";
        if (humanize) {
            var duration = toDuration(elapsed);
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();
            displayValue = hours ? hours + "h " + minutes + "m " + seconds + "s" : minutes ? " " + minutes + "m " + seconds + "s" : seconds + "s";
        }
        return React.createElement("span", { className: "elapsed-time " + className }, displayValue);
    };
    return ElapsedTime;
}(PureComponent));
export default ElapsedTime;
//# sourceMappingURL=ElapsedTime.js.map
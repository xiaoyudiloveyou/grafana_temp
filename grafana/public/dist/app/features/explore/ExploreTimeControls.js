import * as tslib_1 from "tslib";
// Libaries
import React, { Component } from 'react';
import { dateTimeForTimeZone } from '@grafana/data';
// State
// Components
import { TimePicker } from '@grafana/ui';
// Utils & Services
import { defaultSelectOptions } from '@grafana/ui/src/components/TimePicker/TimePicker';
import { getShiftedTimeRange, getZoomedTimeRange } from 'app/core/utils/timePicker';
var ExploreTimeControls = /** @class */ (function (_super) {
    tslib_1.__extends(ExploreTimeControls, _super);
    function ExploreTimeControls() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onMoveTimePicker = function (direction) {
            var _a = _this.props, range = _a.range, onChangeTime = _a.onChangeTime, timeZone = _a.timeZone;
            var _b = getShiftedTimeRange(direction, range), from = _b.from, to = _b.to;
            var nextTimeRange = {
                from: dateTimeForTimeZone(timeZone, from),
                to: dateTimeForTimeZone(timeZone, to),
            };
            onChangeTime(nextTimeRange);
        };
        _this.onMoveForward = function () { return _this.onMoveTimePicker(1); };
        _this.onMoveBack = function () { return _this.onMoveTimePicker(-1); };
        _this.onChangeTimePicker = function (timeRange) {
            _this.props.onChangeTime(timeRange.raw);
        };
        _this.onZoom = function () {
            var _a = _this.props, range = _a.range, onChangeTime = _a.onChangeTime, timeZone = _a.timeZone;
            var _b = getZoomedTimeRange(range, 2), from = _b.from, to = _b.to;
            var nextTimeRange = {
                from: dateTimeForTimeZone(timeZone, from),
                to: dateTimeForTimeZone(timeZone, to),
            };
            onChangeTime(nextTimeRange);
        };
        _this.setActiveTimeOption = function (timeOptions, rawTimeRange) {
            return timeOptions.map(function (option) {
                if (option.to === rawTimeRange.to && option.from === rawTimeRange.from) {
                    return tslib_1.__assign({}, option, { active: true });
                }
                return tslib_1.__assign({}, option, { active: false });
            });
        };
        return _this;
    }
    ExploreTimeControls.prototype.render = function () {
        var _a = this.props, range = _a.range, timeZone = _a.timeZone;
        return (React.createElement(TimePicker, { value: range, onChange: this.onChangeTimePicker, timeZone: timeZone, onMoveBackward: this.onMoveBack, onMoveForward: this.onMoveForward, onZoom: this.onZoom, selectOptions: this.setActiveTimeOption(defaultSelectOptions, range.raw) }));
    };
    return ExploreTimeControls;
}(Component));
export { ExploreTimeControls };
//# sourceMappingURL=ExploreTimeControls.js.map
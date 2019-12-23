import * as tslib_1 from "tslib";
// Libaries
import React, { Component } from 'react';
import { dateMath } from '@grafana/data';
// Components
import { TimePicker, RefreshPicker } from '@grafana/ui';
// Utils & Services
import { getTimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { defaultSelectOptions } from '@grafana/ui/src/components/TimePicker/TimePicker';
var DashNavTimeControls = /** @class */ (function (_super) {
    tslib_1.__extends(DashNavTimeControls, _super);
    function DashNavTimeControls() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timeSrv = getTimeSrv();
        _this.$rootScope = _this.props.$injector.get('$rootScope');
        _this.onChangeRefreshInterval = function (interval) {
            _this.timeSrv.setAutoRefresh(interval);
            _this.forceUpdate();
        };
        _this.onRefresh = function () {
            _this.timeSrv.refreshDashboard();
            return Promise.resolve();
        };
        _this.onMoveBack = function () {
            _this.$rootScope.appEvent('shift-time', -1);
        };
        _this.onMoveForward = function () {
            _this.$rootScope.appEvent('shift-time', 1);
        };
        _this.onChangeTimePicker = function (timeRange) {
            var dashboard = _this.props.dashboard;
            var panel = dashboard.timepicker;
            var hasDelay = panel.nowDelay && timeRange.raw.to === 'now';
            var adjustedFrom = dateMath.isMathString(timeRange.raw.from) ? timeRange.raw.from : timeRange.from;
            var adjustedTo = dateMath.isMathString(timeRange.raw.to) ? timeRange.raw.to : timeRange.to;
            var nextRange = {
                from: adjustedFrom,
                to: hasDelay ? 'now-' + panel.nowDelay : adjustedTo,
            };
            _this.timeSrv.setTime(nextRange);
        };
        _this.onZoom = function () {
            _this.$rootScope.appEvent('zoom-out', 2);
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
    Object.defineProperty(DashNavTimeControls.prototype, "refreshParamInUrl", {
        get: function () {
            return this.props.location.query.refresh;
        },
        enumerable: true,
        configurable: true
    });
    DashNavTimeControls.prototype.render = function () {
        var dashboard = this.props.dashboard;
        var intervals = dashboard.timepicker.refresh_intervals;
        var timePickerValue = this.timeSrv.timeRange();
        var timeZone = dashboard.getTimezone();
        return (React.createElement("div", { className: "dashboard-timepicker-wrapper" },
            React.createElement(TimePicker, { value: timePickerValue, onChange: this.onChangeTimePicker, timeZone: timeZone, onMoveBackward: this.onMoveBack, onMoveForward: this.onMoveForward, onZoom: this.onZoom, selectOptions: this.setActiveTimeOption(defaultSelectOptions, timePickerValue.raw) }),
            React.createElement(RefreshPicker, { onIntervalChanged: this.onChangeRefreshInterval, onRefresh: this.onRefresh, value: dashboard.refresh, intervals: intervals, tooltip: "Refresh dashboard" })));
    };
    return DashNavTimeControls;
}(Component));
export { DashNavTimeControls };
//# sourceMappingURL=DashNavTimeControls.js.map
import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { css, cx } from 'emotion';
import tinycolor from 'tinycolor2';
import { last } from 'lodash';
import { withTheme, getLogRowStyles } from '@grafana/ui';
import ElapsedTime from './ElapsedTime';
var getStyles = function (theme) { return ({
    logsRowsLive: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    label: logs-rows-live;\n    font-family: ", ";\n    font-size: ", ";\n    display: flex;\n    flex-flow: column nowrap;\n    height: 65vh;\n    overflow-y: auto;\n    :first-child {\n      margin-top: auto !important;\n    }\n  "], ["\n    label: logs-rows-live;\n    font-family: ", ";\n    font-size: ", ";\n    display: flex;\n    flex-flow: column nowrap;\n    height: 65vh;\n    overflow-y: auto;\n    :first-child {\n      margin-top: auto !important;\n    }\n  "])), theme.typography.fontFamily.monospace, theme.typography.size.sm),
    logsRowFresh: css(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n    label: logs-row-fresh;\n    color: ", ";\n    background-color: ", ";\n    animation: fade 1s ease-out 1s 1 normal forwards;\n    @keyframes fade {\n      from {\n        background-color: ", ";\n      }\n      to {\n        background-color: transparent;\n      }\n    }\n  "], ["\n    label: logs-row-fresh;\n    color: ", ";\n    background-color: ",
        ";\n    animation: fade 1s ease-out 1s 1 normal forwards;\n    @keyframes fade {\n      from {\n        background-color: ",
        ";\n      }\n      to {\n        background-color: transparent;\n      }\n    }\n  "])), theme.colors.text, tinycolor(theme.colors.blueLight)
        .setAlpha(0.25)
        .toString(), tinycolor(theme.colors.blueLight)
        .setAlpha(0.25)
        .toString()),
    logsRowOld: css(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n    label: logs-row-old;\n  "], ["\n    label: logs-row-old;\n  "]))),
    logsRowsIndicator: css(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n    font-size: ", ";\n    padding-top: ", ";\n    display: flex;\n    align-items: center;\n  "], ["\n    font-size: ", ";\n    padding-top: ", ";\n    display: flex;\n    align-items: center;\n  "])), theme.typography.size.md, theme.spacing.sm),
    button: css(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n    margin-right: ", ";\n  "], ["\n    margin-right: ", ";\n  "])), theme.spacing.sm),
}); };
var LiveLogs = /** @class */ (function (_super) {
    tslib_1.__extends(LiveLogs, _super);
    function LiveLogs(props) {
        var _this = _super.call(this, props) || this;
        _this.liveEndDiv = null;
        _this.scrollContainerRef = React.createRef();
        _this.lastScrollPos = null;
        /**
         * Handle pausing when user scrolls up so that we stop resetting his position to the bottom when new row arrives.
         * We do not need to throttle it here much, adding new rows should be throttled/buffered itself in the query epics
         * and after you pause we remove the handler and add it after you manually resume, so this should not be fired often.
         */
        _this.onScroll = function (event) {
            var _a = _this.props, isPaused = _a.isPaused, onPause = _a.onPause;
            var _b = event.currentTarget, scrollTop = _b.scrollTop, clientHeight = _b.clientHeight, scrollHeight = _b.scrollHeight;
            var distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
            if (distanceFromBottom >= 5 && !isPaused) {
                onPause();
                _this.lastScrollPos = distanceFromBottom;
            }
        };
        _this.rowsToRender = function () {
            var isPaused = _this.props.isPaused;
            var rowsToRender = _this.state.logsResultToRender ? _this.state.logsResultToRender.rows : [];
            if (!isPaused) {
                // A perf optimisation here. Show just 100 rows when streaming and full length when the streaming is paused.
                rowsToRender = rowsToRender.slice(-100);
            }
            return rowsToRender;
        };
        /**
         * Check if row is fresh so we can apply special styling. This is bit naive and does not take into account rows
         * which arrive out of order. Because loki datasource sends full data instead of deltas we need to compare the
         * data and this is easier than doing some intersection of some uuid of each row (which we do not have now anyway)
         */
        _this.isFresh = function (row) {
            return row.timeEpochMs > _this.state.lastTimestamp;
        };
        _this.state = {
            logsResultToRender: props.logsResult,
            lastTimestamp: 0,
        };
        return _this;
    }
    LiveLogs.prototype.componentDidUpdate = function (prevProps) {
        if (!prevProps.isPaused && this.props.isPaused) {
            // So we paused the view and we changed the content size, but we want to keep the relative offset from the bottom.
            if (this.lastScrollPos) {
                // There is last scroll pos from when user scrolled up a bit so go to that position.
                var _a = this.scrollContainerRef.current, clientHeight = _a.clientHeight, scrollHeight = _a.scrollHeight;
                var scrollTop = scrollHeight - (this.lastScrollPos + clientHeight);
                this.scrollContainerRef.current.scrollTo(0, scrollTop);
                this.lastScrollPos = null;
            }
            else {
                // We do not have any position to jump to su the assumption is user just clicked pause. We can just scroll
                // to the bottom.
                if (this.liveEndDiv) {
                    this.liveEndDiv.scrollIntoView(false);
                }
            }
        }
    };
    LiveLogs.getDerivedStateFromProps = function (nextProps, state) {
        if (!nextProps.isPaused) {
            return {
                // We update what we show only if not paused. We keep any background subscriptions running and keep updating
                // our state, but we do not show the updates, this allows us start again showing correct result after resuming
                // without creating a gap in the log results.
                logsResultToRender: nextProps.logsResult,
                lastTimestamp: state.logsResultToRender && last(state.logsResultToRender.rows)
                    ? last(state.logsResultToRender.rows).timeEpochMs
                    : 0,
            };
        }
        else {
            return null;
        }
    };
    LiveLogs.prototype.render = function () {
        var _this = this;
        var _a = this.props, theme = _a.theme, timeZone = _a.timeZone, onPause = _a.onPause, onResume = _a.onResume, isPaused = _a.isPaused;
        var styles = getStyles(theme);
        var showUtc = timeZone === 'utc';
        var _b = getLogRowStyles(theme), logsRow = _b.logsRow, logsRowLocalTime = _b.logsRowLocalTime, logsRowMessage = _b.logsRowMessage;
        return (React.createElement("div", null,
            React.createElement("div", { onScroll: isPaused ? undefined : this.onScroll, className: cx(['logs-rows', styles.logsRowsLive]), ref: this.scrollContainerRef },
                this.rowsToRender().map(function (row, index) {
                    return (React.createElement("div", { className: cx(logsRow, _this.isFresh(row) ? styles.logsRowFresh : styles.logsRowOld), key: row.timeEpochMs + "-" + index },
                        showUtc && (React.createElement("div", { className: cx([logsRowLocalTime]), title: "Local: " + row.timeLocal + " (" + row.timeFromNow + ")" }, row.timeUtc)),
                        !showUtc && (React.createElement("div", { className: cx([logsRowLocalTime]), title: row.timeUtc + " (" + row.timeFromNow + ")" }, row.timeLocal)),
                        React.createElement("div", { className: cx([logsRowMessage]) }, row.entry)));
                }),
                React.createElement("div", { ref: function (element) {
                        _this.liveEndDiv = element;
                        // This is triggered on every update so on every new row. It keeps the view scrolled at the bottom by
                        // default.
                        if (_this.liveEndDiv && !isPaused) {
                            _this.liveEndDiv.scrollIntoView(false);
                        }
                    } })),
            React.createElement("div", { className: cx([styles.logsRowsIndicator]) },
                React.createElement("button", { onClick: isPaused ? onResume : onPause, className: cx('btn btn-secondary', styles.button) },
                    React.createElement("i", { className: cx('fa', isPaused ? 'fa-play' : 'fa-pause') }),
                    "\u00A0",
                    isPaused ? 'Resume' : 'Pause'),
                React.createElement("button", { onClick: this.props.stopLive, className: cx('btn btn-inverse', styles.button) },
                    React.createElement("i", { className: 'fa fa-stop' }),
                    "\u00A0 Exit live mode"),
                isPaused || (React.createElement("span", null,
                    "Last line received: ",
                    React.createElement(ElapsedTime, { resetKey: this.props.logsResult, humanize: true }),
                    " ago")))));
    };
    return LiveLogs;
}(PureComponent));
export var LiveLogsWithTheme = withTheme(LiveLogs);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=LiveLogs.js.map
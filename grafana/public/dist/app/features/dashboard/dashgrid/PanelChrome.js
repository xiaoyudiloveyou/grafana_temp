import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
import classNames from 'classnames';
// Components
import { PanelHeader } from './PanelHeader/PanelHeader';
import { ErrorBoundary } from '@grafana/ui';
// Utils & Services
import { getTimeSrv } from '../services/TimeSrv';
import { applyPanelTimeOverrides, calculateInnerPanelHeight } from 'app/features/dashboard/utils/panel';
import { profiler } from 'app/core/profiler';
import { getProcessedDataFrames } from '../state/runRequest';
import templateSrv from 'app/features/templating/template_srv';
import config from 'app/core/config';
import { LoadingState, toUtc, toDataFrameDTO, DefaultTimeRange } from '@grafana/data';
var DEFAULT_PLUGIN_ERROR = 'Error in plugin';
var PanelChrome = /** @class */ (function (_super) {
    tslib_1.__extends(PanelChrome, _super);
    function PanelChrome(props) {
        var _this = _super.call(this, props) || this;
        _this.timeSrv = getTimeSrv();
        // Updates the response with information from the stream
        // The next is outside a react synthetic event so setState is not batched
        // So in this context we can only do a single call to setState
        _this.panelDataObserver = {
            next: function (data) {
                if (!_this.props.isInView) {
                    // Ignore events when not visible.
                    // The call will be repeated when the panel comes into view
                    return;
                }
                var isFirstLoad = _this.state.isFirstLoad;
                var errorMessage = null;
                switch (data.state) {
                    case LoadingState.Loading:
                        // Skip updating state data if it is already in loading state
                        // This is to avoid rendering partial loading responses
                        if (_this.state.data.state === LoadingState.Loading) {
                            return;
                        }
                        break;
                    case LoadingState.Error:
                        var error = data.error;
                        if (error) {
                            if (errorMessage !== error.message) {
                                errorMessage = error.message;
                            }
                        }
                        break;
                    case LoadingState.Done:
                        // If we are doing a snapshot save data in panel model
                        if (_this.props.dashboard.snapshot) {
                            _this.props.panel.snapshotData = data.series.map(function (frame) { return toDataFrameDTO(frame); });
                        }
                        if (isFirstLoad) {
                            isFirstLoad = false;
                        }
                        break;
                }
                _this.setState({ isFirstLoad: isFirstLoad, errorMessage: errorMessage, data: data });
            },
        };
        _this.onRefresh = function () {
            var _a = _this.props, panel = _a.panel, isInView = _a.isInView, width = _a.width;
            if (!isInView) {
                console.log('Refresh when panel is visible', panel.id);
                _this.setState({ refreshWhenInView: true });
                return;
            }
            var timeData = applyPanelTimeOverrides(panel, _this.timeSrv.timeRange());
            // Issue Query
            if (_this.wantsQueryExecution) {
                if (width < 0) {
                    console.log('Refresh skippted, no width yet... wait till we know');
                    return;
                }
                var queryRunner = panel.getQueryRunner();
                if (!_this.querySubscription) {
                    _this.querySubscription = queryRunner.getData().subscribe(_this.panelDataObserver);
                }
                queryRunner.run({
                    datasource: panel.datasource,
                    queries: panel.targets,
                    panelId: panel.id,
                    dashboardId: _this.props.dashboard.id,
                    timezone: _this.props.dashboard.getTimezone(),
                    timeRange: timeData.timeRange,
                    timeInfo: timeData.timeInfo,
                    widthPixels: width,
                    maxDataPoints: panel.maxDataPoints,
                    minInterval: panel.interval,
                    scopedVars: panel.scopedVars,
                    cacheTimeout: panel.cacheTimeout,
                    transformations: panel.transformations,
                });
            }
        };
        _this.onRender = function () {
            var stateUpdate = { renderCounter: _this.state.renderCounter + 1 };
            _this.setState(stateUpdate);
        };
        _this.onOptionsChange = function (options) {
            _this.props.panel.updateOptions(options);
        };
        _this.replaceVariables = function (value, extraVars, format) {
            var vars = _this.props.panel.scopedVars;
            if (extraVars) {
                vars = vars ? tslib_1.__assign({}, vars, extraVars) : extraVars;
            }
            return templateSrv.replace(value, vars, format);
        };
        _this.onPanelError = function (message) {
            if (_this.state.errorMessage !== message) {
                _this.setState({ errorMessage: message });
            }
        };
        _this.onChangeTimeRange = function (timeRange) {
            _this.timeSrv.setTime({
                from: toUtc(timeRange.from),
                to: toUtc(timeRange.to),
            });
        };
        _this.state = {
            isFirstLoad: true,
            renderCounter: 0,
            errorMessage: null,
            refreshWhenInView: false,
            data: {
                state: LoadingState.NotStarted,
                series: [],
                timeRange: DefaultTimeRange,
            },
        };
        return _this;
    }
    PanelChrome.prototype.componentDidMount = function () {
        var _a = this.props, panel = _a.panel, dashboard = _a.dashboard;
        panel.events.on('refresh', this.onRefresh);
        panel.events.on('render', this.onRender);
        dashboard.panelInitialized(this.props.panel);
        // Move snapshot data into the query response
        if (this.hasPanelSnapshot) {
            this.setState({
                data: tslib_1.__assign({}, this.state.data, { state: LoadingState.Done, series: getProcessedDataFrames(panel.snapshotData) }),
                isFirstLoad: false,
            });
        }
        else if (!this.wantsQueryExecution) {
            this.setState({ isFirstLoad: false });
        }
    };
    PanelChrome.prototype.componentWillUnmount = function () {
        this.props.panel.events.off('refresh', this.onRefresh);
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
            this.querySubscription = null;
        }
    };
    PanelChrome.prototype.componentDidUpdate = function (prevProps) {
        var isInView = this.props.isInView;
        // View state has changed
        if (isInView !== prevProps.isInView) {
            if (isInView) {
                // Check if we need a delayed refresh
                if (this.state.refreshWhenInView) {
                    this.onRefresh();
                }
            }
            else if (this.querySubscription) {
                this.querySubscription.unsubscribe();
                this.querySubscription = null;
            }
        }
    };
    Object.defineProperty(PanelChrome.prototype, "hasPanelSnapshot", {
        get: function () {
            var panel = this.props.panel;
            return panel.snapshotData && panel.snapshotData.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelChrome.prototype, "wantsQueryExecution", {
        get: function () {
            return !(this.props.plugin.meta.skipDataQuery || this.hasPanelSnapshot);
        },
        enumerable: true,
        configurable: true
    });
    PanelChrome.prototype.renderPanel = function (width, height) {
        var _a = this.props, panel = _a.panel, plugin = _a.plugin;
        var _b = this.state, renderCounter = _b.renderCounter, data = _b.data, isFirstLoad = _b.isFirstLoad;
        var theme = config.theme;
        // This is only done to increase a counter that is used by backend
        // image rendering (phantomjs/headless chrome) to know when to capture image
        var loading = data.state;
        if (loading === LoadingState.Done) {
            profiler.renderingCompleted();
        }
        // do not render component until we have first data
        if (isFirstLoad && (loading === LoadingState.Loading || loading === LoadingState.NotStarted)) {
            return this.renderLoadingState();
        }
        var PanelComponent = plugin.panel;
        var innerPanelHeight = calculateInnerPanelHeight(panel, height);
        var timeRange = data.timeRange || this.timeSrv.timeRange();
        return (React.createElement(React.Fragment, null,
            loading === LoadingState.Loading && this.renderLoadingState(),
            React.createElement("div", { className: "panel-content" },
                React.createElement(PanelComponent, { id: panel.id, data: data, timeRange: timeRange, timeZone: this.props.dashboard.getTimezone(), options: panel.getOptions(), transparent: panel.transparent, width: width - theme.panelPadding * 2, height: innerPanelHeight, renderCounter: renderCounter, replaceVariables: this.replaceVariables, onOptionsChange: this.onOptionsChange, onChangeTimeRange: this.onChangeTimeRange }))));
    };
    PanelChrome.prototype.renderLoadingState = function () {
        return (React.createElement("div", { className: "panel-loading" },
            React.createElement("i", { className: "fa fa-spinner fa-spin" })));
    };
    PanelChrome.prototype.render = function () {
        var _this = this;
        var _a = this.props, dashboard = _a.dashboard, panel = _a.panel, isFullscreen = _a.isFullscreen, width = _a.width, height = _a.height;
        var _b = this.state, errorMessage = _b.errorMessage, data = _b.data;
        var transparent = panel.transparent;
        var containerClassNames = classNames({
            'panel-container': true,
            'panel-container--absolute': true,
            'panel-container--no-title': !panel.hasTitle(),
            'panel-transparent': transparent,
        });
        return (React.createElement("div", { className: containerClassNames },
            React.createElement(PanelHeader, { panel: panel, dashboard: dashboard, timeInfo: data.request ? data.request.timeInfo : null, title: panel.title, description: panel.description, scopedVars: panel.scopedVars, links: panel.links, error: errorMessage, isFullscreen: isFullscreen }),
            React.createElement(ErrorBoundary, null, function (_a) {
                var error = _a.error, errorInfo = _a.errorInfo;
                if (errorInfo) {
                    _this.onPanelError(error.message || DEFAULT_PLUGIN_ERROR);
                    return null;
                }
                return _this.renderPanel(width, height);
            })));
    };
    return PanelChrome;
}(PureComponent));
export { PanelChrome };
//# sourceMappingURL=PanelChrome.js.map
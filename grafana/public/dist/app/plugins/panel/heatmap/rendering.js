import _ from 'lodash';
import $ from 'jquery';
import * as d3 from 'd3';
import { appEvents, contextSrv } from 'app/core/core';
import * as ticksUtils from 'app/core/utils/ticks';
import { HeatmapTooltip } from './heatmap_tooltip';
import { mergeZeroBuckets } from './heatmap_data_converter';
import { getColorScale, getOpacityScale } from './color_scale';
import { GrafanaThemeType, getColorFromHexRgbOrName, getValueFormat } from '@grafana/ui';
import { toUtc } from '@grafana/data';
var MIN_CARD_SIZE = 1, CARD_PADDING = 1, CARD_ROUND = 0, DATA_RANGE_WIDING_FACTOR = 1.2, DEFAULT_X_TICK_SIZE_PX = 100, DEFAULT_Y_TICK_SIZE_PX = 50, X_AXIS_TICK_PADDING = 10, Y_AXIS_TICK_PADDING = 5, MIN_SELECTION_WIDTH = 2;
export default function rendering(scope, elem, attrs, ctrl) {
    return new HeatmapRenderer(scope, elem, attrs, ctrl);
}
var HeatmapRenderer = /** @class */ (function () {
    function HeatmapRenderer(scope, elem, attrs, ctrl) {
        this.scope = scope;
        this.elem = elem;
        this.ctrl = ctrl;
        // $heatmap is JQuery object, but heatmap is D3
        this.$heatmap = this.elem.find('.heatmap-panel');
        this.tooltip = new HeatmapTooltip(this.$heatmap, this.scope);
        this.selection = {
            active: false,
            x1: -1,
            x2: -1,
        };
        this.padding = { left: 0, right: 0, top: 0, bottom: 0 };
        this.margin = { left: 25, right: 15, top: 10, bottom: 20 };
        this.dataRangeWidingFactor = DATA_RANGE_WIDING_FACTOR;
        this.ctrl.events.on('render', this.onRender.bind(this));
        this.ctrl.tickValueFormatter = this.tickValueFormatter.bind(this);
        /////////////////////////////
        // Selection and crosshair //
        /////////////////////////////
        // Shared crosshair and tooltip
        appEvents.on('graph-hover', this.onGraphHover.bind(this), this.scope);
        appEvents.on('graph-hover-clear', this.onGraphHoverClear.bind(this), this.scope);
        // Register selection listeners
        this.$heatmap.on('mousedown', this.onMouseDown.bind(this));
        this.$heatmap.on('mousemove', this.onMouseMove.bind(this));
        this.$heatmap.on('mouseleave', this.onMouseLeave.bind(this));
    }
    HeatmapRenderer.prototype.onGraphHoverClear = function () {
        this.clearCrosshair();
    };
    HeatmapRenderer.prototype.onGraphHover = function (event) {
        this.drawSharedCrosshair(event.pos);
    };
    HeatmapRenderer.prototype.onRender = function () {
        this.render();
        this.ctrl.renderingCompleted();
    };
    HeatmapRenderer.prototype.setElementHeight = function () {
        try {
            var height = this.ctrl.height || this.panel.height || this.ctrl.row.height;
            if (_.isString(height)) {
                height = parseInt(height.replace('px', ''), 10);
            }
            height -= this.panel.legend.show ? 28 : 11; // bottom padding and space for legend
            this.$heatmap.css('height', height + 'px');
            return true;
        }
        catch (e) {
            // IE throws errors sometimes
            return false;
        }
    };
    HeatmapRenderer.prototype.getYAxisWidth = function (elem) {
        var axisText = elem.selectAll('.axis-y text').nodes();
        var maxTextWidth = _.max(_.map(axisText, function (text) {
            // Use SVG getBBox method
            return text.getBBox().width;
        }));
        return maxTextWidth;
    };
    HeatmapRenderer.prototype.getXAxisHeight = function (elem) {
        var axisLine = elem.select('.axis-x line');
        if (!axisLine.empty()) {
            var axisLinePosition = parseFloat(elem.select('.axis-x line').attr('y2'));
            var canvasWidth = parseFloat(elem.attr('height'));
            return canvasWidth - axisLinePosition;
        }
        else {
            // Default height
            return 30;
        }
    };
    HeatmapRenderer.prototype.addXAxis = function () {
        this.scope.xScale = this.xScale = d3
            .scaleTime()
            .domain([this.timeRange.from, this.timeRange.to])
            .range([0, this.chartWidth]);
        var ticks = this.chartWidth / DEFAULT_X_TICK_SIZE_PX;
        var grafanaTimeFormatter = ticksUtils.grafanaTimeFormat(ticks, this.timeRange.from, this.timeRange.to);
        var timeFormat;
        var dashboardTimeZone = this.ctrl.dashboard.getTimezone();
        if (dashboardTimeZone === 'utc') {
            timeFormat = d3.utcFormat(grafanaTimeFormatter);
        }
        else {
            timeFormat = d3.timeFormat(grafanaTimeFormatter);
        }
        var xAxis = d3
            .axisBottom(this.xScale)
            .ticks(ticks)
            .tickFormat(timeFormat)
            .tickPadding(X_AXIS_TICK_PADDING)
            .tickSize(this.chartHeight);
        var posY = this.margin.top;
        var posX = this.yAxisWidth;
        this.heatmap
            .append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', 'translate(' + posX + ',' + posY + ')')
            .call(xAxis);
        // Remove horizontal line in the top of axis labels (called domain in d3)
        this.heatmap
            .select('.axis-x')
            .select('.domain')
            .remove();
    };
    HeatmapRenderer.prototype.addYAxis = function () {
        var ticks = Math.ceil(this.chartHeight / DEFAULT_Y_TICK_SIZE_PX);
        var tickInterval = ticksUtils.tickStep(this.data.heatmapStats.min, this.data.heatmapStats.max, ticks);
        var _a = this.wideYAxisRange(this.data.heatmapStats.min, this.data.heatmapStats.max, tickInterval), yMin = _a.yMin, yMax = _a.yMax;
        // Rewrite min and max if it have been set explicitly
        yMin = this.panel.yAxis.min !== null ? this.panel.yAxis.min : yMin;
        yMax = this.panel.yAxis.max !== null ? this.panel.yAxis.max : yMax;
        // Adjust ticks after Y range widening
        tickInterval = ticksUtils.tickStep(yMin, yMax, ticks);
        ticks = Math.ceil((yMax - yMin) / tickInterval);
        var decimalsAuto = ticksUtils.getPrecision(tickInterval);
        var decimals = this.panel.yAxis.decimals === null ? decimalsAuto : this.panel.yAxis.decimals;
        // Calculate scaledDecimals for log scales using tick size (as in jquery.flot.js)
        var flotTickSize = ticksUtils.getFlotTickSize(yMin, yMax, ticks, decimalsAuto);
        var scaledDecimals = ticksUtils.getScaledDecimals(decimals, flotTickSize);
        this.ctrl.decimals = decimals;
        this.ctrl.scaledDecimals = scaledDecimals;
        // Set default Y min and max if no data
        if (_.isEmpty(this.data.buckets)) {
            yMax = 1;
            yMin = -1;
            ticks = 3;
            decimals = 1;
        }
        this.data.yAxis = {
            min: yMin,
            max: yMax,
            ticks: ticks,
        };
        this.scope.yScale = this.yScale = d3
            .scaleLinear()
            .domain([yMin, yMax])
            .range([this.chartHeight, 0]);
        var yAxis = d3
            .axisLeft(this.yScale)
            .ticks(ticks)
            .tickFormat(this.tickValueFormatter(decimals, scaledDecimals))
            .tickSizeInner(0 - this.width)
            .tickSizeOuter(0)
            .tickPadding(Y_AXIS_TICK_PADDING);
        this.heatmap
            .append('g')
            .attr('class', 'axis axis-y')
            .call(yAxis);
        // Calculate Y axis width first, then move axis into visible area
        var posY = this.margin.top;
        var posX = this.getYAxisWidth(this.heatmap) + Y_AXIS_TICK_PADDING;
        this.heatmap.select('.axis-y').attr('transform', 'translate(' + posX + ',' + posY + ')');
        // Remove vertical line in the right of axis labels (called domain in d3)
        this.heatmap
            .select('.axis-y')
            .select('.domain')
            .remove();
    };
    // Wide Y values range and anjust to bucket size
    HeatmapRenderer.prototype.wideYAxisRange = function (min, max, tickInterval) {
        var yWiding = (max * (this.dataRangeWidingFactor - 1) - min * (this.dataRangeWidingFactor - 1)) / 2;
        var yMin, yMax;
        if (tickInterval === 0) {
            yMax = max * this.dataRangeWidingFactor;
            yMin = min - min * (this.dataRangeWidingFactor - 1);
        }
        else {
            yMax = Math.ceil((max + yWiding) / tickInterval) * tickInterval;
            yMin = Math.floor((min - yWiding) / tickInterval) * tickInterval;
        }
        // Don't wide axis below 0 if all values are positive
        if (min >= 0 && yMin < 0) {
            yMin = 0;
        }
        return { yMin: yMin, yMax: yMax };
    };
    HeatmapRenderer.prototype.addLogYAxis = function () {
        var logBase = this.panel.yAxis.logBase;
        var _a = this.adjustLogRange(this.data.heatmapStats.minLog, this.data.heatmapStats.max, logBase), yMin = _a.yMin, yMax = _a.yMax;
        yMin =
            this.panel.yAxis.min && this.panel.yAxis.min !== '0' ? this.adjustLogMin(this.panel.yAxis.min, logBase) : yMin;
        yMax = this.panel.yAxis.max !== null ? this.adjustLogMax(this.panel.yAxis.max, logBase) : yMax;
        // Set default Y min and max if no data
        if (_.isEmpty(this.data.buckets)) {
            yMax = Math.pow(logBase, 2);
            yMin = 1;
        }
        this.scope.yScale = this.yScale = d3
            .scaleLog()
            .base(this.panel.yAxis.logBase)
            .domain([yMin, yMax])
            .range([this.chartHeight, 0]);
        var domain = this.yScale.domain();
        var tickValues = this.logScaleTickValues(domain, logBase);
        var decimalsAuto = ticksUtils.getPrecision(yMin);
        var decimals = this.panel.yAxis.decimals || decimalsAuto;
        // Calculate scaledDecimals for log scales using tick size (as in jquery.flot.js)
        var flotTickSize = ticksUtils.getFlotTickSize(yMin, yMax, tickValues.length, decimalsAuto);
        var scaledDecimals = ticksUtils.getScaledDecimals(decimals, flotTickSize);
        this.ctrl.decimals = decimals;
        this.ctrl.scaledDecimals = scaledDecimals;
        this.data.yAxis = {
            min: yMin,
            max: yMax,
            ticks: tickValues.length,
        };
        var yAxis = d3
            .axisLeft(this.yScale)
            .tickValues(tickValues)
            .tickFormat(this.tickValueFormatter(decimals, scaledDecimals))
            .tickSizeInner(0 - this.width)
            .tickSizeOuter(0)
            .tickPadding(Y_AXIS_TICK_PADDING);
        this.heatmap
            .append('g')
            .attr('class', 'axis axis-y')
            .call(yAxis);
        // Calculate Y axis width first, then move axis into visible area
        var posY = this.margin.top;
        var posX = this.getYAxisWidth(this.heatmap) + Y_AXIS_TICK_PADDING;
        this.heatmap.select('.axis-y').attr('transform', 'translate(' + posX + ',' + posY + ')');
        // Set first tick as pseudo 0
        if (yMin < 1) {
            this.heatmap
                .select('.axis-y')
                .select('.tick text')
                .text('0');
        }
        // Remove vertical line in the right of axis labels (called domain in d3)
        this.heatmap
            .select('.axis-y')
            .select('.domain')
            .remove();
    };
    HeatmapRenderer.prototype.addYAxisFromBuckets = function () {
        var tsBuckets = this.data.tsBuckets;
        this.scope.yScale = this.yScale = d3
            .scaleLinear()
            .domain([0, tsBuckets.length - 1])
            .range([this.chartHeight, 0]);
        var tickValues = _.map(tsBuckets, function (b, i) { return i; });
        var decimalsAuto = _.max(_.map(tsBuckets, ticksUtils.getStringPrecision));
        var decimals = this.panel.yAxis.decimals === null ? decimalsAuto : this.panel.yAxis.decimals;
        this.ctrl.decimals = decimals;
        var tickValueFormatter = this.tickValueFormatter.bind(this);
        function tickFormatter(valIndex) {
            var valueFormatted = tsBuckets[valIndex];
            if (!_.isNaN(_.toNumber(valueFormatted)) && valueFormatted !== '') {
                // Try to format numeric tick labels
                valueFormatted = tickValueFormatter(decimals)(_.toNumber(valueFormatted));
            }
            return valueFormatted;
        }
        var tsBucketsFormatted = _.map(tsBuckets, function (v, i) { return tickFormatter(i); });
        this.data.tsBucketsFormatted = tsBucketsFormatted;
        var yAxis = d3
            .axisLeft(this.yScale)
            .tickValues(tickValues)
            .tickFormat(tickFormatter)
            .tickSizeInner(0 - this.width)
            .tickSizeOuter(0)
            .tickPadding(Y_AXIS_TICK_PADDING);
        this.heatmap
            .append('g')
            .attr('class', 'axis axis-y')
            .call(yAxis);
        // Calculate Y axis width first, then move axis into visible area
        var posY = this.margin.top;
        var posX = this.getYAxisWidth(this.heatmap) + Y_AXIS_TICK_PADDING;
        this.heatmap.select('.axis-y').attr('transform', 'translate(' + posX + ',' + posY + ')');
        if (this.panel.yBucketBound === 'middle' && tickValues && tickValues.length) {
            // Shift Y axis labels to the middle of bucket
            var tickShift = 0 - this.chartHeight / (tickValues.length - 1) / 2;
            this.heatmap.selectAll('.axis-y text').attr('transform', 'translate(' + 0 + ',' + tickShift + ')');
        }
        // Remove vertical line in the right of axis labels (called domain in d3)
        this.heatmap
            .select('.axis-y')
            .select('.domain')
            .remove();
    };
    // Adjust data range to log base
    HeatmapRenderer.prototype.adjustLogRange = function (min, max, logBase) {
        var yMin = this.data.heatmapStats.minLog;
        if (this.data.heatmapStats.minLog > 1 || !this.data.heatmapStats.minLog) {
            yMin = 1;
        }
        else {
            yMin = this.adjustLogMin(this.data.heatmapStats.minLog, logBase);
        }
        // Adjust max Y value to log base
        var yMax = this.adjustLogMax(this.data.heatmapStats.max, logBase);
        return { yMin: yMin, yMax: yMax };
    };
    HeatmapRenderer.prototype.adjustLogMax = function (max, base) {
        return Math.pow(base, Math.ceil(ticksUtils.logp(max, base)));
    };
    HeatmapRenderer.prototype.adjustLogMin = function (min, base) {
        return Math.pow(base, Math.floor(ticksUtils.logp(min, base)));
    };
    HeatmapRenderer.prototype.logScaleTickValues = function (domain, base) {
        var domainMin = domain[0];
        var domainMax = domain[1];
        var tickValues = [];
        if (domainMin < 1) {
            var underOneTicks = Math.floor(ticksUtils.logp(domainMin, base));
            for (var i = underOneTicks; i < 0; i++) {
                var tickValue = Math.pow(base, i);
                tickValues.push(tickValue);
            }
        }
        var ticks = Math.ceil(ticksUtils.logp(domainMax, base));
        for (var i = 0; i <= ticks; i++) {
            var tickValue = Math.pow(base, i);
            tickValues.push(tickValue);
        }
        return tickValues;
    };
    HeatmapRenderer.prototype.tickValueFormatter = function (decimals, scaledDecimals) {
        if (scaledDecimals === void 0) { scaledDecimals = null; }
        var format = this.panel.yAxis.format;
        return function (value) {
            try {
                return format !== 'none' ? getValueFormat(format)(value, decimals, scaledDecimals) : value;
            }
            catch (err) {
                console.error(err.message || err);
                return value;
            }
        };
    };
    HeatmapRenderer.prototype.fixYAxisTickSize = function () {
        this.heatmap
            .select('.axis-y')
            .selectAll('.tick line')
            .attr('x2', this.chartWidth);
    };
    HeatmapRenderer.prototype.addAxes = function () {
        this.chartHeight = this.height - this.margin.top - this.margin.bottom;
        this.chartTop = this.margin.top;
        this.chartBottom = this.chartTop + this.chartHeight;
        if (this.panel.dataFormat === 'tsbuckets') {
            this.addYAxisFromBuckets();
        }
        else {
            if (this.panel.yAxis.logBase === 1) {
                this.addYAxis();
            }
            else {
                this.addLogYAxis();
            }
        }
        this.yAxisWidth = this.getYAxisWidth(this.heatmap) + Y_AXIS_TICK_PADDING;
        this.chartWidth = this.width - this.yAxisWidth - this.margin.right;
        this.fixYAxisTickSize();
        this.addXAxis();
        this.xAxisHeight = this.getXAxisHeight(this.heatmap);
        if (!this.panel.yAxis.show) {
            this.heatmap
                .select('.axis-y')
                .selectAll('line')
                .style('opacity', 0);
        }
        if (!this.panel.xAxis.show) {
            this.heatmap
                .select('.axis-x')
                .selectAll('line')
                .style('opacity', 0);
        }
    };
    HeatmapRenderer.prototype.addHeatmapCanvas = function () {
        var heatmapElem = this.$heatmap[0];
        this.width = Math.floor(this.$heatmap.width()) - this.padding.right;
        this.height = Math.floor(this.$heatmap.height()) - this.padding.bottom;
        this.cardPadding = this.panel.cards.cardPadding !== null ? this.panel.cards.cardPadding : CARD_PADDING;
        this.cardRound = this.panel.cards.cardRound !== null ? this.panel.cards.cardRound : CARD_ROUND;
        if (this.heatmap) {
            this.heatmap.remove();
        }
        this.heatmap = d3
            .select(heatmapElem)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
    };
    HeatmapRenderer.prototype.addHeatmap = function () {
        var _this = this;
        this.addHeatmapCanvas();
        this.addAxes();
        if (this.panel.yAxis.logBase !== 1 && this.panel.dataFormat !== 'tsbuckets') {
            var logBase = this.panel.yAxis.logBase;
            var domain = this.yScale.domain();
            var tickValues = this.logScaleTickValues(domain, logBase);
            this.data.buckets = mergeZeroBuckets(this.data.buckets, _.min(tickValues));
        }
        var cardsData = this.data.cards;
        var cardStats = this.data.cardStats;
        var maxValueAuto = cardStats.max;
        var minValueAuto = Math.min(cardStats.min, 0);
        var maxValue = _.isNil(this.panel.color.max) ? maxValueAuto : this.panel.color.max;
        var minValue = _.isNil(this.panel.color.min) ? minValueAuto : this.panel.color.min;
        var colorScheme = _.find(this.ctrl.colorSchemes, {
            value: this.panel.color.colorScheme,
        });
        this.colorScale = getColorScale(colorScheme, contextSrv.user.lightTheme, maxValue, minValue);
        this.opacityScale = getOpacityScale(this.panel.color, maxValue, minValue);
        this.setCardSize();
        var cards = this.heatmap.selectAll('.heatmap-card').data(cardsData);
        cards.append('title');
        cards = cards
            .enter()
            .append('rect')
            .attr('x', this.getCardX.bind(this))
            .attr('width', this.getCardWidth.bind(this))
            .attr('y', this.getCardY.bind(this))
            .attr('height', this.getCardHeight.bind(this))
            .attr('rx', this.cardRound)
            .attr('ry', this.cardRound)
            .attr('class', 'bordered heatmap-card')
            .style('fill', this.getCardColor.bind(this))
            .style('stroke', this.getCardColor.bind(this))
            .style('stroke-width', 0)
            .style('opacity', this.getCardOpacity.bind(this));
        var $cards = this.$heatmap.find('.heatmap-card');
        $cards
            .on('mouseenter', function (event) {
            _this.tooltip.mouseOverBucket = true;
            _this.highlightCard(event);
        })
            .on('mouseleave', function (event) {
            _this.tooltip.mouseOverBucket = false;
            _this.resetCardHighLight(event);
        });
    };
    HeatmapRenderer.prototype.highlightCard = function (event) {
        var color = d3.select(event.target).style('fill');
        var highlightColor = d3.color(color).darker(2);
        var strokeColor = d3.color(color).brighter(4);
        var currentCard = d3.select(event.target);
        this.tooltip.originalFillColor = color;
        currentCard
            .style('fill', highlightColor.toString())
            .style('stroke', strokeColor.toString())
            .style('stroke-width', 1);
    };
    HeatmapRenderer.prototype.resetCardHighLight = function (event) {
        d3.select(event.target)
            .style('fill', this.tooltip.originalFillColor)
            .style('stroke', this.tooltip.originalFillColor)
            .style('stroke-width', 0);
    };
    HeatmapRenderer.prototype.setCardSize = function () {
        var xGridSize = Math.floor(this.xScale(this.data.xBucketSize) - this.xScale(0));
        var yGridSize = Math.floor(this.yScale(this.yScale.invert(0) - this.data.yBucketSize));
        if (this.panel.yAxis.logBase !== 1) {
            var base = this.panel.yAxis.logBase;
            var splitFactor = this.data.yBucketSize || 1;
            yGridSize = Math.floor((this.yScale(1) - this.yScale(base)) / splitFactor);
        }
        var cardWidth = xGridSize - this.cardPadding * 2;
        this.cardWidth = Math.max(cardWidth, MIN_CARD_SIZE);
        this.cardHeight = yGridSize ? yGridSize - this.cardPadding * 2 : 0;
    };
    HeatmapRenderer.prototype.getCardX = function (d) {
        var x;
        if (this.xScale(d.x) < 0) {
            // Cut card left to prevent overlay
            x = this.yAxisWidth + this.cardPadding;
        }
        else {
            x = this.xScale(d.x) + this.yAxisWidth + this.cardPadding;
        }
        return x;
    };
    HeatmapRenderer.prototype.getCardWidth = function (d) {
        var w = this.cardWidth;
        if (this.xScale(d.x) < 0) {
            // Cut card left to prevent overlay
            w = this.xScale(d.x) + this.cardWidth;
        }
        else if (this.xScale(d.x) + this.cardWidth > this.chartWidth) {
            // Cut card right to prevent overlay
            w = this.chartWidth - this.xScale(d.x) - this.cardPadding;
        }
        // Card width should be MIN_CARD_SIZE at least, but cut cards shouldn't be displayed
        w = w > 0 ? Math.max(w, MIN_CARD_SIZE) : 0;
        return w;
    };
    HeatmapRenderer.prototype.getCardY = function (d) {
        var y = this.yScale(d.y) + this.chartTop - this.cardHeight - this.cardPadding;
        if (this.panel.yAxis.logBase !== 1 && d.y === 0) {
            y = this.chartBottom - this.cardHeight - this.cardPadding;
        }
        else {
            if (y < this.chartTop) {
                y = this.chartTop;
            }
        }
        return y;
    };
    HeatmapRenderer.prototype.getCardHeight = function (d) {
        var y = this.yScale(d.y) + this.chartTop - this.cardHeight - this.cardPadding;
        var h = this.cardHeight;
        if (this.panel.yAxis.logBase !== 1 && d.y === 0) {
            return this.cardHeight;
        }
        // Cut card height to prevent overlay
        if (y < this.chartTop) {
            h = this.yScale(d.y) - this.cardPadding;
        }
        else if (this.yScale(d.y) > this.chartBottom) {
            h = this.chartBottom - y;
        }
        else if (y + this.cardHeight > this.chartBottom) {
            h = this.chartBottom - y;
        }
        // Height can't be more than chart height
        h = Math.min(h, this.chartHeight);
        // Card height should be MIN_CARD_SIZE at least
        h = Math.max(h, MIN_CARD_SIZE);
        return h;
    };
    HeatmapRenderer.prototype.getCardColor = function (d) {
        if (this.panel.color.mode === 'opacity') {
            return getColorFromHexRgbOrName(this.panel.color.cardColor, contextSrv.user.lightTheme ? GrafanaThemeType.Light : GrafanaThemeType.Dark);
        }
        else {
            return this.colorScale(d.count);
        }
    };
    HeatmapRenderer.prototype.getCardOpacity = function (d) {
        if (this.panel.color.mode === 'opacity') {
            return this.opacityScale(d.count);
        }
        else {
            return 1;
        }
    };
    HeatmapRenderer.prototype.getEventOffset = function (event) {
        var elemOffset = this.$heatmap.offset();
        var x = Math.floor(event.clientX - elemOffset.left);
        var y = Math.floor(event.clientY - elemOffset.top);
        return { x: x, y: y };
    };
    HeatmapRenderer.prototype.onMouseDown = function (event) {
        var _this = this;
        var offset = this.getEventOffset(event);
        this.selection.active = true;
        this.selection.x1 = offset.x;
        this.mouseUpHandler = function () {
            _this.onMouseUp();
        };
        $(document).one('mouseup', this.mouseUpHandler.bind(this));
    };
    HeatmapRenderer.prototype.onMouseUp = function () {
        $(document).unbind('mouseup', this.mouseUpHandler.bind(this));
        this.mouseUpHandler = null;
        this.selection.active = false;
        var selectionRange = Math.abs(this.selection.x2 - this.selection.x1);
        if (this.selection.x2 >= 0 && selectionRange > MIN_SELECTION_WIDTH) {
            var timeFrom = this.xScale.invert(Math.min(this.selection.x1, this.selection.x2) - this.yAxisWidth);
            var timeTo = this.xScale.invert(Math.max(this.selection.x1, this.selection.x2) - this.yAxisWidth);
            this.ctrl.timeSrv.setTime({
                from: toUtc(timeFrom),
                to: toUtc(timeTo),
            });
        }
        this.clearSelection();
    };
    HeatmapRenderer.prototype.onMouseLeave = function () {
        appEvents.emit('graph-hover-clear');
        this.clearCrosshair();
    };
    HeatmapRenderer.prototype.onMouseMove = function (event) {
        if (!this.heatmap) {
            return;
        }
        var offset = this.getEventOffset(event);
        if (this.selection.active) {
            // Clear crosshair and tooltip
            this.clearCrosshair();
            this.tooltip.destroy();
            this.selection.x2 = this.limitSelection(offset.x);
            this.drawSelection(this.selection.x1, this.selection.x2);
        }
        else {
            var pos = this.getEventPos(event, offset);
            this.drawCrosshair(offset.x);
            this.tooltip.show(pos, this.data);
            this.emitGraphHoverEvent(pos);
        }
    };
    HeatmapRenderer.prototype.getEventPos = function (event, offset) {
        var x = this.xScale.invert(offset.x - this.yAxisWidth).valueOf();
        var y = this.yScale.invert(offset.y - this.chartTop);
        var pos = {
            pageX: event.pageX,
            pageY: event.pageY,
            x: x,
            x1: x,
            y: y,
            y1: y,
            panelRelY: null,
            offset: offset,
        };
        return pos;
    };
    HeatmapRenderer.prototype.emitGraphHoverEvent = function (pos) {
        // Set minimum offset to prevent showing legend from another panel
        pos.panelRelY = Math.max(pos.offset.y / this.height, 0.001);
        // broadcast to other graph panels that we are hovering
        appEvents.emit('graph-hover', { pos: pos, panel: this.panel });
    };
    HeatmapRenderer.prototype.limitSelection = function (x2) {
        x2 = Math.max(x2, this.yAxisWidth);
        x2 = Math.min(x2, this.chartWidth + this.yAxisWidth);
        return x2;
    };
    HeatmapRenderer.prototype.drawSelection = function (posX1, posX2) {
        if (this.heatmap) {
            this.heatmap.selectAll('.heatmap-selection').remove();
            var selectionX = Math.min(posX1, posX2);
            var selectionWidth = Math.abs(posX1 - posX2);
            if (selectionWidth > MIN_SELECTION_WIDTH) {
                this.heatmap
                    .append('rect')
                    .attr('class', 'heatmap-selection')
                    .attr('x', selectionX)
                    .attr('width', selectionWidth)
                    .attr('y', this.chartTop)
                    .attr('height', this.chartHeight);
            }
        }
    };
    HeatmapRenderer.prototype.clearSelection = function () {
        this.selection.x1 = -1;
        this.selection.x2 = -1;
        if (this.heatmap) {
            this.heatmap.selectAll('.heatmap-selection').remove();
        }
    };
    HeatmapRenderer.prototype.drawCrosshair = function (position) {
        if (this.heatmap) {
            this.heatmap.selectAll('.heatmap-crosshair').remove();
            var posX = position;
            posX = Math.max(posX, this.yAxisWidth);
            posX = Math.min(posX, this.chartWidth + this.yAxisWidth);
            this.heatmap
                .append('g')
                .attr('class', 'heatmap-crosshair')
                .attr('transform', 'translate(' + posX + ',0)')
                .append('line')
                .attr('x1', 1)
                .attr('y1', this.chartTop)
                .attr('x2', 1)
                .attr('y2', this.chartBottom)
                .attr('stroke-width', 1);
        }
    };
    HeatmapRenderer.prototype.drawSharedCrosshair = function (pos) {
        if (this.heatmap && this.ctrl.dashboard.graphTooltip !== 0) {
            var posX = this.xScale(pos.x) + this.yAxisWidth;
            this.drawCrosshair(posX);
        }
    };
    HeatmapRenderer.prototype.clearCrosshair = function () {
        if (this.heatmap) {
            this.heatmap.selectAll('.heatmap-crosshair').remove();
        }
    };
    HeatmapRenderer.prototype.render = function () {
        this.data = this.ctrl.data;
        this.panel = this.ctrl.panel;
        this.timeRange = this.ctrl.range;
        if (!this.setElementHeight() || !this.data) {
            return;
        }
        // Draw default axes and return if no data
        if (_.isEmpty(this.data.buckets)) {
            this.addHeatmapCanvas();
            this.addAxes();
            return;
        }
        this.addHeatmap();
        this.scope.yAxisWidth = this.yAxisWidth;
        this.scope.xAxisHeight = this.xAxisHeight;
        this.scope.chartHeight = this.chartHeight;
        this.scope.chartWidth = this.chartWidth;
        this.scope.chartTop = this.chartTop;
    };
    return HeatmapRenderer;
}());
export { HeatmapRenderer };
//# sourceMappingURL=rendering.js.map
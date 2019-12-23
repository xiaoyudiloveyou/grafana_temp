import { __assign, __read, __spread } from "tslib";
import _ from 'lodash';
import templateSrv from 'app/features/templating/template_srv';
import coreModule from 'app/core/core_module';
import { appendQueryToUrl, toUrlParams } from 'app/core/utils/url';
import { VariableOrigin, DataLinkBuiltInVars } from '@grafana/ui';
import { deprecationWarning } from '@grafana/data';
var timeRangeVars = [
    {
        value: "" + DataLinkBuiltInVars.keepTime,
        label: 'Time range',
        documentation: 'Adds current time range',
        origin: VariableOrigin.BuiltIn,
    },
    {
        value: "" + DataLinkBuiltInVars.timeRangeFrom,
        label: 'Time range: from',
        documentation: "Adds current time range's from value",
        origin: VariableOrigin.BuiltIn,
    },
    {
        value: "" + DataLinkBuiltInVars.timeRangeTo,
        label: 'Time range: to',
        documentation: "Adds current time range's to value",
        origin: VariableOrigin.BuiltIn,
    },
];
var fieldVars = [
    {
        value: "" + DataLinkBuiltInVars.fieldName,
        label: 'Name',
        documentation: 'Field name of the clicked datapoint (in ms epoch)',
        origin: VariableOrigin.Field,
    },
];
var valueVars = [
    {
        value: "" + DataLinkBuiltInVars.valueNumeric,
        label: 'Numeric',
        documentation: 'Numeric representation of selected value',
        origin: VariableOrigin.Value,
    },
    {
        value: "" + DataLinkBuiltInVars.valueText,
        label: 'Text',
        documentation: 'Text representation of selected value',
        origin: VariableOrigin.Value,
    },
    {
        value: "" + DataLinkBuiltInVars.valueRaw,
        label: 'Raw',
        documentation: 'Raw value',
        origin: VariableOrigin.Value,
    },
];
var buildLabelPath = function (label) {
    return label.indexOf('.') > -1 ? "[\"" + label + "\"]" : "." + label;
};
export var getPanelLinksVariableSuggestions = function () { return __spread(templateSrv.variables.map(function (variable) { return ({
    value: variable.name,
    label: variable.name,
    origin: VariableOrigin.Template,
}); }), [
    {
        value: "" + DataLinkBuiltInVars.includeVars,
        label: 'All variables',
        documentation: 'Adds current variables',
        origin: VariableOrigin.Template,
    }
], timeRangeVars); };
var getSeriesVars = function (dataFrames) {
    var labels = _.chain(dataFrames.map(function (df) { return Object.keys(df.labels || {}); }))
        .flatten()
        .uniq()
        .value();
    return __spread([
        {
            value: "" + DataLinkBuiltInVars.seriesName,
            label: 'Name',
            documentation: 'Name of the series',
            origin: VariableOrigin.Series,
        }
    ], labels.map(function (label) { return ({
        value: "__series.labels" + buildLabelPath(label),
        label: "labels." + label,
        documentation: label + " label value",
        origin: VariableOrigin.Series,
    }); }));
};
export var getDataLinksVariableSuggestions = function (dataFrames) {
    var seriesVars = getSeriesVars(dataFrames);
    var valueTimeVar = {
        value: "" + DataLinkBuiltInVars.valueTime,
        label: 'Time',
        documentation: 'Time value of the clicked datapoint (in ms epoch)',
        origin: VariableOrigin.Value,
    };
    return __spread(seriesVars, fieldVars, valueVars, [valueTimeVar], getPanelLinksVariableSuggestions());
};
export var getCalculationValueDataLinksVariableSuggestions = function (dataFrames) {
    var seriesVars = getSeriesVars(dataFrames);
    var valueCalcVar = {
        value: "" + DataLinkBuiltInVars.valueCalc,
        label: 'Calculation name',
        documentation: 'Name of the calculation the value is a result of',
        origin: VariableOrigin.Value,
    };
    return __spread(seriesVars, fieldVars, valueVars, [valueCalcVar], getPanelLinksVariableSuggestions());
};
var LinkSrv = /** @class */ (function () {
    /** @ngInject */
    function LinkSrv(templateSrv, timeSrv) {
        var _this = this;
        this.templateSrv = templateSrv;
        this.timeSrv = timeSrv;
        this.getDataLinkUIModel = function (link, scopedVars, origin) {
            var _a;
            var params = {};
            var timeRangeUrl = toUrlParams(_this.timeSrv.timeRangeForUrl());
            var info = {
                href: link.url.replace(/\s|\n/g, ''),
                title: _this.templateSrv.replace(link.title || '', scopedVars),
                target: link.targetBlank ? '_blank' : '_self',
                origin: origin,
            };
            _this.templateSrv.fillVariableValuesForUrl(params, scopedVars);
            var variablesQuery = toUrlParams(params);
            info.href = _this.templateSrv.replace(info.href, __assign(__assign({}, scopedVars), (_a = {}, _a[DataLinkBuiltInVars.keepTime] = {
                text: timeRangeUrl,
                value: timeRangeUrl,
            }, _a[DataLinkBuiltInVars.includeVars] = {
                text: variablesQuery,
                value: variablesQuery,
            }, _a)));
            return info;
        };
    }
    LinkSrv.prototype.getLinkUrl = function (link) {
        var url = this.templateSrv.replace(link.url || '');
        var params = {};
        if (link.keepTime) {
            var range = this.timeSrv.timeRangeForUrl();
            params['from'] = range.from;
            params['to'] = range.to;
        }
        if (link.includeVars) {
            this.templateSrv.fillVariableValuesForUrl(params);
        }
        return appendQueryToUrl(url, toUrlParams(params));
    };
    LinkSrv.prototype.getAnchorInfo = function (link) {
        var info = {};
        info.href = this.getLinkUrl(link);
        info.title = this.templateSrv.replace(link.title || '');
        return info;
    };
    /**
     * getPanelLinkAnchorInfo method is left for plugins compatibility reasons
     *
     * @deprecated Drilldown links should be generated using getDataLinkUIModel method
     */
    LinkSrv.prototype.getPanelLinkAnchorInfo = function (link, scopedVars) {
        deprecationWarning('link_srv.ts', 'getPanelLinkAnchorInfo', 'getDataLinkUIModel');
        return this.getDataLinkUIModel(link, scopedVars, {});
    };
    return LinkSrv;
}());
export { LinkSrv };
var singleton;
export function setLinkSrv(srv) {
    singleton = srv;
}
export function getLinkSrv() {
    return singleton;
}
coreModule.service('linkSrv', LinkSrv);
//# sourceMappingURL=link_srv.js.map
import * as tslib_1 from "tslib";
var AzureMonitorAnnotationsQueryCtrl = /** @class */ (function () {
    /** @ngInject */
    function AzureMonitorAnnotationsQueryCtrl(templateSrv) {
        var _this = this;
        this.templateSrv = templateSrv;
        this.defaultQuery = '<your table>\n| where $__timeFilter() \n| project TimeGenerated, Text=YourTitleColumn, Tags="tag1,tag2"';
        this.getAzureLogAnalyticsSchema = function () {
            return _this.getWorkspaces()
                .then(function () {
                return _this.datasource.azureLogAnalyticsDatasource.getSchema(_this.annotation.workspace);
            })
                .catch(function () { });
        };
        this.onSubscriptionChange = function () {
            _this.getWorkspaces(true);
        };
        this.onLogAnalyticsQueryChange = function (nextQuery) {
            _this.annotation.rawQuery = nextQuery;
        };
        this.annotation.queryType = this.annotation.queryType || 'Azure Log Analytics';
        this.annotation.rawQuery = this.annotation.rawQuery || this.defaultQuery;
        this.initDropdowns();
    }
    AzureMonitorAnnotationsQueryCtrl.prototype.initDropdowns = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSubscriptions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getWorkspaces()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AzureMonitorAnnotationsQueryCtrl.prototype.getSubscriptions = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!this.datasource.azureMonitorDatasource.isConfigured()) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, this.datasource.azureMonitorDatasource.getSubscriptions().then(function (subs) {
                        _this.subscriptions = subs;
                        if (!_this.annotation.subscription && _this.annotation.queryType === 'Azure Log Analytics') {
                            _this.annotation.subscription = _this.datasource.azureLogAnalyticsDatasource.subscriptionId;
                        }
                        if (!_this.annotation.subscription && _this.subscriptions.length > 0) {
                            _this.annotation.subscription = _this.subscriptions[0].value;
                        }
                    })];
            });
        });
    };
    AzureMonitorAnnotationsQueryCtrl.prototype.getWorkspaces = function (bustCache) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!bustCache && this.workspaces && this.workspaces.length > 0) {
                    return [2 /*return*/, this.workspaces];
                }
                return [2 /*return*/, this.datasource
                        .getAzureLogAnalyticsWorkspaces(this.annotation.subscription)
                        .then(function (list) {
                        _this.workspaces = list;
                        if (list.length > 0 && !_this.annotation.workspace) {
                            _this.annotation.workspace = list[0].value;
                        }
                        return _this.workspaces;
                    })
                        .catch(function () { })];
            });
        });
    };
    Object.defineProperty(AzureMonitorAnnotationsQueryCtrl.prototype, "templateVariables", {
        get: function () {
            return this.templateSrv.variables.map(function (t) { return '$' + t.name; });
        },
        enumerable: true,
        configurable: true
    });
    AzureMonitorAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return AzureMonitorAnnotationsQueryCtrl;
}());
export { AzureMonitorAnnotationsQueryCtrl };
//# sourceMappingURL=annotations_query_ctrl.js.map
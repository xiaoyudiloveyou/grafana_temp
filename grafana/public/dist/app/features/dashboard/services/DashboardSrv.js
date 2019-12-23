import { __assign, __values } from "tslib";
import coreModule from 'app/core/core_module';
import { appEvents } from 'app/core/app_events';
import locationUtil from 'app/core/utils/location_util';
import { DashboardModel } from '../state/DashboardModel';
import { removePanel } from '../utils/panel';
var DashboardSrv = /** @class */ (function () {
    /** @ngInject */
    function DashboardSrv(backendSrv, $rootScope, $location) {
        var _this = this;
        this.backendSrv = backendSrv;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.onRemovePanel = function (panelId) {
            var dashboard = _this.getCurrent();
            removePanel(dashboard, dashboard.getPanelById(panelId), true);
        };
        this.onPanelChangeView = function (_a) {
            var e_1, _b;
            var _c = _a.fullscreen, fullscreen = _c === void 0 ? false : _c, _d = _a.edit, edit = _d === void 0 ? false : _d, panelId = _a.panelId;
            var urlParams = _this.$location.search();
            // handle toggle logic
            // I hate using these truthy converters (!!) but in this case
            // I think it's appropriate. edit can be null/false/undefined and
            // here i want all of those to compare the same
            if (fullscreen === urlParams.fullscreen && edit === !!urlParams.edit) {
                var paramsToRemove = ['fullscreen', 'edit', 'panelId', 'tab'];
                try {
                    for (var paramsToRemove_1 = __values(paramsToRemove), paramsToRemove_1_1 = paramsToRemove_1.next(); !paramsToRemove_1_1.done; paramsToRemove_1_1 = paramsToRemove_1.next()) {
                        var key = paramsToRemove_1_1.value;
                        delete urlParams[key];
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (paramsToRemove_1_1 && !paramsToRemove_1_1.done && (_b = paramsToRemove_1.return)) _b.call(paramsToRemove_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                _this.$location.search(urlParams);
                return;
            }
            var newUrlParams = __assign(__assign({}, urlParams), { fullscreen: fullscreen || undefined, edit: edit || undefined, tab: edit ? urlParams.tab : undefined, panelId: panelId });
            Object.keys(newUrlParams).forEach(function (key) {
                if (newUrlParams[key] === undefined) {
                    delete newUrlParams[key];
                }
            });
            _this.$location.search(newUrlParams);
        };
        appEvents.on('save-dashboard', this.saveDashboard.bind(this), $rootScope);
        appEvents.on('panel-change-view', this.onPanelChangeView);
        appEvents.on('remove-panel', this.onRemovePanel);
        // Export to react
        setDashboardSrv(this);
    }
    DashboardSrv.prototype.create = function (dashboard, meta) {
        return new DashboardModel(dashboard, meta);
    };
    DashboardSrv.prototype.setCurrent = function (dashboard) {
        this.dashboard = dashboard;
    };
    DashboardSrv.prototype.getCurrent = function () {
        return this.dashboard;
    };
    DashboardSrv.prototype.handleSaveDashboardError = function (clone, options, err) {
        var _this = this;
        options.overwrite = true;
        if (err.data && err.data.status === 'version-mismatch') {
            err.isHandled = true;
            this.$rootScope.appEvent('confirm-modal', {
                title: 'Conflict',
                text: 'Someone else has updated this dashboard.',
                text2: 'Would you still like to save this dashboard?',
                yesText: 'Save & Overwrite',
                icon: 'fa-warning',
                onConfirm: function () {
                    _this.save(clone, options);
                },
            });
        }
        if (err.data && err.data.status === 'name-exists') {
            err.isHandled = true;
            this.$rootScope.appEvent('confirm-modal', {
                title: 'Conflict',
                text: 'A dashboard with the same name in selected folder already exists.',
                text2: 'Would you still like to save this dashboard?',
                yesText: 'Save & Overwrite',
                icon: 'fa-warning',
                onConfirm: function () {
                    _this.save(clone, options);
                },
            });
        }
        if (err.data && err.data.status === 'plugin-dashboard') {
            err.isHandled = true;
            this.$rootScope.appEvent('confirm-modal', {
                title: 'Plugin Dashboard',
                text: err.data.message,
                text2: 'Your changes will be lost when you update the plugin. Use Save As to create custom version.',
                yesText: 'Overwrite',
                icon: 'fa-warning',
                altActionText: 'Save As',
                onAltAction: function () {
                    _this.showSaveAsModal();
                },
                onConfirm: function () {
                    _this.save(clone, __assign(__assign({}, options), { overwrite: true }));
                },
            });
        }
    };
    DashboardSrv.prototype.postSave = function (data) {
        this.dashboard.version = data.version;
        // important that these happen before location redirect below
        this.$rootScope.appEvent('dashboard-saved', this.dashboard);
        this.$rootScope.appEvent('alert-success', ['Dashboard saved']);
        var newUrl = locationUtil.stripBaseFromUrl(data.url);
        var currentPath = this.$location.path();
        if (newUrl !== currentPath) {
            this.$location.url(newUrl).replace();
        }
        return this.dashboard;
    };
    DashboardSrv.prototype.save = function (clone, options) {
        var _this = this;
        options.folderId = options.folderId >= 0 ? options.folderId : this.dashboard.meta.folderId || clone.folderId;
        return this.backendSrv
            .saveDashboard(clone, options)
            .then(function (data) { return _this.postSave(data); })
            .catch(this.handleSaveDashboardError.bind(this, clone, { folderId: options.folderId }));
    };
    DashboardSrv.prototype.saveDashboard = function (clone, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.makeEditable, makeEditable = _c === void 0 ? false : _c, folderId = _b.folderId, _d = _b.overwrite, overwrite = _d === void 0 ? false : _d, message = _b.message;
        if (clone) {
            this.setCurrent(this.create(clone, this.dashboard.meta));
        }
        if (this.dashboard.meta.provisioned) {
            return this.showDashboardProvisionedModal();
        }
        if (!(this.dashboard.meta.canSave || makeEditable)) {
            return Promise.resolve();
        }
        if (this.dashboard.title === 'New dashboard') {
            return this.showSaveAsModal();
        }
        if (this.dashboard.version > 0) {
            return this.showSaveModal();
        }
        return this.save(this.dashboard.getSaveModelClone(), { folderId: folderId, overwrite: overwrite, message: message });
    };
    DashboardSrv.prototype.saveJSONDashboard = function (json) {
        return this.save(JSON.parse(json), {});
    };
    DashboardSrv.prototype.showDashboardProvisionedModal = function () {
        this.$rootScope.appEvent('show-modal', {
            templateHtml: '<save-provisioned-dashboard-modal dismiss="dismiss()"></save-provisioned-dashboard-modal>',
        });
    };
    DashboardSrv.prototype.showSaveAsModal = function () {
        this.$rootScope.appEvent('show-modal', {
            templateHtml: '<save-dashboard-as-modal dismiss="dismiss()"></save-dashboard-as-modal>',
            modalClass: 'modal--narrow',
        });
    };
    DashboardSrv.prototype.showSaveModal = function () {
        this.$rootScope.appEvent('show-modal', {
            templateHtml: '<save-dashboard-modal dismiss="dismiss()"></save-dashboard-modal>',
            modalClass: 'modal--narrow',
        });
    };
    DashboardSrv.prototype.starDashboard = function (dashboardId, isStarred) {
        var _this = this;
        var promise;
        if (isStarred) {
            promise = this.backendSrv.delete('/api/user/stars/dashboard/' + dashboardId).then(function () {
                return false;
            });
        }
        else {
            promise = this.backendSrv.post('/api/user/stars/dashboard/' + dashboardId).then(function () {
                return true;
            });
        }
        return promise.then(function (res) {
            if (_this.dashboard && _this.dashboard.id === dashboardId) {
                _this.dashboard.meta.isStarred = res;
            }
            return res;
        });
    };
    return DashboardSrv;
}());
export { DashboardSrv };
coreModule.service('dashboardSrv', DashboardSrv);
//
// Code below is to export the service to react components
//
var singletonInstance;
export function setDashboardSrv(instance) {
    singletonInstance = instance;
}
export function getDashboardSrv() {
    return singletonInstance;
}
//# sourceMappingURL=DashboardSrv.js.map
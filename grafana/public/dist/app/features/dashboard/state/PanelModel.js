import { __assign, __values } from "tslib";
// Libraries
import _ from 'lodash';
// Utils
import { Emitter } from 'app/core/utils/emitter';
import { getNextRefIdChar } from 'app/core/utils/query';
import config from 'app/core/config';
import { PanelQueryRunner } from './PanelQueryRunner';
var notPersistedProperties = {
    events: true,
    fullscreen: true,
    isEditing: true,
    isInView: true,
    hasRefreshed: true,
    cachedPluginOptions: true,
    plugin: true,
    queryRunner: true,
};
// For angular panels we need to clean up properties when changing type
// To make sure the change happens without strange bugs happening when panels use same
// named property with different type / value expectations
// This is not required for react panels
var mustKeepProps = {
    id: true,
    gridPos: true,
    type: true,
    title: true,
    scopedVars: true,
    repeat: true,
    repeatIteration: true,
    repeatPanelId: true,
    repeatDirection: true,
    repeatedByRow: true,
    minSpan: true,
    collapsed: true,
    panels: true,
    targets: true,
    datasource: true,
    timeFrom: true,
    timeShift: true,
    hideTimeOverride: true,
    description: true,
    links: true,
    fullscreen: true,
    isEditing: true,
    hasRefreshed: true,
    events: true,
    cacheTimeout: true,
    cachedPluginOptions: true,
    transparent: true,
    pluginVersion: true,
    queryRunner: true,
    transformations: true,
};
var defaults = {
    gridPos: { x: 0, y: 0, h: 3, w: 6 },
    targets: [{ refId: 'A' }],
    cachedPluginOptions: {},
    transparent: false,
};
var PanelModel = /** @class */ (function () {
    function PanelModel(model) {
        this.events = new Emitter();
        // should not be part of defaults as defaults are removed in save model and
        // this should not be removed in save model as exporter needs to templatize it
        this.datasource = null;
        // copy properties from persisted model
        for (var property in model) {
            this[property] = model[property];
        }
        // defaults
        _.defaultsDeep(this, _.cloneDeep(defaults));
        // queries must have refId
        this.ensureQueryIds();
    }
    PanelModel.prototype.ensureQueryIds = function () {
        var e_1, _a;
        if (this.targets && _.isArray(this.targets)) {
            try {
                for (var _b = __values(this.targets), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var query = _c.value;
                    if (!query.refId) {
                        query.refId = getNextRefIdChar(this.targets);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    PanelModel.prototype.getOptions = function () {
        return this.options;
    };
    PanelModel.prototype.updateOptions = function (options) {
        this.options = options;
        this.render();
    };
    PanelModel.prototype.getSaveModel = function () {
        var model = {};
        for (var property in this) {
            if (notPersistedProperties[property] || !this.hasOwnProperty(property)) {
                continue;
            }
            if (_.isEqual(this[property], defaults[property])) {
                continue;
            }
            model[property] = _.cloneDeep(this[property]);
        }
        return model;
    };
    PanelModel.prototype.setViewMode = function (fullscreen, isEditing) {
        this.fullscreen = fullscreen;
        this.isEditing = isEditing;
        this.events.emit('view-mode-changed');
    };
    PanelModel.prototype.updateGridPos = function (newPos) {
        var sizeChanged = false;
        if (this.gridPos.w !== newPos.w || this.gridPos.h !== newPos.h) {
            sizeChanged = true;
        }
        this.gridPos.x = newPos.x;
        this.gridPos.y = newPos.y;
        this.gridPos.w = newPos.w;
        this.gridPos.h = newPos.h;
        if (sizeChanged) {
            this.events.emit('panel-size-changed');
        }
    };
    PanelModel.prototype.resizeDone = function () {
        this.events.emit('panel-size-changed');
    };
    PanelModel.prototype.refresh = function () {
        this.hasRefreshed = true;
        this.events.emit('refresh');
    };
    PanelModel.prototype.render = function () {
        if (!this.hasRefreshed) {
            this.refresh();
        }
        else {
            this.events.emit('render');
        }
    };
    PanelModel.prototype.initialized = function () {
        this.events.emit('panel-initialized');
    };
    PanelModel.prototype.getOptionsToRemember = function () {
        var _this = this;
        return Object.keys(this).reduce(function (acc, property) {
            var _a;
            if (notPersistedProperties[property] || mustKeepProps[property]) {
                return acc;
            }
            return __assign(__assign({}, acc), (_a = {}, _a[property] = _this[property], _a));
        }, {});
    };
    PanelModel.prototype.restorePanelOptions = function (pluginId) {
        var _this = this;
        var prevOptions = this.cachedPluginOptions[pluginId] || {};
        Object.keys(prevOptions).map(function (property) {
            _this[property] = prevOptions[property];
        });
    };
    PanelModel.prototype.applyPluginOptionDefaults = function (plugin) {
        if (plugin.angularConfigCtrl) {
            return;
        }
        this.options = _.defaultsDeep({}, this.options || {}, plugin.defaults);
    };
    PanelModel.prototype.pluginLoaded = function (plugin) {
        this.plugin = plugin;
        if (plugin.panel && plugin.onPanelMigration) {
            var version = getPluginVersion(plugin);
            if (version !== this.pluginVersion) {
                this.options = plugin.onPanelMigration(this);
                this.pluginVersion = version;
            }
        }
        this.applyPluginOptionDefaults(plugin);
    };
    PanelModel.prototype.changePlugin = function (newPlugin) {
        var e_2, _a;
        var pluginId = newPlugin.meta.id;
        var oldOptions = this.getOptionsToRemember();
        var oldPluginId = this.type;
        var wasAngular = !!this.plugin.angularPanelCtrl;
        // for angular panels we must remove all events and let angular panels do some cleanup
        if (wasAngular) {
            this.destroy();
        }
        try {
            // remove panel type specific  options
            for (var _b = __values(_.keys(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (mustKeepProps[key]) {
                    continue;
                }
                delete this[key];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.cachedPluginOptions[oldPluginId] = oldOptions;
        this.restorePanelOptions(pluginId);
        // Let panel plugins inspect options from previous panel and keep any that it can use
        if (newPlugin.onPanelTypeChanged) {
            var old = {};
            if (wasAngular) {
                old = { angular: oldOptions };
            }
            else if (oldOptions && oldOptions.options) {
                old = oldOptions.options;
            }
            this.options = this.options || {};
            Object.assign(this.options, newPlugin.onPanelTypeChanged(this.options, oldPluginId, old));
        }
        // switch
        this.type = pluginId;
        this.plugin = newPlugin;
        this.applyPluginOptionDefaults(newPlugin);
        if (newPlugin.onPanelMigration) {
            this.pluginVersion = getPluginVersion(newPlugin);
        }
    };
    PanelModel.prototype.addQuery = function (query) {
        query = query || { refId: 'A' };
        query.refId = getNextRefIdChar(this.targets);
        this.targets.push(query);
    };
    PanelModel.prototype.changeQuery = function (query, index) {
        // ensure refId is maintained
        query.refId = this.targets[index].refId;
        // update query in array
        this.targets = this.targets.map(function (item, itemIndex) {
            if (itemIndex === index) {
                return query;
            }
            return item;
        });
    };
    PanelModel.prototype.getQueryRunner = function () {
        if (!this.queryRunner) {
            this.queryRunner = new PanelQueryRunner();
            this.setTransformations(this.transformations);
        }
        return this.queryRunner;
    };
    PanelModel.prototype.hasTitle = function () {
        return this.title && this.title.length > 0;
    };
    PanelModel.prototype.isAngularPlugin = function () {
        return this.plugin && !!this.plugin.angularPanelCtrl;
    };
    PanelModel.prototype.destroy = function () {
        this.events.emit('panel-teardown');
        this.events.removeAllListeners();
        if (this.queryRunner) {
            this.queryRunner.destroy();
            this.queryRunner = null;
        }
    };
    PanelModel.prototype.setTransformations = function (transformations) {
        this.transformations = transformations;
        this.getQueryRunner().setTransformations(transformations);
    };
    return PanelModel;
}());
export { PanelModel };
function getPluginVersion(plugin) {
    return plugin && plugin.meta.info.version ? plugin.meta.info.version : config.buildInfo.version;
}
//# sourceMappingURL=PanelModel.js.map
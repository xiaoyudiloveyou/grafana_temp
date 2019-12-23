import { __awaiter, __generator, __read, __spread, __values } from "tslib";
import _ from 'lodash';
import { sanitize, escapeHtml } from 'app/core/utils/text';
import { renderMarkdown } from '@grafana/data';
import config from 'app/core/config';
import { profiler } from 'app/core/core';
import getFactors from 'app/core/utils/factors';
import { duplicatePanel, removePanel, copyPanel as copyPanelUtil, editPanelJson as editPanelJsonUtil, sharePanel as sharePanelUtil, calculateInnerPanelHeight, } from 'app/features/dashboard/utils/panel';
import { GRID_COLUMN_COUNT } from 'app/core/constants';
import { getPanelLinksSupplier } from './panellinks/linkSuppliers';
var PanelCtrl = /** @class */ (function () {
    function PanelCtrl($scope, $injector) {
        var _this = this;
        // overriden from react
        this.onPluginTypeChange = function (plugin) { };
        this.$injector = $injector;
        this.$location = $injector.get('$location');
        this.$scope = $scope;
        this.$timeout = $injector.get('$timeout');
        this.editorTabs = [];
        this.events = this.panel.events;
        this.timing = {}; // not used but here to not break plugins
        var plugin = config.panels[this.panel.type];
        if (plugin) {
            this.pluginId = plugin.id;
            this.pluginName = plugin.name;
        }
        $scope.$on('component-did-mount', function () { return _this.panelDidMount(); });
    }
    PanelCtrl.prototype.panelDidMount = function () {
        this.events.emit('component-did-mount');
        this.dashboard.panelInitialized(this.panel);
    };
    PanelCtrl.prototype.renderingCompleted = function () {
        profiler.renderingCompleted();
    };
    PanelCtrl.prototype.refresh = function () {
        this.panel.refresh();
    };
    PanelCtrl.prototype.publishAppEvent = function (evtName, evt) {
        this.$scope.$root.appEvent(evtName, evt);
    };
    PanelCtrl.prototype.changeView = function (fullscreen, edit) {
        this.publishAppEvent('panel-change-view', {
            fullscreen: fullscreen,
            edit: edit,
            panelId: this.panel.id,
        });
    };
    PanelCtrl.prototype.viewPanel = function () {
        this.changeView(true, false);
    };
    PanelCtrl.prototype.editPanel = function () {
        this.changeView(true, true);
    };
    PanelCtrl.prototype.exitFullscreen = function () {
        this.changeView(false, false);
    };
    PanelCtrl.prototype.initEditMode = function () {
        if (!this.editModeInitiated) {
            this.editModeInitiated = true;
            this.events.emit('init-edit-mode', null);
            this.maxPanelsPerRowOptions = getFactors(GRID_COLUMN_COUNT);
        }
    };
    PanelCtrl.prototype.addEditorTab = function (title, directiveFn, index, icon) {
        var editorTab = { title: title, directiveFn: directiveFn, icon: icon };
        if (_.isString(directiveFn)) {
            editorTab.directiveFn = function () {
                return { templateUrl: directiveFn };
            };
        }
        if (index) {
            this.editorTabs.splice(index, 0, editorTab);
        }
        else {
            this.editorTabs.push(editorTab);
        }
    };
    PanelCtrl.prototype.getMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var menu, _a, _b, _c, extendedMenu;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        menu = [];
                        menu.push({
                            text: 'View',
                            click: 'ctrl.viewPanel();',
                            icon: 'gicon gicon-viewer',
                            shortcut: 'v',
                        });
                        if (this.dashboard.meta.canEdit) {
                            menu.push({
                                text: 'Edit',
                                click: 'ctrl.editPanel();',
                                role: 'Editor',
                                icon: 'gicon gicon-editor',
                                shortcut: 'e',
                            });
                        }
                        menu.push({
                            text: 'Share',
                            click: 'ctrl.sharePanel();',
                            icon: 'fa fa-fw fa-share',
                            shortcut: 'p s',
                        });
                        _b = 
                        // Additional items from sub-class
                        (_a = menu.push).apply;
                        _c = [
                            // Additional items from sub-class
                            menu];
                        return [4 /*yield*/, this.getAdditionalMenuItems()];
                    case 1:
                        // Additional items from sub-class
                        _b.apply(_a, _c.concat([__spread.apply(void 0, [(_d.sent())])]));
                        extendedMenu = this.getExtendedMenu();
                        menu.push({
                            text: 'More ...',
                            click: '',
                            icon: 'fa fa-fw fa-cube',
                            submenu: extendedMenu,
                        });
                        if (this.dashboard.meta.canEdit) {
                            menu.push({ divider: true, role: 'Editor' });
                            menu.push({
                                text: 'Remove',
                                click: 'ctrl.removePanel();',
                                role: 'Editor',
                                icon: 'fa fa-fw fa-trash',
                                shortcut: 'p r',
                            });
                        }
                        return [2 /*return*/, menu];
                }
            });
        });
    };
    PanelCtrl.prototype.getExtendedMenu = function () {
        var menu = [];
        if (!this.panel.fullscreen && this.dashboard.meta.canEdit) {
            menu.push({
                text: 'Duplicate',
                click: 'ctrl.duplicate()',
                role: 'Editor',
                shortcut: 'p d',
            });
            menu.push({
                text: 'Copy',
                click: 'ctrl.copyPanel()',
                role: 'Editor',
            });
        }
        menu.push({
            text: 'Panel JSON',
            click: 'ctrl.editPanelJson(); dismiss();',
        });
        this.events.emit('init-panel-actions', menu);
        return menu;
    };
    // Override in sub-class to add items before extended menu
    PanelCtrl.prototype.getAdditionalMenuItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    PanelCtrl.prototype.otherPanelInFullscreenMode = function () {
        return this.dashboard.meta.fullscreen && !this.panel.fullscreen;
    };
    PanelCtrl.prototype.calculatePanelHeight = function (containerHeight) {
        this.containerHeight = containerHeight;
        this.height = calculateInnerPanelHeight(this.panel, containerHeight);
    };
    PanelCtrl.prototype.render = function (payload) {
        this.events.emit('render', payload);
    };
    PanelCtrl.prototype.duplicate = function () {
        duplicatePanel(this.dashboard, this.panel);
    };
    PanelCtrl.prototype.removePanel = function () {
        removePanel(this.dashboard, this.panel, true);
    };
    PanelCtrl.prototype.editPanelJson = function () {
        editPanelJsonUtil(this.dashboard, this.panel);
    };
    PanelCtrl.prototype.copyPanel = function () {
        copyPanelUtil(this.panel);
    };
    PanelCtrl.prototype.sharePanel = function () {
        sharePanelUtil(this.dashboard, this.panel);
    };
    PanelCtrl.prototype.getInfoMode = function () {
        if (this.error) {
            return 'error';
        }
        if (!!this.panel.description) {
            return 'info';
        }
        if (this.panel.links && this.panel.links.length) {
            return 'links';
        }
        return '';
    };
    PanelCtrl.prototype.getInfoContent = function (options) {
        var e_1, _a;
        var panel = this.panel;
        var markdown = panel.description || '';
        if (options.mode === 'tooltip') {
            markdown = this.error || panel.description || '';
        }
        var templateSrv = this.$injector.get('templateSrv');
        var interpolatedMarkdown = templateSrv.replace(markdown, panel.scopedVars);
        var html = '<div class="markdown-html panel-info-content">';
        var md = renderMarkdown(interpolatedMarkdown);
        html += config.disableSanitizeHtml ? md : sanitize(md);
        if (panel.links && panel.links.length > 0) {
            var interpolatedLinks = getPanelLinksSupplier(panel).getLinks();
            html += '<ul class="panel-info-corner-links">';
            try {
                for (var interpolatedLinks_1 = __values(interpolatedLinks), interpolatedLinks_1_1 = interpolatedLinks_1.next(); !interpolatedLinks_1_1.done; interpolatedLinks_1_1 = interpolatedLinks_1.next()) {
                    var link = interpolatedLinks_1_1.value;
                    html +=
                        '<li><a class="panel-menu-link" href="' +
                            escapeHtml(link.href) +
                            '" target="' +
                            escapeHtml(link.target) +
                            '">' +
                            escapeHtml(link.title) +
                            '</a></li>';
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (interpolatedLinks_1_1 && !interpolatedLinks_1_1.done && (_a = interpolatedLinks_1.return)) _a.call(interpolatedLinks_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            html += '</ul>';
        }
        html += '</div>';
        return html;
    };
    return PanelCtrl;
}());
export { PanelCtrl };
//# sourceMappingURL=panel_ctrl.js.map
import * as tslib_1 from "tslib";
import { coreModule } from 'app/core/core';
var template = "\n<span class=\"panel-title\">\n  <span class=\"icon-gf panel-alert-icon\"></span>\n  <span class=\"panel-title-text\">{{ctrl.panel.title | interpolateTemplateVars:this}}</span>\n  <span class=\"panel-menu-container dropdown\">\n    <span class=\"fa fa-caret-down panel-menu-toggle\" data-toggle=\"dropdown\"></span>\n    <ul class=\"dropdown-menu dropdown-menu--menu panel-menu\" role=\"menu\">\n    </ul>\n  </span>\n  <span class=\"panel-time-info\" ng-if=\"ctrl.timeInfo\"><i class=\"fa fa-clock-o\"></i> {{ctrl.timeInfo}}</span>\n</span>";
function renderMenuItem(item, ctrl) {
    var e_1, _a;
    var html = '';
    var listItemClass = '';
    if (item.divider) {
        return '<li class="divider"></li>';
    }
    if (item.submenu) {
        listItemClass = 'dropdown-submenu';
    }
    html += "<li class=\"" + listItemClass + "\"><a ";
    if (item.click) {
        html += " ng-click=\"" + item.click + "\"";
    }
    if (item.href) {
        html += " href=\"" + item.href + "\"";
    }
    html += "><i class=\"" + item.icon + "\"></i>";
    html += "<span class=\"dropdown-item-text\" aria-label=\"" + item.text + " panel menu item\">" + item.text + "</span>";
    if (item.shortcut) {
        html += "<span class=\"dropdown-menu-item-shortcut\">" + item.shortcut + "</span>";
    }
    html += "</a>";
    if (item.submenu) {
        html += '<ul class="dropdown-menu dropdown-menu--menu panel-menu">';
        try {
            for (var _b = tslib_1.__values(item.submenu), _c = _b.next(); !_c.done; _c = _b.next()) {
                var subitem = _c.value;
                html += renderMenuItem(subitem, ctrl);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        html += '</ul>';
    }
    html += "</li>";
    return html;
}
function createMenuTemplate(ctrl) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var html, _a, _b, item, e_2_1;
        var e_2, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    html = '';
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, ctrl.getMenu()];
                case 2:
                    _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                    _d.label = 3;
                case 3:
                    if (!!_b.done) return [3 /*break*/, 5];
                    item = _b.value;
                    html += renderMenuItem(item, ctrl);
                    _d.label = 4;
                case 4:
                    _b = _a.next();
                    return [3 /*break*/, 3];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, html];
            }
        });
    });
}
/** @ngInject */
function panelHeader($compile) {
    var _this = this;
    return {
        restrict: 'E',
        template: template,
        link: function (scope, elem, attrs) {
            var menuElem = elem.find('.panel-menu');
            var menuScope;
            var isDragged;
            elem.click(function (evt) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var targetClass, menuHtml;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            targetClass = evt.target.className;
                            // remove existing scope
                            if (menuScope) {
                                menuScope.$destroy();
                            }
                            menuScope = scope.$new();
                            return [4 /*yield*/, createMenuTemplate(scope.ctrl)];
                        case 1:
                            menuHtml = _a.sent();
                            menuElem.html(menuHtml);
                            $compile(menuElem)(menuScope);
                            if (targetClass.indexOf('panel-title-text') >= 0 || targetClass.indexOf('panel-title') >= 0) {
                                togglePanelMenu(evt);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            function togglePanelMenu(e) {
                if (!isDragged) {
                    e.stopPropagation();
                    elem.find('[data-toggle=dropdown]').dropdown('toggle');
                }
            }
            var mouseX, mouseY;
            elem.mousedown(function (e) {
                mouseX = e.pageX;
                mouseY = e.pageY;
            });
            elem.mouseup(function (e) {
                if (mouseX === e.pageX && mouseY === e.pageY) {
                    isDragged = false;
                }
                else {
                    isDragged = true;
                }
            });
        },
    };
}
coreModule.directive('panelHeader', panelHeader);
//# sourceMappingURL=panel_header.js.map
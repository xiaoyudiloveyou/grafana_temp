import { __awaiter, __generator } from "tslib";
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';
import appEvents from 'app/core/app_events';
var AnnotationsEditorCtrl = /** @class */ (function () {
    /** @ngInject */
    function AnnotationsEditorCtrl($scope, datasourceSrv) {
        var _this = this;
        this.$scope = $scope;
        this.datasourceSrv = datasourceSrv;
        this.annotationDefaults = {
            name: '',
            datasource: null,
            iconColor: 'rgba(255, 96, 96, 1)',
            enable: true,
            showIn: 0,
            hide: false,
        };
        this.emptyListCta = {
            title: 'There are no custom annotation queries added yet',
            buttonIcon: 'gicon gicon-annotation',
            buttonTitle: 'Add Annotation Query',
            infoBox: {
                __html: "<p>Annotations provide a way to integrate event data into your graphs. They are visualized as vertical lines\n    and icons on all graph panels. When you hover over an annotation icon you can get event text &amp; tags for\n    the event. You can add annotation events directly from grafana by holding CTRL or CMD + click on graph (or\n    drag region). These will be stored in Grafana's annotation database.\n  </p>\n  Checkout the\n  <a class='external-link' target='_blank' href='http://docs.grafana.org/reference/annotations/'\n    >Annotations documentation</a\n  >\n  for more information.",
            },
            infoBoxTitle: 'What are annotations?',
        };
        this.showOptions = [{ text: 'All Panels', value: 0 }, { text: 'Specific Panels', value: 1 }];
        this.setupNew = function () {
            _this.mode = 'new';
            _this.reset();
        };
        $scope.ctrl = this;
        this.dashboard = $scope.dashboard;
        this.mode = 'list';
        this.datasources = datasourceSrv.getAnnotationSources();
        this.annotations = this.dashboard.annotations.list;
        this.reset();
        this.onColorChange = this.onColorChange.bind(this);
    }
    AnnotationsEditorCtrl.prototype.datasourceChanged = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newDatasource;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datasourceSrv.get(this.currentAnnotation.datasource)];
                    case 1:
                        newDatasource = _a.sent();
                        this.$scope.$apply(function () {
                            _this.currentDatasource = newDatasource;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    AnnotationsEditorCtrl.prototype.edit = function (annotation) {
        this.currentAnnotation = annotation;
        this.currentAnnotation.showIn = this.currentAnnotation.showIn || 0;
        this.currentIsNew = false;
        this.datasourceChanged();
        this.mode = 'edit';
        $('.tooltip.in').remove();
    };
    AnnotationsEditorCtrl.prototype.reset = function () {
        this.currentAnnotation = angular.copy(this.annotationDefaults);
        this.currentAnnotation.datasource = this.datasources[0].name;
        this.currentIsNew = true;
        this.datasourceChanged();
    };
    AnnotationsEditorCtrl.prototype.update = function () {
        this.reset();
        this.mode = 'list';
    };
    AnnotationsEditorCtrl.prototype.backToList = function () {
        this.mode = 'list';
    };
    AnnotationsEditorCtrl.prototype.move = function (index, dir) {
        // @ts-ignore
        _.move(this.annotations, index, index + dir);
    };
    AnnotationsEditorCtrl.prototype.add = function () {
        var sameName = _.find(this.annotations, { name: this.currentAnnotation.name });
        if (sameName) {
            appEvents.emit('alert-warning', ['Validation', 'Annotations with the same name already exists']);
            return;
        }
        this.annotations.push(this.currentAnnotation);
        this.reset();
        this.mode = 'list';
        this.dashboard.updateSubmenuVisibility();
    };
    AnnotationsEditorCtrl.prototype.removeAnnotation = function (annotation) {
        var index = _.indexOf(this.annotations, annotation);
        this.annotations.splice(index, 1);
        this.dashboard.updateSubmenuVisibility();
    };
    AnnotationsEditorCtrl.prototype.onColorChange = function (newColor) {
        this.currentAnnotation.iconColor = newColor;
    };
    return AnnotationsEditorCtrl;
}());
export { AnnotationsEditorCtrl };
coreModule.controller('AnnotationsEditorCtrl', AnnotationsEditorCtrl);
//# sourceMappingURL=editor_ctrl.js.map
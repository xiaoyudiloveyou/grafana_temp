import angular from 'angular';
import _ from 'lodash';
export var iconMap = {
    'external link': 'fa-external-link',
    dashboard: 'fa-th-large',
    question: 'fa-question',
    info: 'fa-info',
    bolt: 'fa-bolt',
    doc: 'fa-file-text-o',
    cloud: 'fa-cloud',
};
var DashLinksEditorCtrl = /** @class */ (function () {
    /** @ngInject */
    function DashLinksEditorCtrl($scope, $rootScope) {
        var _this = this;
        this.emptyListCta = {
            title: 'There are no dashboard links added yet',
            buttonIcon: 'gicon gicon-link',
            buttonTitle: 'Add Dashboard Link',
            infoBox: {
                __html: "<p>\n      Dashboard Links allow you to place links to other dashboards and web sites directly in below the dashboard\n      header.\n    </p>",
            },
            infoBoxTitle: 'What are Dashboard Links?',
        };
        this.setupNew = function () {
            _this.mode = 'new';
            _this.link = { type: 'dashboards', icon: 'external link' };
        };
        this.iconMap = iconMap;
        this.dashboard.links = this.dashboard.links || [];
        this.mode = 'list';
        $scope.$on('$destroy', function () {
            $rootScope.appEvent('dash-links-updated');
        });
    }
    DashLinksEditorCtrl.prototype.backToList = function () {
        this.mode = 'list';
    };
    DashLinksEditorCtrl.prototype.addLink = function () {
        this.dashboard.links.push(this.link);
        this.mode = 'list';
        this.dashboard.updateSubmenuVisibility();
    };
    DashLinksEditorCtrl.prototype.editLink = function (link) {
        this.link = link;
        this.mode = 'edit';
        console.log(this.link);
    };
    DashLinksEditorCtrl.prototype.saveLink = function () {
        this.backToList();
    };
    DashLinksEditorCtrl.prototype.moveLink = function (index, dir) {
        // @ts-ignore
        _.move(this.dashboard.links, index, index + dir);
    };
    DashLinksEditorCtrl.prototype.deleteLink = function (index) {
        this.dashboard.links.splice(index, 1);
        this.dashboard.updateSubmenuVisibility();
    };
    return DashLinksEditorCtrl;
}());
export { DashLinksEditorCtrl };
function dashLinksEditor() {
    return {
        restrict: 'E',
        controller: DashLinksEditorCtrl,
        templateUrl: 'public/app/features/dashboard/components/DashLinks/editor.html',
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            dashboard: '=',
        },
    };
}
angular.module('grafana.directives').directive('dashLinksEditor', dashLinksEditor);
//# sourceMappingURL=DashLinksEditorCtrl.js.map
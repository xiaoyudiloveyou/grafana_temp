import angular from 'angular';
import _ from 'lodash';
import './link_srv';
function panelLinksEditor() {
    return {
        scope: {
            panel: '=',
        },
        restrict: 'E',
        controller: 'PanelLinksEditorCtrl',
        templateUrl: 'public/app/features/panel/panellinks/module.html',
        link: function () { },
    };
}
var PanelLinksEditorCtrl = /** @class */ (function () {
    /** @ngInject */
    function PanelLinksEditorCtrl($scope, backendSrv) {
        $scope.panel.links = $scope.panel.links || [];
        $scope.addLink = function () {
            $scope.panel.links.push({
                type: 'dashboard',
            });
        };
        $scope.searchDashboards = function (queryStr, callback) {
            backendSrv.search({ query: queryStr }).then(function (hits) {
                var dashboards = _.map(hits, function (dash) {
                    return dash.title;
                });
                callback(dashboards);
            });
        };
        $scope.dashboardChanged = function (link) {
            backendSrv.search({ query: link.dashboard }).then(function (hits) {
                var dashboard = _.find(hits, { title: link.dashboard });
                if (dashboard) {
                    if (dashboard.url) {
                        link.url = dashboard.url;
                    }
                    else {
                        // To support legacy url's
                        link.dashUri = dashboard.uri;
                    }
                    link.title = dashboard.title;
                }
            });
        };
        $scope.deleteLink = function (link) {
            $scope.panel.links = _.without($scope.panel.links, link);
        };
    }
    return PanelLinksEditorCtrl;
}());
export { PanelLinksEditorCtrl };
angular
    .module('grafana.directives')
    .directive('panelLinksEditor', panelLinksEditor)
    .controller('PanelLinksEditorCtrl', PanelLinksEditorCtrl);
//# sourceMappingURL=module.js.map
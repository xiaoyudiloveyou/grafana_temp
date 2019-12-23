import coreModule from 'app/core/core_module';
import locationUtil from 'app/core/utils/location_util';
var LoadDashboardCtrl = /** @class */ (function () {
    /** @ngInject */
    function LoadDashboardCtrl($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location, $browser) {
        $scope.appEvent('dashboard-fetch-start');
        if (!$routeParams.uid && !$routeParams.slug) {
            backendSrv.get('/api/dashboards/home').then(function (homeDash) {
                if (homeDash.redirectUri) {
                    var newUrl = locationUtil.stripBaseFromUrl(homeDash.redirectUri);
                    $location.path(newUrl);
                }
                else {
                    var meta = homeDash.meta;
                    meta.canSave = meta.canShare = meta.canStar = false;
                    $scope.initDashboard(homeDash, $scope);
                }
            });
            return;
        }
        // if no uid, redirect to new route based on slug
        if (!($routeParams.type === 'script' || $routeParams.type === 'snapshot') && !$routeParams.uid) {
            // @ts-ignore
            backendSrv.getDashboardBySlug($routeParams.slug).then(function (res) {
                if (res) {
                    $location.path(locationUtil.stripBaseFromUrl(res.meta.url)).replace();
                }
            });
            return;
        }
        dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug, $routeParams.uid).then(function (result) {
            if (result.meta.url) {
                var url = locationUtil.stripBaseFromUrl(result.meta.url);
                if (url !== $location.path()) {
                    // replace url to not create additional history items and then return so that initDashboard below isn't executed multiple times.
                    $location.path(url).replace();
                    return;
                }
            }
            result.meta.autofitpanels = $routeParams.autofitpanels;
            result.meta.kiosk = $routeParams.kiosk;
            $scope.initDashboard(result, $scope);
        });
    }
    return LoadDashboardCtrl;
}());
export { LoadDashboardCtrl };
var NewDashboardCtrl = /** @class */ (function () {
    /** @ngInject */
    function NewDashboardCtrl($scope, $routeParams) {
        $scope.initDashboard({
            meta: {
                canStar: false,
                canShare: false,
                isNew: true,
                folderId: Number($routeParams.folderId),
            },
            dashboard: {
                title: 'New dashboard',
                panels: [
                    {
                        type: 'add-panel',
                        gridPos: { x: 0, y: 0, w: 12, h: 9 },
                        title: 'Panel Title',
                    },
                ],
            },
        }, $scope);
    }
    return NewDashboardCtrl;
}());
export { NewDashboardCtrl };
coreModule.controller('LoadDashboardCtrl', LoadDashboardCtrl);
coreModule.controller('NewDashboardCtrl', NewDashboardCtrl);
//# sourceMappingURL=dashboard_loaders.js.map
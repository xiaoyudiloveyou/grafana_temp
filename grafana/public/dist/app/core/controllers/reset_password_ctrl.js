import coreModule from '../core_module';
import config from 'app/core/config';
var ResetPasswordCtrl = /** @class */ (function () {
    /** @ngInject */
    function ResetPasswordCtrl($scope, backendSrv, $location) {
        $scope.formModel = {};
        $scope.mode = 'send';
        $scope.ldapEnabled = config.ldapEnabled;
        $scope.authProxyEnabled = config.authProxyEnabled;
        $scope.disableLoginForm = config.disableLoginForm;
        var params = $location.search();
        if (params.code) {
            $scope.mode = 'reset';
            $scope.formModel.code = params.code;
        }
        $scope.navModel = {
            main: {
                icon: 'gicon gicon-branding',
                text: 'Reset Password',
                subTitle: 'Reset your Grafana password',
                breadcrumbs: [{ title: 'Login', url: 'login' }],
            },
        };
        $scope.sendResetEmail = function () {
            if (!$scope.sendResetForm.$valid) {
                return;
            }
            backendSrv.post('/api/user/password/send-reset-email', $scope.formModel).then(function () {
                $scope.mode = 'email-sent';
            });
        };
        $scope.submitReset = function () {
            if (!$scope.resetForm.$valid) {
                return;
            }
            if ($scope.formModel.newPassword !== $scope.formModel.confirmPassword) {
                $scope.appEvent('alert-warning', ['New passwords do not match', '']);
                return;
            }
            backendSrv.post('/api/user/password/reset', $scope.formModel).then(function () {
                $location.path('login');
            });
        };
    }
    return ResetPasswordCtrl;
}());
export { ResetPasswordCtrl };
coreModule.controller('ResetPasswordCtrl', ResetPasswordCtrl);
//# sourceMappingURL=reset_password_ctrl.js.map
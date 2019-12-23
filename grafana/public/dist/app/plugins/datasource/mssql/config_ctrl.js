import { createChangeHandler, createResetHandler, PasswordFieldEnum, } from '../../../features/datasources/utils/passwordHandlers';
var MssqlConfigCtrl = /** @class */ (function () {
    /** @ngInject */
    function MssqlConfigCtrl($scope) {
        this.current.jsonData.encrypt = this.current.jsonData.encrypt || 'false';
        this.onPasswordReset = createResetHandler(this, PasswordFieldEnum.Password);
        this.onPasswordChange = createChangeHandler(this, PasswordFieldEnum.Password);
    }
    MssqlConfigCtrl.templateUrl = 'partials/config.html';
    return MssqlConfigCtrl;
}());
export { MssqlConfigCtrl };
//# sourceMappingURL=config_ctrl.js.map
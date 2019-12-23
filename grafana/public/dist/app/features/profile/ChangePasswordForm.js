import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import config from 'app/core/config';
import { Button, LinkButton } from '@grafana/ui';
import { PasswordInput } from 'app/core/components/PasswordInput/PasswordInput';
var ChangePasswordForm = /** @class */ (function (_super) {
    tslib_1.__extends(ChangePasswordForm, _super);
    function ChangePasswordForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNew: '',
        };
        _this.onOldPasswordChange = function (oldPassword) {
            _this.setState({ oldPassword: oldPassword });
        };
        _this.onNewPasswordChange = function (newPassword) {
            _this.setState({ newPassword: newPassword });
        };
        _this.onConfirmPasswordChange = function (confirmNew) {
            _this.setState({ confirmNew: confirmNew });
        };
        _this.onSubmitChangePassword = function (event) {
            event.preventDefault();
            _this.props.onChangePassword(tslib_1.__assign({}, _this.state));
        };
        return _this;
    }
    ChangePasswordForm.prototype.render = function () {
        var _a = this.state, oldPassword = _a.oldPassword, newPassword = _a.newPassword, confirmNew = _a.confirmNew;
        var isSaving = this.props.isSaving;
        var ldapEnabled = config.ldapEnabled, authProxyEnabled = config.authProxyEnabled;
        if (ldapEnabled || authProxyEnabled) {
            return React.createElement("p", null, "You cannot change password when ldap or auth proxy authentication is enabled.");
        }
        return (React.createElement("form", { name: "userForm", className: "gf-form-group" },
            React.createElement("div", { className: "gf-form max-width-30" },
                React.createElement(PasswordInput, { label: "Old Password", onChange: this.onOldPasswordChange, value: oldPassword })),
            React.createElement("div", { className: "gf-form max-width-30" },
                React.createElement(PasswordInput, { label: "New Password", onChange: this.onNewPasswordChange, value: newPassword })),
            React.createElement("div", { className: "gf-form max-width-30" },
                React.createElement(PasswordInput, { label: "Confirm Password", onChange: this.onConfirmPasswordChange, value: confirmNew })),
            React.createElement("div", { className: "gf-form-button-row" },
                React.createElement(Button, { variant: "primary", onClick: this.onSubmitChangePassword, disabled: isSaving }, "Change Password"),
                React.createElement(LinkButton, { variant: "transparent", href: config.appSubUrl + "/profile" }, "Cancel"))));
    };
    return ChangePasswordForm;
}(PureComponent));
export { ChangePasswordForm };
export default ChangePasswordForm;
//# sourceMappingURL=ChangePasswordForm.js.map
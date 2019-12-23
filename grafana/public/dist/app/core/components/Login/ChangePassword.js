import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { Tooltip } from '@grafana/ui';
import appEvents from 'app/core/app_events';
var ChangePassword = /** @class */ (function (_super) {
    tslib_1.__extends(ChangePassword, _super);
    function ChangePassword(props) {
        var _this = _super.call(this, props) || this;
        _this.onSubmit = function (e) {
            e.preventDefault();
            var _a = _this.state, newPassword = _a.newPassword, valid = _a.valid;
            if (valid) {
                _this.props.onSubmit(newPassword);
            }
            else {
                appEvents.emit('alert-warning', ['New passwords do not match', '']);
            }
        };
        _this.onNewPasswordChange = function (e) {
            _this.setState({
                newPassword: e.target.value,
                valid: _this.validate('newPassword', e.target.value),
            });
        };
        _this.onConfirmPasswordChange = function (e) {
            _this.setState({
                confirmNew: e.target.value,
                valid: _this.validate('confirmNew', e.target.value),
            });
        };
        _this.onSkip = function (e) {
            _this.props.onSkip();
        };
        _this.state = {
            newPassword: '',
            confirmNew: '',
            valid: false,
        };
        return _this;
    }
    ChangePassword.prototype.componentDidUpdate = function (prevProps) {
        if (!prevProps.focus && this.props.focus) {
            this.focus();
        }
    };
    ChangePassword.prototype.focus = function () {
        this.userInput.focus();
    };
    ChangePassword.prototype.validate = function (changed, pw) {
        if (changed === 'newPassword') {
            return this.state.confirmNew === pw;
        }
        else if (changed === 'confirmNew') {
            return this.state.newPassword === pw;
        }
        return false;
    };
    ChangePassword.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "login-inner-box", id: "change-password-view" },
            React.createElement("div", { className: "text-left login-change-password-info" },
                React.createElement("h5", null, "Change Password"),
                "Before you can get started with awesome dashboards we need you to make your account more secure by changing your password.",
                React.createElement("br", null),
                "You can change your password again later."),
            React.createElement("form", { className: "login-form-group gf-form-group" },
                React.createElement("div", { className: "login-form" },
                    React.createElement("input", { type: "password", id: "newPassword", name: "newPassword", className: "gf-form-input login-form-input", required: true, placeholder: "New password", onChange: this.onNewPasswordChange, ref: function (input) {
                            _this.userInput = input;
                        } })),
                React.createElement("div", { className: "login-form" },
                    React.createElement("input", { type: "password", name: "confirmNew", className: "gf-form-input login-form-input", required: true, "ng-model": "command.confirmNew", placeholder: "Confirm new password", onChange: this.onConfirmPasswordChange })),
                React.createElement("div", { className: "login-button-group login-button-group--right text-right" },
                    React.createElement(Tooltip, { placement: "bottom", content: "If you skip you will be prompted to change password next time you login." },
                        React.createElement("a", { className: "btn btn-link", onClick: this.onSkip }, "Skip")),
                    React.createElement("button", { type: "submit", className: "btn btn-large p-x-2 " + (this.state.valid ? 'btn-primary' : 'btn-inverse'), onClick: this.onSubmit, disabled: !this.state.valid }, "Save")))));
    };
    return ChangePassword;
}(PureComponent));
export { ChangePassword };
//# sourceMappingURL=ChangePassword.js.map
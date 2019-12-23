import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
var LoginForm = /** @class */ (function (_super) {
    tslib_1.__extends(LoginForm, _super);
    function LoginForm(props) {
        var _this = _super.call(this, props) || this;
        _this.onSubmit = function (e) {
            e.preventDefault();
            var _a = _this.state, user = _a.user, password = _a.password, email = _a.email;
            if (_this.state.valid) {
                _this.props.onSubmit({ user: user, password: password, email: email });
            }
        };
        _this.onChangePassword = function (e) {
            _this.setState({
                password: e.target.value,
                valid: _this.validate(_this.state.user, e.target.value),
            });
        };
        _this.onChangeUsername = function (e) {
            _this.setState({
                user: e.target.value,
                valid: _this.validate(e.target.value, _this.state.password),
            });
        };
        _this.state = {
            user: '',
            password: '',
            email: '',
            valid: false,
        };
        return _this;
    }
    LoginForm.prototype.componentDidMount = function () {
        this.userInput.focus();
    };
    LoginForm.prototype.validate = function (user, password) {
        return user.length > 0 && password.length > 0;
    };
    LoginForm.prototype.render = function () {
        var _this = this;
        return (React.createElement("form", { name: "loginForm", className: "login-form-group gf-form-group" },
            React.createElement("div", { className: "login-form" },
                React.createElement("input", { ref: function (input) {
                        _this.userInput = input;
                    }, type: "text", name: "user", className: "gf-form-input login-form-input", required: true, placeholder: this.props.loginHint, "aria-label": "Username input field", onChange: this.onChangeUsername })),
            React.createElement("div", { className: "login-form" },
                React.createElement("input", { type: "password", name: "password", className: "gf-form-input login-form-input", required: true, "ng-model": "formModel.password", id: "inputPassword", placeholder: this.props.passwordHint, "aria-label": "Password input field", onChange: this.onChangePassword })),
            React.createElement("div", { className: "login-button-group" },
                !this.props.isLoggingIn ? (React.createElement("button", { type: "submit", "aria-label": "Login button", className: "btn btn-large p-x-2 " + (this.state.valid ? 'btn-primary' : 'btn-inverse'), onClick: this.onSubmit, disabled: !this.state.valid }, "Log In")) : (React.createElement("button", { type: "submit", className: "btn btn-large p-x-2 btn-inverse btn-loading" },
                    "Logging In",
                    React.createElement("span", null, "."),
                    React.createElement("span", null, "."),
                    React.createElement("span", null, "."))),
                this.props.displayForgotPassword ? (React.createElement("div", { className: "small login-button-forgot-password" },
                    React.createElement("a", { href: "user/password/send-reset-email" }, "Forgot your password?"))) : null)));
    };
    return LoginForm;
}(PureComponent));
export { LoginForm };
//# sourceMappingURL=LoginForm.js.map
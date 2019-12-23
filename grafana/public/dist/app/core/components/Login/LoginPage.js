import React from 'react';
import { UserSignup } from './UserSignup';
import { LoginServiceButtons } from './LoginServiceButtons';
import LoginCtrl from './LoginCtrl';
import { LoginForm } from './LoginForm';
import { ChangePassword } from './ChangePassword';
import { CSSTransition } from 'react-transition-group';
export var LoginPage = function () {
    return (React.createElement("div", { className: "login container" },
        React.createElement("div", { className: "login-content" },
            React.createElement("div", { className: "login-branding" },
                React.createElement("img", { className: "logo-icon", src: "public/img/grafana_icon.svg", alt: "Grafana" }),
                React.createElement("div", { className: "logo-wordmark" })),
            React.createElement(LoginCtrl, null, function (_a) {
                var loginHint = _a.loginHint, passwordHint = _a.passwordHint, isOauthEnabled = _a.isOauthEnabled, ldapEnabled = _a.ldapEnabled, authProxyEnabled = _a.authProxyEnabled, disableLoginForm = _a.disableLoginForm, disableUserSignUp = _a.disableUserSignUp, login = _a.login, isLoggingIn = _a.isLoggingIn, changePassword = _a.changePassword, skipPasswordChange = _a.skipPasswordChange, isChangingPassword = _a.isChangingPassword;
                return (React.createElement("div", { className: "login-outer-box" },
                    React.createElement("div", { className: "login-inner-box " + (isChangingPassword ? 'hidden' : ''), id: "login-view" },
                        !disableLoginForm ? (React.createElement(LoginForm, { displayForgotPassword: !(ldapEnabled || authProxyEnabled), onSubmit: login, loginHint: loginHint, passwordHint: passwordHint, isLoggingIn: isLoggingIn })) : null,
                        React.createElement(LoginServiceButtons, null),
                        !disableUserSignUp ? React.createElement(UserSignup, null) : null),
                    React.createElement(CSSTransition, { appear: true, mountOnEnter: true, in: isChangingPassword, timeout: 250, classNames: "login-inner-box" },
                        React.createElement(ChangePassword, { onSubmit: changePassword, onSkip: skipPasswordChange, focus: isChangingPassword }))));
            }),
            React.createElement("div", { className: "clearfix" }))));
};
//# sourceMappingURL=LoginPage.js.map
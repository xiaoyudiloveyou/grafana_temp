import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { Button, FormLabel, Input, Tooltip } from '@grafana/ui';
import config from 'app/core/config';
var UserProfileEditForm = /** @class */ (function (_super) {
    __extends(UserProfileEditForm, _super);
    function UserProfileEditForm(props) {
        var _this = _super.call(this, props) || this;
        _this.onNameChange = function (event) {
            _this.setState({ name: event.target.value });
        };
        _this.onEmailChange = function (event) {
            _this.setState({ email: event.target.value });
        };
        _this.onLoginChange = function (event) {
            _this.setState({ login: event.target.value });
        };
        _this.onSubmitProfileUpdate = function (event) {
            event.preventDefault();
            _this.props.updateProfile(__assign({}, _this.state));
        };
        var _a = _this.props.user, name = _a.name, email = _a.email, login = _a.login;
        _this.state = {
            name: name,
            email: email,
            login: login,
        };
        return _this;
    }
    UserProfileEditForm.prototype.render = function () {
        var _a = this.state, name = _a.name, email = _a.email, login = _a.login;
        var isSavingUser = this.props.isSavingUser;
        var disableLoginForm = config.disableLoginForm;
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-sub-heading" }, "Edit Profile"),
            React.createElement("form", { name: "userForm", className: "gf-form-group" },
                React.createElement("div", { className: "gf-form max-width-30" },
                    React.createElement(FormLabel, { className: "width-8" }, "Name"),
                    React.createElement(Input, { className: "gf-form-input max-width-22", type: "text", onChange: this.onNameChange, value: name })),
                React.createElement("div", { className: "gf-form max-width-30" },
                    React.createElement(FormLabel, { className: "width-8" }, "Email"),
                    React.createElement(Input, { className: "gf-form-input max-width-22", type: "text", onChange: this.onEmailChange, value: email, disabled: disableLoginForm }),
                    disableLoginForm && (React.createElement(Tooltip, { content: "Login Details Locked - managed in another system." },
                        React.createElement("i", { className: "fa fa-lock gf-form-icon--right-absolute" })))),
                React.createElement("div", { className: "gf-form max-width-30" },
                    React.createElement(FormLabel, { className: "width-8" }, "Username"),
                    React.createElement(Input, { className: "gf-form-input max-width-22", type: "text", onChange: this.onLoginChange, value: login, disabled: disableLoginForm }),
                    disableLoginForm && (React.createElement(Tooltip, { content: "Login Details Locked - managed in another system." },
                        React.createElement("i", { className: "fa fa-lock gf-form-icon--right-absolute" })))),
                React.createElement("div", { className: "gf-form-button-row" },
                    React.createElement(Button, { variant: "primary", onClick: this.onSubmitProfileUpdate, disabled: isSavingUser }, "Save")))));
    };
    return UserProfileEditForm;
}(PureComponent));
export { UserProfileEditForm };
export default UserProfileEditForm;
//# sourceMappingURL=UserProfileEditForm.js.map
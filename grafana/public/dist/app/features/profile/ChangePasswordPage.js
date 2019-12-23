import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { getNavModel } from 'app/core/selectors/navModel';
import { UserProvider } from 'app/core/utils/UserProvider';
import Page from 'app/core/components/Page/Page';
import { ChangePasswordForm } from './ChangePasswordForm';
var ChangePasswordPage = /** @class */ (function (_super) {
    tslib_1.__extends(ChangePasswordPage, _super);
    function ChangePasswordPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePasswordPage.prototype.render = function () {
        var navModel = this.props.navModel;
        return (React.createElement(Page, { navModel: navModel },
            React.createElement(UserProvider, null, function (_a, states) {
                var changePassword = _a.changePassword;
                return (React.createElement(Page.Contents, null,
                    React.createElement("h3", { className: "page-sub-heading" }, "Change Your Password"),
                    React.createElement(ChangePasswordForm, { onChangePassword: changePassword, isSaving: states.changePassword })));
            })));
    };
    return ChangePasswordPage;
}(PureComponent));
export { ChangePasswordPage };
function mapStateToProps(state) {
    return {
        navModel: getNavModel(state.navIndex, "change-password"),
    };
}
var mapDispatchToProps = {};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage));
//# sourceMappingURL=ChangePasswordPage.js.map
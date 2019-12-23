import { __extends } from "tslib";
import React, { PureComponent } from 'react';
import { LoadingPlaceholder, Button } from '@grafana/ui';
var UserOrganizations = /** @class */ (function (_super) {
    __extends(UserOrganizations, _super);
    function UserOrganizations() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserOrganizations.prototype.componentDidMount = function () {
        this.props.loadOrgs();
    };
    UserOrganizations.prototype.render = function () {
        var _this = this;
        var _a = this.props, isLoading = _a.isLoading, orgs = _a.orgs, user = _a.user;
        if (isLoading) {
            return React.createElement(LoadingPlaceholder, { text: "Loading organizations..." });
        }
        return (React.createElement(React.Fragment, null, orgs.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("h3", { className: "page-sub-heading" }, "Organizations"),
            React.createElement("div", { className: "gf-form-group" },
                React.createElement("table", { className: "filter-table form-inline" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Role"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, orgs.map(function (org, index) {
                        return (React.createElement("tr", { key: index },
                            React.createElement("td", null, org.name),
                            React.createElement("td", null, org.role),
                            React.createElement("td", { className: "text-right" }, org.orgId === user.orgId ? (React.createElement("span", { className: "btn btn-primary btn-small" }, "Current")) : (React.createElement(Button, { variant: "inverse", size: "sm", onClick: function () {
                                    _this.props.setUserOrg(org);
                                } }, "Select")))));
                    }))))))));
    };
    return UserOrganizations;
}(PureComponent));
export { UserOrganizations };
export default UserOrganizations;
//# sourceMappingURL=UserOrganizations.js.map
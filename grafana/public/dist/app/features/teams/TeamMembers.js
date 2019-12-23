import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SlideDown } from 'app/core/components/Animations/SlideDown';
import { UserPicker } from 'app/core/components/Select/UserPicker';
import { TagBadge } from 'app/core/components/TagFilter/TagBadge';
import { addTeamMember, setSearchMemberQuery } from './state/actions';
import { getSearchMemberQuery, isSignedInUserTeamAdmin } from './state/selectors';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';
import { WithFeatureToggle } from 'app/core/components/WithFeatureToggle';
import { config } from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import TeamMemberRow from './TeamMemberRow';
var TeamMembers = /** @class */ (function (_super) {
    tslib_1.__extends(TeamMembers, _super);
    function TeamMembers(props) {
        var _this = _super.call(this, props) || this;
        _this.onSearchQueryChange = function (value) {
            _this.props.setSearchMemberQuery(value);
        };
        _this.onToggleAdding = function () {
            _this.setState({ isAdding: !_this.state.isAdding });
        };
        _this.onUserSelected = function (user) {
            _this.setState({ newTeamMember: user });
        };
        _this.onAddUserToTeam = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.props.addTeamMember(this.state.newTeamMember.id);
                this.setState({ newTeamMember: null });
                return [2 /*return*/];
            });
        }); };
        _this.state = { isAdding: false, newTeamMember: null };
        return _this;
    }
    TeamMembers.prototype.renderLabels = function (labels) {
        if (!labels) {
            return React.createElement("td", null);
        }
        return (React.createElement("td", null, labels.map(function (label) { return (React.createElement(TagBadge, { key: label, label: label, removeIcon: false, count: 0, onClick: function () { } })); })));
    };
    TeamMembers.prototype.render = function () {
        var isAdding = this.state.isAdding;
        var _a = this.props, searchMemberQuery = _a.searchMemberQuery, members = _a.members, syncEnabled = _a.syncEnabled, editorsCanAdmin = _a.editorsCanAdmin, signedInUser = _a.signedInUser;
        var isTeamAdmin = isSignedInUserTeamAdmin({ members: members, editorsCanAdmin: editorsCanAdmin, signedInUser: signedInUser });
        return (React.createElement("div", null,
            React.createElement("div", { className: "page-action-bar" },
                React.createElement("div", { className: "gf-form gf-form--grow" },
                    React.createElement(FilterInput, { labelClassName: "gf-form--has-input-icon gf-form--grow", inputClassName: "gf-form-input", placeholder: "Search members", value: searchMemberQuery, onChange: this.onSearchQueryChange })),
                React.createElement("div", { className: "page-action-bar__spacer" }),
                React.createElement("button", { className: "btn btn-primary pull-right", onClick: this.onToggleAdding, disabled: isAdding || !isTeamAdmin }, "Add member")),
            React.createElement(SlideDown, { in: isAdding },
                React.createElement("div", { className: "cta-form" },
                    React.createElement("button", { className: "cta-form__close btn btn-transparent", onClick: this.onToggleAdding },
                        React.createElement("i", { className: "fa fa-close" })),
                    React.createElement("h5", null, "Add team member"),
                    React.createElement("div", { className: "gf-form-inline" },
                        React.createElement(UserPicker, { onSelected: this.onUserSelected, className: "min-width-30" }),
                        this.state.newTeamMember && (React.createElement("button", { className: "btn btn-primary gf-form-btn", type: "submit", onClick: this.onAddUserToTeam }, "Add to team"))))),
            React.createElement("div", { className: "admin-list-table" },
                React.createElement("table", { className: "filter-table filter-table--hover form-inline" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null),
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Email"),
                            React.createElement(WithFeatureToggle, { featureToggle: editorsCanAdmin },
                                React.createElement("th", null, "Permission")),
                            syncEnabled && React.createElement("th", null),
                            React.createElement("th", { style: { width: '1%' } }))),
                    React.createElement("tbody", null, members &&
                        members.map(function (member) { return (React.createElement(TeamMemberRow, { key: member.userId, member: member, syncEnabled: syncEnabled, editorsCanAdmin: editorsCanAdmin, signedInUserIsTeamAdmin: isTeamAdmin })); }))))));
    };
    return TeamMembers;
}(PureComponent));
export { TeamMembers };
function mapStateToProps(state) {
    return {
        searchMemberQuery: getSearchMemberQuery(state.team),
        editorsCanAdmin: config.editorsCanAdmin,
        signedInUser: contextSrv.user,
    };
}
var mapDispatchToProps = {
    addTeamMember: addTeamMember,
    setSearchMemberQuery: setSearchMemberQuery,
};
export default connect(mapStateToProps, mapDispatchToProps)(TeamMembers);
//# sourceMappingURL=TeamMembers.js.map
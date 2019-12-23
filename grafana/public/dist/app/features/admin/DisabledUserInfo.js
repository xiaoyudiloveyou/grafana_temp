import React from 'react';
import { UserInfo } from './UserInfo';
import { LdapUserPermissions } from './ldap/LdapUserPermissions';
export var DisabledUserInfo = function (_a) {
    var user = _a.user;
    return (React.createElement(React.Fragment, null,
        React.createElement(LdapUserPermissions, { permissions: {
                isGrafanaAdmin: user.isGrafanaAdmin,
                isDisabled: user.isDisabled,
            } }),
        React.createElement(UserInfo, { user: user })));
};
//# sourceMappingURL=DisabledUserInfo.js.map
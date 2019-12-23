import React from 'react';
import { UserProvider } from 'app/core/utils/UserProvider';
import { UserProfileEditForm } from './UserProfileEditForm';
import { SharedPreferences } from 'app/core/components/SharedPreferences/SharedPreferences';
import { UserTeams } from './UserTeams';
import { UserOrganizations } from './UserOrganizations';
import { config } from '@grafana/runtime';
import { LoadingPlaceholder } from '@grafana/ui';
export var ReactProfileWrapper = function () { return (React.createElement(UserProvider, { userId: config.bootData.user.id }, function (api, states, teams, orgs, user) {
    return (React.createElement(React.Fragment, null,
        states.loadUser ? (React.createElement(LoadingPlaceholder, { text: "Loading user profile..." })) : (React.createElement(UserProfileEditForm, { updateProfile: api.updateUserProfile, isSavingUser: states.updateUserProfile, user: user })),
        React.createElement(SharedPreferences, { resourceUri: "user" }),
        React.createElement(UserTeams, { isLoading: states.loadTeams, loadTeams: api.loadTeams, teams: teams }),
        !states.loadUser && (React.createElement(UserOrganizations, { isLoading: states.loadOrgs, setUserOrg: api.setUserOrg, loadOrgs: api.loadOrgs, orgs: orgs, user: user }))));
})); };
export default ReactProfileWrapper;
//# sourceMappingURL=ReactProfileWrapper.js.map
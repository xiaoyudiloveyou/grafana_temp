import * as tslib_1 from "tslib";
import { reducerFactory } from 'app/core/redux';
import { ldapConnectionInfoLoadedAction, ldapFailedAction, userMappingInfoLoadedAction, userMappingInfoFailedAction, clearUserErrorAction, userLoadedAction, userSessionsLoadedAction, ldapSyncStatusLoadedAction, clearUserMappingInfoAction, } from './actions';
var initialLdapState = {
    connectionInfo: [],
    syncInfo: null,
    user: null,
    connectionError: null,
    userError: null,
};
var initialLdapUserState = {
    user: null,
    ldapUser: null,
    ldapSyncInfo: null,
    sessions: [],
};
export var ldapReducer = reducerFactory(initialLdapState)
    .addMapper({
    filter: ldapConnectionInfoLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { ldapError: null, connectionInfo: action.payload })); },
})
    .addMapper({
    filter: ldapFailedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { ldapError: action.payload })); },
})
    .addMapper({
    filter: ldapSyncStatusLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { syncInfo: action.payload })); },
})
    .addMapper({
    filter: userMappingInfoLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { user: action.payload, userError: null })); },
})
    .addMapper({
    filter: userMappingInfoFailedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { user: null, userError: action.payload })); },
})
    .addMapper({
    filter: clearUserMappingInfoAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { user: null })); },
})
    .addMapper({
    filter: clearUserErrorAction,
    mapper: function (state) { return (tslib_1.__assign({}, state, { userError: null })); },
})
    .create();
export var ldapUserReducer = reducerFactory(initialLdapUserState)
    .addMapper({
    filter: userMappingInfoLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { ldapUser: action.payload })); },
})
    .addMapper({
    filter: userMappingInfoFailedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { ldapUser: null, userError: action.payload })); },
})
    .addMapper({
    filter: clearUserErrorAction,
    mapper: function (state) { return (tslib_1.__assign({}, state, { userError: null })); },
})
    .addMapper({
    filter: ldapSyncStatusLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { ldapSyncInfo: action.payload })); },
})
    .addMapper({
    filter: userLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { user: action.payload, userError: null })); },
})
    .addMapper({
    filter: userSessionsLoadedAction,
    mapper: function (state, action) { return (tslib_1.__assign({}, state, { sessions: action.payload })); },
})
    .create();
export default {
    ldap: ldapReducer,
    ldapUser: ldapUserReducer,
};
//# sourceMappingURL=reducers.js.map
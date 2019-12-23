import * as tslib_1 from "tslib";
import { reducerTester } from 'test/core/redux/reducerTester';
import { ldapReducer, ldapUserReducer } from './reducers';
import { ldapConnectionInfoLoadedAction, ldapSyncStatusLoadedAction, userMappingInfoLoadedAction, userMappingInfoFailedAction, ldapFailedAction, userLoadedAction, } from './actions';
var makeInitialLdapState = function () { return ({
    connectionInfo: [],
    syncInfo: null,
    user: null,
    ldapError: null,
    connectionError: null,
    userError: null,
}); };
var makeInitialLdapUserState = function () { return ({
    user: null,
    ldapUser: null,
    ldapSyncInfo: null,
    sessions: [],
}); };
var getTestUserMapping = function () { return ({
    info: {
        email: { cfgAttrValue: 'mail', ldapValue: 'user@localhost' },
        name: { cfgAttrValue: 'givenName', ldapValue: 'User' },
        surname: { cfgAttrValue: 'sn', ldapValue: '' },
        login: { cfgAttrValue: 'cn', ldapValue: 'user' },
    },
    permissions: {
        isGrafanaAdmin: false,
        isDisabled: false,
    },
    roles: [],
    teams: [],
}); };
var getTestUser = function () { return ({
    id: 1,
    email: 'user@localhost',
    login: 'user',
    name: 'User',
    avatarUrl: '',
    label: '',
}); };
describe('LDAP page reducer', function () {
    describe('When page loaded', function () {
        describe('When connection info loaded', function () {
            it('should set connection info and clear error', function () {
                var initalState = tslib_1.__assign({}, makeInitialLdapState());
                reducerTester()
                    .givenReducer(ldapReducer, initalState)
                    .whenActionIsDispatched(ldapConnectionInfoLoadedAction([
                    {
                        available: true,
                        host: 'localhost',
                        port: 389,
                        error: null,
                    },
                ]))
                    .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapState(), { connectionInfo: [
                        {
                            available: true,
                            host: 'localhost',
                            port: 389,
                            error: null,
                        },
                    ], ldapError: null }));
            });
        });
        describe('When connection failed', function () {
            it('should set ldap error', function () {
                var initalState = tslib_1.__assign({}, makeInitialLdapState());
                reducerTester()
                    .givenReducer(ldapReducer, initalState)
                    .whenActionIsDispatched(ldapFailedAction({
                    title: 'LDAP error',
                    body: 'Failed to connect',
                }))
                    .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapState(), { ldapError: {
                        title: 'LDAP error',
                        body: 'Failed to connect',
                    } }));
            });
        });
        describe('When LDAP sync status loaded', function () {
            it('should set sync info', function () {
                var initalState = tslib_1.__assign({}, makeInitialLdapState());
                reducerTester()
                    .givenReducer(ldapReducer, initalState)
                    .whenActionIsDispatched(ldapSyncStatusLoadedAction({
                    enabled: true,
                    schedule: '0 0 * * * *',
                    nextSync: '2019-01-01T12:00:00Z',
                }))
                    .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapState(), { syncInfo: {
                        enabled: true,
                        schedule: '0 0 * * * *',
                        nextSync: '2019-01-01T12:00:00Z',
                    } }));
            });
        });
    });
    describe('When user mapping info loaded', function () {
        it('should set sync info and clear user error', function () {
            var initalState = tslib_1.__assign({}, makeInitialLdapState(), { userError: {
                    title: 'User not found',
                    body: 'Cannot find user',
                } });
            reducerTester()
                .givenReducer(ldapReducer, initalState)
                .whenActionIsDispatched(userMappingInfoLoadedAction(getTestUserMapping()))
                .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapState(), { user: getTestUserMapping(), userError: null }));
        });
    });
    describe('When user not found', function () {
        it('should set user error and clear user info', function () {
            var initalState = tslib_1.__assign({}, makeInitialLdapState(), { user: getTestUserMapping() });
            reducerTester()
                .givenReducer(ldapReducer, initalState)
                .whenActionIsDispatched(userMappingInfoFailedAction({
                title: 'User not found',
                body: 'Cannot find user',
            }))
                .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapState(), { user: null, userError: {
                    title: 'User not found',
                    body: 'Cannot find user',
                } }));
        });
    });
});
describe('Edit LDAP user page reducer', function () {
    describe('When user loaded', function () {
        it('should set user and clear user error', function () {
            var initalState = tslib_1.__assign({}, makeInitialLdapUserState(), { userError: {
                    title: 'User not found',
                    body: 'Cannot find user',
                } });
            reducerTester()
                .givenReducer(ldapUserReducer, initalState)
                .whenActionIsDispatched(userLoadedAction(getTestUser()))
                .thenStateShouldEqual(tslib_1.__assign({}, makeInitialLdapUserState(), { user: getTestUser(), userError: null }));
        });
    });
});
//# sourceMappingURL=reducers.test.js.map
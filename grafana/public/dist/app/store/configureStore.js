import * as tslib_1 from "tslib";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import sharedReducers from 'app/core/reducers';
import alertingReducers from 'app/features/alerting/state/reducers';
import teamsReducers from 'app/features/teams/state/reducers';
import apiKeysReducers from 'app/features/api-keys/state/reducers';
import foldersReducers from 'app/features/folders/state/reducers';
import dashboardReducers from 'app/features/dashboard/state/reducers';
import exploreReducers from 'app/features/explore/state/reducers';
import pluginReducers from 'app/features/plugins/state/reducers';
import dataSourcesReducers from 'app/features/datasources/state/reducers';
import usersReducers from 'app/features/users/state/reducers';
import userReducers from 'app/features/profile/state/reducers';
import organizationReducers from 'app/features/org/state/reducers';
import ldapReducers from 'app/features/admin/state/reducers';
import { setStore } from './store';
import { toggleLogActionsMiddleware } from 'app/core/middlewares/application';
var rootReducers = tslib_1.__assign({}, sharedReducers, alertingReducers, teamsReducers, apiKeysReducers, foldersReducers, dashboardReducers, exploreReducers, pluginReducers, dataSourcesReducers, usersReducers, userReducers, organizationReducers, ldapReducers);
export function addRootReducer(reducers) {
    Object.assign.apply(Object, tslib_1.__spread([rootReducers], reducers));
}
export function configureStore() {
    var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    var rootReducer = combineReducers(rootReducers);
    var logger = createLogger({
        predicate: function (getState) {
            return getState().application.logActions;
        },
    });
    var storeEnhancers = process.env.NODE_ENV !== 'production'
        ? applyMiddleware(toggleLogActionsMiddleware, thunk, logger)
        : applyMiddleware(thunk);
    var store = createStore(rootReducer, {}, composeEnhancers(storeEnhancers));
    setStore(store);
    return store;
}
//# sourceMappingURL=configureStore.js.map
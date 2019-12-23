import { toggleLogActions } from '../actions/application';
export var toggleLogActionsMiddleware = function (store) { return function (next) { return function (action) {
    var isLogActionsAction = action.type === toggleLogActions.type;
    if (isLogActionsAction) {
        return next(action);
    }
    var logActionsTrue = window && window.location && window.location.search && window.location.search.indexOf('logActions=true') !== -1;
    var logActionsFalse = window && window.location && window.location.search && window.location.search.indexOf('logActions=false') !== -1;
    var logActions = store.getState().application.logActions;
    if (logActionsTrue && !logActions) {
        store.dispatch(toggleLogActions());
    }
    if (logActionsFalse && logActions) {
        store.dispatch(toggleLogActions());
    }
    return next(action);
}; }; };
//# sourceMappingURL=application.js.map
import * as tslib_1 from "tslib";
import { reducerFactory } from 'app/core/redux';
import { toggleLogActions } from '../actions/application';
export var initialState = {
    logActions: false,
};
export var applicationReducer = reducerFactory(initialState)
    .addMapper({
    filter: toggleLogActions,
    mapper: function (state) { return (tslib_1.__assign({}, state, { logActions: !state.logActions })); },
})
    .create();
//# sourceMappingURL=application.js.map
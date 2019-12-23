import * as tslib_1 from "tslib";
import { renderUrl } from 'app/core/utils/url';
import _ from 'lodash';
import { reducerFactory } from 'app/core/redux';
import { updateLocation } from 'app/core/actions';
export var initialState = {
    url: '',
    path: '',
    query: {},
    routeParams: {},
    replace: false,
    lastUpdated: 0,
};
export var locationReducer = reducerFactory(initialState)
    .addMapper({
    filter: updateLocation,
    mapper: function (state, action) {
        var _a = action.payload, path = _a.path, routeParams = _a.routeParams, replace = _a.replace;
        var query = action.payload.query || state.query;
        if (action.payload.partial) {
            query = _.defaults(query, state.query);
            query = _.omitBy(query, _.isNull);
        }
        return {
            url: renderUrl(path || state.path, query),
            path: path || state.path,
            query: tslib_1.__assign({}, query),
            routeParams: routeParams || state.routeParams,
            replace: replace === true,
            lastUpdated: new Date().getTime(),
        };
    },
})
    .create();
//# sourceMappingURL=location.js.map
import config from 'app/core/config';
export var initialState = {
    orgId: config.bootData.user.orgId,
    timeZone: config.bootData.user.timezone,
};
export var userReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    return state;
};
export default {
    user: userReducer,
};
//# sourceMappingURL=reducers.js.map
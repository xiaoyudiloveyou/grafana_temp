import { __assign, __read, __spread } from "tslib";
import React from 'react';
import { connect } from 'react-redux';
import { store } from '../../store/store';
export function connectWithStore(WrappedComponent) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var ConnectedWrappedComponent = connect.apply(void 0, __spread(args))(WrappedComponent);
    return function (props) {
        return React.createElement(ConnectedWrappedComponent, __assign({}, props, { store: store }));
    };
}
//# sourceMappingURL=connectWithReduxStore.js.map
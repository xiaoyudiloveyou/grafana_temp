import * as tslib_1 from "tslib";
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { ExploreId } from 'app/types/explore';
import Explore from './Explore';
import { CustomScrollbar, ErrorBoundaryAlert } from '@grafana/ui';
import { resetExploreAction } from './state/actionTypes';
var Wrapper = /** @class */ (function (_super) {
    tslib_1.__extends(Wrapper, _super);
    function Wrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wrapper.prototype.componentWillUnmount = function () {
        this.props.resetExploreAction({});
    };
    Wrapper.prototype.render = function () {
        var split = this.props.split;
        return (React.createElement("div", { className: "page-scrollbar-wrapper" },
            React.createElement(CustomScrollbar, { autoHeightMin: '100%', autoHeightMax: '', className: "custom-scrollbar--page" },
                React.createElement("div", { className: "explore-wrapper" },
                    React.createElement(ErrorBoundaryAlert, { style: "page" },
                        React.createElement(Explore, { exploreId: ExploreId.left })),
                    split && (React.createElement(ErrorBoundaryAlert, { style: "page" },
                        React.createElement(Explore, { exploreId: ExploreId.right })))))));
    };
    return Wrapper;
}(Component));
export { Wrapper };
var mapStateToProps = function (state) {
    var split = state.explore.split;
    return { split: split };
};
var mapDispatchToProps = {
    resetExploreAction: resetExploreAction,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Wrapper));
//# sourceMappingURL=Wrapper.js.map
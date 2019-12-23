import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Collapse } from '@grafana/ui';
import { toggleTable } from './state/actions';
import Table from './Table';
var TableContainer = /** @class */ (function (_super) {
    tslib_1.__extends(TableContainer, _super);
    function TableContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClickTableButton = function () {
            _this.props.toggleTable(_this.props.exploreId, _this.props.showingTable);
        };
        return _this;
    }
    TableContainer.prototype.render = function () {
        var _a = this.props, loading = _a.loading, onClickCell = _a.onClickCell, showingTable = _a.showingTable, tableResult = _a.tableResult;
        return (React.createElement(Collapse, { label: "Table", loading: loading, collapsible: true, isOpen: showingTable, onToggle: this.onClickTableButton }, tableResult && React.createElement(Table, { data: tableResult, loading: loading, onClickCell: onClickCell })));
    };
    return TableContainer;
}(PureComponent));
export { TableContainer };
function mapStateToProps(state, _a) {
    var exploreId = _a.exploreId;
    var explore = state.explore;
    // @ts-ignore
    var item = explore[exploreId];
    var loadingInState = item.loading, showingTable = item.showingTable, tableResult = item.tableResult;
    var loading = tableResult && tableResult.rows.length > 0 ? false : loadingInState;
    return { loading: loading, showingTable: showingTable, tableResult: tableResult };
}
var mapDispatchToProps = {
    toggleTable: toggleTable,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(TableContainer));
//# sourceMappingURL=TableContainer.js.map
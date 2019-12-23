import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { AsyncSelect } from '@grafana/ui';
import { debounce } from 'lodash';
import { getBackendSrv } from 'app/core/services/backend_srv';
var DashboardPicker = /** @class */ (function (_super) {
    tslib_1.__extends(DashboardPicker, _super);
    function DashboardPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.getDashboards = function (query) {
            if (query === void 0) { query = ''; }
            _this.setState({ isLoading: true });
            return getBackendSrv()
                .search({ type: 'dash-db', query: query })
                .then(function (result) {
                var dashboards = result.map(function (item) {
                    return {
                        id: item.id,
                        value: item.id,
                        label: (item.folderTitle ? item.folderTitle : 'General') + "/" + item.title,
                    };
                });
                _this.setState({ isLoading: false });
                return dashboards;
            });
        };
        _this.state = {
            isLoading: false,
        };
        _this.debouncedSearch = debounce(_this.getDashboards, 300, {
            leading: true,
            trailing: true,
        });
        return _this;
    }
    DashboardPicker.prototype.render = function () {
        var _a = this.props, className = _a.className, onSelected = _a.onSelected, currentDashboardId = _a.currentDashboardId;
        var isLoading = this.state.isLoading;
        return (React.createElement("div", { className: "gf-form-inline" },
            React.createElement("div", { className: "gf-form" },
                React.createElement(AsyncSelect, { className: className, isLoading: isLoading, isClearable: true, defaultOptions: true, loadOptions: this.debouncedSearch, onChange: onSelected, placeholder: "Select dashboard", noOptionsMessage: function () { return 'No dashboards found'; }, value: currentDashboardId }))));
    };
    return DashboardPicker;
}(PureComponent));
export { DashboardPicker };
//# sourceMappingURL=DashboardPicker.js.map
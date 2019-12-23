import * as tslib_1 from "tslib";
import { DataSourceApi, } from '@grafana/ui';
var DatasourceSrvMock = /** @class */ (function () {
    function DatasourceSrvMock(defaultDS, datasources) {
        this.defaultDS = defaultDS;
        this.datasources = datasources;
        //
    }
    DatasourceSrvMock.prototype.get = function (name) {
        if (!name) {
            return Promise.resolve(this.defaultDS);
        }
        var ds = this.datasources[name];
        if (ds) {
            return Promise.resolve(ds);
        }
        return Promise.reject('Unknown Datasource: ' + name);
    };
    return DatasourceSrvMock;
}());
export { DatasourceSrvMock };
var MockDataSourceApi = /** @class */ (function (_super) {
    tslib_1.__extends(MockDataSourceApi, _super);
    function MockDataSourceApi(name, result) {
        var _this = _super.call(this, { name: name ? name : 'MockDataSourceApi' }) || this;
        _this.result = { data: [] };
        if (result) {
            _this.result = result;
        }
        _this.meta = {};
        return _this;
    }
    MockDataSourceApi.prototype.query = function (request) {
        var _this = this;
        if (this.queryResolver) {
            return this.queryResolver;
        }
        return new Promise(function (resolver) {
            setTimeout(function () {
                resolver(_this.result);
            });
        });
    };
    MockDataSourceApi.prototype.testDatasource = function () {
        return Promise.resolve();
    };
    return MockDataSourceApi;
}(DataSourceApi));
export { MockDataSourceApi };
//# sourceMappingURL=datasource_srv.js.map
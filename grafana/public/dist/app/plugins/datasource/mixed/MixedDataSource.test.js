var _this = this;
import * as tslib_1 from "tslib";
import { DatasourceSrvMock, MockDataSourceApi } from 'test/mocks/datasource_srv';
import { getDataSourceSrv } from '@grafana/runtime';
import { getQueryOptions } from 'test/helpers/getQueryOptions';
import { LoadingState } from '@grafana/data';
import { MixedDatasource } from './module';
import { from } from 'rxjs';
var defaultDS = new MockDataSourceApi('DefaultDS', { data: ['DDD'] });
var datasourceSrv = new DatasourceSrvMock(defaultDS, {
    '-- Mixed --': new MixedDatasource({ name: 'mixed', id: 5 }),
    A: new MockDataSourceApi('DSA', { data: ['AAAA'] }),
    B: new MockDataSourceApi('DSB', { data: ['BBBB'] }),
    C: new MockDataSourceApi('DSC', { data: ['CCCC'] }),
});
jest.mock('@grafana/runtime', function () { return ({
    getDataSourceSrv: function () {
        return datasourceSrv;
    },
}); });
describe('MixedDatasource', function () {
    var requestMixed = getQueryOptions({
        targets: [
            { refId: 'QA', datasource: 'A' },
            { refId: 'QB', datasource: 'B' },
            { refId: 'QC', datasource: 'C' },
        ],
    });
    var results = [];
    beforeEach(function (done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var ds;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDataSourceSrv().get('-- Mixed --')];
                case 1:
                    ds = _a.sent();
                    from(ds.query(requestMixed)).subscribe(function (result) {
                        results.push(result);
                        if (result.state === LoadingState.Done) {
                            done();
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('direct query should return results', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            expect(results.length).toBe(3);
            expect(results[0].data).toEqual(['AAAA']);
            expect(results[0].state).toEqual(LoadingState.Loading);
            expect(results[1].data).toEqual(['BBBB']);
            expect(results[2].data).toEqual(['CCCC']);
            expect(results[2].state).toEqual(LoadingState.Done);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=MixedDataSource.test.js.map
import InputDatasource, { describeDataFrame } from './InputDatasource';
import { readCSV, MutableDataFrame } from '@grafana/data';
import { getQueryOptions } from 'test/helpers/getQueryOptions';
describe('InputDatasource', function () {
    var data = readCSV('a,b,c\n1,2,3\n4,5,6');
    var instanceSettings = {
        id: 1,
        type: 'x',
        name: 'xxx',
        meta: {},
        jsonData: {
            data: data,
        },
    };
    describe('when querying', function () {
        test('should return the saved data with a query', function () {
            var ds = new InputDatasource(instanceSettings);
            var options = getQueryOptions({
                targets: [{ refId: 'Z' }],
            });
            return ds.query(options).then(function (rsp) {
                expect(rsp.data.length).toBe(1);
                var series = rsp.data[0];
                expect(series.refId).toBe('Z');
                expect(series.fields[0].values).toEqual(data[0].fields[0].values);
            });
        });
    });
    test('DataFrame descriptions', function () {
        expect(describeDataFrame([])).toEqual('');
        expect(describeDataFrame(null)).toEqual('');
        expect(describeDataFrame([
            new MutableDataFrame({
                name: 'x',
                fields: [{ name: 'a' }],
            }),
        ])).toEqual('1 Fields, 0 Rows');
    });
});
//# sourceMappingURL=InputDatasource.test.js.map
import { DataProcessor } from '../data_processor';
import { getProcessedDataFrames } from 'app/features/dashboard/state/runRequest';
describe('Graph DataProcessor', function () {
    var panel = {
        xaxis: { mode: 'series' },
        aliasColors: {},
    };
    var processor = new DataProcessor(panel);
    describe('getTimeSeries from LegacyResponseData', function () {
        // Try each type of data
        var dataList = getProcessedDataFrames([
            {
                alias: 'First (time_series)',
                datapoints: [[1, 1001], [2, 1002], [3, 1003]],
                unit: 'watt',
            },
            {
                name: 'table_data',
                columns: [
                    { text: 'time' },
                    { text: 'v1', unit: 'ohm' },
                    { text: 'v2' },
                    { text: 'string' },
                ],
                rows: [
                    [1001, 0.1, 1.1, 'a'],
                    [1002, 0.2, 2.2, 'b'],
                    [1003, 0.3, 3.3, 'c'],
                ],
            },
            {
                name: 'series',
                fields: [
                    { name: 'v1', values: [0.1, 0.2, 0.3] },
                    { name: 'v2', values: [1.1, 2.2, 3.3] },
                    { name: 'string', values: ['a', 'b', 'c'] },
                    { name: 'time', values: [1001, 1002, 1003] },
                ],
            },
        ]);
        it('Should return a new series for each field', function () {
            panel.xaxis.mode = 'series';
            var series = processor.getSeriesList({ dataList: dataList });
            expect(series.length).toEqual(5);
            expect(series).toMatchSnapshot();
        });
        it('Should return single histogram', function () {
            panel.xaxis.mode = 'histogram';
            var series = processor.getSeriesList({ dataList: dataList });
            expect(series.length).toEqual(1);
            expect(series).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=data_processor.test.js.map
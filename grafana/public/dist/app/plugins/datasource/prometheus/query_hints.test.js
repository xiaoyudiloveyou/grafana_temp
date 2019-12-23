import { getQueryHints } from './query_hints';
describe('getQueryHints', function () {
    describe('when called without datapoints in series', function () {
        it('then it should use rows instead and return correct hint', function () {
            var series = [
                {
                    fields: [
                        {
                            name: 'Some Name',
                        },
                    ],
                    rows: [[1], [2]],
                },
            ];
            var result = getQueryHints('up', series);
            expect(result).toEqual([
                {
                    fix: { action: { query: 'up', type: 'ADD_RATE' }, label: 'Fix by adding rate().' },
                    label: 'Time series is monotonically increasing.',
                    type: 'APPLY_RATE',
                },
            ]);
        });
    });
    describe('when called without datapoints and rows in series', function () {
        it('then it should use an empty array and return null', function () {
            var series = [
                {
                    fields: [
                        {
                            name: 'Some Name',
                        },
                    ],
                },
            ];
            var result = getQueryHints('up', series);
            expect(result).toEqual(null);
        });
    });
});
//# sourceMappingURL=query_hints.test.js.map
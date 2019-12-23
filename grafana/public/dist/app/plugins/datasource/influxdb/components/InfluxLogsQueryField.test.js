import { pairsAreValid } from './InfluxLogsQueryField';
describe('pairsAreValid()', function () {
    describe('when all pairs are fully defined', function () {
        it('should return true', function () {
            var pairs = [
                {
                    key: 'a',
                    operator: '=',
                    value: '1',
                },
                {
                    key: 'b',
                    operator: '!=',
                    value: '2',
                },
            ];
            expect(pairsAreValid(pairs)).toBe(true);
        });
    });
    describe('when no pairs are defined at all', function () {
        it('should return true', function () {
            expect(pairsAreValid([])).toBe(true);
        });
    });
    describe('when pairs are undefined', function () {
        it('should return true', function () {
            expect(pairsAreValid(undefined)).toBe(true);
        });
    });
    describe('when one or more pairs are only partially defined', function () {
        it('should return false', function () {
            var pairs = [
                {
                    key: 'a',
                    operator: undefined,
                    value: '1',
                },
                {
                    key: 'b',
                    operator: '!=',
                    value: '2',
                },
            ];
            expect(pairsAreValid(pairs)).toBe(false);
        });
    });
});
//# sourceMappingURL=InfluxLogsQueryField.test.js.map
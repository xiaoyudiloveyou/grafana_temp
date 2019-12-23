import { getNextRefIdChar } from './query';
var dataQueries = [
    {
        refId: 'A',
    },
    {
        refId: 'B',
    },
    {
        refId: 'C',
    },
    {
        refId: 'D',
    },
    {
        refId: 'E',
    },
];
describe('Get next refId char', function () {
    it('should return next char', function () {
        expect(getNextRefIdChar(dataQueries)).toEqual('F');
    });
    it('should get first char', function () {
        expect(getNextRefIdChar([])).toEqual('A');
    });
});
//# sourceMappingURL=query.test.js.map
import flatten from 'app/core/utils/flatten';
describe('flatten', function () {
    it('should return flatten object', function () {
        var flattened = flatten({
            level1: 'level1-value',
            deeper: {
                level2: 'level2-value',
                deeper: {
                    level3: 'level3-value',
                },
            },
        }, null);
        expect(flattened['level1']).toBe('level1-value');
        expect(flattened['deeper.level2']).toBe('level2-value');
        expect(flattened['deeper.deeper.level3']).toBe('level3-value');
    });
});
//# sourceMappingURL=flatten.test.js.map
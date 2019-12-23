import { parseQuery, getHighlighterExpressionsFromQuery } from './query_utils';
describe('parseQuery', function () {
    it('returns empty for empty string', function () {
        expect(parseQuery('')).toEqual({
            query: '',
            regexp: '',
        });
    });
    it('returns regexp for strings without query', function () {
        expect(parseQuery('test')).toEqual({
            query: 'test',
            regexp: '',
        });
    });
    it('returns query for strings without regexp', function () {
        expect(parseQuery('{foo="bar"}')).toEqual({
            query: '{foo="bar"}',
            regexp: '',
        });
    });
    it('returns query for strings with query and search string', function () {
        expect(parseQuery('x {foo="bar"}')).toEqual({
            query: '{foo="bar"}',
            regexp: '(?i)x',
        });
    });
    it('returns query for strings with query and regexp', function () {
        expect(parseQuery('{foo="bar"} x|y')).toEqual({
            query: '{foo="bar"}',
            regexp: '(?i)x|y',
        });
    });
    it('returns query for selector with two labels', function () {
        expect(parseQuery('{foo="bar", baz="42"}')).toEqual({
            query: '{foo="bar", baz="42"}',
            regexp: '',
        });
    });
    it('returns query and regexp with quantifiers', function () {
        expect(parseQuery('{foo="bar"} \\.java:[0-9]{1,5}')).toEqual({
            query: '{foo="bar"}',
            regexp: '(?i)\\.java:[0-9]{1,5}',
        });
        expect(parseQuery('\\.java:[0-9]{1,5} {foo="bar"}')).toEqual({
            query: '{foo="bar"}',
            regexp: '(?i)\\.java:[0-9]{1,5}',
        });
    });
    it('returns query with filter operands as is', function () {
        expect(parseQuery('{foo="bar"} |= "x|y"')).toEqual({
            query: '{foo="bar"} |= "x|y"',
            regexp: '',
        });
        expect(parseQuery('{foo="bar"} |~ "42"')).toEqual({
            query: '{foo="bar"} |~ "42"',
            regexp: '',
        });
    });
});
describe('getHighlighterExpressionsFromQuery', function () {
    it('returns no expressions for empty query', function () {
        expect(getHighlighterExpressionsFromQuery('')).toEqual([]);
    });
    it('returns a single expressions for legacy query', function () {
        expect(getHighlighterExpressionsFromQuery('{} x')).toEqual(['(?i)x']);
        expect(getHighlighterExpressionsFromQuery('{foo="bar"} x')).toEqual(['(?i)x']);
    });
    it('returns an expression for query with filter', function () {
        expect(getHighlighterExpressionsFromQuery('{foo="bar"} |= "x"')).toEqual(['x']);
    });
    it('returns expressions for query with filter chain', function () {
        expect(getHighlighterExpressionsFromQuery('{foo="bar"} |= "x" |~ "y"')).toEqual(['x', 'y']);
    });
    it('returns drops expressions for query with negative filter chain', function () {
        expect(getHighlighterExpressionsFromQuery('{foo="bar"} |= "x" != "y"')).toEqual(['x']);
    });
    it('returns null if filter term is not wrapped in double quotes', function () {
        expect(getHighlighterExpressionsFromQuery('{foo="bar"} |= x')).toEqual(null);
    });
});
//# sourceMappingURL=query_utils.test.js.map
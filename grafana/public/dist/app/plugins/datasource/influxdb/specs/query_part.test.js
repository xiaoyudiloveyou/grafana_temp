import queryPart from '../query_part';
describe('InfluxQueryPart', function () {
    describe('series with measurement only', function () {
        it('should handle nested function parts', function () {
            var part = queryPart.create({
                type: 'derivative',
                params: ['10s'],
            });
            expect(part.text).toBe('derivative(10s)');
            expect(part.render('mean(value)')).toBe('derivative(mean(value), 10s)');
        });
        it('should nest spread function', function () {
            var part = queryPart.create({
                type: 'spread',
            });
            expect(part.text).toBe('spread()');
            expect(part.render('value')).toBe('spread(value)');
        });
        it('should handle suffix parts', function () {
            var part = queryPart.create({
                type: 'math',
                params: ['/ 100'],
            });
            expect(part.text).toBe('math(/ 100)');
            expect(part.render('mean(value)')).toBe('mean(value) / 100');
        });
        it('should handle alias parts', function () {
            var part = queryPart.create({
                type: 'alias',
                params: ['test'],
            });
            expect(part.text).toBe('alias(test)');
            expect(part.render('mean(value)')).toBe('mean(value) AS "test"');
        });
        it('should nest distinct when count is selected', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'count',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'distinct',
                category: queryPart.getCategories().Aggregations,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('distinct()');
            expect(selectParts[2].text).toBe('count()');
        });
        it('should convert to count distinct when distinct is selected and count added', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'distinct',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'count',
                category: queryPart.getCategories().Aggregations,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('distinct()');
            expect(selectParts[2].text).toBe('count()');
        });
        it('should replace count distinct if an aggregation is selected', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'distinct',
                    category: queryPart.getCategories().Aggregations,
                }),
                queryPart.create({
                    type: 'count',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'mean',
                category: queryPart.getCategories().Selectors,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('mean()');
            expect(selectParts).toHaveLength(2);
        });
        it('should not allowed nested counts when count distinct is selected', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'distinct',
                    category: queryPart.getCategories().Aggregations,
                }),
                queryPart.create({
                    type: 'count',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'count',
                category: queryPart.getCategories().Aggregations,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('distinct()');
            expect(selectParts[2].text).toBe('count()');
            expect(selectParts).toHaveLength(3);
        });
        it('should not remove count distinct when distinct is added', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'distinct',
                    category: queryPart.getCategories().Aggregations,
                }),
                queryPart.create({
                    type: 'count',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'distinct',
                category: queryPart.getCategories().Aggregations,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('distinct()');
            expect(selectParts[2].text).toBe('count()');
            expect(selectParts).toHaveLength(3);
        });
        it('should remove distinct when sum aggregation is selected', function () {
            var selectParts = [
                queryPart.create({
                    type: 'field',
                    category: queryPart.getCategories().Fields,
                }),
                queryPart.create({
                    type: 'distinct',
                    category: queryPart.getCategories().Aggregations,
                }),
            ];
            var partModel = queryPart.create({
                type: 'sum',
                category: queryPart.getCategories().Aggregations,
            });
            queryPart.replaceAggregationAdd(selectParts, partModel);
            expect(selectParts[1].text).toBe('sum()');
        });
    });
});
//# sourceMappingURL=query_part.test.js.map
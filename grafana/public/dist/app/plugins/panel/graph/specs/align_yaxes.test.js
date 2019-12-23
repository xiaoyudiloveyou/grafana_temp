import { alignYLevel } from '../align_yaxes';
describe('Graph Y axes aligner', function () {
    var yaxes, expected;
    var alignY = 0;
    describe('on the one hand with respect to zero', function () {
        it('Should shrink Y axis', function () {
            yaxes = [{ min: 5, max: 10 }, { min: 2, max: 3 }];
            expected = [{ min: 5, max: 10 }, { min: 1.5, max: 3 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axis', function () {
            yaxes = [{ min: 2, max: 3 }, { min: 5, max: 10 }];
            expected = [{ min: 1.5, max: 3 }, { min: 5, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axis', function () {
            yaxes = [{ min: -10, max: -5 }, { min: -3, max: -2 }];
            expected = [{ min: -10, max: -5 }, { min: -3, max: -1.5 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axis', function () {
            yaxes = [{ min: -3, max: -2 }, { min: -10, max: -5 }];
            expected = [{ min: -3, max: -1.5 }, { min: -10, max: -5 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('on the opposite sides with respect to zero', function () {
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -3, max: -1 }, { min: 5, max: 10 }];
            expected = [{ min: -3, max: 3 }, { min: -10, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: 1, max: 3 }, { min: -10, max: -5 }];
            expected = [{ min: -3, max: 3 }, { min: -10, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('both across zero', function () {
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -10, max: 5 }, { min: -2, max: 3 }];
            expected = [{ min: -10, max: 15 }, { min: -2, max: 3 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -5, max: 10 }, { min: -3, max: 2 }];
            expected = [{ min: -15, max: 10 }, { min: -3, max: 2 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('one of graphs on zero', function () {
        it('Should shrink Y axes', function () {
            yaxes = [{ min: 0, max: 3 }, { min: 5, max: 10 }];
            expected = [{ min: 0, max: 3 }, { min: 0, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: 5, max: 10 }, { min: 0, max: 3 }];
            expected = [{ min: 0, max: 10 }, { min: 0, max: 3 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -3, max: 0 }, { min: -10, max: -5 }];
            expected = [{ min: -3, max: 0 }, { min: -10, max: 0 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -10, max: -5 }, { min: -3, max: 0 }];
            expected = [{ min: -10, max: 0 }, { min: -3, max: 0 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('both graphs on zero', function () {
        it('Should shrink Y axes', function () {
            yaxes = [{ min: 0, max: 3 }, { min: -10, max: 0 }];
            expected = [{ min: -3, max: 3 }, { min: -10, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -3, max: 0 }, { min: 0, max: 10 }];
            expected = [{ min: -3, max: 3 }, { min: -10, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('mixed placement of graphs relative to zero', function () {
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -10, max: 5 }, { min: 1, max: 3 }];
            expected = [{ min: -10, max: 5 }, { min: -6, max: 3 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: 1, max: 3 }, { min: -10, max: 5 }];
            expected = [{ min: -6, max: 3 }, { min: -10, max: 5 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -10, max: 5 }, { min: -3, max: -1 }];
            expected = [{ min: -10, max: 5 }, { min: -3, max: 1.5 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            yaxes = [{ min: -3, max: -1 }, { min: -10, max: 5 }];
            expected = [{ min: -3, max: 1.5 }, { min: -10, max: 5 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('on level not zero', function () {
        it('Should shrink Y axis', function () {
            alignY = 1;
            yaxes = [{ min: 5, max: 10 }, { min: 2, max: 4 }];
            expected = [{ min: 4, max: 10 }, { min: 2, max: 4 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            alignY = 2;
            yaxes = [{ min: -3, max: 1 }, { min: 5, max: 10 }];
            expected = [{ min: -3, max: 7 }, { min: -6, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            alignY = -1;
            yaxes = [{ min: -5, max: 5 }, { min: -2, max: 3 }];
            expected = [{ min: -5, max: 15 }, { min: -2, max: 3 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
        it('Should shrink Y axes', function () {
            alignY = -2;
            yaxes = [{ min: -2, max: 3 }, { min: 5, max: 10 }];
            expected = [{ min: -2, max: 3 }, { min: -2, max: 10 }];
            alignYLevel(yaxes, alignY);
            expect(yaxes).toMatchObject(expected);
        });
    });
    describe('on level not number value', function () {
        it('Should ignore without errors', function () {
            yaxes = [{ min: 5, max: 10 }, { min: 2, max: 4 }];
            expected = [{ min: 5, max: 10 }, { min: 2, max: 4 }];
            alignYLevel(yaxes, 'q');
            expect(yaxes).toMatchObject(expected);
        });
    });
});
//# sourceMappingURL=align_yaxes.test.js.map
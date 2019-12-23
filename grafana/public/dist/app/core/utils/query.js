import _ from 'lodash';
export var getNextRefIdChar = function (queries) {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return _.find(letters, function (refId) {
        return _.every(queries, function (other) {
            return other.refId !== refId;
        });
    });
};
//# sourceMappingURL=query.js.map
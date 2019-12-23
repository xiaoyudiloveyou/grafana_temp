/**
 * Just a simple wrapper for a react component that is actually implementing the query editor.
 */
var LokiAnnotationsQueryCtrl = /** @class */ (function () {
    /** @ngInject */
    function LokiAnnotationsQueryCtrl() {
        this.annotation.target = this.annotation.target || {};
        this.onQueryChange = this.onQueryChange.bind(this);
    }
    LokiAnnotationsQueryCtrl.prototype.onQueryChange = function (expr) {
        this.annotation.expr = expr;
    };
    LokiAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return LokiAnnotationsQueryCtrl;
}());
export { LokiAnnotationsQueryCtrl };
//# sourceMappingURL=LokiAnnotationsQueryCtrl.js.map
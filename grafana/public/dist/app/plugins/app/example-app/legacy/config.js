var ExampleConfigCtrl = /** @class */ (function () {
    /** @ngInject */
    function ExampleConfigCtrl($scope, $injector) {
        this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
        // Make sure it has a JSON Data spot
        if (!this.appModel) {
            this.appModel = {};
        }
        // Required until we get the types sorted on appModel :(
        var appModel = this.appModel;
        if (!appModel.jsonData) {
            appModel.jsonData = {};
        }
        console.log('ExampleConfigCtrl', this);
    }
    ExampleConfigCtrl.prototype.postUpdate = function () {
        if (!this.appModel.enabled) {
            console.log('Not enabled...');
            return;
        }
        // TODO, can do stuff after update
        console.log('Post Update:', this);
    };
    ExampleConfigCtrl.templateUrl = 'legacy/config.html';
    return ExampleConfigCtrl;
}());
export { ExampleConfigCtrl };
//# sourceMappingURL=config.js.map
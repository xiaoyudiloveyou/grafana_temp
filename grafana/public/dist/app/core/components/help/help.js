import coreModule from '../../core_module';
import appEvents from 'app/core/app_events';
var HelpCtrl = /** @class */ (function () {
    /** @ngInject */
    function HelpCtrl() {
        this.tabIndex = 0;
        this.shortcuts = {
            Global: [
                { keys: ['g', 'h'], description: 'Go to Home Dashboard' },
                { keys: ['g', 'p'], description: 'Go to Profile' },
                { keys: ['s', 'o'], description: 'Open search' },
                { keys: ['esc'], description: 'Exit edit/setting views' },
            ],
            Dashboard: [
                { keys: ['mod+s'], description: 'Save dashboard' },
                { keys: ['d', 'r'], description: 'Refresh all panels' },
                { keys: ['d', 's'], description: 'Dashboard settings' },
                { keys: ['d', 'v'], description: 'Toggle in-active / view mode' },
                { keys: ['d', 'k'], description: 'Toggle kiosk mode (hides top nav)' },
                { keys: ['d', 'E'], description: 'Expand all rows' },
                { keys: ['d', 'C'], description: 'Collapse all rows' },
                { keys: ['d', 'a'], description: 'Toggle auto fit panels (experimental feature)' },
                { keys: ['mod+o'], description: 'Toggle shared graph crosshair' },
                { keys: ['d', 'l'], description: 'Toggle all panel legends' },
            ],
            'Focused Panel': [
                { keys: ['e'], description: 'Toggle panel edit view' },
                { keys: ['v'], description: 'Toggle panel fullscreen view' },
                { keys: ['p', 's'], description: 'Open Panel Share Modal' },
                { keys: ['p', 'd'], description: 'Duplicate Panel' },
                { keys: ['p', 'r'], description: 'Remove Panel' },
                { keys: ['p', 'l'], description: 'Toggle panel legend' },
            ],
            'Time Range': [
                { keys: ['t', 'z'], description: 'Zoom out time range' },
                {
                    keys: ['t', '<i class="fa fa-long-arrow-left"></i>'],
                    description: 'Move time range back',
                },
                {
                    keys: ['t', '<i class="fa fa-long-arrow-right"></i>'],
                    description: 'Move time range forward',
                },
            ],
        };
    }
    HelpCtrl.prototype.dismiss = function () {
        appEvents.emit('hide-modal');
    };
    return HelpCtrl;
}());
export { HelpCtrl };
export function helpModal() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/help/help.html',
        controller: HelpCtrl,
        bindToController: true,
        transclude: true,
        controllerAs: 'ctrl',
        scope: {},
    };
}
coreModule.directive('helpModal', helpModal);
//# sourceMappingURL=help.js.map
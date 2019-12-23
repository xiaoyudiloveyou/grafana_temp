import coreModule from 'app/core/core_module';
var TimePickerCtrl = /** @class */ (function () {
    function TimePickerCtrl() {
        this.panel = this.dashboard.timepicker;
        this.panel.refresh_intervals = this.panel.refresh_intervals || [
            '5s',
            '10s',
            '30s',
            '1m',
            '5m',
            '15m',
            '30m',
            '1h',
            '2h',
            '1d',
        ];
    }
    return TimePickerCtrl;
}());
export { TimePickerCtrl };
var template = "\n<div class=\"editor-row\">\n\t<h5 class=\"section-heading\">Time Options</h5>\n\n  <div class=\"gf-form-group\">\n\t\t<div class=\"gf-form\">\n\t\t\t<label class=\"gf-form-label width-10\">Timezone</label>\n\t\t\t<div class=\"gf-form-select-wrapper\">\n\t\t\t\t<select ng-model=\"ctrl.dashboard.timezone\" class='gf-form-input' ng-options=\"f.value as f.text for f in\n\t\t\t\t  [{value: '', text: 'Default'}, {value: 'browser', text: 'Local browser time'},{value: 'utc', text: 'UTC'}]\">\n\t\t\t\t</select>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"gf-form\">\n\t\t\t<span class=\"gf-form-label width-10\">Auto-refresh</span>\n\t\t\t<input type=\"text\" class=\"gf-form-input max-width-25\" ng-model=\"ctrl.panel.refresh_intervals\" array-join>\n\t\t</div>\n\t\t<div class=\"gf-form\">\n\t\t\t<span class=\"gf-form-label width-10\">Now delay now-</span>\n\t\t\t<input type=\"text\" class=\"gf-form-input max-width-25\" ng-model=\"ctrl.panel.nowDelay\"\n\t\t\t    placeholder=\"0m\"\n\t\t\t    valid-time-span\n\t\t\t    bs-tooltip=\"'Enter 1m to ignore the last minute (because it can contain incomplete metrics)'\"\n \t\t\t\t  data-placement=\"right\">\n\t\t</div>\n\n\t\t<gf-form-switch class=\"gf-form\" label=\"Hide time picker\" checked=\"ctrl.panel.hidden\" label-class=\"width-10\">\n\t\t</gf-form-switch>\n\t</div>\n</div>\n";
export function TimePickerSettings() {
    return {
        restrict: 'E',
        template: template,
        controller: TimePickerCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            dashboard: '=',
        },
    };
}
coreModule.directive('gfTimePickerSettings', TimePickerSettings);
//# sourceMappingURL=TimePickerSettings.js.map
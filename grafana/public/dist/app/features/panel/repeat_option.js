import { coreModule } from 'app/core/core';
var template = "\n<div class=\"gf-form-select-wrapper max-width-18\">\n  <select class=\"gf-form-input\" ng-model=\"panel.repeat\" ng-options=\"f.value as f.text for f in variables\" ng-change=\"optionChanged()\">\n  <option value=\"\"></option>\n</div>\n";
/** @ngInject */
function dashRepeatOptionDirective(variableSrv) {
    return {
        restrict: 'E',
        template: template,
        scope: {
            panel: '=',
        },
        link: function (scope, element) {
            element.css({ display: 'block', width: '100%' });
            scope.variables = variableSrv.variables.map(function (item) {
                return { text: item.name, value: item.name };
            });
            if (scope.variables.length === 0) {
                scope.variables.unshift({
                    text: 'No template variables found',
                    value: null,
                });
            }
            scope.variables.unshift({ text: 'Disabled', value: null });
            // if repeat is set and no direction set to horizontal
            if (scope.panel.repeat && !scope.panel.repeatDirection) {
                scope.panel.repeatDirection = 'h';
            }
            scope.optionChanged = function () {
                if (scope.panel.repeat) {
                    scope.panel.repeatDirection = 'h';
                }
            };
        },
    };
}
coreModule.directive('dashRepeatOption', dashRepeatOptionDirective);
//# sourceMappingURL=repeat_option.js.map
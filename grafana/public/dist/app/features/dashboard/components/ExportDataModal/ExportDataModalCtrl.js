import angular from 'angular';
import * as fileExport from 'app/core/utils/file_export';
import appEvents from 'app/core/app_events';
var ExportDataModalCtrl = /** @class */ (function () {
    /** @ngInject */
    function ExportDataModalCtrl(dashboardSrv) {
        this.dashboardSrv = dashboardSrv;
        this.asRows = true;
        this.dateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';
        this.excel = false;
    }
    ExportDataModalCtrl.prototype.export = function () {
        var timezone = this.dashboardSrv.getCurrent().timezone;
        var options = {
            excel: this.excel,
            dateTimeFormat: this.dateTimeFormat,
            timezone: timezone,
        };
        if (this.panel === 'table') {
            fileExport.exportTableDataToCsv(this.data, this.excel);
        }
        else {
            if (this.asRows) {
                fileExport.exportSeriesListToCsv(this.data, options);
            }
            else {
                fileExport.exportSeriesListToCsvColumns(this.data, options);
            }
        }
        this.dismiss();
    };
    ExportDataModalCtrl.prototype.dismiss = function () {
        appEvents.emit('hide-modal');
    };
    return ExportDataModalCtrl;
}());
export { ExportDataModalCtrl };
export function exportDataModal() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/dashboard/components/ExportDataModal/template.html',
        controller: ExportDataModalCtrl,
        controllerAs: 'ctrl',
        scope: {
            panel: '<',
            data: '<',
        },
        bindToController: true,
    };
}
angular.module('grafana.directives').directive('exportDataModal', exportDataModal);
//# sourceMappingURL=ExportDataModalCtrl.js.map
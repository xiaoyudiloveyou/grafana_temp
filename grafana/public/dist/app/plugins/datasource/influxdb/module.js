import InfluxDatasource from './datasource';
import { InfluxQueryCtrl } from './query_ctrl';
import { InfluxLogsQueryField } from './components/InfluxLogsQueryField';
import InfluxStartPage from './components/InfluxStartPage';
import { createChangeHandler, createResetHandler, PasswordFieldEnum, } from '../../../features/datasources/utils/passwordHandlers';
import { DataSourcePlugin } from '@grafana/ui';
var InfluxConfigCtrl = /** @class */ (function () {
    function InfluxConfigCtrl() {
        this.httpMode = [{ name: 'GET', value: 'GET' }, { name: 'POST', value: 'POST' }];
        this.onPasswordReset = createResetHandler(this, PasswordFieldEnum.Password);
        this.onPasswordChange = createChangeHandler(this, PasswordFieldEnum.Password);
        this.current.jsonData.httpMode = this.current.jsonData.httpMode || 'GET';
    }
    InfluxConfigCtrl.templateUrl = 'partials/config.html';
    return InfluxConfigCtrl;
}());
var InfluxAnnotationsQueryCtrl = /** @class */ (function () {
    function InfluxAnnotationsQueryCtrl() {
    }
    InfluxAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return InfluxAnnotationsQueryCtrl;
}());
export var plugin = new DataSourcePlugin(InfluxDatasource)
    .setConfigCtrl(InfluxConfigCtrl)
    .setQueryCtrl(InfluxQueryCtrl)
    .setAnnotationQueryCtrl(InfluxAnnotationsQueryCtrl)
    .setExploreLogsQueryField(InfluxLogsQueryField)
    .setExploreStartPage(InfluxStartPage);
//# sourceMappingURL=module.js.map
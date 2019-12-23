import { DataSourcePlugin } from '@grafana/ui';
import { TestDataDataSource } from './datasource';
import { TestDataQueryCtrl } from './query_ctrl';
import { TestInfoTab } from './TestInfoTab';
import { ConfigEditor } from './ConfigEditor';
var TestDataAnnotationsQueryCtrl = /** @class */ (function () {
    function TestDataAnnotationsQueryCtrl() {
    }
    TestDataAnnotationsQueryCtrl.template = '<h2>Annotation scenario</h2>';
    return TestDataAnnotationsQueryCtrl;
}());
export var plugin = new DataSourcePlugin(TestDataDataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryCtrl(TestDataQueryCtrl)
    .setAnnotationQueryCtrl(TestDataAnnotationsQueryCtrl)
    .addConfigPage({
    title: 'Setup',
    icon: 'fa fa-list-alt',
    body: TestInfoTab,
    id: 'setup',
});
//# sourceMappingURL=module.js.map
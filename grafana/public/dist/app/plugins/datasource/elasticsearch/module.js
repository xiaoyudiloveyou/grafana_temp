import { DataSourcePlugin } from '@grafana/ui';
import { ElasticDatasource } from './datasource';
import { ElasticQueryCtrl } from './query_ctrl';
import { ElasticConfigCtrl } from './config_ctrl';
import ElasticsearchQueryField from './components/ElasticsearchQueryField';
var ElasticAnnotationsQueryCtrl = /** @class */ (function () {
    function ElasticAnnotationsQueryCtrl() {
    }
    ElasticAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    return ElasticAnnotationsQueryCtrl;
}());
export var plugin = new DataSourcePlugin(ElasticDatasource)
    .setQueryCtrl(ElasticQueryCtrl)
    .setConfigCtrl(ElasticConfigCtrl)
    .setExploreLogsQueryField(ElasticsearchQueryField)
    .setAnnotationQueryCtrl(ElasticAnnotationsQueryCtrl);
//# sourceMappingURL=module.js.map
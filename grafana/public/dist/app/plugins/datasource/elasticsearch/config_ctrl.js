import _ from 'lodash';
import { getMaxConcurrenShardRequestOrDefault } from './datasource';
var ElasticConfigCtrl = /** @class */ (function () {
    /** @ngInject */
    function ElasticConfigCtrl($scope) {
        this.indexPatternTypes = [
            { name: 'No pattern', value: undefined },
            { name: 'Hourly', value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
            { name: 'Daily', value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
            { name: 'Weekly', value: 'Weekly', example: '[logstash-]GGGG.WW' },
            { name: 'Monthly', value: 'Monthly', example: '[logstash-]YYYY.MM' },
            { name: 'Yearly', value: 'Yearly', example: '[logstash-]YYYY' },
        ];
        this.esVersions = [
            { name: '2.x', value: 2 },
            { name: '5.x', value: 5 },
            { name: '5.6+', value: 56 },
            { name: '6.0+', value: 60 },
            { name: '7.0+', value: 70 },
        ];
        this.current.jsonData.timeField = this.current.jsonData.timeField || '@timestamp';
        this.current.jsonData.esVersion = this.current.jsonData.esVersion || 5;
        var defaultMaxConcurrentShardRequests = this.current.jsonData.esVersion >= 70 ? 5 : 256;
        this.current.jsonData.maxConcurrentShardRequests =
            this.current.jsonData.maxConcurrentShardRequests || defaultMaxConcurrentShardRequests;
        this.current.jsonData.logMessageField = this.current.jsonData.logMessageField || '';
        this.current.jsonData.logLevelField = this.current.jsonData.logLevelField || '';
    }
    ElasticConfigCtrl.prototype.indexPatternTypeChanged = function () {
        if (!this.current.database ||
            this.current.database.length === 0 ||
            this.current.database.startsWith('[logstash-]')) {
            var def = _.find(this.indexPatternTypes, {
                value: this.current.jsonData.interval,
            });
            this.current.database = def.example || 'es-index-name';
        }
    };
    ElasticConfigCtrl.prototype.versionChanged = function () {
        this.current.jsonData.maxConcurrentShardRequests = getMaxConcurrenShardRequestOrDefault(this.current.jsonData);
    };
    ElasticConfigCtrl.templateUrl = 'public/app/plugins/datasource/elasticsearch/partials/config.html';
    return ElasticConfigCtrl;
}());
export { ElasticConfigCtrl };
//# sourceMappingURL=config_ctrl.js.map
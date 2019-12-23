import * as tslib_1 from "tslib";
import _ from 'lodash';
import { QueryCtrl } from 'app/plugins/sdk';
import { defaultQuery } from './runStreams';
import { getBackendSrv } from 'app/core/services/backend_srv';
import { dateTime } from '@grafana/data';
export var defaultPulse = {
    timeStep: 60,
    onCount: 3,
    onValue: 2,
    offCount: 3,
    offValue: 1,
};
export var defaultCSVWave = {
    timeStep: 60,
    valuesCSV: '0,0,2,2,1,1',
};
var showLabelsFor = ['random_walk', 'predictable_pulse', 'predictable_csv_wave'];
var TestDataQueryCtrl = /** @class */ (function (_super) {
    tslib_1.__extends(TestDataQueryCtrl, _super);
    /** @ngInject */
    function TestDataQueryCtrl($scope, $injector) {
        var _this = _super.call(this, $scope, $injector) || this;
        _this.showLabels = false;
        _this.target.scenarioId = _this.target.scenarioId || 'random_walk';
        _this.scenarioList = [];
        _this.newPointTime = dateTime();
        _this.selectedPoint = { text: 'Select point', value: null };
        _this.showLabels = showLabelsFor.includes(_this.target.scenarioId);
        return _this;
    }
    TestDataQueryCtrl.prototype.getPoints = function () {
        return _.map(this.target.points, function (point, index) {
            return {
                text: dateTime(point[1]).format('MMMM Do YYYY, H:mm:ss') + ' : ' + point[0],
                value: index,
            };
        });
    };
    TestDataQueryCtrl.prototype.pointSelected = function (option) {
        this.selectedPoint = option;
    };
    TestDataQueryCtrl.prototype.deletePoint = function () {
        this.target.points.splice(this.selectedPoint.value, 1);
        this.selectedPoint = { text: 'Select point', value: null };
        this.refresh();
    };
    TestDataQueryCtrl.prototype.addPoint = function () {
        this.target.points = this.target.points || [];
        this.target.points.push([this.newPointValue, this.newPointTime.valueOf()]);
        this.target.points = _.sortBy(this.target.points, function (p) { return p[1]; });
        this.refresh();
    };
    TestDataQueryCtrl.prototype.$onInit = function () {
        var _this = this;
        return getBackendSrv()
            .get('/api/tsdb/testdata/scenarios')
            .then(function (res) {
            _this.scenarioList = res;
            _this.scenario = _.find(_this.scenarioList, { id: _this.target.scenarioId });
        });
    };
    TestDataQueryCtrl.prototype.scenarioChanged = function () {
        this.scenario = _.find(this.scenarioList, { id: this.target.scenarioId });
        this.target.stringInput = this.scenario.stringInput;
        this.showLabels = showLabelsFor.includes(this.target.scenarioId);
        if (this.target.scenarioId === 'manual_entry') {
            this.target.points = this.target.points || [];
        }
        else {
            delete this.target.points;
        }
        if (this.target.scenarioId === 'streaming_client') {
            this.target.stream = _.defaults(this.target.stream || {}, defaultQuery);
        }
        else {
            delete this.target.stream;
        }
        if (this.target.scenarioId === 'predictable_pulse') {
            this.target.pulseWave = _.defaults(this.target.pulseWave || {}, defaultPulse);
        }
        else {
            delete this.target.pulseWave;
        }
        if (this.target.scenarioId === 'predictable_csv_wave') {
            this.target.csvWave = _.defaults(this.target.csvWave || {}, defaultCSVWave);
        }
        else {
            delete this.target.csvWave;
        }
        this.refresh();
    };
    TestDataQueryCtrl.prototype.streamChanged = function () {
        this.refresh();
    };
    TestDataQueryCtrl.templateUrl = 'partials/query.editor.html';
    return TestDataQueryCtrl;
}(QueryCtrl));
export { TestDataQueryCtrl };
//# sourceMappingURL=query_ctrl.js.map
import { LinkSrv } from '../link_srv';
import { DataLinkBuiltInVars } from '@grafana/ui';
import { TimeSrv } from 'app/features/dashboard/services/TimeSrv';
import { TemplateSrv } from 'app/features/templating/template_srv';
import { advanceTo } from 'jest-date-mock';
jest.mock('angular', function () {
    var AngularJSMock = require('test/mocks/angular');
    return new AngularJSMock();
});
var dataPointMock = {
    seriesName: 'A-series',
    datapoint: [1000000001, 1],
};
describe('linkSrv', function () {
    var linkSrv;
    function initLinkSrv() {
        var rootScope = {
            $on: jest.fn(),
            onAppEvent: jest.fn(),
            appEvent: jest.fn(),
        };
        var timer = {
            register: jest.fn(),
            cancel: jest.fn(),
            cancelAll: jest.fn(),
        };
        var location = {
            search: jest.fn(function () { return ({}); }),
        };
        var _dashboard = {
            time: { from: 'now-6h', to: 'now' },
            getTimezone: jest.fn(function () { return 'browser'; }),
        };
        var timeSrv = new TimeSrv(rootScope, jest.fn(), location, timer, {});
        timeSrv.init(_dashboard);
        timeSrv.setTime({ from: 'now-1h', to: 'now' });
        _dashboard.refresh = false;
        var _templateSrv = new TemplateSrv();
        _templateSrv.init([
            {
                type: 'query',
                name: 'test1',
                current: { value: 'val1' },
                getValueForUrl: function () {
                    return this.current.value;
                },
            },
            {
                type: 'query',
                name: 'test2',
                current: { value: 'val2' },
                getValueForUrl: function () {
                    return this.current.value;
                },
            },
        ]);
        linkSrv = new LinkSrv(_templateSrv, timeSrv);
    }
    beforeEach(function () {
        initLinkSrv();
        advanceTo(1000000000);
    });
    describe('built in variables', function () {
        it('should add time range to url if $__url_time_range variable present', function () {
            expect(linkSrv.getDataLinkUIModel({
                title: 'Any title',
                url: "/d/1?$" + DataLinkBuiltInVars.keepTime,
            }, {}, {}).href).toEqual('/d/1?from=now-1h&to=now');
        });
        it('should add all variables to url if $__all_variables variable present', function () {
            expect(linkSrv.getDataLinkUIModel({
                title: 'Any title',
                url: "/d/1?$" + DataLinkBuiltInVars.includeVars,
            }, {}, {}).href).toEqual('/d/1?var-test1=val1&var-test2=val2');
        });
        it('should interpolate series name', function () {
            expect(linkSrv.getDataLinkUIModel({
                title: 'Any title',
                url: "/d/1?var-test=${" + DataLinkBuiltInVars.seriesName + "}",
            }, {
                __series: {
                    value: {
                        name: 'A-series',
                    },
                    text: 'A-series',
                },
            }, {}).href).toEqual('/d/1?var-test=A-series');
        });
        it('should interpolate value time', function () {
            expect(linkSrv.getDataLinkUIModel({
                title: 'Any title',
                url: "/d/1?time=${" + DataLinkBuiltInVars.valueTime + "}",
            }, {
                __value: {
                    value: { time: dataPointMock.datapoint[0] },
                    text: 'Value',
                },
            }, {}).href).toEqual('/d/1?time=1000000001');
        });
    });
});
//# sourceMappingURL=link_srv.test.js.map
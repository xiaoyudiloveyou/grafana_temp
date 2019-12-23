import * as tslib_1 from "tslib";
import React from 'react';
import { shallow } from 'enzyme';
import AnalyticsConfig from './AnalyticsConfig';
var setup = function (propOverrides) {
    var props = {
        datasourceConfig: {
            id: 21,
            orgId: 1,
            name: 'Azure Monitor-10-10',
            type: 'grafana-azure-monitor-datasource',
            typeLogoUrl: '',
            access: 'proxy',
            url: '',
            password: '',
            user: '',
            database: '',
            basicAuth: false,
            basicAuthUser: '',
            basicAuthPassword: '',
            withCredentials: false,
            isDefault: false,
            jsonData: {
                azureLogAnalyticsSameAs: false,
            },
            secureJsonFields: {
                logAnalyticsClientSecret: false,
            },
            editorJsonData: {
                logAnalyticsDefaultWorkspace: '',
                logAnalyticsClientSecret: '',
                logAnalyticsTenantId: '',
            },
            editorSecureJsonData: {
                logAnalyticsClientSecret: '',
            },
            version: 1,
            readOnly: false,
        },
        logAnalyticsSubscriptions: [],
        logAnalyticsWorkspaces: [],
        onDatasourceUpdate: jest.fn(),
        onLoadSubscriptions: jest.fn(),
        onLoadWorkspaces: jest.fn(),
    };
    Object.assign(props, propOverrides);
    return shallow(React.createElement(AnalyticsConfig, tslib_1.__assign({}, props)));
};
describe('Render', function () {
    it('should render component', function () {
        var wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('should disable log analytics credentials form', function () {
        var wrapper = setup({
            jsonData: {
                azureLogAnalyticsSameAs: true,
            },
        });
        expect(wrapper).toMatchSnapshot();
    });
    it('should enable azure log analytics load workspaces button', function () {
        var wrapper = setup({
            editorJsonData: {
                logAnalyticsDefaultWorkspace: '',
                logAnalyticsTenantId: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
                logAnalyticsClientId: '44693801-6ee6-49de-9b2d-9106972f9572',
                logAnalyticsSubscriptionId: 'e3fe4fde-ad5e-4d60-9974-e2f3562ffdf2',
                logAnalyticsClientSecret: 'cddcc020-2c94-460a-a3d0-df3147ffa792',
            },
        });
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=AnalyticsConfig.test.js.map
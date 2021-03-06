import * as tslib_1 from "tslib";
import React from 'react';
import { shallow } from 'enzyme';
import InsightsConfig from './InsightsConfig';
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
            jsonData: {},
            secureJsonFields: {
                appInsightsApiKey: false,
            },
            editorJsonData: {
                appInsightsAppId: 'cddcc020-2c94-460a-a3d0-df3147ffa792',
            },
            editorSecureJsonData: {
                appInsightsApiKey: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
            },
            version: 1,
            readOnly: false,
        },
        onDatasourceUpdate: jest.fn(),
    };
    Object.assign(props, propOverrides);
    return shallow(React.createElement(InsightsConfig, tslib_1.__assign({}, props)));
};
describe('Render', function () {
    it('should render component', function () {
        var wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('should disable insights api key input', function () {
        var wrapper = setup({
            datasourceConfig: {
                secureJsonFields: {
                    appInsightsApiKey: true,
                },
                editorJsonData: {
                    appInsightsAppId: 'cddcc020-2c94-460a-a3d0-df3147ffa792',
                },
                editorSecureJsonData: {
                    appInsightsApiKey: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
                },
            },
        });
        expect(wrapper).toMatchSnapshot();
    });
    it('should enable insights api key input', function () {
        var wrapper = setup({
            datasourceConfig: {
                secureJsonFields: {
                    appInsightsApiKey: false,
                },
                editorJsonData: {
                    appInsightsAppId: 'cddcc020-2c94-460a-a3d0-df3147ffa792',
                },
                editorSecureJsonData: {
                    appInsightsApiKey: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
                },
            },
        });
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=InsightsConfig.test.js.map
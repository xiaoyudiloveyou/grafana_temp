import * as tslib_1 from "tslib";
import React from 'react';
import { shallow } from 'enzyme';
import ConfigEditor from './ConfigEditor';
var setup = function () {
    var props = {
        options: {
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
                azureLogAnalyticsSameAs: true,
                cloudName: 'azuremonitor',
            },
            secureJsonFields: {},
            version: 1,
            readOnly: false,
        },
        onOptionsChange: jest.fn(),
    };
    return shallow(React.createElement(ConfigEditor, tslib_1.__assign({}, props)));
};
describe('Render', function () {
    it('should render component', function () {
        var wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=ConfigEditor.test.js.map
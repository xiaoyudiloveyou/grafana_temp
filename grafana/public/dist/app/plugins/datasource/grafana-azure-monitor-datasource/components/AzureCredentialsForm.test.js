import * as tslib_1 from "tslib";
import React from 'react';
import { shallow } from 'enzyme';
import AzureCredentialsForm from './AzureCredentialsForm';
var setup = function (propOverrides) {
    var props = {
        selectedAzureCloud: 'azuremonitor',
        selectedSubscription: '44693801-6ee6-49de-9b2d-9106972f9572',
        azureCloudOptions: [
            { value: 'azuremonitor', label: 'Azure' },
            { value: 'govazuremonitor', label: 'Azure US Government' },
            { value: 'germanyazuremonitor', label: 'Azure Germany' },
            { value: 'chinaazuremonitor', label: 'Azure China' },
        ],
        tenantId: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
        clientId: '77409fad-c0a9-45df-9e25-f1ff95af6554',
        clientSecret: '',
        clientSecretConfigured: false,
        subscriptionOptions: [],
        onAzureCloudChange: jest.fn(),
        onSubscriptionSelectChange: jest.fn(),
        onTenantIdChange: jest.fn(),
        onClientIdChange: jest.fn(),
        onClientSecretChange: jest.fn(),
        onResetClientSecret: jest.fn(),
        onLoadSubscriptions: jest.fn(),
    };
    Object.assign(props, propOverrides);
    return shallow(React.createElement(AzureCredentialsForm, tslib_1.__assign({}, props)));
};
describe('Render', function () {
    it('should render component', function () {
        var wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('should disable azure monitor secret input', function () {
        var wrapper = setup({
            clientSecretConfigured: true,
        });
        expect(wrapper).toMatchSnapshot();
    });
    it('should enable azure monitor load subscriptions button', function () {
        var wrapper = setup({
            clientSecret: 'e7f3f661-a933-4b3f-8176-51c4f982ec48',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=AzureCredentialsForm.test.js.map
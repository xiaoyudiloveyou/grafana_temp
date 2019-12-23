import React from 'react';
import { shallow } from 'enzyme';
import { QueryField } from './QueryField';
describe('<QueryField />', function () {
    it('should render with null initial value', function () {
        var wrapper = shallow(React.createElement(QueryField, { query: null }));
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
    it('should render with empty initial value', function () {
        var wrapper = shallow(React.createElement(QueryField, { query: "" }));
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
    it('should render with initial value', function () {
        var wrapper = shallow(React.createElement(QueryField, { query: "my query" }));
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
});
//# sourceMappingURL=QueryField.test.js.map
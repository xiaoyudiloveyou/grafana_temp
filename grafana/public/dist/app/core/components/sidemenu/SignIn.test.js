import React from 'react';
import { shallow } from 'enzyme';
import { SignIn } from './SignIn';
describe('Render', function () {
    it('should render component', function () {
        var wrapper = shallow(React.createElement(SignIn, { url: "/" }));
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=SignIn.test.js.map
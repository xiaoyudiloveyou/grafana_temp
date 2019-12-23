import React from 'react';
import { shallow } from 'enzyme';
import { LoadingState } from '@grafana/data';
import QueryStatus from './QueryStatus';
describe('<QueryStatus />', function () {
    it('should render with a latency', function () {
        var res = { series: [], state: LoadingState.Done, timeRange: {} };
        var wrapper = shallow(React.createElement(QueryStatus, { latency: 0, queryResponse: res }));
        expect(wrapper.find('div').exists()).toBeTruthy();
    });
    it('should not render when query has not started', function () {
        var res = { series: [], state: LoadingState.NotStarted, timeRange: {} };
        var wrapper = shallow(React.createElement(QueryStatus, { latency: 0, queryResponse: res }));
        expect(wrapper.getElement()).toBe(null);
    });
});
//# sourceMappingURL=QueryStatus.test.js.map
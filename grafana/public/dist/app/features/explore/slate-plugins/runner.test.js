import Plain from 'slate-plain-serializer';
import React from 'react';
import { Editor } from '@grafana/slate-react';
import { shallow } from 'enzyme';
import RunnerPlugin from './runner';
describe('runner', function () {
    var mockHandler = jest.fn();
    var handler = RunnerPlugin({ handler: mockHandler }).onKeyDown;
    it('should execute query when enter is pressed and there are no suggestions visible', function () {
        var value = Plain.deserialize('');
        var editor = shallow(React.createElement(Editor, { value: value }));
        handler({ key: 'Enter', preventDefault: function () { } }, editor.instance(), function () { });
        expect(mockHandler).toBeCalled();
    });
});
//# sourceMappingURL=runner.test.js.map
import Plain from 'slate-plain-serializer';
import React from 'react';
import { Editor } from '@grafana/slate-react';
import { shallow } from 'enzyme';
import ClearPlugin from './clear';
describe('clear', function () {
    var handler = ClearPlugin().onKeyDown;
    it('does not change the empty value', function () {
        var value = Plain.deserialize('');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
        });
        handler(event, editor.instance(), function () { });
        expect(Plain.serialize(editor.instance().value)).toEqual('');
    });
    it('clears to the end of the line', function () {
        var value = Plain.deserialize('foo');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
        });
        handler(event, editor.instance(), function () { });
        expect(Plain.serialize(editor.instance().value)).toEqual('');
    });
    it('clears from the middle to the end of the line', function () {
        var value = Plain.deserialize('foo bar');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
        });
        handler(event, editor.instance().moveForward(4), function () { });
        expect(Plain.serialize(editor.instance().value)).toEqual('foo ');
    });
});
//# sourceMappingURL=clear.test.js.map
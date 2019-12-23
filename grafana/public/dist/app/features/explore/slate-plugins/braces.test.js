import React from 'react';
import Plain from 'slate-plain-serializer';
import { Editor } from '@grafana/slate-react';
import { shallow } from 'enzyme';
import BracesPlugin from './braces';
describe('braces', function () {
    var handler = BracesPlugin().onKeyDown;
    var nextMock = function () { };
    it('adds closing braces around empty value', function () {
        var value = Plain.deserialize('');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', { key: '(' });
        handler(event, editor.instance(), nextMock);
        expect(Plain.serialize(editor.instance().value)).toEqual('()');
    });
    it('removes closing brace when opening brace is removed', function () {
        var value = Plain.deserialize('time()');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
        handler(event, editor.instance().moveForward(5), nextMock);
        expect(Plain.serialize(editor.instance().value)).toEqual('time');
    });
    it('keeps closing brace when opening brace is removed and inner values exist', function () {
        var value = Plain.deserialize('time(value)');
        var editor = shallow(React.createElement(Editor, { value: value }));
        var event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
        var handled = handler(event, editor.instance().moveForward(5), nextMock);
        expect(handled).toBeFalsy();
    });
});
//# sourceMappingURL=braces.test.js.map
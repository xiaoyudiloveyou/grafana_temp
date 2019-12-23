var BRACES = {
    '[': ']',
    '{': '}',
    '(': ')',
};
export default function BracesPlugin() {
    return {
        onKeyDown: function (event, editor, next) {
            var value = editor.value;
            switch (event.key) {
                case '(':
                case '{':
                case '[': {
                    event.preventDefault();
                    var _a = value.selection, _b = _a.start, startOffset = _b.offset, startKey = _b.key, _c = _a.end, endOffset = _c.offset, endKey = _c.key, focusOffset = _a.focus.offset;
                    var text = value.focusText.text;
                    // If text is selected, wrap selected text in parens
                    if (value.selection.isExpanded) {
                        editor
                            .insertTextByKey(startKey, startOffset, event.key)
                            .insertTextByKey(endKey, endOffset + 1, BRACES[event.key])
                            .moveEndBackward(1);
                    }
                    else if (focusOffset === text.length ||
                        text[focusOffset] === ' ' ||
                        Object.values(BRACES).includes(text[focusOffset])) {
                        editor.insertText("" + event.key + BRACES[event.key]).moveBackward(1);
                    }
                    else {
                        editor.insertText(event.key);
                    }
                    return true;
                }
                case 'Backspace': {
                    var text = value.anchorText.text;
                    var offset = value.selection.anchor.offset;
                    var previousChar = text[offset - 1];
                    var nextChar = text[offset];
                    if (BRACES[previousChar] && BRACES[previousChar] === nextChar) {
                        event.preventDefault();
                        // Remove closing brace if directly following
                        editor
                            .deleteBackward(1)
                            .deleteForward(1)
                            .focus();
                        return true;
                    }
                }
                default: {
                    break;
                }
            }
            return next();
        },
    };
}
//# sourceMappingURL=braces.js.map
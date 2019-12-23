// Clears the rest of the line after the caret
export default function ClearPlugin() {
    return {
        onKeyDown: function (event, editor, next) {
            var value = editor.value;
            if (value.selection.isExpanded) {
                return next();
            }
            if (event.key === 'k' && event.ctrlKey) {
                event.preventDefault();
                var text = value.anchorText.text;
                var offset = value.selection.anchor.offset;
                var length_1 = text.length;
                var forward = length_1 - offset;
                editor.deleteForward(forward);
                return true;
            }
            return next();
        },
    };
}
//# sourceMappingURL=clear.js.map
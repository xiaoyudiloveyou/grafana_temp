import { isKeyHotkey } from 'is-hotkey';
var isSelectLineHotkey = isKeyHotkey('mod+l');
// Clears the rest of the line after the caret
export default function SelectionShortcutsPlugin() {
    return {
        onKeyDown: function (event, editor, next) {
            if (isSelectLineHotkey(event)) {
                event.preventDefault();
                var _a = editor.value, focusBlock = _a.focusBlock, document_1 = _a.document;
                editor.moveAnchorToStartOfBlock();
                var nextBlock = document_1.getNextBlock(focusBlock.key);
                if (nextBlock) {
                    editor.moveFocusToStartOfNextBlock();
                }
                else {
                    editor.moveFocusToEndOfText();
                }
            }
            else {
                return next();
            }
            return true;
        },
    };
}
//# sourceMappingURL=selection_shortcuts.js.map
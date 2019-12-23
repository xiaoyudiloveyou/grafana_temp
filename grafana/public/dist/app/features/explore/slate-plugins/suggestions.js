import { __assign, __awaiter, __generator } from "tslib";
import React from 'react';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import TOKEN_MARK from '@grafana/ui/src/slate-plugins/slate-prism/TOKEN_MARK';
import { TypeaheadWithTheme } from '../Typeahead';
import { makeFragment } from '@grafana/ui';
export var TYPEAHEAD_DEBOUNCE = 100;
var state = {
    groupedItems: [],
    typeaheadPrefix: '',
    typeaheadContext: '',
    typeaheadText: '',
};
export default function SuggestionsPlugin(_a) {
    var onTypeahead = _a.onTypeahead, cleanText = _a.cleanText, onWillApplySuggestion = _a.onWillApplySuggestion, syntax = _a.syntax, portalOrigin = _a.portalOrigin, component = _a.component;
    return {
        onBlur: function (event, editor, next) {
            state = __assign(__assign({}, state), { groupedItems: [] });
            return next();
        },
        onClick: function (event, editor, next) {
            state = __assign(__assign({}, state), { groupedItems: [] });
            return next();
        },
        onKeyDown: function (event, editor, next) {
            var currentSuggestions = state.groupedItems;
            var hasSuggestions = currentSuggestions.length;
            switch (event.key) {
                case 'Escape': {
                    if (hasSuggestions) {
                        event.preventDefault();
                        state = __assign(__assign({}, state), { groupedItems: [] });
                        // Bogus edit to re-render editor
                        return editor.insertText('');
                    }
                    break;
                }
                case 'ArrowDown':
                case 'ArrowUp':
                    if (hasSuggestions) {
                        event.preventDefault();
                        component.typeaheadRef.moveMenuIndex(event.key === 'ArrowDown' ? 1 : -1);
                        return;
                    }
                    break;
                case 'Enter':
                case 'Tab': {
                    if (hasSuggestions) {
                        event.preventDefault();
                        component.typeaheadRef.insertSuggestion();
                        return handleTypeahead(event, editor, onTypeahead, cleanText);
                    }
                    break;
                }
                default: {
                    handleTypeahead(event, editor, onTypeahead, cleanText);
                    break;
                }
            }
            return next();
        },
        commands: {
            selectSuggestion: function (editor, suggestion) {
                var suggestions = state.groupedItems;
                if (!suggestions || !suggestions.length) {
                    return editor;
                }
                // @ts-ignore
                return editor.applyTypeahead(suggestion);
            },
            applyTypeahead: function (editor, suggestion) {
                var suggestionText = suggestion.insertText || suggestion.label;
                var preserveSuffix = suggestion.kind === 'function';
                var move = suggestion.move || 0;
                var typeaheadPrefix = state.typeaheadPrefix, typeaheadText = state.typeaheadText, typeaheadContext = state.typeaheadContext;
                if (onWillApplySuggestion) {
                    suggestionText = onWillApplySuggestion(suggestionText, {
                        groupedItems: state.groupedItems,
                        typeaheadContext: typeaheadContext,
                        typeaheadPrefix: typeaheadPrefix,
                        typeaheadText: typeaheadText,
                    });
                }
                // Remove the current, incomplete text and replace it with the selected suggestion
                var backward = suggestion.deleteBackwards || typeaheadPrefix.length;
                var text = cleanText ? cleanText(typeaheadText) : typeaheadText;
                var suffixLength = text.length - typeaheadPrefix.length;
                var offset = typeaheadText.indexOf(typeaheadPrefix);
                var midWord = typeaheadPrefix && ((suffixLength > 0 && offset > -1) || suggestionText === typeaheadText);
                var forward = midWord && !preserveSuffix ? suffixLength + offset : 0;
                // If new-lines, apply suggestion as block
                if (suggestionText.match(/\n/)) {
                    var fragment = makeFragment(suggestionText);
                    return editor
                        .deleteBackward(backward)
                        .deleteForward(forward)
                        .insertFragment(fragment)
                        .focus();
                }
                state = __assign(__assign({}, state), { groupedItems: [] });
                return editor
                    .deleteBackward(backward)
                    .deleteForward(forward)
                    .insertText(suggestionText)
                    .moveForward(move)
                    .focus();
            },
        },
        renderEditor: function (props, editor, next) {
            if (editor.value.selection.isExpanded) {
                return next();
            }
            var children = next();
            return (React.createElement(React.Fragment, null,
                children,
                React.createElement(TypeaheadWithTheme, { menuRef: function (el) { return (component.typeaheadRef = el); }, origin: portalOrigin, prefix: state.typeaheadPrefix, isOpen: !!state.groupedItems.length, groupedItems: state.groupedItems, 
                    //@ts-ignore
                    onSelectSuggestion: editor.selectSuggestion })));
        },
    };
}
var handleTypeahead = debounce(function (event, editor, onTypeahead, cleanText) { return __awaiter(void 0, void 0, void 0, function () {
    var value, selection, parentBlock, myOffset, decorations, filteredDecorations, labelKeyDec, labelKey, wrapperClasses, text, prefix, labelValueMatch, _a, suggestions, context, filteredSuggestions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!onTypeahead) {
                    return [2 /*return*/, null];
                }
                value = editor.value;
                selection = value.selection;
                parentBlock = value.document.getClosestBlock(value.focusBlock.key);
                myOffset = value.selection.start.offset - 1;
                decorations = parentBlock.getDecorations(editor);
                filteredDecorations = decorations
                    .filter(function (decoration) {
                    return decoration.start.offset <= myOffset && decoration.end.offset > myOffset && decoration.type === TOKEN_MARK;
                })
                    .toArray();
                labelKeyDec = decorations
                    .filter(function (decoration) {
                    return (decoration.end.offset <= myOffset &&
                        decoration.type === TOKEN_MARK &&
                        decoration.data.get('className').includes('label-key'));
                })
                    .last();
                labelKey = labelKeyDec && value.focusText.text.slice(labelKeyDec.start.offset, labelKeyDec.end.offset);
                wrapperClasses = filteredDecorations
                    .map(function (decoration) { return decoration.data.get('className'); })
                    .join(' ')
                    .split(' ')
                    .filter(function (className) { return className.length; });
                text = value.focusText.text;
                prefix = text.slice(0, selection.focus.offset);
                if (filteredDecorations.length) {
                    text = value.focusText.text.slice(filteredDecorations[0].start.offset, filteredDecorations[0].end.offset);
                    prefix = value.focusText.text.slice(filteredDecorations[0].start.offset, selection.focus.offset);
                }
                labelValueMatch = prefix.match(/(?:!?=~?"?|")(.*)/);
                if (labelValueMatch) {
                    prefix = labelValueMatch[1];
                }
                else if (cleanText) {
                    prefix = cleanText(prefix);
                }
                return [4 /*yield*/, onTypeahead({
                        prefix: prefix,
                        text: text,
                        value: value,
                        wrapperClasses: wrapperClasses,
                        labelKey: labelKey,
                    })];
            case 1:
                _a = _b.sent(), suggestions = _a.suggestions, context = _a.context;
                filteredSuggestions = suggestions
                    .map(function (group) {
                    if (!group.items) {
                        return group;
                    }
                    if (prefix) {
                        // Filter groups based on prefix
                        if (!group.skipFilter) {
                            group.items = group.items.filter(function (c) { return (c.filterText || c.label).length >= prefix.length; });
                            if (group.prefixMatch) {
                                group.items = group.items.filter(function (c) { return (c.filterText || c.label).startsWith(prefix); });
                            }
                            else {
                                group.items = group.items.filter(function (c) { return (c.filterText || c.label).includes(prefix); });
                            }
                        }
                        // Filter out the already typed value (prefix) unless it inserts custom text
                        group.items = group.items.filter(function (c) { return c.insertText || (c.filterText || c.label) !== prefix; });
                    }
                    if (!group.skipSort) {
                        group.items = sortBy(group.items, function (item) { return item.sortText || item.label; });
                    }
                    return group;
                })
                    .filter(function (group) { return group.items && group.items.length; });
                state = __assign(__assign({}, state), { groupedItems: filteredSuggestions, typeaheadPrefix: prefix, typeaheadContext: context, typeaheadText: text });
                // Bogus edit to force re-render
                return [2 /*return*/, editor.blur().focus()];
        }
    });
}); }, TYPEAHEAD_DEBOUNCE);
//# sourceMappingURL=suggestions.js.map
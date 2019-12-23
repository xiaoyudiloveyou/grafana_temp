import { __extends } from "tslib";
import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { FixedSizeList } from 'react-window';
import { withTheme } from '@grafana/ui';
import { CompletionItemKind } from 'app/types/explore';
import { TypeaheadItem } from './TypeaheadItem';
import { TypeaheadInfo } from './TypeaheadInfo';
import { flattenGroupItems, calculateLongestLabel, calculateListSizes } from './utils/typeahead';
var modulo = function (a, n) { return a - n * Math.floor(a / n); };
var Typeahead = /** @class */ (function (_super) {
    __extends(Typeahead, _super);
    function Typeahead(props) {
        var _this = _super.call(this, props) || this;
        _this.listRef = createRef();
        _this.componentDidMount = function () {
            _this.props.menuRef(_this);
            document.addEventListener('selectionchange', _this.handleSelectionChange);
        };
        _this.componentWillUnmount = function () {
            document.removeEventListener('selectionchange', _this.handleSelectionChange);
        };
        _this.handleSelectionChange = function () {
            _this.forceUpdate();
        };
        _this.componentDidUpdate = function (prevProps, prevState) {
            if (prevState.typeaheadIndex !== _this.state.typeaheadIndex && _this.listRef && _this.listRef.current) {
                if (_this.state.typeaheadIndex === 1) {
                    _this.listRef.current.scrollToItem(0); // special case for handling the first group label
                    return;
                }
                _this.listRef.current.scrollToItem(_this.state.typeaheadIndex);
            }
            if (_.isEqual(prevProps.groupedItems, _this.props.groupedItems) === false) {
                var allItems = flattenGroupItems(_this.props.groupedItems);
                var longestLabel = calculateLongestLabel(allItems);
                var _a = calculateListSizes(_this.props.theme, allItems, longestLabel), listWidth = _a.listWidth, listHeight = _a.listHeight, itemHeight = _a.itemHeight;
                _this.setState({ listWidth: listWidth, listHeight: listHeight, itemHeight: itemHeight, allItems: allItems });
            }
        };
        _this.onMouseEnter = function (index) {
            _this.setState({
                hoveredItem: index,
            });
        };
        _this.onMouseLeave = function () {
            _this.setState({
                hoveredItem: null,
            });
        };
        _this.moveMenuIndex = function (moveAmount) {
            var itemCount = _this.state.allItems.length;
            if (itemCount) {
                // Select next suggestion
                event.preventDefault();
                var newTypeaheadIndex = modulo(_this.state.typeaheadIndex + moveAmount, itemCount);
                if (_this.state.allItems[newTypeaheadIndex].kind === CompletionItemKind.GroupTitle) {
                    newTypeaheadIndex = modulo(newTypeaheadIndex + moveAmount, itemCount);
                }
                _this.setState({
                    typeaheadIndex: newTypeaheadIndex,
                });
                return;
            }
        };
        _this.insertSuggestion = function () {
            _this.props.onSelectSuggestion(_this.state.allItems[_this.state.typeaheadIndex]);
        };
        var allItems = flattenGroupItems(props.groupedItems);
        var longestLabel = calculateLongestLabel(allItems);
        var _a = calculateListSizes(props.theme, allItems, longestLabel), listWidth = _a.listWidth, listHeight = _a.listHeight, itemHeight = _a.itemHeight;
        _this.state = { listWidth: listWidth, listHeight: listHeight, itemHeight: itemHeight, hoveredItem: null, typeaheadIndex: 1, allItems: allItems };
        return _this;
    }
    Object.defineProperty(Typeahead.prototype, "menuPosition", {
        get: function () {
            // Exit for unit tests
            if (!window.getSelection) {
                return '';
            }
            var selection = window.getSelection();
            var node = selection.anchorNode;
            // Align menu overlay to editor node
            if (node) {
                // Read from DOM
                var rect = node.parentElement.getBoundingClientRect();
                var scrollX_1 = window.scrollX;
                var scrollY_1 = window.scrollY;
                return "position: absolute; display: flex; top: " + (rect.top + scrollY_1 + rect.height + 6) + "px; left: " + (rect.left +
                    scrollX_1 -
                    2) + "px";
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Typeahead.prototype.render = function () {
        var _this = this;
        var _a = this.props, prefix = _a.prefix, theme = _a.theme, isOpen = _a.isOpen, origin = _a.origin;
        var _b = this.state, allItems = _b.allItems, listWidth = _b.listWidth, listHeight = _b.listHeight, itemHeight = _b.itemHeight, hoveredItem = _b.hoveredItem, typeaheadIndex = _b.typeaheadIndex;
        var showDocumentation = hoveredItem || typeaheadIndex;
        return (React.createElement(Portal, { origin: origin, isOpen: isOpen, style: this.menuPosition },
            React.createElement("ul", { className: "typeahead" },
                React.createElement(FixedSizeList, { ref: this.listRef, itemCount: allItems.length, itemSize: itemHeight, itemKey: function (index) {
                        var item = allItems && allItems[index];
                        var key = item ? index + "-" + item.label : "" + index;
                        return key;
                    }, width: listWidth, height: listHeight }, function (_a) {
                    var index = _a.index, style = _a.style;
                    var item = allItems && allItems[index];
                    if (!item) {
                        return null;
                    }
                    return (React.createElement(TypeaheadItem, { onClickItem: function () { return _this.props.onSelectSuggestion(item); }, isSelected: allItems[typeaheadIndex] === item, item: item, prefix: prefix, style: style, onMouseEnter: function () { return _this.onMouseEnter(index); }, onMouseLeave: _this.onMouseLeave }));
                })),
            showDocumentation && (React.createElement(TypeaheadInfo, { width: listWidth, height: listHeight, theme: theme, item: allItems[hoveredItem ? hoveredItem : typeaheadIndex] }))));
    };
    return Typeahead;
}(React.PureComponent));
export { Typeahead };
export var TypeaheadWithTheme = withTheme(Typeahead);
var Portal = /** @class */ (function (_super) {
    __extends(Portal, _super);
    function Portal(props) {
        var _this = _super.call(this, props) || this;
        var _a = props.index, index = _a === void 0 ? 0 : _a, _b = props.origin, origin = _b === void 0 ? 'query' : _b, style = props.style;
        _this.node = document.createElement('div');
        _this.node.setAttribute('style', style);
        _this.node.classList.add("slate-typeahead", "slate-typeahead-" + origin + "-" + index);
        document.body.appendChild(_this.node);
        return _this;
    }
    Portal.prototype.componentWillUnmount = function () {
        document.body.removeChild(this.node);
    };
    Portal.prototype.render = function () {
        if (this.props.isOpen) {
            this.node.setAttribute('style', this.props.style);
            this.node.classList.add("slate-typeahead--open");
            return ReactDOM.createPortal(this.props.children, this.node);
        }
        else {
            this.node.classList.remove("slate-typeahead--open");
        }
        return null;
    };
    return Portal;
}(React.PureComponent));
//# sourceMappingURL=Typeahead.js.map
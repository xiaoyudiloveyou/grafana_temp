import * as tslib_1 from "tslib";
// Libraries
import React, { PureComponent } from 'react';
var TAB_ID_A = 'A';
var TAB_ID_B = 'B';
var TAB_ID_C = 'C';
var ExampleRootPage = /** @class */ (function (_super) {
    tslib_1.__extends(ExampleRootPage, _super);
    function ExampleRootPage(props) {
        return _super.call(this, props) || this;
    }
    ExampleRootPage.prototype.componentDidMount = function () {
        this.updateNav();
    };
    ExampleRootPage.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.query !== prevProps.query) {
            if (this.props.query.tab !== prevProps.query.tab) {
                this.updateNav();
            }
        }
    };
    ExampleRootPage.prototype.updateNav = function () {
        var e_1, _a;
        var _b = this.props, path = _b.path, onNavChanged = _b.onNavChanged, query = _b.query, meta = _b.meta;
        var tabs = [];
        tabs.push({
            text: 'Tab A',
            icon: 'fa fa-fw fa-file-text-o',
            url: path + '?tab=' + TAB_ID_A,
            id: TAB_ID_A,
        });
        tabs.push({
            text: 'Tab B',
            icon: 'fa fa-fw fa-file-text-o',
            url: path + '?tab=' + TAB_ID_B,
            id: TAB_ID_B,
        });
        tabs.push({
            text: 'Tab C',
            icon: 'fa fa-fw fa-file-text-o',
            url: path + '?tab=' + TAB_ID_C,
            id: TAB_ID_C,
        });
        // Set the active tab
        var found = false;
        var selected = query.tab || TAB_ID_B;
        try {
            for (var tabs_1 = tslib_1.__values(tabs), tabs_1_1 = tabs_1.next(); !tabs_1_1.done; tabs_1_1 = tabs_1.next()) {
                var tab = tabs_1_1.value;
                tab.active = !found && selected === tab.id;
                if (tab.active) {
                    found = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tabs_1_1 && !tabs_1_1.done && (_a = tabs_1.return)) _a.call(tabs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!found) {
            tabs[0].active = true;
        }
        var node = {
            text: 'This is the Page title',
            img: meta.info.logos.large,
            subTitle: 'subtitle here',
            url: path,
            children: tabs,
        };
        // Update the page header
        onNavChanged({
            node: node,
            main: node,
        });
    };
    ExampleRootPage.prototype.render = function () {
        var _a = this.props, path = _a.path, query = _a.query, meta = _a.meta;
        return (React.createElement("div", null,
            "QUERY: ",
            React.createElement("pre", null, JSON.stringify(query)),
            React.createElement("br", null),
            React.createElement("ul", null,
                React.createElement("li", null,
                    React.createElement("a", { href: path + '?x=1' }, "111")),
                React.createElement("li", null,
                    React.createElement("a", { href: path + '?x=AAA' }, "AAA")),
                React.createElement("li", null,
                    React.createElement("a", { href: path + '?x=1&y=2&y=3' }, "ZZZ"))),
            React.createElement("pre", null, JSON.stringify(meta.jsonData))));
    };
    return ExampleRootPage;
}(PureComponent));
export { ExampleRootPage };
//# sourceMappingURL=ExampleRootPage.js.map
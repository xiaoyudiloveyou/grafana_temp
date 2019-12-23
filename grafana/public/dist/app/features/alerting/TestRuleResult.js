import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import appEvents from 'app/core/app_events';
import { CopyToClipboard } from 'app/core/components/CopyToClipboard/CopyToClipboard';
import { getBackendSrv } from '@grafana/runtime';
import { LoadingPlaceholder, JSONFormatter } from '@grafana/ui';
var TestRuleResult = /** @class */ (function (_super) {
    tslib_1.__extends(TestRuleResult, _super);
    function TestRuleResult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isLoading: false,
            allNodesExpanded: null,
            testRuleResponse: {},
        };
        _this.setFormattedJson = function (formattedJson) {
            _this.formattedJson = formattedJson;
        };
        _this.getTextForClipboard = function () {
            return JSON.stringify(_this.formattedJson, null, 2);
        };
        _this.onClipboardSuccess = function () {
            appEvents.emit('alert-success', ['Content copied to clipboard']);
        };
        _this.onToggleExpand = function () {
            _this.setState(function (prevState) { return (tslib_1.__assign({}, prevState, { allNodesExpanded: !_this.state.allNodesExpanded })); });
        };
        _this.getNrOfOpenNodes = function () {
            if (_this.state.allNodesExpanded === null) {
                return 3; // 3 is default, ie when state is null
            }
            else if (_this.state.allNodesExpanded) {
                return 20;
            }
            return 1;
        };
        _this.renderExpandCollapse = function () {
            var allNodesExpanded = _this.state.allNodesExpanded;
            var collapse = (React.createElement(React.Fragment, null,
                React.createElement("i", { className: "fa fa-minus-square-o" }),
                " Collapse All"));
            var expand = (React.createElement(React.Fragment, null,
                React.createElement("i", { className: "fa fa-plus-square-o" }),
                " Expand All"));
            return allNodesExpanded ? collapse : expand;
        };
        return _this;
    }
    TestRuleResult.prototype.componentDidMount = function () {
        this.testRule();
    };
    TestRuleResult.prototype.testRule = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, panelId, dashboard, payload, testRuleResponse;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, panelId = _a.panelId, dashboard = _a.dashboard;
                        payload = { dashboard: dashboard.getSaveModelClone(), panelId: panelId };
                        this.setState({ isLoading: true });
                        return [4 /*yield*/, getBackendSrv().post("/api/alerts/test", payload)];
                    case 1:
                        testRuleResponse = _b.sent();
                        this.setState({ isLoading: false, testRuleResponse: testRuleResponse });
                        return [2 /*return*/];
                }
            });
        });
    };
    TestRuleResult.prototype.render = function () {
        var _a = this.state, testRuleResponse = _a.testRuleResponse, isLoading = _a.isLoading;
        if (isLoading === true) {
            return React.createElement(LoadingPlaceholder, { text: "Evaluating rule" });
        }
        var openNodes = this.getNrOfOpenNodes();
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "pull-right" },
                React.createElement("button", { className: "btn btn-transparent btn-p-x-0 m-r-1", onClick: this.onToggleExpand }, this.renderExpandCollapse()),
                React.createElement(CopyToClipboard, { className: "btn btn-transparent btn-p-x-0", text: this.getTextForClipboard, onSuccess: this.onClipboardSuccess },
                    React.createElement("i", { className: "fa fa-clipboard" }),
                    " Copy to Clipboard")),
            React.createElement(JSONFormatter, { json: testRuleResponse, open: openNodes, onDidRender: this.setFormattedJson })));
    };
    return TestRuleResult;
}(PureComponent));
export { TestRuleResult };
//# sourceMappingURL=TestRuleResult.js.map
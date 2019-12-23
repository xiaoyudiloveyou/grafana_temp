import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { shuffle } from 'lodash';
var DEFAULT_EXAMPLES = ['{job="default/prometheus"}'];
var PREFERRED_LABELS = ['job', 'app', 'k8s_app'];
var EXAMPLES_LIMIT = 5;
var LokiCheatSheet = /** @class */ (function (_super) {
    tslib_1.__extends(LokiCheatSheet, _super);
    function LokiCheatSheet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            userExamples: DEFAULT_EXAMPLES,
        };
        _this.checkUserLabels = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var provider, labels_1, preferredLabel_1, values, userExamples;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = this.props.datasource.languageProvider;
                        if (!provider.started) return [3 /*break*/, 3];
                        labels_1 = provider.getLabelKeys() || [];
                        preferredLabel_1 = PREFERRED_LABELS.find(function (l) { return labels_1.includes(l); });
                        if (!preferredLabel_1) return [3 /*break*/, 2];
                        return [4 /*yield*/, provider.getLabelValues(preferredLabel_1)];
                    case 1:
                        values = _a.sent();
                        userExamples = shuffle(values)
                            .slice(0, EXAMPLES_LIMIT)
                            .map(function (value) { return "{" + preferredLabel_1 + "=\"" + value + "\"}"; });
                        this.setState({ userExamples: userExamples });
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        this.scheduleUserLabelChecking();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    LokiCheatSheet.prototype.componentDidMount = function () {
        this.scheduleUserLabelChecking();
    };
    LokiCheatSheet.prototype.componentWillUnmount = function () {
        clearTimeout(this.userLabelTimer);
    };
    LokiCheatSheet.prototype.scheduleUserLabelChecking = function () {
        this.userLabelTimer = setTimeout(this.checkUserLabels, 1000);
    };
    LokiCheatSheet.prototype.renderExpression = function (expr) {
        var onClickExample = this.props.onClickExample;
        return (React.createElement("div", { className: "cheat-sheet-item__example", key: expr, onClick: function (e) { return onClickExample({ refId: 'A', expr: expr }); } },
            React.createElement("code", null, expr)));
    };
    LokiCheatSheet.prototype.render = function () {
        var _this = this;
        var userExamples = this.state.userExamples;
        return (React.createElement("div", null,
            React.createElement("h2", null, "Loki Cheat Sheet"),
            React.createElement("div", { className: "cheat-sheet-item" },
                React.createElement("div", { className: "cheat-sheet-item__title" }, "See your logs"),
                React.createElement("div", { className: "cheat-sheet-item__label" }, "Start by selecting a log stream from the Log labels selector."),
                React.createElement("div", { className: "cheat-sheet-item__label" }, "Alternatively, you can write a stream selector into the query field:"),
                this.renderExpression('{job="default/prometheus"}'),
                userExamples !== DEFAULT_EXAMPLES && userExamples.length > 0 ? (React.createElement("div", null,
                    React.createElement("div", { className: "cheat-sheet-item__label" }, "Here are some example streams from your logs:"),
                    userExamples.map(function (example) { return _this.renderExpression(example); }))) : null),
            React.createElement("div", { className: "cheat-sheet-item" },
                React.createElement("div", { className: "cheat-sheet-item__title" }, "Combine stream selectors"),
                this.renderExpression('{app="cassandra",namespace="prod"}'),
                React.createElement("div", { className: "cheat-sheet-item__label" }, "Returns all log lines from streams that have both labels.")),
            React.createElement("div", { className: "cheat-sheet-item" },
                React.createElement("div", { className: "cheat-sheet-item__title" }, "Filtering for search terms."),
                this.renderExpression('{app="cassandra"} |~ "(duration|latency)s*(=|is|of)s*[d.]+"'),
                this.renderExpression('{app="cassandra"} |= "exact match"'),
                this.renderExpression('{app="cassandra"} != "do not match"'),
                React.createElement("div", { className: "cheat-sheet-item__label" },
                    React.createElement("a", { href: "https://github.com/grafana/loki/blob/master/docs/logql.md#filter-expression", target: "logql" }, "LogQL"),
                    ' ',
                    "supports exact and regular expression filters."))));
    };
    return LokiCheatSheet;
}(PureComponent));
export default LokiCheatSheet;
//# sourceMappingURL=LokiCheatSheet.js.map
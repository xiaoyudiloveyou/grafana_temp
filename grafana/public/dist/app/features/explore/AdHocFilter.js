import * as tslib_1 from "tslib";
import React, { useContext } from 'react';
import { Select, ThemeContext } from '@grafana/ui';
import { css, cx } from 'emotion';
var getStyles = function (theme) { return ({
    keyValueContainer: css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    label: key-value-container;\n    display: flex;\n    flex-flow: row nowrap;\n  "], ["\n    label: key-value-container;\n    display: flex;\n    flex-flow: row nowrap;\n  "]))),
}); };
var ChangeType;
(function (ChangeType) {
    ChangeType["Key"] = "key";
    ChangeType["Value"] = "value";
    ChangeType["Operator"] = "operator";
})(ChangeType || (ChangeType = {}));
export var AdHocFilter = function (props) {
    var theme = useContext(ThemeContext);
    var styles = getStyles(theme);
    var onChange = function (changeType) { return function (item) {
        var onKeyChanged = props.onKeyChanged, onValueChanged = props.onValueChanged, onOperatorChanged = props.onOperatorChanged;
        switch (changeType) {
            case ChangeType.Key:
                onKeyChanged(item.value);
                break;
            case ChangeType.Operator:
                onOperatorChanged(item.value);
                break;
            case ChangeType.Value:
                onValueChanged(item.value);
                break;
        }
    }; };
    var stringToOption = function (value) { return ({ label: value, value: value }); };
    var keys = props.keys, initialKey = props.initialKey, keysPlaceHolder = props.keysPlaceHolder, initialOperator = props.initialOperator, values = props.values, initialValue = props.initialValue, valuesPlaceHolder = props.valuesPlaceHolder;
    var operators = ['=', '!='];
    var keysAsOptions = keys ? keys.map(stringToOption) : [];
    var selectedKey = initialKey ? keysAsOptions.filter(function (option) { return option.value === initialKey; }) : null;
    var valuesAsOptions = values ? values.map(stringToOption) : [];
    var selectedValue = initialValue ? valuesAsOptions.filter(function (option) { return option.value === initialValue; }) : null;
    var operatorsAsOptions = operators.map(stringToOption);
    var selectedOperator = initialOperator
        ? operatorsAsOptions.filter(function (option) { return option.value === initialOperator; })
        : null;
    return (React.createElement("div", { className: cx([styles.keyValueContainer]) },
        React.createElement(Select, { options: keysAsOptions, isSearchable: true, value: selectedKey, onChange: onChange(ChangeType.Key), placeholder: keysPlaceHolder }),
        React.createElement(Select, { options: operatorsAsOptions, value: selectedOperator, onChange: onChange(ChangeType.Operator) }),
        React.createElement(Select, { options: valuesAsOptions, isSearchable: true, value: selectedValue, onChange: onChange(ChangeType.Value), placeholder: valuesPlaceHolder })));
};
var templateObject_1;
//# sourceMappingURL=AdHocFilter.js.map
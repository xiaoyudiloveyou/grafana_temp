import React, { forwardRef } from 'react';
import { Input, FormLabel } from '@grafana/ui';
export var PasswordInput = forwardRef(function (props, ref) { return (React.createElement(React.Fragment, null,
    React.createElement(FormLabel, { className: "width-8" }, props.label),
    React.createElement(Input, { className: "gf-form-input max-width-22", type: "password", onChange: function (event) { return props.onChange(event.target.value); }, value: props.value }))); });
//# sourceMappingURL=PasswordInput.js.map
import React from 'react';
import { FadeIn } from 'app/core/components/Animations/FadeIn';
import { getFirstQueryErrorWithoutRefId, getValueWithRefId } from 'app/core/utils/explore';
export var ErrorContainer = function (props) {
    var queryErrors = props.queryErrors;
    var refId = getValueWithRefId(queryErrors);
    var queryError = refId ? null : getFirstQueryErrorWithoutRefId(queryErrors);
    var showError = queryError ? true : false;
    var duration = showError ? 100 : 10;
    var message = queryError ? queryError.message : null;
    return (React.createElement(FadeIn, { in: showError, duration: duration },
        React.createElement("div", { className: "alert-container" },
            React.createElement("div", { className: "alert-error alert" },
                React.createElement("div", { className: "alert-icon" },
                    React.createElement("i", { className: "fa fa-exclamation-triangle" })),
                React.createElement("div", { className: "alert-body" },
                    React.createElement("div", { className: "alert-title" }, message))))));
};
//# sourceMappingURL=ErrorContainer.js.map
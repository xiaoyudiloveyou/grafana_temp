import React from 'react';
import classNames from 'classnames';
import { AppNotificationSeverity } from 'app/types';
function getIconFromSeverity(severity) {
    switch (severity) {
        case AppNotificationSeverity.Error: {
            return 'fa fa-exclamation-triangle';
        }
        case AppNotificationSeverity.Warning: {
            return 'fa fa-exclamation-triangle';
        }
        case AppNotificationSeverity.Info: {
            return 'fa fa-info-circle';
        }
        case AppNotificationSeverity.Success: {
            return 'fa fa-check';
        }
        default:
            return '';
    }
}
export var AlertBox = function (_a) {
    var title = _a.title, icon = _a.icon, body = _a.body, severity = _a.severity, onClose = _a.onClose;
    var alertClass = classNames('alert', "alert-" + severity);
    return (React.createElement("div", { className: alertClass },
        React.createElement("div", { className: "alert-icon" },
            React.createElement("i", { className: icon || getIconFromSeverity(severity) })),
        React.createElement("div", { className: "alert-body" },
            React.createElement("div", { className: "alert-title" }, title),
            body && React.createElement("div", { className: "alert-text" }, body)),
        onClose && (React.createElement("button", { type: "button", className: "alert-close", onClick: onClose },
            React.createElement("i", { className: "fa fa fa-remove" })))));
};
//# sourceMappingURL=AlertBox.js.map
import * as tslib_1 from "tslib";
import React, { useContext } from 'react';
import { css } from 'emotion';
import { ThemeContext, LinkButton, CallToActionCard } from '@grafana/ui';
export var NoDataSourceCallToAction = function () {
    var theme = useContext(ThemeContext);
    var message = 'Explore requires at least one data source. Once you have added a data source, you can query it here.';
    var footer = (React.createElement(React.Fragment, null,
        React.createElement("i", { className: "fa fa-rocket" }),
        React.createElement(React.Fragment, null, " ProTip: You can also define data sources through configuration files. "),
        React.createElement("a", { href: "http://docs.grafana.org/administration/provisioning/#datasources?utm_source=explore", target: "_blank", rel: "noopener", className: "text-link" }, "Learn more")));
    var ctaElement = (React.createElement(LinkButton, { size: "lg", href: "/datasources/new", icon: "gicon gicon-datasources" }, "Add data source"));
    var cardClassName = css(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n    max-width: ", ";\n    margin-top: ", ";\n    align-self: center;\n  "], ["\n    max-width: ", ";\n    margin-top: ", ";\n    align-self: center;\n  "])), theme.breakpoints.lg, theme.spacing.md);
    return (React.createElement(CallToActionCard, { callToActionElement: ctaElement, className: cardClassName, footer: footer, message: message, theme: theme }));
};
var templateObject_1;
//# sourceMappingURL=NoDataSourceCallToAction.js.map
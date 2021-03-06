import React from 'react';
export var AnnotationsHelp = function () {
    return (React.createElement("div", { className: "gf-form grafana-info-box", style: { padding: 0 } },
        React.createElement("pre", { className: "gf-form-pre alert alert-info", style: { marginRight: 0 } },
            React.createElement("h5", null, "Annotation Query Format"),
            React.createElement("p", null,
                "An annotation is an event that is overlaid on top of graphs. Annotation rendering is expensive so it is important to limit the number of rows returned.",
                ' '),
            React.createElement("p", null, "The Title and Text fields support templating and can use data returned from the query. For example, the Title field could have the following text:"),
            React.createElement("code", null, "" + '{{metric.type}}',
                " has value: ", "" + '{{metric.value}}'),
            React.createElement("p", null,
                "Example Result: ",
                React.createElement("code", null, "monitoring.googleapis.com/uptime_check/http_status has this value: 502")),
            React.createElement("label", null, "Patterns:"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{metric.value}}'),
                " = value of the metric/point"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{metric.type}}'),
                " = metric type e.g. compute.googleapis.com/instance/cpu/usage_time"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{metric.name}}'),
                " = name part of metric e.g. instance/cpu/usage_time"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{metric.service}}'),
                " = service part of metric e.g. compute"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{metric.label.label_name}}'),
                " = Metric label metadata e.g. metric.label.instance_name"),
            React.createElement("p", null,
                React.createElement("code", null, "" + '{{resource.label.label_name}}'),
                " = Resource label metadata e.g. resource.label.zone"))));
};
//# sourceMappingURL=AnnotationsHelp.js.map
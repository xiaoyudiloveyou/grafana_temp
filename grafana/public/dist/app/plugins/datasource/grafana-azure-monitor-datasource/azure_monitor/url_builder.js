var UrlBuilder = /** @class */ (function () {
    function UrlBuilder() {
    }
    UrlBuilder.buildAzureMonitorGetMetricNamespacesUrl = function (baseUrl, subscriptionId, resourceGroup, metricDefinition, resourceName, apiVersion) {
        if ((metricDefinition.match(/\//g) || []).length > 1) {
            var rn = resourceName.split('/');
            var service = metricDefinition.substring(metricDefinition.lastIndexOf('/') + 1);
            var md = metricDefinition.substring(0, metricDefinition.lastIndexOf('/'));
            return (baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/" + md + "/" + rn[0] + "/" + service + "/" + rn[1] +
                ("/providers/microsoft.insights/metricNamespaces?api-version=" + apiVersion));
        }
        return (baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/" + metricDefinition + "/" + resourceName +
            ("/providers/microsoft.insights/metricNamespaces?api-version=" + apiVersion));
    };
    UrlBuilder.buildAzureMonitorGetMetricNamesUrl = function (baseUrl, subscriptionId, resourceGroup, metricDefinition, resourceName, metricNamespace, apiVersion) {
        if ((metricDefinition.match(/\//g) || []).length > 1) {
            var rn = resourceName.split('/');
            var service = metricDefinition.substring(metricDefinition.lastIndexOf('/') + 1);
            var md = metricDefinition.substring(0, metricDefinition.lastIndexOf('/'));
            return (baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/" + md + "/" + rn[0] + "/" + service + "/" + rn[1] +
                ("/providers/microsoft.insights/metricdefinitions?api-version=" + apiVersion + "&metricnamespace=" + encodeURIComponent(metricNamespace)));
        }
        return (baseUrl + "/" + subscriptionId + "/resourceGroups/" + resourceGroup + "/providers/" + metricDefinition + "/" + resourceName +
            ("/providers/microsoft.insights/metricdefinitions?api-version=" + apiVersion + "&metricnamespace=" + encodeURIComponent(metricNamespace)));
    };
    return UrlBuilder;
}());
export default UrlBuilder;
//# sourceMappingURL=url_builder.js.map
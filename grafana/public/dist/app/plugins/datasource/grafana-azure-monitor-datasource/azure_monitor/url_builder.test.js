import UrlBuilder from './url_builder';
describe('AzureMonitorUrlBuilder', function () {
    describe('when metric definition is Microsoft.Sql/servers/databases', function () {
        it('should build the getMetricNames url in the longer format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Sql/servers/databases', 'rn1/rn2', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Sql/servers/rn1/databases/rn2/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
    describe('when metric definition is Microsoft.Sql/servers', function () {
        it('should build the getMetricNames url in the shorter format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Sql/servers', 'rn', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Sql/servers/rn/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
    describe('when metric definition is Microsoft.Storage/storageAccounts/blobServices', function () {
        it('should build the getMetricNames url in the longer format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Storage/storageAccounts/blobServices', 'rn1/default', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/rn1/blobServices/default/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
    describe('when metric definition is Microsoft.Storage/storageAccounts/fileServices', function () {
        it('should build the getMetricNames url in the longer format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Storage/storageAccounts/fileServices', 'rn1/default', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/rn1/fileServices/default/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
    describe('when metric definition is Microsoft.Storage/storageAccounts/tableServices', function () {
        it('should build the getMetricNames url in the longer format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Storage/storageAccounts/tableServices', 'rn1/default', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/rn1/tableServices/default/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
    describe('when metric definition is Microsoft.Storage/storageAccounts/queueServices', function () {
        it('should build the getMetricNames url in the longer format', function () {
            var url = UrlBuilder.buildAzureMonitorGetMetricNamesUrl('', 'sub1', 'rg', 'Microsoft.Storage/storageAccounts/queueServices', 'rn1/default', 'default', '2017-05-01-preview');
            expect(url).toBe('/sub1/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/rn1/queueServices/default/' +
                'providers/microsoft.insights/metricdefinitions?api-version=2017-05-01-preview&metricnamespace=default');
        });
    });
});
//# sourceMappingURL=url_builder.test.js.map